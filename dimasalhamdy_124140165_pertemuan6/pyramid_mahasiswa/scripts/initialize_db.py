"""Script inisialisasi & seeding data awal (mahasiswa dan matakuliah)."""
import argparse
import sys
from datetime import date

from pyramid.paster import bootstrap, setup_logging
from sqlalchemy.exc import OperationalError

from .. import models


def setup_models(dbsession):
    """Menambahkan data awal (seeding) ke database.

    Bersifat idempotent: baris yang sudah ada dilewati (tidak duplikat).
    Mengembalikan tuple (jumlah mahasiswa baru, jumlah matakuliah baru).
    """
    mahasiswa_data = [
        {
            'nim': '12345',
            'nama': 'Budi Santoso',
            'jurusan': 'Teknik Informatika',
            'tanggal_lahir': date(2000, 5, 15),
            'alamat': 'Jl. Merdeka No. 123, Bandung',
        },
        {
            'nim': '54321',
            'nama': 'Siti Aminah',
            'jurusan': 'Sistem Informasi',
            'tanggal_lahir': date(2001, 8, 22),
            'alamat': 'Jl. Mawar No. 45, Jakarta',
        },
    ]

    matakuliah_data = [
        {'kode_mk': 'IF2110', 'nama_mk': 'Pemrograman Web',
         'sks': 3, 'semester': 3},
        {'kode_mk': 'IF3140', 'nama_mk': 'Basis Data',
         'sks': 3, 'semester': 5},
        {'kode_mk': 'IF2010', 'nama_mk': 'Struktur Data',
         'sks': 4, 'semester': 3},
    ]

    jumlah_mahasiswa = 0
    for data in mahasiswa_data:
        ada = dbsession.query(models.Mahasiswa).filter_by(
            nim=data['nim']).first()
        if ada is None:
            dbsession.add(models.Mahasiswa(**data))
            jumlah_mahasiswa += 1

    jumlah_matakuliah = 0
    for data in matakuliah_data:
        ada = dbsession.query(models.Matakuliah).filter_by(
            kode_mk=data['kode_mk']).first()
        if ada is None:
            dbsession.add(models.Matakuliah(**data))
            jumlah_matakuliah += 1

    return jumlah_mahasiswa, jumlah_matakuliah


def parse_args(argv):
    parser = argparse.ArgumentParser()
    parser.add_argument(
        'config_uri',
        help='Configuration file, e.g., development.ini',
    )
    return parser.parse_args(argv[1:])


def main(argv=sys.argv):
    args = parse_args(argv)
    setup_logging(args.config_uri)
    env = bootstrap(args.config_uri)

    try:
        with env['request'].tm:
            dbsession = env['request'].dbsession
            jumlah_mahasiswa, jumlah_matakuliah = setup_models(dbsession)
            print(f'Seeding selesai: {jumlah_mahasiswa} mahasiswa baru dan '
                  f'{jumlah_matakuliah} matakuliah baru ditambahkan.')
            print('Berhasil memasukkan data seeding awal '
                  '(data yang sudah ada dilewati)!')
    except OperationalError:
        print('Pyramid gagal terhubung ke database SQL.')
        print('Pastikan service PostgreSQL berjalan dan connection string '
              'di development.ini benar.')


if __name__ == '__main__':
    main()
