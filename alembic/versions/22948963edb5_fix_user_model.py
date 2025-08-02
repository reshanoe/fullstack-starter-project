"""fix user model
Revision ID: 22948963edb5
Revises: 2c11b1afb878
Create Date: 2025-08-02 11:13:35.782535
"""
from alembic import op
import sqlalchemy as sa 


revision = '22948963edb5'
down_revision = '2c11b1afb878'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column("users", sa.Column('username', sa.String),nullable=False)
    op.drop_column('users', 'name')

def downgrade():
    op.alter_column('users', 'username', new_column_name='name')