"""Entry point aplikasi WSGI Pyramid."""
from pyramid.config import Configurator


def main(global_config, **settings):
    """Fungsi ini mengembalikan aplikasi WSGI Pyramid."""
    with Configurator(settings=settings) as config:
        config.include('pyramid_tm')
        config.include('.routes')
        config.include('.models')
        config.scan()
    return config.make_wsgi_app()
