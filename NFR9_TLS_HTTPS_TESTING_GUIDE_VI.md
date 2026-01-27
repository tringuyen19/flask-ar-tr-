# NFR-9: Hướng dẫn TEST TLS/HTTPS (tiếng Việt)

> Mục tiêu: đảm bảo **mã hóa khi truyền tải** bằng **TLS 1.2+** và ưu tiên **cipher AES-256**, đồng thời **ép chuyển HTTP → HTTPS**.

---

## 1) Bạn đang test cái gì?

- **HTTPS chạy được**: truy cập `https://...` vào API/Swagger không lỗi server.
- **HTTP bị ép redirect**: truy cập `http://...` sẽ bị chuyển sang `https://...` (status 301).
- **TLS 1.2+**: khi bắt tay TLS, server không cho TLS 1.0/1.1.
- **Cipher có AES-256**: cipher suite được chọn khi handshake có `AES256` (ví dụ `ECDHE-RSA-AES256-GCM-SHA384`).
- **Swagger dùng HTTPS**: Swagger UI mở bằng HTTPS và gọi API ok.

---

## 2) Chuẩn bị (Development trên Windows)

### 2.1 Cài OpenSSL (bắt buộc để kiểm tra TLS + tạo cert)

- Cài OpenSSL (Windows). Sau đó mở PowerShell và kiểm tra:

```powershell
openssl version
```

Nếu chạy ra version là OK.

### 2.2 Tạo certificate tự ký (self-signed) cho dev

Trong thư mục project, chạy:

```powershell
python scripts\generate_dev_cert.py
```

Script sẽ tạo:
- `certs\server.crt`
- `certs\server.key`

---

## 3) Chạy server ở chế độ HTTPS (Development)

### 3.1 Set biến môi trường (PowerShell)

> Lưu ý: `$env:...` chỉ có hiệu lực trong phiên PowerShell hiện tại.

```powershell
$env:SSL_ENABLED="True"
$env:FORCE_HTTPS="True"
$env:SSL_CERT_PATH=".\certs\server.crt"
$env:SSL_KEY_PATH=".\certs\server.key"
$env:TLS_VERSION="1.2"
$env:HTTPS_PORT="8443"
$env:HTTP_PORT="9999"
```

### 3.2 Run app

```powershell
python src\app.py
```

Kỳ vọng log có dạng:
- chạy HTTPS port `8443`
- gợi ý URL `https://localhost:8443`

---

## 4) TEST chức năng HTTPS/TLS

### 4.1 Test truy cập HTTPS bằng trình duyệt

- Mở: `https://localhost:8443/docs`
- Trình duyệt sẽ cảnh báo do self-signed → chọn “Advanced” → “Proceed”.

Kỳ vọng:
- Swagger UI hiện ra bình thường.

### 4.2 Test redirect HTTP → HTTPS (301)

Mở:
- `http://localhost:9999/docs`

Kỳ vọng:
- trình duyệt tự chuyển sang `https://localhost:8443/docs`

Test bằng curl (nếu có):

```powershell
curl -I http://localhost:9999/docs
```

Kỳ vọng header có:
- `HTTP/1.1 301 ...`
- `Location: https://...`

### 4.3 Xác minh TLS version và cipher AES-256 bằng OpenSSL

#### (A) Kiểm tra TLS 1.2 handshake OK

```powershell
openssl s_client -connect localhost:8443 -tls1_2
```

Kỳ vọng trong output có:
- `Protocol  : TLSv1.2`
- `Cipher    : ...AES256...` (hoặc cipher mạnh khác, ưu tiên có `AES256`)

#### (B) Kiểm tra TLS 1.1 bị từ chối

```powershell
openssl s_client -connect localhost:8443 -tls1_1
```

Kỳ vọng:
- handshake fail / “wrong version number” / “protocol version” (tùy OpenSSL), tức là **TLS 1.1 không dùng được**.

> Nếu TLS 1.1 vẫn connect được, nghĩa là cấu hình minimum TLS chưa đúng.

---

## 5) TEST Swagger gọi API qua HTTPS

### 5.1 Test endpoint public

Ví dụ:
- `GET https://localhost:8443/health`

Bạn có thể test trong browser hoặc curl:

```powershell
curl -k https://localhost:8443/health
```

Giải thích `-k`: bỏ qua verify cert self-signed (chỉ dùng cho dev).

### 5.2 Test endpoint cần JWT trong Swagger

- Vào Swagger: `https://localhost:8443/docs`
- Bấm **Authorize** → dán **token** (chỉ token, không cần “Bearer ” nếu middleware đã auto thêm)
- Gọi 1 API có `security: Bearer`.

Kỳ vọng:
- không còn 401 do thiếu Bearer prefix.

---

## 6) Production: Test checklist nhanh (khuyến nghị dùng reverse proxy)

Thực tế production thường dùng:
- Nginx/Apache/Load Balancer terminate TLS
- Flask chạy phía sau (HTTP nội bộ)

### 6.1 Checklist production

- [ ] Cert hợp lệ (không cảnh báo trình duyệt)
- [ ] HTTP → HTTPS redirect 301/308
- [ ] TLS 1.2+ (không hỗ trợ TLS 1.0/1.1)
- [ ] Cipher mạnh (ưu tiên AES-256-GCM + ECDHE)
- [ ] HSTS header bật (nếu dùng HTTPS thực)

### 6.2 Test TLS với OpenSSL

```bash
openssl s_client -connect yourdomain.com:443 -tls1_2
```

Kỳ vọng:
- `Protocol  : TLSv1.2` hoặc `TLSv1.3`
- `Cipher    : ...AES256...` (hoặc TLS1.3 cipher mạnh tương đương)

---

## 7) Giải thích quan trọng: “AES-256 khi lưu trữ” là phần khác

NFR-9 bạn đưa có câu: **“mã hóa khi lưu trữ và khi truyền tải (TLS 1.2+; AES-256)”**.

- **TLS 1.2+ / cipher AES-256** → áp dụng cho **khi truyền tải (in transit)**.
- **Khi lưu trữ (at rest)** muốn “AES-256” thì thường phải làm ở tầng DB/hạ tầng, ví dụ:
  - **SQL Server TDE** (Transparent Data Encryption – AES)
  - **Always Encrypted** (mã hóa cột nhạy cảm)
  - Disk encryption (BitLocker) / managed encryption của cloud

Phần “at rest” nếu bạn muốn mình làm đúng đủ theo yêu cầu, mình đề xuất tách thành 1 task rõ ràng (liên quan nhiều đến DB/infra) để triển khai và test riêng.

---

## 8) Troubleshooting nhanh

- **Không vào được `https://localhost:8443`**:
  - cert/key path sai
  - port 8443 đang bị chiếm
  - OpenSSL chưa tạo cert

- **HTTP không redirect sang HTTPS**:
  - chưa set `FORCE_HTTPS=True`
  - bạn đang truy cập nhầm port / host

- **TLS 1.1 vẫn connect được**:
  - kiểm tra `TLS_VERSION=1.2`
  - kiểm tra code tạo SSL context (minimum_version)

---

## 9) Checklist test chi tiết từ A → Z (dùng cho chấm điểm / báo cáo)

> Bạn có thể in phần này ra và tick từng bước để đảm bảo **NFR-9** được test đầy đủ.

### 9.1 Chuẩn bị máy test

1. **Cài Python 3.10+** nếu chưa có.
2. **Cài OpenSSL** (Windows):
   - Vào Google, tìm `Download OpenSSL for Windows` → tải bộ cài chính thức (ví dụ slproweb).
   - Cài xong, mở **PowerShell mới** và chạy:

   ```powershell
   openssl version
   ```

   - Nếu hiện ra version (ví dụ `OpenSSL 3.2.1 ...`) là OK.
3. **Cài các thư viện Python** cho project (nếu chưa):

   ```powershell
   cd "E:\công nghệ phần mềm\Flask-CleanArchitecture (Trí)"
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

### 9.2 Tạo và kiểm tra certificate dev

1. Đảm bảo đang ở thư mục gốc project:

   ```powershell
   cd "E:\công nghệ phần mềm\Flask-CleanArchitecture (Trí)"
   ```

2. Chạy script tạo cert:

   ```powershell
   python .\scripts\generate_dev_cert.py
   ```

3. Kiểm tra thư mục `certs`:
   - Mở File Explorer, vào `E:\công nghệ phần mềm\Flask-CleanArchitecture (Trí)\certs`.
   - Xác nhận có **2 file**:
     - `server.crt`
     - `server.key`

4. Nếu **không có thư mục `certs` hoặc thiếu file**:
   - Kiểm tra log của `generate_dev_cert.py`.
   - Thường là do **không có OpenSSL** hoặc **không đủ quyền ghi file**.

### 9.3 Cấu hình biến môi trường cho HTTPS

Trong PowerShell (sau khi đã `cd` vào thư mục project và active virtualenv nếu có):

```powershell
$env:SSL_ENABLED="True"
$env:FORCE_HTTPS="True"
$env:SSL_CERT_PATH=".\certs\server.crt"
$env:SSL_KEY_PATH=".\certs\server.key"
$env:TLS_VERSION="1.2"
$env:HTTPS_PORT="8443"
$env:HTTP_PORT="9999"
```

- Có thể kiểm tra lại nhanh bằng:

  ```powershell
  echo $env:SSL_ENABLED
  echo $env:FORCE_HTTPS
  echo $env:TLS_VERSION
  ```

  Nếu trả về `True`, `True`, `1.2` là đúng.

### 9.4 Chạy server và xác nhận log

1. Vẫn ở PowerShell đó, chạy:

   ```powershell
   python .\src\app.py
   ```

2. Quan sát log console, kỳ vọng có dòng kiểu:
   - `* Running on https://0.0.0.0:8443` hoặc tương tự.
   - Không có exception liên quan tới SSL (ví dụ: “cannot load certificate”).

3. Nếu có lỗi:
   - Kiểm tra lại đường dẫn `SSL_CERT_PATH`, `SSL_KEY_PATH`.
   - Kiểm tra file có quyền đọc (không bị khóa, không bị antivirus chặn).

### 9.5 Test bằng trình duyệt (Chrome/Edge)

1. Mở Chrome/Edge.
2. Nhập URL:

   ```text
   https://localhost:8443/docs
   ```

3. Trình duyệt sẽ báo **“Your connection is not private”** (do self-signed).
4. Bấm **Advanced** → **Proceed to localhost (unsafe)**.
5. Kỳ vọng:
   - Swagger UI hiện đầy đủ.
   - Ở thanh địa chỉ, biểu tượng “ổ khóa”/“Not secure” nhưng **protocol là HTTPS**.

6. Xem chi tiết TLS trong Chrome:
   - Bấm vào biểu tượng **ổ khóa** → **Connection is secure / Certificate**.
   - Kiểm tra phần **Certificate**: Issued to `localhost` (hoặc CN dev).
   - Vào **Developer Tools (F12)** → tab **Security**:
     - `Connection` nên hiển thị `TLS 1.2` hoặc `TLS 1.3`.
     - `Cipher` chứa `AES_256` hoặc cipher mạnh tương đương.

### 9.6 Test redirect HTTP → HTTPS

#### (A) Bằng trình duyệt

1. Mở tab mới, nhập:

   ```text
   http://localhost:9999/docs
   ```

2. Kỳ vọng:
   - URL tự động chuyển thành `https://localhost:8443/docs`.
   - Không có lỗi vòng lặp redirect (ERR_TOO_MANY_REDIRECTS).

#### (B) Bằng curl (để ghi log vào báo cáo)

1. Trong **PowerShell khác** (server vẫn đang chạy), gõ:

   ```powershell
   curl -I http://localhost:9999/docs
   ```

2. Kết quả mẫu (tham khảo, không cần giống 100%):

   ```text
   HTTP/1.1 301 MOVED PERMANENTLY
   Location: https://localhost:8443/docs
   ...
   ```

3. Dùng kết quả này để **chụp màn hình** hoặc **dán vào tài liệu test** làm bằng chứng.

### 9.7 Xác minh TLS version & cipher bằng OpenSSL (chi tiết)

#### (A) TLS 1.2 OK

1. Trong PowerShell, chạy:

   ```powershell
   openssl s_client -connect localhost:8443 -tls1_2
   ```

2. Sau khi lệnh chạy xong (sẽ hiện rất nhiều text), tìm các dòng:
   - `Protocol  : TLSv1.2`
   - `Cipher    : ...AES256...` (ví dụ `TLS_AES_256_GCM_SHA384`).

3. Bạn có thể dùng **tìm kiếm trong console** (chuột phải → Mark/Find) để tìm từ khóa `Protocol` và `Cipher`.

4. Nếu không thấy `TLSv1.2` hoặc cipher không phải AES-256 (mà là AES-128 hoặc RC4 cũ), cần báo lại để cấu hình lại SSL context.

#### (B) TLS 1.1 bị từ chối

1. Chạy:

   ```powershell
   openssl s_client -connect localhost:8443 -tls1_1
   ```

2. Kỳ vọng:
   - Lệnh **không bắt tay thành công**, hiển thị lỗi kiểu:
     - `wrong version number` hoặc
     - `tlsv1 alert protocol version`.

3. Nếu vẫn thấy `Protocol : TLSv1.1` và kết nối được:
   - Ghi lại log → báo là **FAIL** cho tiêu chí “không hỗ trợ TLS 1.1”.
   - Cần chỉnh lại code cấu hình TLS (`minimum_version = TLSVersion.TLSv1_2` hoặc tương đương).

### 9.8 Test API thực tế qua HTTPS (Swagger + curl/Postman)

#### (A) Test endpoint public (`/health`)

1. Vào Swagger: `https://localhost:8443/docs`.
2. Tìm endpoint `GET /health`.
3. Bấm **Try it out** → **Execute**.
4. Kỳ vọng:
   - Response code: `200`.
   - Body: hiển thị trạng thái OK (tùy logic app).

5. Test bằng curl để có log text:

   ```powershell
   curl -k https://localhost:8443/health
   ```

6. Ghi lại output (status code + body) cho báo cáo.

#### (B) Test endpoint cần JWT (qua Swagger)

1. Lấy **JWT token** (theo flow login của hệ thống).
2. Vào Swagger `https://localhost:8443/docs`.
3. Bấm nút **Authorize** (hình cái khóa).
4. Trong popup, dán **chuỗi token** (không cần gõ “Bearer ” nếu backend đã tự thêm).
5. Bấm **Authorize** → **Close**.
6. Chọn 1 API có `security: Bearer` (ví dụ `/api/users/me`).
7. Bấm **Try it out** → **Execute**.
8. Kỳ vọng:
   - Response `200` (hoặc `2xx` hợp lý).
   - Không bị `401 Unauthorized` do thiếu prefix Bearer.

#### (C) Test qua Postman (tùy chọn, dùng cho tài liệu)

1. Mở Postman.
2. Tạo request mới:
   - Method: `GET`.
   - URL: `https://localhost:8443/health` hoặc API protected.
3. Vào tab **Authorization**:
   - Type: `Bearer Token`.
   - Token: dán JWT.
4. Vào tab **Settings** của request (hoặc Global Settings):
   - Bật `SSL certificate verification` nếu bạn đã import cert; **hoặc** tạm thời tắt verify cho môi trường dev.
5. Gửi request.
6. Kỳ vọng:
   - Status code 2xx.
   - Trong tab **Headers** của response, header `Content-Type`, `Strict-Transport-Security` (nếu đã cấu hình) hiển thị đúng.

### 9.9 Checklist tóm tắt cho NFR-9 (điền PASS/FAIL)

- [ ] **HTTPS chạy OK**: `https://localhost:8443/docs` mở được (Swagger hoạt động).
- [ ] **HTTP redirect sang HTTPS**: `http://localhost:9999/docs` → 301/308 → `https://localhost:8443/docs`.
- [ ] **TLS phiên bản tối thiểu 1.2**: OpenSSL/Chrome cho thấy `Protocol : TLSv1.2` hoặc `TLSv1.3`.
- [ ] **Không hỗ trợ TLS 1.0/1.1**: `openssl s_client -tls1_1` bị từ chối.
- [ ] **Cipher mạnh (ưu tiên AES-256)**: handshake chọn cipher có `AES256` hoặc TLS1.3 cipher tương đương.
- [ ] **Swagger sử dụng HTTPS**: tất cả request từ Swagger đều tới `https://...`, không còn gọi `http://...`.
- [ ] **API public qua HTTPS OK**: `/health` trả 200 khi gọi bằng HTTPS.
- [ ] **API cần JWT qua HTTPS OK**: gọi bằng Swagger/Postman với token → 2xx, không lỗi 401 do Bearer.

> Nếu tất cả checkbox trên đều **PASS**, bạn có thể tự tin ghi vào tài liệu rằng **NFR-9 (TLS/HTTPS)** đã được test & đáp ứng ở môi trường dev (về phần “truyền tải”). Phần **mã hóa khi lưu trữ (at rest)** sẽ được xử lý ở task khác liên quan DB/infra.
