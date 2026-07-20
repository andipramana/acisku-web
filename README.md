# Acisku — Landing Page

Landing page statis (HTML/CSS/JS biasa, tanpa build step) untuk Acisku, di-host lewat GitHub Pages.

## Menjalankan lokal

Tidak perlu instalasi apa pun — cukup jalankan server statis apa saja dari folder ini, misalnya:

```
python -m http.server 8080
```

lalu buka `http://localhost:8080`.

## Struktur

```
index.html       # semua konten & struktur halaman
css/styles.css    # semua styling, token warna/tipografi di :root
js/main.js        # parallax, scroll reveal, navbar glass, tilt 3D, menu mobile
assets/           # gambar (layer parallax, logo, og-cover)
```

## Mengaktifkan GitHub Pages

Repo ini sudah berisi `index.html` di root, jadi tinggal:

1. Buka **Settings → Pages** di repo GitHub.
2. Source: **Deploy from a branch**, branch **main**, folder **/ (root)**.
3. Simpan — halaman akan tersedia di `https://andipramana.github.io/acisku-web/` dalam beberapa menit.

## Update tombol "Download APK"

Tombol download di halaman ini mengarah ke:

```
https://github.com/andipramana/acisku-web/releases/latest/download/acisku.apk
```

Ini adalah URL tetap yang selalu menunjuk ke file bernama `acisku.apk` di **release terbaru** repo ini — jadi kalau kamu upload APK baru dengan nama file yang sama ke sebuah GitHub Release, tombolnya otomatis mengarah ke situ tanpa perlu ubah kode.

Cara upload:

1. Build APK dari project Flutter `acisku` (`flutter build apk --release`), hasilnya ada di `build/app/outputs/flutter-apk/app-release.apk`.
2. Di repo `acisku-web` di GitHub, buka **Releases → Draft a new release**.
3. Beri tag versi (mis. `v0.1.0`), upload file APK-nya, **ganti nama file yang diupload menjadi `acisku.apk`** (nama file harus persis ini supaya link di atas bekerja).
4. Publish release.

## Catatan konten

Beberapa bagian dari brief awal sengaja tidak dipakai supaya halaman ini tidak menampilkan klaim yang tidak benar:

- **Tidak ada badge Google Play / App Store** — Acisku belum rilis di sana, tombol download mengarah langsung ke file APK.
- **Tidak ada angka statistik (jumlah download, rating, dsb.)** — belum ada data nyata untuk itu.
- **Tidak ada testimoni palsu** — diganti dengan catatan singkat dari pembuat aplikasi.

Kalau nanti ada data nyata (rilis di Play Store, jumlah pengguna, testimoni asli), bagian-bagian itu bisa ditambahkan.
