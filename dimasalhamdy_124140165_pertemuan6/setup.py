"""Setup package untuk aplikasi Pyramid: pyramid_mahasiswa.

Aplikasi REST API manajemen data mahasiswa dan matakuliah
dengan Pyramid + SQLAlchemy + Alembic + PostgreSQL.
"""
import os

from setuptools import find_packages, setup

here = os.path.abspath(os.path.dirname(__file__))
readme_path = os.path.join(here, 'README.md')
try:
    with open(readme_path, encoding='utf-8') as f:
        long_description = f.read()
except OSError:
    long_description = ''

requires = [
    'plaster_pastedeploy',
    'pyramid',
    'pyramid_debugtoolbar',
    'waitress',
    'alembic',
    'pyramid_tm',
    'SQLAlchemy',
    'transaction',
    'zope.sqlalchemy',
    'psycopg2-binary',
]

tests_require = [
    'WebTest',
    'pytest',
    'pytest-cov',
]

setup(
    name='pyramid_mahasiswa',
    version='0.0',
    description=(
        'REST API Manajemen Data Mahasiswa dan Matakuliah '
        '(Pyramid + PostgreSQL)'
    ),
    long_description=long_description + '\n\n',
    classifiers=[
        'Programming Language :: Python',
        'Framework :: Pyramid',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: WSGI :: Application',
    ],
    author='Dimas Alhamdy',
    author_email='',
    url='',
    keywords='web pyramid pylons',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    extras_require={
        'testing': tests_require,
    },
    install_requires=requires,
    entry_points={
        'paste.app_factory': [
            'main = pyramid_mahasiswa:main',
        ],
        'console_scripts': [
            ('initialize_pyramid_mahasiswa_db = '
             'pyramid_mahasiswa.scripts.initialize_db:main'),
        ],
    },
)
