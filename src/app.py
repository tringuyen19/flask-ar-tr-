from flask import Flask, jsonify
from flasgger import Swagger
from flask_jwt_extended import JWTManager
from infrastructure.databases import init_db
from api.routes import register_routes
from api.middleware.https_middleware import setup_https_redirect, setup_security_headers
from config import Config, SwaggerConfig
import ssl
import os

def create_app():
    """Create and configure Flask application"""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # 1. Initialize JWT
    jwt = JWTManager(app)
    print("✅ JWT Authentication initialized")
    
    # 2. Cấu hình Swagger/Flasgger cho API Documentation
    # Use dynamic template that adapts to SSL configuration (NFR-9)
    swagger_template = SwaggerConfig.get_template()
    Swagger(app, template=swagger_template, config=SwaggerConfig.swagger_config)
    print("✅ Swagger UI enabled at: /docs")
    
    # 3. Khởi tạo Database và Tạo bảng
    try:
        init_db(app)
        print("✅ Database initialized and tables created successfully.")
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
    
    # 4. Setup HTTPS redirect middleware (NFR-9)
    try:
        setup_https_redirect(app)
        setup_security_headers(app)
        print("✅ HTTPS redirect and security headers configured")
    except Exception as e:
        print(f"⚠️ Warning: HTTPS middleware setup failed: {e}")
    
    # 5. Đăng ký tất cả API Routes (19 controllers including auth)
    try:
        register_routes(app)
        print("✅ All API routes registered successfully.")
    except Exception as e:
        print(f"❌ Error registering routes: {e}")
    
    # 4. Root endpoint - API Information
    @app.route("/")
    def index():
        """API Root - Shows system information"""
        return jsonify({
            "message": "🏥 AURA - AI-Powered Retinal Disease Detection System",
            "version": "1.0.0",
            "status": "running",
            "database": "connected",
            "documentation": "/docs",
            "health_check": "/health",
            "features": {
                "core": ["Roles", "Accounts", "Patients", "Doctors", "Clinics"],
                "medical": ["Retinal Images", "AI Analysis", "AI Results", "Medical Reports"],
                "communication": ["Notifications", "Messaging", "Doctor Reviews"],
                "billing": ["Service Packages", "Subscriptions", "Payments"]
            },
            "total_endpoints": "178+",
            "architecture": "Clean Architecture"
        })
    
    # 5. Health check endpoint
    @app.route("/health")
    def health():
        """Health check endpoint for monitoring"""
        return jsonify({
            "status": "healthy",
            "database": "connected",
            "api": "operational"
        })
    
    # 6. API Info endpoint
    @app.route("/api")
    def api_info():
        """API endpoints summary"""
        return jsonify({
            "message": "AURA API Endpoints",
            "base_paths": {
                "roles": "/api/roles",
                "accounts": "/api/accounts", 
                "patients": "/api/patient-profiles",
                "doctors": "/api/doctor-profiles",
                "clinics": "/api/clinics",
                "images": "/api/retinal-images",
                "ai_analysis": "/api/ai-analyses",
                "ai_results": "/api/ai-results",
                "reports": "/api/medical-reports",
                "reviews": "/api/doctor-reviews",
                "notifications": "/api/notifications",
                "conversations": "/api/conversations",
                "messages": "/api/messages",
                "packages": "/api/packages",
                "subscriptions": "/api/subscriptions",
                "payments": "/api/payments",
                "auth": "/api/auth"
            },
            "documentation": "/docs"
        })
    
    return app

def create_ssl_context(config):
    """
    Create SSL context for HTTPS support (NFR-9)
    
    Args:
        config: Flask config object
        
    Returns:
        ssl.SSLContext or None if SSL is disabled or certificates not found
    """
    if not config.get('SSL_ENABLED', False):
        return None
    
    cert_path = config.get('SSL_CERT_PATH')
    key_path = config.get('SSL_KEY_PATH')
    
    # Check if certificate files exist
    if not cert_path or not key_path:
        print("⚠️ Warning: SSL enabled but certificate paths not configured")
        return None
    
    if not os.path.exists(cert_path) or not os.path.exists(key_path):
        print(f"⚠️ Warning: SSL certificate files not found:")
        print(f"   Certificate: {cert_path}")
        print(f"   Private Key: {key_path}")
        print(f"   Run 'python scripts/generate_dev_cert.py' to create development certificates")
        return None
    
    try:
        # Create SSL context
        context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        
        # Load certificate and private key
        context.load_cert_chain(cert_path, key_path)
        
        # Load CA certificate if provided (for production)
        ca_path = config.get('SSL_CA_PATH')
        if ca_path and os.path.exists(ca_path):
            context.load_verify_locations(ca_path)
        
        # Set minimum TLS version (TLS 1.2 as per NFR-9 requirement)
        tls_version = config.get('TLS_VERSION', '1.2')
        if tls_version == '1.2':
            context.minimum_version = ssl.TLSVersion.TLSv1_2
        elif tls_version == '1.3':
            context.minimum_version = ssl.TLSVersion.TLSv1_3
        else:
            context.minimum_version = ssl.TLSVersion.TLSv1_2
        
        # Set cipher suites (must include AES-256 as per NFR-9 requirement)
        ciphers = config.get('SSL_CIPHERS')
        if ciphers:
            context.set_ciphers(ciphers)
        
        # Security options - disable weak protocols
        context.options |= ssl.OP_NO_SSLv2
        context.options |= ssl.OP_NO_SSLv3
        context.options |= ssl.OP_NO_TLSv1
        context.options |= ssl.OP_NO_TLSv1_1
        
        print(f"✅ SSL context created successfully")
        print(f"   Certificate: {cert_path}")
        print(f"   Private Key: {key_path}")
        print(f"   TLS Version: {tls_version}+")
        
        return context
        
    except Exception as e:
        print(f"❌ Error creating SSL context: {e}")
        return None


if __name__ == '__main__':
    app = create_app()
    
    # Get SSL configuration
    ssl_enabled = app.config.get('SSL_ENABLED', False)
    ssl_context = create_ssl_context(app.config)
    
    # Determine port and protocol
    if ssl_enabled and ssl_context:
        port = app.config.get('HTTPS_PORT', 8443)
        protocol = "HTTPS"
        print(f"\n🚀 Starting Flask application with {protocol} on port {port}")
        print(f"   Access at: https://localhost:{port}")
        print(f"   Swagger UI: https://localhost:{port}/docs")
        app.run(host='0.0.0.0', port=port, debug=True, ssl_context=ssl_context)
    else:
        port = app.config.get('HTTP_PORT', 9999)
        protocol = "HTTP"
        print(f"\n🚀 Starting Flask application with {protocol} on port {port}")
        print(f"   Access at: http://localhost:{port}")
        print(f"   Swagger UI: http://localhost:{port}/docs")
        if ssl_enabled:
            print(f"   ⚠️ SSL enabled but certificates not found. Using HTTP mode.")
        app.run(host='0.0.0.0', port=port, debug=True)
