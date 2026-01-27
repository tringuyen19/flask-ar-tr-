"""
HTTPS Redirect Middleware - NFR-9
Force HTTP requests to redirect to HTTPS for security compliance
"""

from flask import request, redirect


def setup_https_redirect(app):
    """
    Setup HTTPS redirect middleware for Flask app
    
    This middleware will:
    1. Check if FORCE_HTTPS is enabled
    2. Check if request is HTTP (not HTTPS)
    3. Redirect to HTTPS with same URL path
    
    Args:
        app: Flask application instance
    """
    @app.before_request
    def force_https():
        """
        Force HTTPS redirect for all HTTP requests
        Only active when FORCE_HTTPS=True in config
        """
        # Check if HTTPS redirect is enabled
        force_https = app.config.get('FORCE_HTTPS', False)
        ssl_enabled = app.config.get('SSL_ENABLED', False)
        
        # Skip redirect if HTTPS is not enabled or redirect is disabled
        if not force_https or not ssl_enabled:
            return None
        
        # Skip redirect for health checks and localhost (development)
        # This allows health checks to work without HTTPS in development
        if request.endpoint == 'health' or request.host.startswith('localhost'):
            # Allow localhost without HTTPS in development
            if app.config.get('DEBUG', False):
                return None
        
        # Check if request is HTTP (not HTTPS)
        # In production behind reverse proxy, check X-Forwarded-Proto header
        # In development, check request.scheme
        is_https = (
            request.is_secure or 
            request.headers.get('X-Forwarded-Proto', '').lower() == 'https' or
            request.headers.get('X-Forwarded-Ssl', '').lower() == 'on'
        )
        
        if not is_https:
            # Build HTTPS URL
            https_url = request.url.replace('http://', 'https://', 1)
            
            # If behind reverse proxy, use X-Forwarded-Host header
            if request.headers.get('X-Forwarded-Host'):
                host = request.headers.get('X-Forwarded-Host')
                https_url = f"https://{host}{request.full_path}"
            
            # Redirect to HTTPS
            return redirect(https_url, code=301)  # 301 Permanent Redirect
        
        return None


def setup_security_headers(app):
    """
    Setup security headers for HTTPS compliance
    
    Headers added:
    - Strict-Transport-Security (HSTS): Force browsers to use HTTPS
    - Content-Security-Policy: Prevent XSS attacks
    - X-Frame-Options: Prevent clickjacking
    - X-Content-Type-Options: Prevent MIME sniffing
    
    Args:
        app: Flask application instance
    """
    @app.after_request
    def add_security_headers(response):
        """
        Add security headers to all responses
        """
        # Only add security headers for HTTPS responses
        is_https = (
            request.is_secure or 
            request.headers.get('X-Forwarded-Proto', '').lower() == 'https'
        )
        
        if is_https or app.config.get('SSL_ENABLED', False):
            # HTTP Strict Transport Security (HSTS)
            # Force browser to use HTTPS for 1 year (31536000 seconds)
            # includeSubDomains: Apply to all subdomains
            # preload: Allow inclusion in HSTS preload list
            response.headers['Strict-Transport-Security'] = (
                'max-age=31536000; includeSubDomains; preload'
            )
            
            # Content Security Policy
            # Restrict resources that can be loaded
            response.headers['Content-Security-Policy'] = (
                "default-src 'self'; "
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
                "style-src 'self' 'unsafe-inline'; "
                "img-src 'self' data: https:; "
                "font-src 'self' data:; "
                "connect-src 'self'; "
                "frame-ancestors 'self';"
            )
            
            # X-Frame-Options: Prevent clickjacking
            response.headers['X-Frame-Options'] = 'SAMEORIGIN'
            
            # X-Content-Type-Options: Prevent MIME sniffing
            response.headers['X-Content-Type-Options'] = 'nosniff'
            
            # X-XSS-Protection: Enable XSS filter
            response.headers['X-XSS-Protection'] = '1; mode=block'
            
            # Referrer-Policy: Control referrer information
            response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        return response
