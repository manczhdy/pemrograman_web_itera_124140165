"""View controller untuk operasi CRUD data mahasiswa."""
import datetime

from pyramid.httpexceptions import (
    HTTPBadRequest,
    HTTPNotFound,
)
from pyramid.view import view_config
from sqlalchemy.exc import IntegrityError

from ..models import Mahasiswa

# Batas maksimum kolom Integer PostgreSQL (signed 32-bit).
ID_MAKSIMUM = 2147483647


def _ambil_json(request):
    """Mengambil payload JSON dari request.

    Mengembalikan None jika body bukan JSON yang valid.
    """
    try:
        return request.json_body
    except ValueError:
        return None


def _parse_id(nilai):
    """Mengubah ID dari URL menjadi integer positif.

    Mengembalikan None jika ID bukan angka yang valid.
    """
    if not isinstance(nilai, str) or not nilai.isdigit():
        return None
    angka = int(nilai)
    if angka <= 0 or angka > ID_MAKSIMUM:
        return None
    return angka


def _validasi_teks(nilai, nama_field):
    """Mengembalikan pesan error jika nilai bukan string yang terisi."""
    if not isinstance(nilai, str) or not nilai.strip():
        return f'Field {nama_field} wajib diisi dengan teks!'
    return None


def _parse_tanggal_lahir(nilai):
    """Mengonversi string tanggal ISO menjadi date.

    Melempar TypeError jika nilai bukan string, atau ValueError jika
    formatnya tidak valid.
    """
    if not isinstance(nilai, str):
        raise TypeError('tanggal lahir harus berupa teks')
    return datetime.datetime.fromisoformat(nilai).date()


def _tidak_ditemukan(mahasiswa_id):
    """Membuat respons HTTP 404 untuk mahasiswa yang tidak ada."""
    return HTTPNotFound(json_body={
        'error': f'Mahasiswa dengan ID {mahasiswa_id} tidak ditemukan'})


# 1. READ ALL: Menampilkan daftar seluruh mahasiswa
@view_config(route_name='mahasiswa_list', renderer='json')
def mahasiswa_list(request):
    """View untuk mengambil semua data mahasiswa."""
    dbsession = request.dbsession
    mahasiswas = dbsession.query(Mahasiswa).order_by(Mahasiswa.id.asc()).all()
    return {'mahasiswas': [m.to_dict() for m in mahasiswas]}


# 2. READ ONE: Menampilkan detail satu mahasiswa berdasarkan ID
@view_config(route_name='mahasiswa_detail', renderer='json')
def mahasiswa_detail(request):
    """View untuk melihat detail satu mahasiswa berdasarkan ID di URL."""
    dbsession = request.dbsession
    mahasiswa_id = request.matchdict['id']
    id_valid = _parse_id(mahasiswa_id)
    if id_valid is None:
        return _tidak_ditemukan(mahasiswa_id)

    mahasiswa = dbsession.query(Mahasiswa).filter_by(id=id_valid).first()
    if mahasiswa is None:
        return _tidak_ditemukan(mahasiswa_id)

    return {'mahasiswa': mahasiswa.to_dict()}


# 3. CREATE: Menambahkan data mahasiswa baru
@view_config(route_name='mahasiswa_add', request_method='POST',
             renderer='json')
def mahasiswa_add(request):
    """View untuk menambahkan mahasiswa baru dari payload JSON."""
    json_data = _ambil_json(request)
    if json_data is None or not isinstance(json_data, dict):
        return HTTPBadRequest(json_body={
            'error': 'Request body harus berupa JSON yang valid'})

    # Validasi field wajib harus berupa teks yang terisi
    for field in ('nim', 'nama', 'jurusan'):
        if field not in json_data or json_data[field] is None:
            return HTTPBadRequest(json_body={
                'error': f'Field {field} wajib diisi!'})
        pesan = _validasi_teks(json_data[field], field)
        if pesan:
            return HTTPBadRequest(json_body={'error': pesan})

    # Validasi alamat opsional agar tetap berupa teks atau null
    alamat = json_data.get('alamat')
    if alamat is not None and not isinstance(alamat, str):
        return HTTPBadRequest(json_body={
            'error': 'Field alamat harus berupa teks!'})

    # Validasi dan konversi format tanggal ISO YYYY-MM-DD
    tanggal_lahir = None
    if json_data.get('tanggal_lahir') not in (None, ''):
        try:
            tanggal_lahir = _parse_tanggal_lahir(json_data['tanggal_lahir'])
        except (TypeError, ValueError):
            return HTTPBadRequest(json_body={
                'error': 'Format tanggal lahir tidak valid. '
                         'Gunakan format YYYY-MM-DD'})

    dbsession = request.dbsession

    # Cegah NIM duplikat dengan pesan error yang jelas
    nim_ada = dbsession.query(Mahasiswa).filter_by(
        nim=json_data['nim']).first()
    if nim_ada is not None:
        return HTTPBadRequest(json_body={
            'error': f'NIM {json_data["nim"]} sudah terdaftar!'})

    mahasiswa = Mahasiswa(
        nim=json_data['nim'],
        nama=json_data['nama'],
        jurusan=json_data['jurusan'],
        tanggal_lahir=tanggal_lahir,
        alamat=alamat,
    )

    dbsession.add(mahasiswa)
    # Flush session untuk mengeksekusi query INSERT dan mendapatkan nilai
    # primary key id yang di-generate PostgreSQL.
    try:
        dbsession.flush()
    except IntegrityError:
        # Pengaman terakhir bila terjadi race condition NIM duplikat.
        # Rollback wajib agar session tidak tertinggal dalam keadaan gagal.
        dbsession.rollback()
        return HTTPBadRequest(json_body={
            'error': f'NIM {json_data["nim"]} sudah terdaftar!'})

    return {'success': True, 'mahasiswa': mahasiswa.to_dict()}


# 4. UPDATE: Mengubah data mahasiswa yang sudah ada
@view_config(route_name='mahasiswa_update', request_method='PUT',
             renderer='json')
def mahasiswa_update(request):
    """View untuk mengupdate data mahasiswa berdasarkan ID."""
    dbsession = request.dbsession
    mahasiswa_id = request.matchdict['id']
    id_valid = _parse_id(mahasiswa_id)
    if id_valid is None:
        return _tidak_ditemukan(mahasiswa_id)

    mahasiswa = dbsession.query(Mahasiswa).filter_by(id=id_valid).first()
    if mahasiswa is None:
        return _tidak_ditemukan(mahasiswa_id)

    json_data = _ambil_json(request)
    if json_data is None or not isinstance(json_data, dict):
        return HTTPBadRequest(json_body={
            'error': 'Request body harus berupa JSON yang valid'})

    # Validasi seluruh field lebih dulu agar tidak ada perubahan setengah
    # jadi ketika salah satu field ternyata tidak valid.
    perubahan = {}

    if 'nim' in json_data:
        pesan = _validasi_teks(json_data['nim'], 'nim')
        if pesan:
            return HTTPBadRequest(json_body={'error': pesan})
        duplikat = dbsession.query(Mahasiswa).filter(
            Mahasiswa.nim == json_data['nim'],
            Mahasiswa.id != mahasiswa.id,
        ).first()
        if duplikat is not None:
            return HTTPBadRequest(json_body={
                'error': f'NIM {json_data["nim"]} sudah terdaftar!'})
        perubahan['nim'] = json_data['nim']

    for field in ('nama', 'jurusan'):
        if field in json_data:
            pesan = _validasi_teks(json_data[field], field)
            if pesan:
                return HTTPBadRequest(json_body={'error': pesan})
            perubahan[field] = json_data[field]

    if 'alamat' in json_data:
        alamat = json_data['alamat']
        if alamat is not None and not isinstance(alamat, str):
            return HTTPBadRequest(json_body={
                'error': 'Field alamat harus berupa teks!'})
        perubahan['alamat'] = alamat

    if 'tanggal_lahir' in json_data:
        nilai = json_data['tanggal_lahir']
        if nilai in (None, ''):
            perubahan['tanggal_lahir'] = None
        else:
            try:
                perubahan['tanggal_lahir'] = _parse_tanggal_lahir(nilai)
            except (TypeError, ValueError):
                return HTTPBadRequest(json_body={
                    'error': 'Format tanggal lahir tidak valid. '
                             'Gunakan format YYYY-MM-DD'})

    for field, nilai in perubahan.items():
        setattr(mahasiswa, field, nilai)

    try:
        dbsession.flush()
    except IntegrityError:
        dbsession.rollback()
        return HTTPBadRequest(json_body={
            'error': 'Data mahasiswa gagal diperbarui '
                     '(kemungkinan NIM duplikat)'})

    return {'success': True, 'mahasiswa': mahasiswa.to_dict()}


# 5. DELETE: Menghapus data mahasiswa
@view_config(route_name='mahasiswa_delete', request_method='DELETE',
             renderer='json')
def mahasiswa_delete(request):
    """View untuk menghapus mahasiswa berdasarkan ID."""
    dbsession = request.dbsession
    mahasiswa_id = request.matchdict['id']
    id_valid = _parse_id(mahasiswa_id)
    if id_valid is None:
        return _tidak_ditemukan(mahasiswa_id)

    mahasiswa = dbsession.query(Mahasiswa).filter_by(id=id_valid).first()
    if mahasiswa is None:
        return _tidak_ditemukan(mahasiswa_id)

    dbsession.delete(mahasiswa)

    return {'success': True,
            'message': f'Mahasiswa dengan ID {mahasiswa_id} berhasil dihapus'}
