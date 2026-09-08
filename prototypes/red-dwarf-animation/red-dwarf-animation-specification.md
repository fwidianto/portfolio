# Spesifikasi Animasi Pembentukan Red Dwarf

**Status:** spesifikasi dasar untuk prototype; belum merupakan implementasi dan belum mendapat owner approval  
**Durasi yang diizinkan:** 12–16 detik  
**Durasi default yang direkomendasikan:** 14 detik  
**Sumber visual tunggal:** `../../index.html` — approved/canonical Red Dwarf pada repository Portfolio

---

## 1. Tujuan

Menampilkan satu transformasi berkesinambungan dari materi yang tersebar menjadi **approved Red Dwarf** yang sudah ada di Portfolio.

Urutan naratifnya:

```text
scattered matter -> directed gathering -> coherent stellar structure -> ignition -> approved Red Dwarf
```

Animasi ini hanya menjelaskan proses pembentukan objek yang sudah disetujui. Animasi tidak boleh mendesain ulang Red Dwarf, membuat interpretasi visual baru, atau mengganti renderer canonical dengan objek pengganti.

---

## 2. Aturan Sumber Visual

1. Renderer Red Dwarf dari `../../index.html` adalah satu-satunya sumber kebenaran visual untuk endpoint akhir.
2. Warna, silhouette, ukuran, posisi, surface detail, starspots, plages, corona, glow, alpha composition, copy, dan marker harus diturunkan dari approved renderer.
3. Particle/node hanya material sementara. Particle bukan gaya visual final dan tidak boleh meninggalkan residu setelah handoff.
4. Tidak boleh menggunakan referensi eksternal, termasuk Kurzgesagt, generic particle art, educational illustration, planet, lava ball, nebula, atau visual treatment lain.
5. Jika endpoint tidak dapat dibuat identik tanpa membuat renderer baru atau approximation, implementasi harus berhenti dan melaporkan blocker—bukan menyelesaikan dengan visual yang hanya mirip.

---

## 3. Kunci Komposisi

Komposisi approved harus tetap dipertahankan sepanjang sequence:

- background dan lingkungan astronomi tetap mengikuti Portfolio;
- posisi hero copy dan typography tidak berubah;
- posisi akhir Red Dwarf tidak berubah;
- marker/pointer tetap memiliki hubungan yang sama dengan star;
- tidak ada scene cut ke canvas yang terpusat atau layout alternatif;
- formation layer hanya bekerja di area star field dan tidak mengambil alih identitas halaman;
- tidak ada teks, label, dashboard, atau UI tambahan selama pembentukan.

Pada awal sequence, halaman boleh menampilkan komposisi hero yang sama dengan formation layer dalam keadaan belum terkumpul. Jangan mereset seluruh halaman menjadi layar hitam kosong jika itu menghilangkan approved composition.

---

## 4. Timing Default: 14 Detik

| Fase | Waktu | Durasi | Fungsi |
|---|---:|---:|---|
| 0. Prepared field | 0.0–1.2 s | 1.2 s | Material tersebar mulai terlihat secara tenang di area tujuan star. |
| 1. Directed gathering | 1.2–4.2 s | 3.0 s | Kelompok material mulai bergerak ke pusat gravitasi bersama secara bertahap. |
| 2. Coherent structure | 4.2–7.2 s | 3.0 s | Kepadatan meningkat; body/protostar terbentuk dari material yang sama. |
| 3. Surface inheritance and ignition | 7.2–9.5 s | 2.3 s | Detail permukaan, hot regions, dan energi Red Dwarf mulai terbaca tanpa ledakan. |
| 4. Controlled convergence | 9.5–11.8 s | 2.3 s | Bentuk dan ukuran mendekati proporsi approved dengan damping yang halus. |
| 5. Canonical handoff and settle | 11.8–14.0 s | 2.2 s | Ownership berpindah tanpa lompatan ke canonical renderer; endpoint mencapai keadaan approved. |

### Rentang 12–16 detik

Durasi default 14 detik menjadi titik tengah review. Implementasi boleh menyediakan durasi 12–16 detik hanya dengan mengubah timing sequence secara proporsional atau memakai preset yang eksplisit.

- Jangan mempercepat fase gathering secara ekstrem untuk memenuhi 12 detik.
- Jangan menambah efek baru hanya untuk mengisi 16 detik.
- Waktu handoff dan settle harus tetap cukup panjang untuk mencegah kesan “tiba-tiba menjadi Red Dwarf”.
- Preset default harus menjadi satu-satunya preset yang digunakan selama validasi awal.

---

## 5. Behavior Tiap Fase

### Fase 0 — Prepared field: 0.0–1.2 detik

- Tampilkan material sebagai node/fragment kecil dengan variasi ukuran dan brightness yang terbatas.
- Distribusi harus terasa tersebar, tetapi tetap memiliki hubungan dengan area tujuan Red Dwarf.
- Pertahankan central negative space secukupnya agar arah gathering dapat dibaca.
- Kemunculan staggered dan gradual; tidak boleh berupa flash atau strobe.
- Jangan membuat particle wallpaper padat yang bersaing dengan copy.

### Fase 1 — Directed gathering: 1.2–4.2 detik

- Setiap particle memiliki target position yang diturunkan dari silhouette/surface approved Red Dwarf.
- Gerak utama selalu inward menuju shared gravitational center.
- Gunakan variasi start time, speed, depth, dan curvature agar tidak terlihat seperti satu blok yang bergerak serempak.
- Gunakan lintasan lengkung ringan dan terkontrol; lintasan tidak boleh membentuk ring, spiral, vortex, atau orbit yang berdiri sendiri.
- Sebagian material boleh tertinggal sementara, tetapi arah akhirnya harus tetap jelas.
- Kecepatan berkurang saat particle mendekati target; hindari tabrakan visual dan crossing yang tidak bermakna.

### Fase 2 — Coherent structure: 4.2–7.2 detik

- Material yang sudah berkumpul mulai membentuk body yang koheren.
- Kepadatan, opacity, dan overlap meningkat secara bertahap dari particle yang sama.
- Intermediate body harus terasa sebagai Red Dwarf yang sedang terbentuk, bukan sphere/planet pengganti.
- Detail permukaan boleh diperkenalkan secara progresif jika detail tersebut berasal dari canonical renderer.
- Jangan menggambar radial-gradient sphere sederhana sebagai pengganti renderer.
- Jangan melakukan cut dari particle field ke objek baru.

### Fase 3 — Surface inheritance and ignition: 7.2–9.5 detik

- Terangkan bahwa body yang terbentuk mewarisi karakter approved Red Dwarf: deep red, burnt orange, amber, granulation, active regions, dan restrained corona.
- Ignition berupa kenaikan energi yang terkontrol, bukan ledakan, flash putih, shockwave, atau bloom yang mencuci seluruh subject.
- Hot regions dan surface detail muncul secara lokal dan bertahap.
- Ukuran dan silhouette mulai mendekati target canonical tanpa overshoot besar.

### Fase 4 — Controlled convergence: 9.5–11.8 detik

- Gunakan convergence yang monotonic atau memiliki overshoot sangat kecil dan segera teredam.
- Target akhir adalah posisi dan ukuran canonical, bukan posisi tengah halaman atau sphere yang dibuat ulang.
- Tidak boleh ada bounce berulang, elastic spring, sudden scale jump, atau perubahan warna drastis.
- Formation layer harus semakin sedikit terlihat karena material benar-benar menjadi bagian dari structure, bukan karena seluruh layar di-fade-out.

### Fase 5 — Canonical handoff and settle: 11.8–14.0 detik

- Canonical renderer boleh disiapkan sejak awal sebagai layer terpisah, tetapi tidak boleh terlihat sebagai objek pengganti yang tiba-tiba muncul.
- Handoff harus berbasis continuity: area yang menjadi permukaan canonical terbuka seiring material target yang sama mengembun dan menghilangkan fragment temporary.
- Jangan memakai global crossfade antara “particle scene” dan “star scene”.
- Tidak boleh ada gap, outline ganda, halo buatan, blur sisa, atau perubahan posisi saat ownership berpindah.
- Pada akhir fase, canonical renderer menjadi satu-satunya pemilik pixel Red Dwarf.
- Formation layer dihapus atau dinonaktifkan setelah handoff; tidak boleh terus berjalan di belakang star.

---

## 6. Gerak dan Kurva

- Gunakan easing yang halus dan terkontrol, terutama ease-in-out dan ease-out untuk gathering serta settle.
- Hindari bounce/elastic sebagai default.
- Gunakan damping agar velocity menurun mendekati target.
- Tangential drift harus kecil dan selalu tunduk pada arah inward; jangan sampai membentuk vortex.
- Variasi antar particle harus staggered, bukan random setiap playback.
- Semua nilai random harus menggunakan seed tetap agar sequence dapat direproduksi.
- Particle identifier dan target mapping harus tetap sama pada setiap playback.
- Jangan menambahkan particle baru di tengah sequence untuk menutupi transisi yang belum halus.

---

## 7. Continuity Rules

Sequence dianggap gagal jika salah satu kondisi berikut terjadi:

- particle menghilang lalu star muncul sebagai objek berbeda;
- body intermediate berubah menjadi planet, lava ball, atau sphere generik;
- posisi akhir berbeda dari posisi approved;
- visual treatment particle tidak memiliki hubungan dengan target surface;
- ada scene cut, global fade, atau flash yang menyembunyikan proses;
- sebagian material bergerak tanpa tujuan yang dapat dibaca;
- formation layer masih terlihat setelah canonical renderer stabil;
- surface detail final berasal dari shader atau approximation yang berbeda dari canonical renderer.

Setiap particle harus memiliki hubungan yang dapat dijelaskan:

```text
source fragment -> target surface sample -> canonical pixel ownership
```

Hubungan ini lebih penting daripada jumlah particle atau kompleksitas efek.

---

## 8. Endpoint Canonical

Pada akhir sequence:

- renderer dan shader harus sama dengan `../../index.html`;
- silhouette harus identik;
- posisi dan responsive sizing harus identik;
- warna dan alpha composition harus identik;
- FBM/granulation, starspots, plages, corona, dan glow harus identik;
- tidak ada `transform`, `filter`, `blur`, scale, atau opacity residual dari formation layer;
- marker dan hubungan spatial-nya harus identik;
- tidak ada temporary canvas yang masih menggambar pixel Red Dwarf;
- formation animation tidak boleh auto-loop.

Untuk validasi deterministik, gunakan baseline canonical yang stabil, termasuk reduced-motion baseline `u_time = 2.5` dengan rotation `(0, 0)` bila diperlukan oleh renderer. Perbandingan visual harus dilakukan pada ukuran viewport dan kondisi renderer yang sama.

---

## 9. Idle dan Replay

- Setelah 14 detik, approved Red Dwarf tetap menjadi visual anchor.
- Jangan meredupkan star ke 20% atau mengubahnya menjadi placeholder; final approved state harus tetap terbaca.
- Idle motion, jika sudah menjadi bagian dari approved renderer, harus tetap berasal dari renderer tersebut dan tidak boleh mengulang formation sequence.
- Formation dimainkan sekali pada first experience.
- Replay hanya boleh ditambahkan sebagai kontrol yang jelas, keyboard-accessible, dan tidak mengganggu composition.
- Replay harus mengulang seed dan target mapping yang sama.

---

## 10. Reduced Motion dan Fallback

Dengan `prefers-reduced-motion: reduce`:

- lewati seluruh particle formation, trajectory, ignition, dan settle motion;
- tampilkan canonical Red Dwarf dalam static coherent baseline;
- jangan menjalankan formation di background;
- jangan mengandalkan fade sebagai pengganti seluruh sequence;
- fallback image tetap tersedia bila WebGL tidak dapat digunakan.

Dengan WebGL tidak tersedia:

- approved static fallback harus muncul langsung;
- tidak boleh menampilkan particle animation yang berakhir pada visual yang berbeda;
- tidak boleh menampilkan error state kepada user.

---

## 11. Responsive dan Performance

- Pertahankan arsitektur HTML/CSS/JavaScript yang sudah ada selama masih mencukupi.
- Jangan menambahkan framework, dependency, rendering engine, atau animation library tanpa bounded proof bahwa jalur existing tidak cukup.
- Uji minimal pada viewport desktop dan mobile sempit.
- Tidak boleh ada horizontal overflow.
- Target performa: 60 FPS pada perangkat mid-range; frame time tidak boleh menyebabkan sequence terasa tersendat.
- Jumlah particle harus dibatasi dan memiliki fallback budget yang jelas.
- Jika performa turun, kurangi particle detail dan efek temporary terlebih dahulu; jangan mengubah endpoint canonical.
- Hindari blur berlapis, shadow mahal, texture besar, dan efek full-screen yang tidak dibutuhkan.
- Jangan mengorbankan fidelity endpoint untuk mengejar efek formation yang lebih kompleks.

---

## 12. Acceptance Criteria

Implementasi berikutnya hanya dapat disebut **technically validated** jika seluruh kriteria ini terpenuhi:

1. Durasi default berada pada 14 detik dan konfigurasi 12–16 detik dapat dijelaskan.
2. Transformasi terbaca sebagai satu continuity dari material tersebar ke approved Red Dwarf.
3. Tidak ada scene cut, replacement object, global crossfade, ring, spiral, vortex, planet, lava ball, atau generic sphere.
4. Particle target mapping deterministik dan konsisten antar playback.
5. Gathering terasa halus, bertahap, dan tidak tiba-tiba runtuh menjadi star.
6. Intermediate structure berasal dari material yang sama, bukan objek baru yang disisipkan.
7. Ignition terkontrol dan tidak menghapus keterbacaan subject.
8. Handoff tidak menghasilkan gap, double edge, halo buatan, blur residual, atau position jump.
9. Frame settle menggunakan canonical renderer dari Portfolio.
10. Endpoint lulus perbandingan visual deterministik terhadap approved baseline.
11. Formation layer berhenti dan tidak meninggalkan pixel setelah canonical settle.
12. Reduced-motion langsung mempertahankan canonical final state tanpa formation motion.
13. WebGL fallback tersedia dan dapat digunakan.
14. Desktop dan mobile tidak mengalami horizontal overflow.
15. Tidak ada console error atau failed local asset request.
16. Tidak ada perubahan pada production integration sebelum owner approval.

Status acceptance harus dilaporkan terpisah:

```text
Implemented != Technically validated != Owner approved
```

---

## 13. Hal yang Dilarang

- Meniru gaya visual eksternal.
- Menggunakan Kurzgesagt atau generic particle art sebagai referensi.
- Membuat Red Dwarf sebagai planet, bola lava, matahari kuning, atau flat disc.
- Menggunakan ring, spiral, vortex, orbit, atau explosive shockwave.
- Menampilkan sphere generik lalu menggantinya dengan canonical star.
- Menggunakan global crossfade untuk menyembunyikan discontinuity.
- Mengubah Hero copy, navigation, marker, atau layout approved.
- Menambahkan teks/label dekoratif pada formation sequence.
- Menggunakan random seed yang berubah setiap playback.
- Membiarkan particle layer tetap aktif setelah handoff.
- Mengklaim owner approval hanya karena prototype berhasil dirender.
- Mengintegrasikan ke production sebelum review dan persetujuan owner.

---

## 14. Urutan Pekerjaan Berikutnya

1. Owner meninjau dan menyetujui spesifikasi ini.
2. Buat bounded visual proof di folder prototype ini saja.
3. Implementasikan satu default timing 14 detik terlebih dahulu.
4. Verifikasi desktop, mobile, reduced-motion, fallback, dan frame-separated continuity.
5. Bandingkan endpoint dengan canonical `../../index.html`.
6. Lakukan visual review terhadap kelancaran transisi.
7. Hanya setelah owner approval, pertimbangkan integrasi ke production.

Dokumen ini menjadi dasar kerja animasi berikutnya. Sampai ada persetujuan eksplisit, tidak ada implementasi animasi atau perubahan production yang diizinkan.
