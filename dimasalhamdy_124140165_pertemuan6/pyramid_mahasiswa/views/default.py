"""View controller untuk halaman utama (home) REST API."""
from pyramid.view import view_config


@view_config(route_name='home', renderer='json')
def home_view(request):
    """View untuk halaman utama API, mengembalikan informasi endpoint."""
    return {
        'message': 'Selamat datang di REST API Manajemen Data Mahasiswa '
                   'dan Matakuliah (Pyramid + PostgreSQL)',
        'endpoints': {
            'mahasiswa': '/api/mahasiswa',
            'matakuliah': '/api/matakuliah',
        },
    }
