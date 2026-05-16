# 🏒 EIDU ģimenes hokeja totalizators — GALVENAIS INDEKSS

## 📚 Dokumentācijas struktūra

Izvēlies, ar ko sākt:

### 🚀 Ātrs starts (30 min)
👉 **[QUICK_START.md](QUICK_START.md)** — izveidot projektu no nulles, tur pašus galvenos soļus.

### 🔧 Detalizēts setup (vidējš)
👉 **[SETUP.md](SETUP.md)** — soli-pa-solim instrukcijas Google Cloud, Google Sheets, Next.js, Vercel deploJS.

### 📖 Koda apskats
👉 **[CODE_OVERVIEW.md](CODE_OVERVIEW.md)** — kā katrs fails darbojas, datu plūsma, API izsaukumi.

### 📁 Projekta struktura
👉 **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** — mapi hierarhija, darbības secības.

### 📝 Galvenā dokumentācija
👉 **[README.md](README.md)** — vispārīgs apskats, features, tehniskais stack.

---

## 🎯 Ātrs jautājumu atbildes

### Jautājums: "Ar ko sākt?"
→ Lasīt **QUICK_START.md** — 30 minūšu setup

### Jautājums: "Kā Google Sheets API konfigurējas?"
→ Solis 1 un 2 **SETUP.md**

### Jautājums: "Kā dati plūst no frontend uz Google Sheets?"
→ **CODE_OVERVIEW.md** → "Datu plūsma"

### Jautājums: "Kāda ir mape struktūra?"
→ **PROJECT_STRUCTURE.md** → "Pilna mapa hierarhija"

### Jautājums: "Kā Cron darbojās?"
→ **CODE_OVERVIEW.md** → "7. API maršruti" → `cron/update-scores/route.ts`

### Jautājums: "Kāda ir punktu sistēma?"
→ **README.md** → "🎯 Punktu sistēma"

### Jautājums: "Deplojs uz Vercel?"
→ **SETUP.md** → "3. DEPLOJS VERCEL"

---

## 📋 Failu saraksts (ar norādēm)

### 📖 Dokumentācija
| Fails | Mērķis |
|------|--------|
| **INDEX.md** | 👈 Tu iesi šeit (šis fails) |
| **README.md** | Galvenā — features, stack, links |
| **QUICK_START.md** | Ātrs 30-min setup |
| **SETUP.md** | Detalizētas instrukcijas |
| **CODE_OVERVIEW.md** | Koda apskats |
| **PROJECT_STRUCTURE.md** | Mapi hierarhija |

### 💻 Frontend kods
| Fails | Nozīme |
|------|--------|
| **src/app/page.tsx** | Viss UI (abi tabulatori, formas) |
| **src/app/layout.tsx** | Root HTML struktura |
| **src/app/globals.css** | Globālie stili |

### 🧮 Loģika
| Fails | Nozīme |
|------|--------|
| **src/utils/points.ts** | Punktu aprēķins |

### 🔗 API
| Fails | Nozīme |
|------|--------|
| **src/app/api/predictions/route.ts** | POST prognozes |
| **src/app/api/matches/route.ts** | GET spēles |
| **src/app/api/leaderboard/route.ts** | GET leaderboard |
| **src/app/api/player-history/route.ts** | GET vēsture |
| **src/app/api/cron/update-scores/route.ts** | Automātiska atjaunināšana |

### ⚙️ Konfigurācija
| Fails | Nozīme |
|------|--------|
| **.env.local** | 🔐 Slepeni! Google API atslēgas |
| **.env.local.example** | Template (var Git'ā) |
| **package.json** | npm dependencies |
| **vercel.json** | Cron jobs |
| **next.config.js** | Next.js config |
| **tailwind.config.js** | Tailwind config |
| **tsconfig.json** | TypeScript config |

---

## 🎯 Darbības soļi

### 1️⃣ Pirmoreiz?
```
Lasīt QUICK_START.md 
  ↓ (30 min setup)
Atvērt http://localhost:3000
  ↓ (vietējā testēšana)
Deplojs uz Vercel
  ↓ (public URL)
Gatavs! 🎉
```

### 2️⃣ Debugging?
```
CODE_OVERVIEW.md + PROJECT_STRUCTURE.md
  ↓
Pārbaudi .env.local
  ↓
Skatīt Google Sheets
  ↓
Vercel logs (ja Vercel)
```

### 3️⃣ Nākamie uzlabojumi?
```
CODE_OVERVIEW.md → "8. Optimizācija"
  ↓
Sporta API integrācija
Notifikācijas
Statistika
```

---

## ⚡ Ātrā komandu nozīme

```bash
npm run dev          # Palaist lokāli
npm run build        # Production build
npm start            # Production server
npm run lint         # Linting
```

---

## 🔐 Svarīgas piezīmes

- ✅ `.env.local` **nekad** Git'ā (`.gitignore` sargā)
- ✅ Google Service Account email drīkst saglabāt Git'ā
- ✅ `CRON_SECRET` jābūt nejaušam un drošam
- ✅ Vercel env variābles ir slepenās (nevar public JS'ā nolasīt)

---

## 🚨 Problēmu ātrie risinājumi

| Problēma | Risinājums |
|----------|-----------|
| "GOOGLE_SHEET_ID nav nosūtīts" | Pārbaudī `.env.local` |
| "Prognozes nesaglabājas" | Pārbaudī Google Sheets Share settings |
| "API kļūda 401" | Pārbaudī CRON_SECRET Vercel Settings |
| "Private key kļūda" | Pārbaudī `\n` rindas pauzes `.env.local` |
| "Spēles neslogā" | Pārbaudī `GET /api/matches` Console logs |

---

## 📞 Palīdzības vadlīnijas

### Manā koda jautājums?
→ **CODE_OVERVIEW.md**

### Kļūda setup laikā?
→ **SETUP.md** → "6. PROBLĒMU RISINĀJUMS"

### Kur ir fails?
→ **PROJECT_STRUCTURE.md** → "Pilna mapa hierarhija"

### Kāda ir tava mapa struktura?
→ **PROJECT_STRUCTURE.md**

### Kā dati plūst?
→ **CODE_OVERVIEW.md** → "Datu plūsma"

---

## ✅ Gatavības pārbaude (pirms deploJS)

- [ ] `npm run dev` darbojas lokāli
- [ ] `http://localhost:3000` pieejams
- [ ] Dropdown ar spēlētājiem darbojās
- [ ] Var iesniedz prognozes
- [ ] Leaderboard parāda punktus
- [ ] Google Sheets ir trīs lapas (Speles, Prognozes, Kopvertejums)
- [ ] `.env.local` aizpildīts ar pareizam vērtībām
- [ ] Git'ā nav `.env.local`
- [ ] `vercel.json` ir projekta saknē

Ja viss ir ✅, tad:
```bash
git push origin main
# → Vercel automātiski deploy
```

---

## 🎓 Mācību resursi

- [Next.js dokumentācija](https://nextjs.org/docs)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Vercel](https://vercel.com/docs)

---

## 🏁 Nākamie soļi

1. ✅ Izlasi QUICK_START.md
2. ✅ Izveido Google Cloud projektu
3. ✅ Izveido Google Sheet
4. ✅ Klonē Next.js projektu
5. ✅ Palaidi `npm run dev`
6. ✅ Ievadi datus un testē
7. ✅ Deplojs uz Vercel
8. ✅ Dalies ar ģimeni! 🏒

---

**Jautājumi? Sākums ar QUICK_START.md! 🚀**

---

*Pēdējoreiz atjaunināts: 2026. gada maijs*
