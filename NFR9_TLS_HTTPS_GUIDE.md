# NFR-9: TLS/HTTPS Implementation Guide (Hướng dẫn triển khai TLS/HTTPS)

## 📋 Tổng quan (Overview)

**Yêu cầu:** Tất cả dữ liệu bệnh nhân phải được mã hóa khi lưu trữ và khi truyền tải (TLS 1.2+; AES-256).

**Mục tiêu:**
- ✅ Cấu hình SSL/TLS cho Flask application
- ✅ Force HTTPS redirect (chuyển hướng HTTP sang HTTPS)
- ✅ Thiết lập certificate (development/production)
- ✅ Cập nhật Swagger để hỗ trợ HTTPS
- ✅ Đảm bảo TLS 1.2+ và AES-256 encryption

---

## 🏗️ Kiến trúc (Architecture)

```
┌─────────────────────────────────────────────────────────┐
│                    Client Request                       │
│                  (HTTP/HTTPS)                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              HTTPS Redirect Middleware                   │
│         (Force HTTP → HTTPS redirect)                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Flask Application (HTTPS)                   │
│         - TLS 1.2+ Protocol                              │
│         - AES-256 Encryption                             │
│         - SSL Certificate                                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Database (Encrypted Connection)             │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Phần 1: Cấu hình SSL/TLS trong Config

### Mục tiêu
Thêm các cấu hình SSL/TLS vào `config.py` để hỗ trợ:
- SSL certificate paths
- TLS protocol version (1.2+)
- Cipher suites (AES-256)
- HTTPS port configuration

### Files cần sửa:
- `src/config.py`

### Các biến môi trường cần thêm:
```bash
# SSL/TLS Configuration
SSL_ENABLED=True
SSL_CERT_PATH=./certs/server.crt
SSL_KEY_PATH=./certs/server.key
SSL_CA_PATH=./certs/ca.crt  # Optional, for production
HTTPS_PORT=8443
FORCE_HTTPS=True
TLS_VERSION=1.2
```

---

## 📦 Phần 2: Force HTTPS Redirect Middleware

### Mục tiêu
Tạo middleware để tự động chuyển hướng tất cả HTTP requests sang HTTPS.

### Files cần tạo/sửa:
- `src/api/middleware/https_middleware.py` (mới)
- `src/api/middleware/__init__.py` (cập nhật)

### Logic:
1. Kiểm tra nếu request là HTTP
2. Kiểm tra nếu `FORCE_HTTPS=True`
3. Redirect sang HTTPS với cùng URL path

---

## 📦 Phần 3: Cập nhật Flask App để hỗ trợ HTTPS

### Mục tiêu
Cấu hình Flask application để chạy với SSL/TLS support.

### Files cần sửa:
- `src/app.py`

### Thay đổi:
1. Load SSL certificate và key từ config
2. Chạy Flask với SSL context
3. Cấu hình TLS version và cipher suites

---

## 📦 Phần 4: Cập nhật Swagger Config

### Mục tiêu
Cập nhật Swagger để hiển thị HTTPS URLs và hỗ trợ HTTPS testing.

### Files cần sửa:
- `src/config.py` (SwaggerConfig)

### Thay đổi:
1. Set schemes mặc định là `https`
2. Cập nhật basePath nếu cần
3. Thêm HTTPS examples

---

## 📦 Phần 5: Tạo Self-Signed Certificate cho Development

### Mục tiêu
Tạo script để tự động generate self-signed certificate cho development/testing.

### Files cần tạo:
- `scripts/generate_dev_cert.sh` (Linux/Mac)
- `scripts/generate_dev_cert.ps1` (Windows PowerShell)
- `scripts/generate_dev_cert.py` (Cross-platform Python script)

### Certificate Requirements:
- Valid for 365 days
- Subject: CN=localhost
- SAN: localhost, 127.0.0.1
- Key size: 2048 bits (RSA) hoặc 256 bits (ECDSA)
- Signature: SHA-256

---

## 📦 Phần 6: Production Certificate Setup

### Mục tiêu
Hướng dẫn setup SSL certificate cho production environment.

### Option 1: Let's Encrypt (Free, Automated) - Khuyến nghị

**Ưu điểm:**
- ✅ Miễn phí
- ✅ Tự động gia hạn
- ✅ Trusted CA (được tin cậy bởi tất cả browsers)
- ✅ Dễ dàng setup với certbot

**Cài đặt:**

```bash
# 1. Install certbot
# Ubuntu/Debian:
sudo apt-get update
sudo apt-get install certbot

# CentOS/RHEL:
sudo yum install certbot

# Mac:
brew install certbot

# 2. Generate certificate (standalone mode)
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# 3. Certificates sẽ được lưu tại:
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem (certificate)
# /etc/letsencrypt/live/yourdomain.com/privkey.pem (private key)

# 4. Set environment variables:
export SSL_ENABLED=True
export SSL_CERT_PATH=/etc/letsencrypt/live/yourdomain.com/fullchain.pem
export SSL_KEY_PATH=/etc/letsencrypt/live/yourdomain.com/privkey.pem
export FORCE_HTTPS=True

# 5. Auto-renewal (thêm vào crontab)
sudo crontab -e
# Thêm dòng này:
0 0 * * * certbot renew --quiet && systemctl reload your-app-service
```

**Lưu ý:**
- Certificates tự động hết hạn sau 90 ngày
- Certbot tự động gia hạn nếu được cấu hình đúng
- Cần có domain name và DNS đã được cấu hình

### Option 2: Commercial SSL Certificate

**Nhà cung cấp phổ biến:**
- DigiCert
- GlobalSign
- Sectigo (Comodo)
- GoDaddy SSL

**Quy trình:**
1. Mua certificate từ nhà cung cấp
2. Generate Certificate Signing Request (CSR):
   ```bash
   openssl req -new -newkey rsa:2048 -nodes -keyout server.key -out server.csr
   ```
3. Submit CSR cho nhà cung cấp
4. Nhận certificate file (.crt hoặc .pem)
5. Cấu hình trong Flask app

**Ưu điểm:**
- Extended Validation (EV) certificates
- Wildcard certificates (*.yourdomain.com)
- Support tốt từ nhà cung cấp
- Bảo hiểm cao hơn

### Option 3: Cloud Provider SSL

#### AWS Certificate Manager (ACM)
```bash
# 1. Request certificate trong AWS Console hoặc CLI
aws acm request-certificate \
  --domain-name yourdomain.com \
  --validation-method DNS

# 2. Validate certificate (DNS hoặc Email)
# 3. Attach certificate to Load Balancer hoặc CloudFront
# 4. Flask app sẽ nhận HTTPS traffic từ Load Balancer
```

#### Azure App Service Certificates
```bash
# 1. Mua certificate trong Azure Portal
# 2. Bind certificate to App Service
# 3. Enable HTTPS Only
# 4. Flask app tự động sử dụng certificate
```

#### Google Cloud SSL
```bash
# 1. Create SSL certificate trong GCP Console
# 2. Attach to Load Balancer
# 3. Configure backend service
# 4. Flask app nhận HTTPS traffic từ Load Balancer
```

### So sánh các options:

| Option | Chi phí | Độ khó | Auto-renewal | Trust Level |
|--------|--------|--------|--------------|-------------|
| Let's Encrypt | Free | Dễ | ✅ Yes | High |
| Commercial | $50-500/năm | Trung bình | ❌ Manual | Very High |
| Cloud Provider | Free/Paid | Dễ | ✅ Yes | High |

**Khuyến nghị:** Sử dụng Let's Encrypt cho hầu hết các trường hợp, chỉ dùng Commercial khi cần EV hoặc Wildcard certificates.

---

## 🧪 Testing Checklist

### Development Testing:
- [ ] HTTP requests redirect to HTTPS
- [ ] HTTPS requests work correctly
- [ ] Swagger UI accessible via HTTPS
- [ ] API endpoints accessible via HTTPS
- [ ] Certificate valid (self-signed warning OK)
- [ ] TLS version is 1.2 or higher
- [ ] Cipher suite includes AES-256

### Production Testing:
- [ ] Valid SSL certificate (no warnings)
- [ ] HTTPS redirect works
- [ ] All API endpoints accessible via HTTPS
- [ ] SSL Labs test: A or A+ rating
- [ ] Certificate auto-renewal configured
- [ ] HSTS headers configured (optional)

---

## 🔒 Security Best Practices

1. **TLS Configuration:**
   - Minimum TLS 1.2 (prefer TLS 1.3)
   - Disable weak ciphers (SSLv2, SSLv3, TLS 1.0, TLS 1.1)
   - Enable perfect forward secrecy (PFS)

2. **Certificate Management:**
   - Store certificates securely (not in git)
   - Use environment variables for paths
   - Rotate certificates before expiration
   - Monitor certificate expiration

3. **Headers:**
   - HSTS (HTTP Strict Transport Security)
   - Content-Security-Policy
   - X-Frame-Options

---

## 📚 Tài liệu tham khảo (References)

- [Flask SSL Context](https://flask.palletsprojects.com/en/2.3.x/deploying/proxy_fix/)
- [OpenSSL Documentation](https://www.openssl.org/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [SSL Labs SSL Test](https://www.ssllabs.com/ssltest/)
- [OWASP TLS Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Protection_Cheat_Sheet.html)

---

## 🚀 Implementation Order

1. ✅ **Part 1:** Cấu hình SSL/TLS trong Config
2. ✅ **Part 2:** Force HTTPS Redirect Middleware
3. ✅ **Part 3:** Cập nhật Flask App để hỗ trợ HTTPS
4. ✅ **Part 4:** Cập nhật Swagger Config
5. ✅ **Part 5:** Tạo Self-Signed Certificate Script
6. ✅ **Part 6:** Production Certificate Setup Guide

---

## 📝 Notes

- **Development:** Sử dụng self-signed certificate (browser sẽ cảnh báo, nhưng OK cho testing)
- **Production:** Phải sử dụng certificate từ trusted CA (Let's Encrypt hoặc commercial)
- **Testing:** Có thể test với `curl -k` để bypass certificate validation (chỉ cho testing)

---

## ⚠️ Important Warnings

1. **Never commit certificates/keys to git**
2. **Use strong passphrases for private keys**
3. **Monitor certificate expiration**
4. **Test HTTPS redirect thoroughly**
5. **Update firewall rules for HTTPS port**
