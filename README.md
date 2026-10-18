# ZENITH · IREC 2027 Geri Sayım

Atılım Üniversitesi ZENITH Roket Takımı için IREC 2027 ve TEKNOFEST 2027 (Orta İrtifa) geri sayımlarını gösteren tek sayfalık site.

- IREC 2027 geri sayımı; sayfa aşağı kaydırılınca TEKNOFEST 2027 Orta İrtifa geri sayımı
- Roket animasyonu: parça parça montaj → sistem testi → T-3 sayımı → kalkış (döngü halinde)
- IREC 2026 sezonundan 20 fotoğraflık dönen albüm (tıklayınca büyür)

Saf HTML/CSS/JS. Kurulum, paket ya da derleme adımı yok.

## Yerelde açmak

`index.html` dosyasını tarayıcıda açmanız yeterli. Ya da:

```bash
npx serve .
```

## Tarihi güncellemek

Sayaç 13 Haziran 2027, 12:00 (Türkiye saati) için ayarlı.
Tarih değişirse
`script.js` dosyasının başındaki iki satırı değiştirin:

```js
const IREC_TARIHI = new Date("2027-06-13T12:00:00+03:00");
const TARIH_NOTU = "12:00 (Türkiye saati)";
```

TEKNOFEST 2027 roket finalinin tarihi henüz açıklanmadı; sayaç **tahmini** 6 Eylül 2027'ye ayarlı
(2026 finali 7–13 Eylül'de Aksaray'daydı). Resmî takvim [teknofest.org](https://www.teknofest.org)'da
yayınlanınca aynı dosyadaki `TEKNOFEST_TARIHI` ve `TEKNOFEST_NOTU` satırlarını değiştirin.

Güncellemeden sonra `index.html` içindeki `script.js?v=3` numarasını bir artırın; aksi halde
GitHub Pages önbelleği yüzünden ziyaretçiler eski tarihi ~10 dakika görebilir.

## Albüme fotoğraf eklemek

1. Fotoğrafı `img/album/21.jpg` gibi sıradaki numarayla ekleyin (genişlik ~1200 px yeterli).
2. `script.js` içindeki `ALBUM` listesine açıklamasını aynı sırayla ekleyin.

## GitHub Pages ile yayın

Repo → **Settings → Pages → Build and deployment** → Source: *Deploy from a branch*,
Branch: `main` / `(root)` → **Save**. Birkaç dakika içinde
`https://<kullanıcı-adı>.github.io/<repo-adı>/` adresinde yayında olur.
