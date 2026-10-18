// ===== Ayarlar =====
// IREC 2027 hedef tarihi (Türkiye saati, UTC+3)
const IREC_TARIHI = new Date("2027-06-13T12:00:00+03:00");
const TARIH_NOTU = "12:00 (Türkiye saati)";

// Albüm: img/album/01.jpg ... sırasıyla
const ALBUM = [
  "Tanışma toplantısı",
  "Dönem içi toplantısı",
  "Alt takım toplantısı",
  "Başvuru onayımız",
  "İmalat takımı",
  "İmalat takımı",
  "İmalat süreci",
  "Roketimiz Amerika'da",
  "Ön değerlendirmeler",
  "Ön değerlendirmeler",
  "Ön değerlendirmeler",
  "Son hazırlıklar",
  "Sahada roket kurulumu",
  "ZENITH kalkışa hazır",
  "Ve ZENITH havada",
  "Ve ZENITH havada",
  "Ve ZENITH havada",
  "Uçuş sonrası roketin bulunması",
  "Uçuş sonrası roketin bulunması",
  "Roketimiz sergileniyor",
];

const $ = (id) => document.getElementById(id);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// ===== Geri sayım =====
const pad2 = (n) => String(n).padStart(2, "0");
const units = { d: $("d"), h: $("h"), m: $("m"), s: $("s") };

$("target").innerHTML =
  `<em>${IREC_TARIHI.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</em> · ${TARIH_NOTU}`;

function tickClock() {
  const diff = IREC_TARIHI - Date.now();
  if (diff <= 0) {
    document.querySelector("h1").innerHTML = "IREC <span>2027</span> başladı!";
    Object.values(units).forEach((el) => (el.textContent = "00"));
    return;
  }
  const sec = Math.floor(diff / 1000);
  const vals = {
    d: String(Math.floor(sec / 86400)),
    h: pad2(Math.floor(sec / 3600) % 24),
    m: pad2(Math.floor(sec / 60) % 60),
    s: pad2(sec % 60),
  };
  for (const k in vals) {
    if (units[k].textContent !== vals[k]) {
      units[k].textContent = vals[k];
      const box = units[k].parentElement;
      box.classList.remove("tick");
      void box.offsetWidth;
      box.classList.add("tick");
    }
  }
}
tickClock();
setInterval(tickClock, 1000);

// ===== Yıldızlı arka plan =====
const cv = $("stars");
const ctx = cv.getContext("2d");
let stars = [];
let shooter = null;

function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  cv.width = innerWidth * dpr;
  cv.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.round((innerWidth * innerHeight) / 5000);
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.3 + 0.2,
    p: Math.random() * Math.PI * 2,
    v: Math.random() * 0.02 + 0.005,
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const s of stars) {
    s.p += s.v;
    ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(s.p));
    ctx.fillStyle = "#dfe6ff";
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  // Ara sıra kayan yıldız
  if (!shooter && Math.random() < 0.004) {
    shooter = { x: Math.random() * innerWidth, y: Math.random() * innerHeight * 0.4, life: 1 };
  }
  if (shooter) {
    const { x, y, life } = shooter;
    const g = ctx.createLinearGradient(x, y, x - 120, y - 50);
    g.addColorStop(0, "rgba(255,255,255,.9)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.globalAlpha = life;
    ctx.strokeStyle = g;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 120, y - 50);
    ctx.stroke();
    shooter.x += 9;
    shooter.y += 3.75;
    shooter.life -= 0.02;
    if (shooter.life <= 0) shooter = null;
  }
  ctx.globalAlpha = 1;
  if (!reduceMotion) requestAnimationFrame(drawStars);
}

addEventListener("resize", resize);
resize();
drawStars();

// ===== Roket: montaj → test → sayım → kalkış =====
const svg = $("pad");
const rocket = $("rocket");
const flame = $("flame");
const spark = $("spark");
const hook = $("hook");
const smoke = $("smoke");
const parts = [...document.querySelectorAll(".part")].sort((a, b) => a.dataset.step - b.dataset.step);
const JOINT_Y = [540, 530, 500, 390, 380, 270]; // her parçanın oturduğu ek yeri

function setStatus(phase, text, progress, go = false) {
  $("phase").textContent = phase;
  $("phase").classList.toggle("go", go);
  $("status-text").textContent = text;
  if (progress !== undefined) $("bar").style.width = progress + "%";
}

function puff(n, spread) {
  for (let i = 0; i < n; i++) {
    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("cx", 150 + (Math.random() - 0.5) * 20);
    c.setAttribute("cy", 556);
    c.setAttribute("r", 5 + Math.random() * 7);
    c.style.setProperty("--dx", (Math.random() - 0.5) * spread + "px");
    c.style.setProperty("--dy", -(10 + Math.random() * 40) + "px");
    c.style.setProperty("--t", 1.8 + Math.random() * 1.4 + "s");
    c.addEventListener("animationend", () => c.remove());
    smoke.appendChild(c);
  }
}

function resetRocket() {
  // Parçaları geçişsiz biçimde başa al
  svg.querySelectorAll(".part").forEach((p) => (p.style.transition = "none"));
  parts.forEach((p) => p.classList.remove("on"));
  rocket.classList.remove("launch", "shake");
  flame.classList.remove("on");
  void svg.getBoundingClientRect();
  svg.querySelectorAll(".part").forEach((p) => (p.style.transition = ""));
  hook.setAttribute("y2", 200);
}

async function cycle() {
  resetRocket();
  setStatus("MONTAJ", "Hangar hazırlanıyor…", 0);
  await wait(900);

  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    setStatus("MONTAJ", p.dataset.label, ((i + 1) / parts.length) * 100);
    hook.setAttribute("y2", Math.max(200, JOINT_Y[i] - 40));
    p.classList.add("on");
    await wait(650);
    spark.setAttribute("transform", `translate(${i === 2 ? 132 : 150} ${JOINT_Y[i]})`);
    spark.classList.add("on");
    await wait(180);
    spark.classList.remove("on");
    await wait(350);
  }
  hook.setAttribute("y2", 160);

  setStatus("TEST", "Aviyonik ve kurtarma sistemi kontrolü", 100);
  await wait(1400);
  setStatus("TEST", "Tüm sistemler nominal ✓", 100, true);
  await wait(1000);

  for (const t of [3, 2, 1]) {
    setStatus("SAYIM", `T-${t}`, 100, true);
    if (t === 1) {
      flame.classList.add("on");
      rocket.classList.add("shake");
      puff(10, 120);
    }
    await wait(800);
  }

  setStatus("KALKIŞ", "ZENITH havada! Hedef: 10.000 ft", 100, true);
  rocket.classList.remove("shake");
  rocket.classList.add("launch");
  for (let k = 0; k < 8; k++) {
    puff(6, 200);
    await wait(180);
  }
  await wait(2600);

  setStatus("UÇUŞ", "Apogee → paraşütler açıldı, kurtarma başarılı", 100, true);
  await wait(2200);
  cycle();
}

if (reduceMotion) {
  parts.forEach((p) => p.classList.add("on"));
  setStatus("HAZIR", "ZENITH rampada", 100, true);
} else {
  cycle();
}

// ===== Dönen albüm =====
const deck = $("deck");
const cards = ALBUM.map((caption, i) => {
  const fig = document.createElement("figure");
  fig.className = "card";
  const src = `img/album/${pad2(i + 1)}.jpg`;
  fig.innerHTML = `<img src="${src}" alt="${caption}" loading="${i < 4 ? "eager" : "lazy"}"><figcaption>${caption}</figcaption>`;
  fig.addEventListener("click", () => openLightbox(src, caption));
  deck.appendChild(fig);
  return fig;
});

// Arkadaki kartların dağınık duruşu (k = öndeki karta uzaklık)
const POSE = [
  { x: "0px", y: "0px", r: "-1deg", sc: 1 },
  { x: "14px", y: "10px", r: "4deg", sc: 0.97 },
  { x: "-12px", y: "16px", r: "-5deg", sc: 0.94 },
  { x: "6px", y: "22px", r: "2deg", sc: 0.91 },
];
let current = 0;

function layoutDeck() {
  const n = cards.length;
  cards.forEach((card, i) => {
    const k = (i - current + n) % n;
    card.classList.toggle("out", k === n - 1);
    const pose = POSE[Math.min(k, POSE.length - 1)];
    card.style.setProperty("--x", pose.x);
    card.style.setProperty("--y", pose.y);
    card.style.setProperty("--r", pose.r);
    card.style.setProperty("--sc", pose.sc);
    card.style.zIndex = n - k;
    if (k !== n - 1) card.style.opacity = k < POSE.length ? 1 : 0;
    else card.style.opacity = "";
  });
  $("counter").textContent = `${current + 1} / ${n}`;
}

function step(dir) {
  current = (current + dir + cards.length) % cards.length;
  layoutDeck();
}

let paused = false;
deck.addEventListener("mouseenter", () => (paused = true));
deck.addEventListener("mouseleave", () => (paused = false));
$("prev").addEventListener("click", () => step(-1));
$("next").addEventListener("click", () => step(1));
setInterval(() => !paused && $("lightbox").hidden && step(1), 3800);
layoutDeck();

// ===== Büyük görünüm =====
const lb = $("lightbox");
function openLightbox(src, caption) {
  lb.querySelector("img").src = src;
  lb.querySelector("img").alt = caption;
  lb.querySelector("figcaption").textContent = caption;
  lb.hidden = false;
}
lb.addEventListener("click", (e) => {
  if (e.target === lb || e.target.classList.contains("lb-close")) lb.hidden = true;
});
addEventListener("keydown", (e) => {
  if (e.key === "Escape") lb.hidden = true;
  if (!lb.hidden) return;
  if (e.key === "ArrowRight") step(1);
  if (e.key === "ArrowLeft") step(-1);
});
