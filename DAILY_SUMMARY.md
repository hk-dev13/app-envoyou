# Daily Summary (2025-09-14)

## Ringkasan Pekerjaan Hari Ini
### 1. Gating & Monetization Foundation
- `LockedModule` mengirim `feature-upgrade-click` & `open-upgrade-modal` dengan payload (feature, required, current, ts).
- `track(event,data)` util + listener di `UpgradeProvider.jsx` untuk log klik upgrade (dev: console fallback).
- `usePlan.js` fetch `/api/plan` (fallback derive) expose: `plan`, `loadingPlan`, `planError`, `remote`.
- `PlanStatus.jsx` menampilkan status & fallback label `(derived)` bila remote belum ada.
- Properti `featureKey` diterapkan di pemakaian `<LockedModule>` agar event punya konteks asal.

### 2. Navigation & Layout
- Global `AppLayout` dengan grouping menu Dashboards & Developer + Profile dropdown.
- Pindahkan Settings ke Profile, hapus header duplikat di halaman Dashboard.
- Perbaiki flicker dropdown (delay close 160ms saat hover keluar).

### 3. API Docs Visual Contrast
- Redoc theme diperluas: warna teks `#e2e8f0`, secondary `#94a3b8`, primary brand hijau, panel kanan gelap.
- Tambah override CSS (tables, code, link hover) agar konten terbaca di background gelap.

### 4. CI Workflow Maintenance
- Perbaikan workflow `Daily Summary Check`: hapus `working-directory: app-envoyou` yang menyebabkan path ganda & kegagalan `npm ci`.

## Struktur Event (Aktif)
- `feature-upgrade-click` (klik tombol upgrade). Listener: track + open modal fallback.
- `open-upgrade-modal` (permintaan buka modal langsung). Listener: membuka modal & set origin feature.

## File Perubahan Utama
- `src/components/LockedModule.jsx`
- `src/components/UpgradeProvider.jsx`
- `src/components/UpgradeProviderContext.js`
- `src/analytics/track.js`
- `src/hooks/usePlan.js`
- `src/components/PlanStatus.jsx`
- `src/components/layout/AppLayout.jsx`
- `docs-site/src/pages/api-spec/index.jsx` & `docusaurus-theme/css/custom.css`
- `.github/workflows/daily-summary.yml`

## Kondisi Saat Ini
Fondasi gating & event analitik klik sudah stabil. Belum ada billing/redirect nyata & belum ada tracking impression modal. Error plan tampil inline tanpa toast. Kontras API Spec sudah membaik. Workflow daily summary kembali hijau (diharapkan) setelah path diperbaiki.

## Backlog / Prioritas Berikutnya
1. Backend endpoint `/api/plan` final (auth + response `{ plan: "BUILD" }`).
2. Billing / redirect nyata di `selectPlan` (misal navigate `/billing?origin=feature&target=PLAN`).
3. Tracking impression modal: `track('open_upgrade_modal', { feature })` saat modal pertama kali muncul.
4. Badge visual (chip warna) khusus untuk plan fallback `(derived)` agar lebih jelas dari teks kecil.
5. Toast + retry action untuk `planError` (misal `fetch` ulang).
6. Chart heavy components lazy + suspense boundary (optimisasi initial TTI).
7. Event tracking sukses upgrade (menunggu integrasi billing/platform pilihan).
8. Dokumentasi `MONETIZATION_FLOW.md` jelaskan arsitektur gating + event.
9. Optional: Local storage cache plan TTL 60s untuk turunkan latency / flicker.
10. (Optional) Integrasi Sentry (guard hanya production) jika observability dibutuhkan.

## Risiko / Catatan
- Lambatnya `/api/plan` masih menyebabkan status derived—bisa tambahkan skeleton berbeda.
- Tanpa server gating tambahan, user bisa mem-bypass UI (perlu enforcement backend untuk aksi kritikal).
- Analytics hanya dev-console saat ga ada gtag/dataLayer.

## Rutinitas Harian (Wajib)
1. Setelah coding selesai: update bagian "Ringkasan Pekerjaan Hari Ini" & reorganize backlog (pindahkan yang selesai).
2. Commit file ini bersama perubahan kode lain agar workflow daily summary dapat memverifikasi.
3. Jika tidak ada perubahan signifikan, tetap update tanggal & konfirmasi status (hindari stagnan >1 hari kerja).

### Template Quick Replace (Referensi)
```markdown
# Daily Summary (YYYY-MM-DD)

## Ringkasan Pekerjaan Hari Ini
- ...

## Backlog / Prioritas Berikutnya
1. ...
```

---
_Dokumen ini adalah log berjalan (rolling). Gunakan commit harian agar historinya tercatat di Git._
