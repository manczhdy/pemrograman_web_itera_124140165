"""Metadata & declarative Base SQLAlchemy."""
from sqlalchemy.orm import declarative_base
from sqlalchemy.schema import MetaData

# Konvensi penamaan constraint yang direkomendasikan Alembic agar
# nama constraint yang di-autogenerate antar provider database konsisten.
NAMING_CONVENTION = {
    'ix': 'ix_%(column_0_label)s',
    'uq': 'uq_%(table_name)s_%(column_0_name)s',
    'fk': 'fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s',
    'pk': 'pk_%(table_name)s',
}

metadata = MetaData(naming_convention=NAMING_CONVENTION)
Base = declarative_base(metadata=metadata)
