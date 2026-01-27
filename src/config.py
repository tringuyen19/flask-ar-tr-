# Configuration settings for the Flask application

import os
from dotenv import load_dotenv
load_dotenv()

class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a_default_secret_key'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-change-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES', 86400))  # 24 hours default
    DEBUG = os.environ.get('DEBUG', 'False').lower() in ['true', '1']
    TESTING = os.environ.get('TESTING', 'False').lower() in ['true', '1']
    DATABASE_URI = os.environ.get('DATABASE_URI') or 'mssql+pymssql://sa:123@127.0.0.1:1433/RetinalHealthDB'
    CORS_HEADERS = 'Content-Type'
    
    # ========== NFR-9: SSL/TLS Configuration ==========
    # Enable SSL/TLS support
    SSL_ENABLED = os.environ.get('SSL_ENABLED', 'False').lower() in ['true', '1']
    
    # SSL Certificate paths
    SSL_CERT_PATH = os.environ.get('SSL_CERT_PATH') or './certs/server.crt'
    SSL_KEY_PATH = os.environ.get('SSL_KEY_PATH') or './certs/server.key'
    SSL_CA_PATH = os.environ.get('SSL_CA_PATH')  # Optional, for production with CA chain
    
    # HTTPS Port (default: 8443 for HTTPS, 9999 for HTTP)
    HTTPS_PORT = int(os.environ.get('HTTPS_PORT', 8443))
    HTTP_PORT = int(os.environ.get('HTTP_PORT', 9999))
    
    # Force HTTPS redirect (redirect all HTTP to HTTPS)
    FORCE_HTTPS = os.environ.get('FORCE_HTTPS', 'False').lower() in ['true', '1']
    
    # TLS Version (minimum TLS 1.2 as per NFR-9 requirement)
    TLS_VERSION = os.environ.get('TLS_VERSION', '1.2')  # Options: '1.2', '1.3'
    
    # Cipher suites (must include AES-256 as per NFR-9 requirement)
    # These are strong ciphers that support AES-256 and TLS 1.2+
    SSL_CIPHERS = os.environ.get('SSL_CIPHERS') or (
        'ECDHE-RSA-AES256-GCM-SHA384:'
        'ECDHE-ECDSA-AES256-GCM-SHA384:'
        'ECDHE-RSA-AES256-SHA384:'
        'ECDHE-ECDSA-AES256-SHA384:'
        'ECDHE-RSA-AES128-GCM-SHA256:'
        'ECDHE-ECDSA-AES128-GCM-SHA256:'
        '!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA'
    )

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    DATABASE_URI = os.environ.get('DATABASE_URI') or 'mssql+pymssql://sa:123@127.0.0.1:1433/RetinalHealthDB'
    # Development: SSL optional, can use self-signed certificate
    SSL_ENABLED = os.environ.get('SSL_ENABLED', 'False').lower() in ['true', '1']
    FORCE_HTTPS = os.environ.get('FORCE_HTTPS', 'False').lower() in ['true', '1']


class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    DATABASE_URI = os.environ.get('DATABASE_URI') or 'mssql+pymssql://sa:123@127.0.0.1:1433/RetinalHealthDB'


class ProductionConfig(Config):
    """Production configuration."""
    DATABASE_URI = os.environ.get('DATABASE_URI') or 'mssql+pymssql://sa:123@127.0.0.1:1433/RetinalHealthDB'
    # Production: SSL required, must use trusted certificate
    SSL_ENABLED = os.environ.get('SSL_ENABLED', 'True').lower() in ['true', '1']
    FORCE_HTTPS = os.environ.get('FORCE_HTTPS', 'True').lower() in ['true', '1']
    DEBUG = False

    
template = {
    "swagger": "2.0",
    "info": {
        "title": "Todo API",
        "description": "API for managing todos",
        "version": "1.0.0"
    },
    "basePath": "/",
    "schemes": [
        "http",
        "https"
    ],
    "consumes": [
        "application/json"
    ],
    "produces": [
        "application/json"
    ]
}
class SwaggerConfig:
    """Swagger configuration for AURA system."""
    # Static template (backward compatibility)
    template = {
        "swagger": "2.0",
        "info": {
            "title": "AURA - AI-Powered Retinal Disease Detection API",
            "description": (
                "Complete REST API for AURA medical system including AI analysis, patient management, "
                "doctor reviews, messaging, and billing services. "
                "**Security:** All patient data is encrypted in transit using TLS 1.2+ with AES-256 encryption (NFR-9)."
            ),
            "version": "1.0.0",
            "contact": {
                "name": "AURA Development Team",
                "email": "support@aura-health.com"
            }
        },
        "basePath": "/api",
        "schemes": [
            "http",
            "https"
        ],
        "consumes": [
            "application/json"
        ],
        "produces": [
            "application/json"
        ],
        "tags": [
            {"name": "Authentication", "description": "User authentication and registration"},
            {"name": "Roles", "description": "Role management operations"},
            {"name": "Accounts", "description": "User account management"},
            {"name": "Patients", "description": "Patient profile operations"},
            {"name": "Doctors", "description": "Doctor profile operations"},
            {"name": "Clinics", "description": "Clinic management"},
            {"name": "Retinal Images", "description": "Medical image upload and management"},
            {"name": "AI Analysis", "description": "AI-powered retinal disease detection"},
            {"name": "AI Results", "description": "AI analysis results and predictions"},
            {"name": "Medical Reports", "description": "Medical report generation and management"},
            {"name": "Doctor Reviews", "description": "Doctor validation and review operations"},
            {"name": "Notifications", "description": "User notification system"},
            {"name": "Messaging", "description": "Patient-doctor communication"},
            {"name": "Billing", "description": "Service packages, subscriptions and payments"}
        ],
        "securityDefinitions": {
            "Bearer": {
                "type": "apiKey",
                "name": "Authorization",
                "in": "header",
                "description": "JWT Authorization header using the Bearer scheme. Enter only the token value (without 'Bearer ' prefix). The middleware will automatically add 'Bearer ' prefix if missing. Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        }
    }

    @staticmethod
    def get_template():
        """
        Get Swagger template with dynamic scheme based on SSL configuration
        NFR-9: Prefer HTTPS scheme when SSL is enabled
        """
        # Check if SSL is enabled (default to HTTPS for production)
        ssl_enabled = os.environ.get('SSL_ENABLED', 'False').lower() in ['true', '1']
        
        # Determine schemes: prefer HTTPS if SSL is enabled
        if ssl_enabled:
            schemes = ["https", "http"]  # HTTPS first
        else:
            schemes = ["http", "https"]  # HTTP first for development
        
        # Create template with dynamic schemes
        template = SwaggerConfig.template.copy()
        template["schemes"] = schemes
        return template

    swagger_config = {
        "headers": [],
        "specs": [
            {
                "endpoint": 'apispec',
                "route": '/apispec.json',
                "rule_filter": lambda rule: True,
                "model_filter": lambda tag: True,
            }
        ],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/docs"
    }