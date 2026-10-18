# ZENITH · IREC 2027 Geri Sayım

Atılım Üniversitesi ZENITH Roket Takımı için IREC 2027'ye kalan süreyi gösteren tek sayfalık site.

- Gün / saat / dakika / saniye geri sayımı
- Roket animasyonu: parça parça montaj → sistem testi → T-3 sayımı → kalkış (döngü halinde)
- IREC 2026 sezonundan 20 fotoğraflık dönen albüm (tıklayınca büyür)

Saf HTML/CSS/JS. Kurulum, paket ya da derleme adımı yok.

## Yerelde açmak

`index.html` dosyasını tarayıcıda açmanız yeterli. Ya da:

```bash
npx serve .
```

## Tarihi güncellemek

IREC 2027 tarihi henüz açıklanmadı; sayaç **tahmini** bir tarihe ayarlı.
ESRA ([soundingrocket.org](https://www.soundingrocket.org)) resmî takvimi yayınlayınca
`script.js` dosyasının başındaki iki satırı değiştirin:

```js
const IREC_TARIHI = new Date("2027-06-14T08:00:00-05:00");
const TARIH_NOTU = "Tahmini tarih — resmî takvim açıklanınca güncellenecek";
```

## Albüme fotoğraf eklemek

1. Fotoğrafı `img/album/21.jpg` gibi sıradaki numarayla ekleyin (genişlik ~1200 px yeterli).
2. `script.js` içindeki `ALBUM` listesine açıklamasını aynı sırayla ekleyin.

## GitHub Pages ile yayın

Repo → **Settings → Pages → Build and deployment** → Source: *Deploy from a branch*,
Branch: `main` / `(root)` → **Save**. Birkaç dakika içinde
`https://<kullanıcı-adı>.github.io/<repo-adı>/` adresinde yayında olur.
