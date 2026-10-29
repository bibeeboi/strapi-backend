# API Search Endpoints

Base URL:

```text
http://localhost:1337
```

Semua endpoint menggunakan filter bawaan Strapi. Parameter yang umum dipakai:

- `keyword`: kata kunci pencarian.
- `organizationId`: ID organization.
- `populate=*`: menyertakan relasi/media.
- `pagination[page]` dan `pagination[pageSize]`: pagination.

Contoh nilai:

```text
keyword=harga buah kota
organizationId=1
```

## Berita

```http
GET /api/beritas?filters[$or][0][title][$containsi]=harga%20buah%20kota&filters[$or][1][content][$containsi]=harga%20buah%20kota&filters[$or][2][author][$containsi]=harga%20buah%20kota&filters[organization][id][$eq]=1&populate=*&pagination[page]=1&pagination[pageSize]=10
```

Parameter yang dicari:

- `title`
- `content`
- `author`

Contoh dengan `curl`:

```bash
curl "http://localhost:1337/api/beritas?filters%5B%24or%5D%5B0%5D%5Btitle%5D%5B%24containsi%5D=harga%20buah%20kota&filters%5B%24or%5D%5B1%5D%5Bcontent%5D%5B%24containsi%5D=harga%20buah%20kota&filters%5B%24or%5D%5B2%5D%5Bauthor%5D%5B%24containsi%5D=harga%20buah%20kota&filters%5Borganization%5D%5Bid%5D%5B%24eq%5D=1&populate=*&pagination%5Bpage%5D=1&pagination%5BpageSize%5D=10"
```

## Video

```http
GET /api/videos?filters[$or][0][title][$containsi]=harga%20buah%20kota&filters[$or][1][description][$containsi]=harga%20buah%20kota&filters[organization][id][$eq]=1&populate=*&pagination[page]=1&pagination[pageSize]=10
```

Parameter yang dicari:

- `title`
- `description`

Contoh dengan `curl`:

```bash
curl "http://localhost:1337/api/videos?filters%5B%24or%5D%5B0%5D%5Btitle%5D%5B%24containsi%5D=harga%20buah%20kota&filters%5B%24or%5D%5B1%5D%5Bdescription%5D%5B%24containsi%5D=harga%20buah%20kota&filters%5Borganization%5D%5Bid%5D%5B%24eq%5D=1&populate=*&pagination%5Bpage%5D=1&pagination%5BpageSize%5D=10"
```

## Gallery

```http
GET /api/galleries?filters[$or][0][title][$containsi]=harga%20buah%20kota&filters[$or][1][descrption][$containsi]=harga%20buah%20kota&filters[organization][id][$eq]=1&populate=*&pagination[page]=1&pagination[pageSize]=10
```

Parameter yang dicari:

- `title`
- `descrption`

> `descrption` mengikuti nama field yang saat ini ada di schema Gallery.

Contoh dengan `curl`:

```bash
curl "http://localhost:1337/api/galleries?filters%5B%24or%5D%5B0%5D%5Btitle%5D%5B%24containsi%5D=harga%20buah%20kota&filters%5B%24or%5D%5B1%5D%5Bdescrption%5D%5B%24containsi%5D=harga%20buah%20kota&filters%5Borganization%5D%5Bid%5D%5B%24eq%5D=1&populate=*&pagination%5Bpage%5D=1&pagination%5BpageSize%5D=10"
```

## Catatan Organization

- Request public dapat menggunakan `filters[organization][id][$eq]`.
- Request dari user yang login akan dibatasi otomatis ke organization milik user oleh controller.
- Jika user login tidak memiliki organization, API mengembalikan `403 Forbidden`.
- Jika endpoint mengembalikan `403`, pastikan permission `find` untuk content type terkait sudah aktif di role Users & Permissions.

## Format Response

Strapi mengembalikan response collection dengan bentuk umum:

```json
{
  "data": [],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 0,
      "total": 0
    }
  }
}
```

## CRUD dengan Kredensial Admin

### Penting

Kredensial login admin Strapi **tidak dikirim langsung** ke endpoint CRUD. Login
admin dilakukan sekali untuk mendapatkan access token, lalu token dikirim sebagai
Bearer token.

Untuk akses server-to-server, pilihan yang lebih sederhana adalah membuat
**API Token** di Strapi Admin melalui `Settings > API Tokens`, lalu gunakan token
tersebut pada request:

```http
Authorization: Bearer <API_TOKEN>
```

Jangan menyimpan API token atau kredensial admin di frontend/mobile app.

### Login Admin

```http
POST /admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password-admin"
}
```

Simpan `data.token` dari response login:

```json
{
  "data": {
    "token": "<ADMIN_ACCESS_TOKEN>"
  }
}
```

### Endpoint CRUD

Endpoint collection type yang digunakan:

| Content type | Endpoint |
|---|---|
| Berita | `/api/beritas` |
| Video | `/api/videos` |
| Gallery | `/api/galleries` |
| Site Setting | `/api/site-settings` |
| Quick Action | `/api/quick-actions` |

Semua contoh berikut menggunakan:

```http
Authorization: Bearer <API_TOKEN>
Content-Type: application/json
```

#### Create

```http
POST /api/beritas
```

```json
{
  "data": {
    "title": "Harga Buah Kota Batu",
    "author": "Admin",
    "content": "Informasi harga buah...",
    "organization": 1
  }
}
```

Ganti path dan isi `data` sesuai content type:

```http
POST /api/videos
POST /api/galleries
POST /api/site-settings
POST /api/quick-actions
```

#### Read

```http
GET /api/beritas/1?populate=*
GET /api/videos/1?populate=*
GET /api/galleries/1?populate=*
GET /api/site-settings/1?populate=*
GET /api/quick-actions/1?populate=*
```

Untuk Strapi v5, identifier pada endpoint detail biasanya berupa
`documentId`, bukan database integer `id`.

#### Update

```http
PUT /api/beritas/<DOCUMENT_ID>
```

```json
{
  "data": {
    "title": "Harga Buah Kota Batu Terbaru"
  }
}
```

Path update untuk content type lain:

```http
PUT /api/videos/<DOCUMENT_ID>
PUT /api/galleries/<DOCUMENT_ID>
PUT /api/site-settings/<DOCUMENT_ID>
PUT /api/quick-actions/<DOCUMENT_ID>
```

#### Delete

```http
DELETE /api/beritas/<DOCUMENT_ID>
DELETE /api/videos/<DOCUMENT_ID>
DELETE /api/galleries/<DOCUMENT_ID>
DELETE /api/site-settings/<DOCUMENT_ID>
DELETE /api/quick-actions/<DOCUMENT_ID>
```

### Contoh curl

```bash
curl -X POST "http://localhost:1337/api/beritas" ^
  -H "Authorization: Bearer <API_TOKEN>" ^
  -H "Content-Type: application/json" ^
  -d "{\"data\":{\"title\":\"Harga Buah Kota Batu\",\"content\":\"Informasi harga buah...\",\"organization\":1}}"
```

### Implementasi Admin CRUD Saat Ini

Endpoint admin CRUD berikut sudah dibuat dan memakai policy `global::is-admin-caller`:

- `/api/admin/beritas`
- `/api/admin/videos`
- `/api/admin/galleries`
- `/api/admin/site-settings`
- `/api/admin/quick-actions`

Semua endpoint admin ini membaca admin JWT dari header `Authorization: Bearer <ADMIN_JWT>`, lalu resolve organisasi admin via `operator.email` → `operator.organization`.

Untuk super admin, akses tetap dibuka tanpa filter organisasi. Untuk admin biasa, request otomatis dibatasi ke organization milik admin tersebut.

### Contoh Request Admin CRUD

#### GET list

```http
GET /api/admin/videos?populate=*&pagination[page]=1&pagination[pageSize]=10
Authorization: Bearer <ADMIN_JWT>
```

```http
GET /api/admin/galleries?populate=*&pagination[page]=1&pagination[pageSize]=10
Authorization: Bearer <ADMIN_JWT>
```

```http
GET /api/admin/site-settings?populate=*
Authorization: Bearer <ADMIN_JWT>
```

```http
GET /api/admin/quick-actions?populate=*
Authorization: Bearer <ADMIN_JWT>
```

#### GET detail

```http
GET /api/admin/videos/<DOCUMENT_ID>?populate=*
Authorization: Bearer <ADMIN_JWT>
```

```http
GET /api/admin/galleries/<DOCUMENT_ID>?populate=*
Authorization: Bearer <ADMIN_JWT>
```

#### Create

```http
POST /api/admin/videos
Authorization: Bearer <ADMIN_JWT>
Content-Type: application/json

{
  "data": {
    "title": "Harga Buah Kota Batu",
    "description": "Video edukasi harga buah terbaru di Kota Batu",
    "organization": 4
  }
}
```

```http
POST /api/admin/galleries
Authorization: Bearer <ADMIN_JWT>
Content-Type: application/json

{
  "data": {
    "title": "Galeri Harga Buah",
    "descrption": "Koleksi foto produk buah lokal",
    "organization": 4
  }
}
```

```http
POST /api/admin/site-settings
Authorization: Bearer <ADMIN_JWT>
Content-Type: application/json

{
  "data": {
    "siteName": "Kota Batu",
    "organization": 4
  }
}
```

```http
POST /api/admin/quick-actions
Authorization: Bearer <ADMIN_JWT>
Content-Type: application/json

{
  "data": {
    "title": "Cek Harga Buah",
    "description": "Akses cepat cek harga buah harian",
    "organization": 4
  }
}
```

#### Update

```http
PUT /api/admin/videos/<DOCUMENT_ID>
Authorization: Bearer <ADMIN_JWT>
Content-Type: application/json

{
  "data": {
    "title": "Harga Buah Kota Batu Update"
  }
}
```

```http
PUT /api/admin/galleries/<DOCUMENT_ID>
Authorization: Bearer <ADMIN_JWT>
Content-Type: application/json

{
  "data": {
    "title": "Galeri Harga Buah Update"
  }
}
```

#### Delete

```http
DELETE /api/admin/videos/<DOCUMENT_ID>
Authorization: Bearer <ADMIN_JWT>
```

```http
DELETE /api/admin/galleries/<DOCUMENT_ID>
Authorization: Bearer <ADMIN_JWT>
```

> Catatan: pada Strapi v5, detail/update/delete sering memakai `documentId`, bukan `id` numeric. Jika request `400` atau `404`, pastikan pakai `documentId` yang valid.
