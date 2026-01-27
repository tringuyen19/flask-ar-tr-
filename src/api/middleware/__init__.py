"""
API Middleware Module
"""

from .auth_middleware import (
    jwt_required,
    get_current_user,
    get_current_user_role,
    get_current_user_role_id,
    get_current_user_role_name,
    require_role,
    require_roles
)

from .https_middleware import (
    setup_https_redirect,
    setup_security_headers
)

__all__ = [
    'jwt_required',
    'get_current_user',
    'get_current_user_role',
    'get_current_user_role_id',
    'get_current_user_role_name',
    'require_role',
    'require_roles',
    'setup_https_redirect',
    'setup_security_headers'
]

