"""View controller untuk operasi CRUD data matakuliah."""
from pyramid.httpexceptions import (
    HTTPBadRequest,
    HTTPNotFound,
)
from pyramid.view import view_config
from sqlalchemy.exc import IntegrityError

from ..models import Matakuliah

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


def _validasi_positif(nilai, nama_field):
    """Mengembalikan pesan error jika nilai bukan integer > 0."""
    if isinstance(nilai, bool) or not isinstance(nilai, int) or nilai <= 0:
        return (f'Field {nama_field} harus berupa bilangan bulat '
                f'lebih dari 0')
    return None


def _tidak_ditemukan(matakuliah_id):
    """Membuat respons HTTP 404 untuk matakuliah yang tidak ada."""
    return HTTPNotFound(json_body={
        'error': f'Matakuliah dengan ID {matakuliah_id} tidak ditemukan'})


# 1. READ ALL: Menampilkan daftar seluruh matakuliah
@view_config(route_name='matakuliah_list', renderer='json')
def matakuliah_list(request):
    """View untuk mengambil semua data matakuliah."""
    dbsession = request.dbsession
    matakuliahs = dbsession.query(Matakuliah).order_by(
        Matakuliah.id.asc()).all()
    return {'matakuliahs': [mk.to_dict() for mk in matakuliahs]}


# 2. READ ONE: Menampilkan detail satu matakuliah berdasarkan ID
@view_config(route_name='matakuliah_detail', renderer='json')
def matakuliah_detail(request):
    """View untuk melihat detail satu matakuliah berdasarkan ID di URL."""
    dbsession = request.dbsession
    matakuliah_id = request.matchdict['id']
    id_valid = _parse_id(matakuliah_id)
    if id_valid is None:
        return _tidak_ditemukan(matakuliah_id)

    matakuliah = dbsession.query(Matakuliah).filter_by(id=id_valid).first()
    if matakuliah is None:
        return _tidak_ditemukan(matakuliah_id)

    return {'matakuliah': matakuliah.to_dict()}


# 3. CREATE: Menambahkan data matakuliah baru
@view_config(route_name='matakuliah_add', request_method='POST',
             renderer='json')
def matakuliah_add(request):
    """View untuk menambahkan matakuliah baru dari payload JSON."""
    json_data = _ambil_json(request)
    if json_data is None or not isinstance(json_data, dict):
        return HTTPBadRequest(json_body={
            'error': 'Request body harus berupa JSON yang valid'})

    # Validasi field wajib tidak boleh kosong
    required_fields = ['kode_mk', 'nama_mk', 'sks', 'semester']
    for field in required_fields:
        if field not in json_data or json_data[field] is None:
            return HTTPBadRequest(json_body={
                'error': f'Field {field} wajib diisi!'})

    # kode_mk dan nama_mk harus berupa teks yang terisi
    for field in ('kode_mk', 'nama_mk'):
        pesan = _validasi_teks(json_data[field], field)
        if pesan:
            return HTTPBadRequest(json_body={'error': pesan})

    # Validasi sks dan semester harus integer > 0
    for nama_field in ('sks', 'semester'):
        pesan = _validasi_positif(json_data[nama_field], nama_field)
        if pesan:
            return HTTPBadRequest(json_body={'error': pesan})

    dbsession = request.dbsession

    # Cegah kode_mk duplikat dengan pesan error yang jelas
    kode_ada = dbsession.query(Matakuliah).filter_by(
        kode_mk=json_data['kode_mk']).first()
    if kode_ada is not None:
        return HTTPBadRequest(json_body={
            'error': f'Kode matakuliah {json_data["kode_mk"]} sudah '
                     f'terdaftar!'})

    matakuliah = Matakuliah(
        kode_mk=json_data['kode_mk'],
        nama_mk=json_data['nama_mk'],
        sks=json_data['sks'],
        semester=json_data['semester'],
    )

    dbsession.add(matakuliah)
    # Flush session untuk mengeksekusi query INSERT dan mendapatkan nilai
    # primary key id yang di-generate PostgreSQL.
    try:
        dbsession.flush()
    except IntegrityError:
        # Pengaman terakhir bila terjadi race condition kode_mk duplikat.
        # Rollback wajib agar session tidak tertinggal dalam keadaan gagal.
        dbsession.rollback()
        return HTTPBadRequest(json_body={
            'error': f'Kode matakuliah {json_data["kode_mk"]} sudah '
                     f'terdaftar!'})

    return {'success': True, 'matakuliah': matakuliah.to_dict()}


# 4. UPDATE: Mengubah data matakuliah yang sudah ada (partial update)
@view_config(route_name='matakuliah_update', request_method='PUT',
             renderer='json')
def matakuliah_update(request):
    """View untuk mengupdate data matakuliah berdasarkan ID."""
    dbsession = request.dbsession
    matakuliah_id = request.matchdict['id']
    id_valid = _parse_id(matakuliah_id)
    if id_valid is None:
        return _tidak_ditemukan(matakuliah_id)

    matakuliah = dbsession.query(Matakuliah).filter_by(id=id_valid).first()
    if matakuliah is None:
        return _tidak_ditemukan(matakuliah_id)

    json_data = _ambil_json(request)
    if json_data is None or not isinstance(json_data, dict):
        return HTTPBadRequest(json_body={
            'error': 'Request body harus berupa JSON yang valid'})

    # Validasi seluruh field lebih dulu agar tidak ada perubahan setengah
    # jadi ketika salah satu field ternyata tidak valid.
    perubahan = {}

    if 'kode_mk' in json_data:
        pesan = _validasi_teks(json_data['kode_mk'], 'kode_mk')
        if pesan:
            return HTTPBadRequest(json_body={'error': pesan})
        duplikat = dbsession.query(Matakuliah).filter(
            Matakuliah.kode_mk == json_data['kode_mk'],
            Matakuliah.id != matakuliah.id,
        ).first()
        if duplikat is not None:
            return HTTPBadRequest(json_body={
                'error': f'Kode matakuliah {json_data["kode_mk"]} sudah '
                         f'terdaftar!'})
        perubahan['kode_mk'] = json_data['kode_mk']

    if 'nama_mk' in json_data:
        pesan = _validasi_teks(json_data['nama_mk'], 'nama_mk')
        if pesan:
            return HTTPBadRequest(json_body={'error': pesan})
        perubahan['nama_mk'] = json_data['nama_mk']

    # Field sks/semester yang dikirim divalidasi harus integer > 0
    for nama_field in ('sks', 'semester'):
        if nama_field in json_data:
            pesan = _validasi_positif(json_data[nama_field], nama_field)
            if pesan:
                return HTTPBadRequest(json_body={'error': pesan})
            perubahan[nama_field] = json_data[nama_field]

    for field, nilai in perubahan.items():
        setattr(matakuliah, field, nilai)

    try:
        dbsession.flush()
    except IntegrityError:
        dbsession.rollback()
        return HTTPBadRequest(json_body={
            'error': 'Data matakuliah gagal diperbarui '
                     '(kemungkinan kode_mk duplikat)'})

    return {'success': True, 'matakuliah': matakuliah.to_dict()}


# 5. DELETE: Menghapus data matakuliah
@view_config(route_name='matakuliah_delete', request_method='DELETE',
             renderer='json')
def matakuliah_delete(request):
    """View untuk menghapus matakuliah berdasarkan ID."""
    dbsession = request.dbsession
    matakuliah_id = request.matchdict['id']
    id_valid = _parse_id(matakuliah_id)
    if id_valid is None:
        return _tidak_ditemukan(matakuliah_id)

    matakuliah = dbsession.query(Matakuliah).filter_by(id=id_valid).first()
    if matakuliah is None:
        return _tidak_ditemukan(matakuliah_id)

    dbsession.delete(matakuliah)

    return {'success': True,
            'message': f'Matakuliah dengan ID {matakuliah_id} berhasil '
                       f'dihapus'}
