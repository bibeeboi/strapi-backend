# 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>

# Strapi — Schema Manual + Seeder

Project ini menggunakan **Strapi 5 + PostgreSQL** dengan skenario:

1. Membuat struktur Content-Type secara manual melalui `schema.json`.
2. Strapi menggunakan schema tersebut untuk membentuk struktur database.
3. Data awal tidak dimasukkan melalui SQL.
4. Data awal dimasukkan menggunakan **seeder pada `src/index.ts`**.
5. Seeder membuat data `Minuman` dan `Detail Minuman` sekaligus relasinya.

---

## 1. Struktur Project

Struktur file yang digunakan:

```text
my-strapi-project/
├── src/
│   ├── api/
│   │   ├── minuman/
│   │   │   └── content-types/
│   │   │       └── minuman/
│   │   │           └── schema.json
│   │   │
│   │   └── detail-minuman/
│   │       └── content-types/
│   │           └── detail-minuman/
│   │               └── schema.json
│   │
│   └── index.ts
│
├── config/
├── database/
├── public/
├── package.json
└── tsconfig.json
```

---

# 2. Skenario Database

Pada skenario ini, database PostgreSQL tidak diisi dengan SQL `INSERT`.

Alurnya:

```text
schema.json
     │
     ▼
Strapi Content-Type
     │
     ▼
Strapi membuat / mengelola struktur database
     │
     ▼
bootstrap() pada src/index.ts
     │
     ▼
Seeder
     │
     ├── Minuman
     │
     └── Detail Minuman
             │
             └── Relasi ke Minuman
```

Dengan pendekatan ini, **schema menjadi sumber struktur data**, sedangkan **seeder menjadi sumber data awal**.

---

# 3. Content-Type Minuman

File:

```text
src/api/minuman/content-types/minuman/schema.json
```

Schema:

```json
{
  "kind": "collectionType",
  "collectionName": "minumans",
  "info": {
    "singularName": "minuman",
    "pluralName": "minumans",
    "displayName": "Minuman"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "nama": {
      "type": "string",
      "required": true
    },
    "deskripsi": {
      "type": "text"
    },
    "detail_minumans": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::detail-minuman.detail-minuman",
      "mappedBy": "minuman"
    }
  }
}
```

## Field Minuman

| Field             | Type     | Keterangan                                   |
| ----------------- | -------- | -------------------------------------------- |
| `nama`            | String   | Nama minuman                                 |
| `deskripsi`       | Text     | Deskripsi minuman                            |
| `detail_minumans` | Relation | Relasi satu Minuman ke banyak Detail Minuman |

Relasinya:

```text
Minuman
   │
   ├── Detail Minuman
   ├── Detail Minuman
   └── Detail Minuman
```

---

# 4. Content-Type Detail Minuman

File:

```text
src/api/detail-minuman/content-types/detail-minuman/schema.json
```

Schema:

```json
{
  "kind": "collectionType",
  "collectionName": "detail_minumans",
  "info": {
    "singularName": "detail-minuman",
    "pluralName": "detail-minumans",
    "displayName": "Detail Minuman"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "ukuran": {
      "type": "string",
      "required": true
    },
    "harga": {
      "type": "decimal",
      "required": true
    },
    "stok": {
      "type": "integer",
      "default": 0
    },
    "minuman": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::minuman.minuman",
      "inversedBy": "detail_minumans"
    }
  }
}
```

## Field Detail Minuman

| Field     | Type     | Keterangan        |
| --------- | -------- | ----------------- |
| `ukuran`  | String   | Ukuran minuman    |
| `harga`   | Decimal  | Harga minuman     |
| `stok`    | Integer  | Jumlah stok       |
| `minuman` | Relation | Relasi ke Minuman |

Relasi yang digunakan:

```text
Minuman
   │
   │ 1
   │
   ├───────────────┐
   │               │
   ▼               ▼
Detail Minuman   Detail Minuman
   │
   │
   └── many
```

Secara database, relasi dikelola oleh Strapi. Jangan membuat kolom foreign key atau tabel relasi secara manual jika Strapi yang mengelola schema.

---

# 5. Seeder

Seeder berada di:

```text
src/index.ts
```

Seeder dijalankan melalui fungsi:

```ts
async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // ...
}
```

`bootstrap()` dijalankan ketika aplikasi Strapi melakukan startup.

---

# 6. Data yang Dibuat Seeder

Seeder membuat 5 data `Minuman`:

| No | Nama          | Deskripsi                                |
| -: | ------------- | ---------------------------------------- |
|  1 | Es Teh        | Teh manis dingin dengan es batu.         |
|  2 | Kopi Susu     | Perpaduan kopi dengan susu yang creamy.  |
|  3 | Jus Alpukat   | Jus alpukat segar dengan tekstur creamy. |
|  4 | Es Jeruk      | Minuman jeruk segar dengan es.           |
|  5 | Coklat Dingin | Minuman coklat dingin dengan rasa manis. |

Setiap minuman mempunyai 3 detail ukuran.

Total:

```text
5 Minuman
+
15 Detail Minuman
=
20 data
```

---

# 7. Contoh Data Detail

### Es Teh

| Ukuran | Harga | Stok |
| ------ | ----: | ---: |
| Small  | 5.000 |   50 |
| Medium | 7.000 |   40 |
| Large  | 9.000 |   30 |

### Kopi Susu

| Ukuran |  Harga | Stok |
| ------ | -----: | ---: |
| Small  | 10.000 |   30 |
| Medium | 13.000 |   25 |
| Large  | 16.000 |   20 |

### Jus Alpukat

| Ukuran |  Harga | Stok |
| ------ | -----: | ---: |
| Small  | 12.000 |   20 |
| Medium | 15.000 |   15 |
| Large  | 18.000 |   10 |

### Es Jeruk

| Ukuran |  Harga | Stok |
| ------ | -----: | ---: |
| Small  |  7.000 |   35 |
| Medium |  9.000 |   30 |
| Large  | 11.000 |   25 |

### Coklat Dingin

| Ukuran |  Harga | Stok |
| ------ | -----: | ---: |
| Small  | 10.000 |   25 |
| Medium | 13.000 |   20 |
| Large  | 18.000 |   10 |

---

# 8. Cara Menjalankan Seeder

Pastikan file:

```text
src/index.ts
```

sudah berisi kode seeder.

Kemudian jalankan Strapi.

Jika menggunakan Docker:

```bash
docker start strapi-baru-aja
```

Untuk melihat proses seeder:

```bash
docker logs -f strapi-baru-aja
```

Output yang diharapkan:

```text
====================================
SEEDER MINUMAN DIMULAI
====================================

Minuman dibuat: Es Teh
Minuman dibuat: Kopi Susu
Minuman dibuat: Jus Alpukat
Minuman dibuat: Es Jeruk
Minuman dibuat: Coklat Dingin

Detail dibuat: Small - Rp5000
Detail dibuat: Medium - Rp7000
Detail dibuat: Large - Rp9000
...

====================================
SEEDER SELESAI
5 Minuman + 15 Detail Minuman dibuat
====================================
```

---

# 9. Seeder Tidak Membuat Duplikasi

Sebelum membuat data, seeder melakukan pengecekan:

```ts
const existingMinuman = await strapi
  .documents('api::minuman.minuman')
  .findMany({
    limit: 1,
  });
```

Kemudian:

```ts
if (existingMinuman.length > 0) {
  console.log('Data minuman sudah ada.');
  console.log('Seeder dilewati.');

  return;
}
```

Tujuannya agar ketika Strapi direstart, data tidak dibuat ulang.

Contohnya:

```text
Startup pertama
    ↓
Minuman belum ada
    ↓
Seeder dijalankan
    ↓
5 Minuman + 15 Detail dibuat


Startup kedua
    ↓
Minuman sudah ada
    ↓
Seeder dilewati
```

---

# 10. Tidak Menggunakan SQL INSERT

Pada skenario ini **tidak perlu** menjalankan:

```sql
INSERT INTO minumans ...
```

atau:

```sql
INSERT INTO detail_minumans ...
```

Data dibuat melalui API internal Strapi:

```ts
strapi.documents('api::minuman.minuman').create()
```

dan:

```ts
strapi.documents('api::detail-minuman.detail-minuman').create()
```

Dengan begitu Strapi menangani struktur data sesuai Content-Type yang telah dibuat.

---

# 11. Relasi pada Seeder

Saat Minuman dibuat, Strapi menghasilkan `documentId`.

Contohnya:

```text
Es Teh
documentId = abc123...
```

Kemudian document ID tersebut digunakan ketika membuat Detail Minuman:

```ts
{
  minuman: createdMinuman[0].documentId,
  ukuran: 'Small',
  harga: 5000,
  stok: 50
}
```

Kemudian saat membuat detail:

```ts
.create({
  data: {
    ...detail,
    minuman,
  },
  status: 'published',
});
```

Sehingga hubungan akhirnya:

```text
Es Teh
│
├── Small
│   ├── Harga: 5000
│   └── Stok: 50
│
├── Medium
│   ├── Harga: 7000
│   └── Stok: 40
│
└── Large
    ├── Harga: 9000
    └── Stok: 30
```

---

# 12. Verifikasi di Admin Panel

Setelah seeder berhasil, buka Strapi Admin Panel.

Masuk ke:

```text
Content Manager
```

Kemudian akan tersedia:

```text
Minuman
Detail Minuman
```

Pada `Minuman`, seharusnya terdapat:

```text
Es Teh
Kopi Susu
Jus Alpukat
Es Jeruk
Coklat Dingin
```

Sedangkan `Detail Minuman` berisi 15 entry.

---

# 13. Verifikasi melalui PostgreSQL

Masuk ke PostgreSQL:

```bash
docker exec -it strapiDB psql -U habibi -d strapi
```

Kemudian cek:

```sql
SELECT COUNT(*) FROM minumans;
```

Hasil yang diharapkan:

```text
5
```

Dan:

```sql
SELECT COUNT(*) FROM detail_minumans;
```

Hasil:

```text
15
```

Untuk keluar:

```sql
\q
```

---

# 14. Kesimpulan Skenario

Pendekatan yang digunakan:

```text
┌─────────────────────────────┐
│        schema.json          │
│                             │
│  Minuman                    │
│  Detail Minuman             │
│  Relasi                     │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│           Strapi            │
│                             │
│  Mengelola struktur DB      │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       src/index.ts          │
│         bootstrap()         │
│                             │
│       Seeder Data           │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│        PostgreSQL           │
│                             │
│  5 Minuman                  │
│  15 Detail Minuman          │
│  Relasi Minuman ↔ Detail    │
└─────────────────────────────┘
```

Dengan demikian, pembagian tanggung jawabnya adalah:

| Komponen       | Tanggung jawab                       |
| -------------- | ------------------------------------ |
| `schema.json`  | Mendefinisikan struktur Content-Type |
| Strapi         | Mengelola struktur database          |
| `src/index.ts` | Menjalankan seeder                   |
| Seeder         | Memasukkan data awal                 |
| PostgreSQL     | Menyimpan data                       |
| Admin Panel    | Mengelola data setelah seeder        |

**Intinya:** pada skenario in
