#!/usr/bin/env python3
"""
Generate Self-Signed SSL Certificate for Development
NFR-9: TLS/HTTPS Support

This script generates a self-signed SSL certificate for development/testing purposes.
For production, use certificates from a trusted CA (Let's Encrypt, commercial CA, etc.)

Requirements:
- OpenSSL must be installed on the system
- Python 3.6+

Usage:
    python scripts/generate_dev_cert.py
    python scripts/generate_dev_cert.py --days 365 --key-size 2048
"""

import os
import sys
import subprocess
import argparse
from pathlib import Path


def check_openssl():
    """Check if OpenSSL is installed"""
    try:
        result = subprocess.run(
            ['openssl', 'version'],
            capture_output=True,
            text=True,
            check=True
        )
        print(f"✅ OpenSSL found: {result.stdout.strip()}")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Error: OpenSSL is not installed or not in PATH")
        print("   Please install OpenSSL:")
        print("   - Windows: Download from https://slproweb.com/products/Win32OpenSSL.html")
        print("   - Linux: sudo apt-get install openssl (Ubuntu/Debian)")
        print("   - Mac: brew install openssl")
        return False


def create_certs_directory(certs_dir='certs'):
    """Create certificates directory if it doesn't exist"""
    certs_path = Path(certs_dir)
    certs_path.mkdir(exist_ok=True)
    print(f"✅ Certificates directory: {certs_path.absolute()}")
    return certs_path


def generate_certificate(certs_dir, days=365, key_size=2048, common_name='localhost'):
    """
    Generate self-signed SSL certificate
    
    Args:
        certs_dir: Directory to save certificates
        days: Certificate validity in days
        key_size: RSA key size in bits (2048 or 4096)
        common_name: Common Name (CN) for the certificate
    """
    certs_path = Path(certs_dir)
    key_path = certs_path / 'server.key'
    cert_path = certs_path / 'server.crt'
    config_path = certs_path / 'cert.conf'
    
    # Create OpenSSL config file
    config_content = f"""[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C = VN
ST = Ho Chi Minh
L = Ho Chi Minh City
O = AURA Development
OU = IT Department
CN = {common_name}

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = {common_name}
DNS.2 = localhost
DNS.3 = *.localhost
IP.1 = 127.0.0.1
IP.2 = ::1
"""
    
    # Write config file
    with open(config_path, 'w') as f:
        f.write(config_content)
    print(f"✅ Created OpenSSL config: {config_path}")
    
    # Generate private key
    print(f"\n🔑 Generating private key ({key_size} bits)...")
    key_cmd = [
        'openssl', 'genrsa',
        '-out', str(key_path),
        str(key_size)
    ]
    
    try:
        subprocess.run(key_cmd, check=True, capture_output=True)
        print(f"✅ Private key generated: {key_path}")
        
        # Set permissions (read-only for owner on Unix systems)
        if sys.platform != 'win32':
            os.chmod(key_path, 0o600)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error generating private key: {e.stderr.decode()}")
        return False
    
    # Generate certificate signing request (CSR) and self-sign
    print(f"\n📜 Generating self-signed certificate (valid for {days} days)...")
    cert_cmd = [
        'openssl', 'req',
        '-new',
        '-x509',
        '-key', str(key_path),
        '-out', str(cert_path),
        '-days', str(days),
        '-config', str(config_path),
        '-extensions', 'v3_req',
        '-sha256'  # Use SHA-256 signature algorithm
    ]
    
    try:
        subprocess.run(cert_cmd, check=True, capture_output=True)
        print(f"✅ Certificate generated: {cert_path}")
        
        # Set permissions
        if sys.platform != 'win32':
            os.chmod(cert_path, 0o644)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error generating certificate: {e.stderr.decode()}")
        return False
    
    # Display certificate information
    print(f"\n📋 Certificate Information:")
    info_cmd = [
        'openssl', 'x509',
        '-in', str(cert_path),
        '-text',
        '-noout'
    ]
    
    try:
        result = subprocess.run(info_cmd, check=True, capture_output=True, text=True)
        # Extract key information
        output = result.stdout
        if 'Subject:' in output:
            for line in output.split('\n'):
                if 'Subject:' in line or 'Issuer:' in line or 'Not Before' in line or 'Not After' in line:
                    print(f"   {line.strip()}")
    except subprocess.CalledProcessError:
        pass  # Ignore if info command fails
    
    print(f"\n✅ SSL Certificate generation completed!")
    print(f"\n📁 Files created:")
    print(f"   Private Key: {key_path.absolute()}")
    print(f"   Certificate: {cert_path.absolute()}")
    print(f"   Config: {config_path.absolute()}")
    
    print(f"\n⚠️  IMPORTANT:")
    print(f"   - This is a SELF-SIGNED certificate for DEVELOPMENT ONLY")
    print(f"   - Browsers will show a security warning (this is normal)")
    print(f"   - For PRODUCTION, use certificates from a trusted CA")
    print(f"   - Never commit these files to git (they're in .gitignore)")
    
    print(f"\n🚀 Next steps:")
    print(f"   1. Set environment variables:")
    print(f"      export SSL_ENABLED=True")
    print(f"      export SSL_CERT_PATH={cert_path.absolute()}")
    print(f"      export SSL_KEY_PATH={key_path.absolute()}")
    print(f"      export FORCE_HTTPS=True")
    print(f"   2. Run the Flask application:")
    print(f"      python src/app.py")
    print(f"   3. Access via HTTPS:")
    print(f"      https://localhost:8443")
    
    return True


def main():
    """Main function"""
    parser = argparse.ArgumentParser(
        description='Generate self-signed SSL certificate for development'
    )
    parser.add_argument(
        '--days',
        type=int,
        default=365,
        help='Certificate validity in days (default: 365)'
    )
    parser.add_argument(
        '--key-size',
        type=int,
        default=2048,
        choices=[2048, 4096],
        help='RSA key size in bits (default: 2048)'
    )
    parser.add_argument(
        '--common-name',
        type=str,
        default='localhost',
        help='Common Name (CN) for certificate (default: localhost)'
    )
    parser.add_argument(
        '--certs-dir',
        type=str,
        default='certs',
        help='Directory to save certificates (default: certs)'
    )
    
    args = parser.parse_args()
    
    print("=" * 60)
    print("🔐 SSL Certificate Generator for Development")
    print("=" * 60)
    print(f"\nConfiguration:")
    print(f"   Validity: {args.days} days")
    print(f"   Key Size: {args.key_size} bits")
    print(f"   Common Name: {args.common_name}")
    print(f"   Output Directory: {args.certs_dir}")
    print()
    
    # Check OpenSSL
    if not check_openssl():
        sys.exit(1)
    
    # Create certs directory
    create_certs_directory(args.certs_dir)
    
    # Generate certificate
    success = generate_certificate(
        certs_dir=args.certs_dir,
        days=args.days,
        key_size=args.key_size,
        common_name=args.common_name
    )
    
    if success:
        print("\n" + "=" * 60)
        print("✅ Certificate generation completed successfully!")
        print("=" * 60)
        sys.exit(0)
    else:
        print("\n" + "=" * 60)
        print("❌ Certificate generation failed!")
        print("=" * 60)
        sys.exit(1)


if __name__ == '__main__':
    main()
