# Spesifikasi Animasi Pembentukan Red Dwarf (Frozen Implementation Reference)

**Status:** implementasi existing yang dirujuk oleh dokumen ini telah disetujui owner as-is dan harus dipertahankan persis; dokumen ini adalah kontrak preservasi, bukan izin untuk membuat ulang atau mengubah sequence
**Durasi tetap:** approximately 14 detik; tidak ada preset durasi lain
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

## 4. Timing Tetap: 14 Detik

| Fase | Waktu | Durasi | Fungsi |
|---|---:|---:|---|
| 0. Prepared field | 0.0–1.4 s | 1.4 s | Material tersebar muncul dengan central negative space tetap terbaca. |
| 1. Directed inward gathering | 1.4–4.8 s | 3.4 s | Material bergerak bertahap menuju shared gravitational center melalui streamlines dan infalling embers. |
| 2. Gravitational condensation | 4.8–6.8 s | 2.0 s | Material mengembun menuju persistent protostar core. |
| 3. Thermonuclear ignition | 6.8–7.6 s | 0.8 s | Energi ignition meningkat secara terkontrol tanpa generic explosion. |
| 4. Continuous expansion and controlled peak | 7.6–10.2 s | 2.6 s | Core mengembang menuju Red Dwarf dan mencapai controlled overshoot. |
| 5. Damped settlement | 10.2–13.0 s | 2.8 s | Overshoot mereda menuju exact canonical scale dan state. |
| 6. Canonical handoff and settle | 13.0–14.0 s | 1.0 s | Formation layer berhenti dan ownership terlihat stabil pada canonical renderer. |

Implementasi existing menggunakan satu sequence approximately 14 detik. Timing ini telah disetujui dan tidak boleh dipendekkan ke brief lama 8–10 detik, diperpanjang dengan preset baru, atau diubah secara proporsional.

Jangan mempercepat, memperlambat, atau membuat preset alternatif. Implementasi 14 detik yang ada adalah satu-satunya timing authority untuk Hero animation ini.

---

## 5. Behavior Tiap Fase

### Fase 0 — Prepared field: 0.0–1.4 detik

- Tampilkan material sebagai node/fragment kecil dengan variasi ukuran dan brightness yang terbatas.
- Distribusi harus terasa tersebar, tetapi tetap memiliki hubungan dengan area tujuan Red Dwarf.
- Pertahankan central negative space secukupnya agar arah gathering dapat dibaca.
- Kemunculan staggered dan gradual; tidak boleh berupa flash atau strobe.
- Jangan membuat particle wallpaper padat yang bersaing dengan copy.

### Fase 1 — Directed gathering: 1.4–4.8 detik

- Setiap particle memiliki target position yang diturunkan dari silhouette/surface approved Red Dwarf.
- Gerak utama selalu inward menuju shared gravitational center.
- Gunakan variasi start time, speed, depth, dan curvature agar tidak terlihat seperti satu blok yang bergerak serempak.
- Gunakan lintasan lengkung ringan dan terkontrol; lintasan tidak boleh membentuk ring, spiral, vortex, atau orbit yang berdiri sendiri.
- Sebagian material boleh tertinggal sementara, tetapi arah akhirnya harus tetap jelas.
- Kecepatan berkurang saat particle mendekati target; hindari tabrakan visual dan crossing yang tidak bermakna.

### Fase 2 — Gravitational condensation: 4.8–6.8 detik

- Material yang sudah berkumpul mulai membentuk body yang koheren.
- Kepadatan, opacity, dan overlap meningkat secara bertahap dari particle yang sama.
- Intermediate body harus terasa sebagai Red Dwarf yang sedang terbentuk, bukan sphere/planet pengganti.
- Detail permukaan boleh diperkenalkan secara progresif jika detail tersebut berasal dari canonical renderer.
- Jangan menggambar radial-gradient sphere sederhana sebagai pengganti renderer.
- Jangan melakukan cut dari particle field ke objek baru.

### Fase 3 — Thermonuclear ignition: 6.8–7.6 detik

- Terangkan bahwa body yang terbentuk mewarisi karakter approved Red Dwarf: deep red, burnt orange, amber, granulation, active regions, dan restrained corona.
- Ignition berupa kenaikan energi yang terkontrol, bukan ledakan, flash putih, shockwave, atau bloom yang mencuci seluruh subject.
- Hot regions dan surface detail muncul secara lokal dan bertahap.
- Ukuran dan silhouette mulai mendekati target canonical tanpa overshoot besar.

### Fase 4 — Continuous expansion and controlled peak: 7.6–10.2 detik

- Gunakan convergence yang monotonic atau memiliki overshoot sangat kecil dan segera teredam.
- Target akhir adalah posisi dan ukuran canonical, bukan posisi tengah halaman atau sphere yang dibuat ulang.
- Tidak boleh ada bounce berulang, elastic spring, sudden scale jump, atau perubahan warna drastis.
- Formation layer harus semakin sedikit terlihat karena material benar-benar menjadi bagian dari structure, bukan karena seluruh layar di-fade-out.

### Fase 5 — Damped settlement and canonical handoff: 10.2–14.0 detik

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

Kriteria berikut adalah preservation checks untuk behavior yang telah disetujui. Status `technically validated` tetap harus dibedakan dari approval owner; approval saat ini berlaku untuk implementation existing, bukan untuk production integration:

1. Durasi existing tetap approximately 14 detik; tidak ada konfigurasi atau preset timing alternatif.
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
16. Tidak ada production integration berdasarkan approval prototype ini saja; integrasi adalah keputusan owner terpisah.

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
- Mengklaim production integration atau technical validation tambahan hanya karena prototype berhasil dirender.
- Mengintegrasikan ke production tanpa keputusan owner yang terpisah untuk integration.

---

## 14. Governance dan keputusan berikutnya

1. Perlakukan `index.html` pada folder prototype ini sebagai implementasi frozen yang telah disetujui owner as-is.
2. Jangan mengubah timing, particle, streamlines, formation sequence, replay, interaction, reduced-motion, shader, atau settled renderer untuk memenuhi brief atau rencana lama.
3. Pemeriksaan di masa depan hanya boleh memverifikasi preservasi behavior existing dan tidak boleh mengubah file prototype.
4. Production integration ke `../../index.html` adalah keputusan owner terpisah dan belum diambil oleh approval prototype ini.
5. Chapter 02 tidak dimulai atau diotorisasi oleh approval ini.

Dokumen ini menjadi authority preservasi untuk implementasi existing. Approval prototype sudah eksplisit; approval tersebut tidak boleh ditafsirkan sebagai approval untuk production integration.
