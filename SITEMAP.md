# 📍 SITEMAP — VISU FAILU CEĻVEDIS

Visi faili, kas ir izveidoti jūsu projektam.

---

## 📂 MAPA STRUKTŪRA

```
eidu-totalizators/
│
├── 📖 DOKUMENTĀCIJA
│   ├── START_HERE.txt ........................ Ātrs orientācijas ceļvedis
│   ├── MASTER_GUIDE.md ....................... Pilnīga vadīte (sākt TE!)
│   ├── INDEX.md .............................. Galvenais indekss
│   ├── README.md ............................. Galvenā dokumentācija
│   │
│   ├── 🚀 SETUP FAZES
│   ├── QUICK_START.md ........................ 30-minūšu ātrs setup
│   ├── SETUP.md .............................. Detalizētas instrukcijas
│   ├── PROJECT_STRUCTURE.md .................. Failā hierarhija
│   ├── DEPLOY_CHECKLIST.md ................... Pre-deployment pārbaude
│   │
│   ├── 📊 GOOGLE SHEETS
│   ├── GOOGLE_SHEETS_SETUP.md ............... Sheets izveides instrukcijas
│   ├── SHEETS_QUICK_REFERENCE.md ............ Ātrs Sheets ceļvedis
│   ├── sheets_visual_guide.html ............. Vizuāls Sheets guide (HTML)
│   ├── SHEETS_AND_APP_INTEGRATION.md ........ Integrācijas logika
│   │
│   ├── 💻 KODS
│   └── CODE_OVERVIEW.md ..................... Koda apskats & datu plūsma
│
├── 💻 KODS
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx ..................... ⭐ GALVENAIS UI
│   │   │   ├── layout.tsx ................... Root layout
│   │   │   ├── globals.css .................. Stili
│   │   │   └── api/
│   │   │       ├── predictions/
│   │   │       │   └── route.ts ............. POST prognozes API
│   │   │       ├── matches/
│   │   │       │   └── route.ts ............. GET spēles API
│   │   │       ├── leaderboard/
│   │   │       │   └── route.ts ............. GET leaderboard API
│   │   │       ├── player-history/
│   │   │       │   └── route.ts ............. GET vēsture API
│   │   │       └── cron/
│   │   │           └── update-scores/
│   │   │               └── route.ts ......... Automātiska atjaunināšana
│   │   └── utils/
│   │       └── points.ts .................... ⭐ PUNKTU LOGIKA
│   │
│   ├── 🔧 KONFIGURĀCIJA
│   ├── package.json ......................... npm dependencies
│   ├── package-lock.json .................... Blokētās versijas
│   ├── tsconfig.json ........................ TypeScript
│   ├── tailwind.config.js ................... Tailwind CSS
│   ├── next.config.js ....................... Next.js
│   ├── postcss.config.js .................... PostCSS
│   ├── vercel.json .......................... Cron config
│   ├── .gitignore ........................... Git drošība
│   └── .env.local.example ................... Template (papīrs)
│
├── 📋 SAMPLE DATI (CSV)
│   ├── sample_data_speles.csv ............... Pietestu spēles
│   ├── sample_data_prognozes.csv ............ Pietestu prognozes
│   └── sample_data_kopvertejums.csv ......... Pietestu leaderboard
│
└── public/ ................................. Statiskais (nav izmantots)

```

---

## 🎯 FAILU NOZĪMES

### 📖 Dokumentācija

| Fails | Mērķis | Lasīšanas laiks |
|------|--------|-----------------|
| **START_HERE.txt** | Ātrs orientācijas pavediens | 5 min |
| **MASTER_GUIDE.md** | Pilnīga vadīte no nulles | 10 min |
| **INDEX.md** | Galvenais indekss ar navigāciju | 5 min |
| **README.md** | Galvenā info (features, stack) | 10 min |
| **QUICK_START.md** | 30-minūšu setup | 30 min |
| **SETUP.md** | Detalizētas instrukcijas | 60 min |
| **PROJECT_STRUCTURE.md** | Failā struktūra un secības | 15 min |
| **CODE_OVERVIEW.md** | Koda paskaidrojums | 20 min |
| **GOOGLE_SHEETS_SETUP.md** | Pilns Sheets guide | 30 min |
| **SHEETS_QUICK_REFERENCE.md** | Ātrs Sheets ceļvedis | 10 min |
| **sheets_visual_guide.html** | Vizuāls Sheets guide | 5 min (HTML) |
| **SHEETS_AND_APP_INTEGRATION.md** | Integrācijas logika | 15 min |
| **DEPLOY_CHECKLIST.md** | Pre-deployment pārbaude | 20 min |
| **SITEMAP.md** | Šis fails (navigācija) | 5 min |

---

### 💻 Kods (Production-ready)

| Fails | Nozīme | Rīcības |
|------|--------|--------|
| **src/app/page.tsx** | Frontend UI — abi tabulatori | ⭐ Galvenais |
| **src/app/layout.tsx** | Root HTML struktura | Minimāli rediģē |
| **src/app/globals.css** | Globālie stili | Modificē pēc nepieciešamības |
| **src/utils/points.ts** | Punktu aprēķina loģika | ⭐ Kritisks |
| **src/app/api/predictions/route.ts** | POST prognožu API | Lasīt & sapratne |
| **src/app/api/matches/route.ts** | GET spēļu API | Lasīt & sapratne |
| **src/app/api/leaderboard/route.ts** | GET leaderboard API | Lasīt & sapratne |
| **src/app/api/player-history/route.ts** | GET vēstures API | Lasīt & sapratne |
| **src/app/api/cron/update-scores/route.ts** | Automātiska atjaunināšana | Lasīt & sapratne |

---

### 🔧 Konfigurācija

| Fails | Nozīme |
|------|--------|
| **package.json** | npm dependencies — NE rediģē |
| **tsconfig.json** | TypeScript — NE rediģē |
| **tailwind.config.js** | Tailwind CSS — rediģē pēc nepieciešamības |
| **next.config.js** | Next.js — NE rediģē |
| **postcss.config.js** | PostCSS — NE rediģē |
| **vercel.json** | Cron config — rediģē pēc nepieciešamības |
| **.gitignore** | Git drošība — NE rediģē |
| **.env.local.example** | Template — kopē uz .env.local |

---

### 📋 Sample Dati (CSV)

| Fails | Saturs |
|------|--------|
| **sample_data_speles.csv** | 6 pietestu spēles |
| **sample_data_prognozes.csv** | 10 pietestu prognozes |
| **sample_data_kopvertejums.csv** | 8 spēlētāju punkti |

**Lietošana:**
1. Kopēt-ielīmēt Google Sheets
2. Vai importēt CSV'us tieši

---

## 🔄 REKOMENDĒTĀ LASĪŠANAS SECĪBA

### 1. ĀTRS ORIENTATION (15 min)
```
START_HERE.txt
  ↓ (5 min)
INDEX.md
  ↓ (5 min)
MASTER_GUIDE.md
  ↓ (5 min)
```

### 2. GOOGLE SHEETS (20-30 min)
```
SHEETS_QUICK_REFERENCE.md (ātrs)
  VAI
sheets_visual_guide.html (vizuāls)
  VAI
GOOGLE_SHEETS_SETUP.md (detalizēts)
```

### 3. NEXT.JS SETUP (30-60 min)
```
QUICK_START.md (30 min, ātrs)
  VAI
SETUP.md (60 min, detalizēts)
  │
  └─ PROJECT_STRUCTURE.md (papildu)
```

### 4. IZPRATNE (20-30 min)
```
SHEETS_AND_APP_INTEGRATION.md
CODE_OVERVIEW.md
```

### 5. DEPLOYMENT (20 min)
```
DEPLOY_CHECKLIST.md
SETUP.md → Solis 3
```

---

## 🎯 ĀTRI JAUTĀJUMI → FAILI

| Jautājums | Sākums | Tad | Beigas |
|-----------|--------|-----|--------|
| "Sākt ar ko?" | START_HERE.txt | INDEX.md | MASTER_GUIDE.md |
| "30-min setup?" | QUICK_START.md | — | — |
| "Detalizēts?" | SETUP.md | PROJECT_STRUCTURE.md | CODE_OVERVIEW.md |
| "Google Sheets?" | SHEETS_QUICK_REFERENCE.md | sheets_visual_guide.html | GOOGLE_SHEETS_SETUP.md |
| "Kā dati plūst?" | SHEETS_AND_APP_INTEGRATION.md | CODE_OVERVIEW.md | — |
| "Kāds kods?" | CODE_OVERVIEW.md | — | — |
| "Pre-deploy?" | DEPLOY_CHECKLIST.md | — | — |
| "Vercel?" | SETUP.md (Solis 3) | DEPLOY_CHECKLIST.md | — |

---

## 📊 FAILU KATEGORIJAS

### Svarīgi (Sākt ar šiem)
- ⭐ START_HERE.txt
- ⭐ MASTER_GUIDE.md
- ⭐ QUICK_START.md

### Setup
- SETUP.md
- GOOGLE_SHEETS_SETUP.md
- SHEETS_QUICK_REFERENCE.md

### Izpratne
- CODE_OVERVIEW.md
- SHEETS_AND_APP_INTEGRATION.md
- PROJECT_STRUCTURE.md

### Deployment
- DEPLOY_CHECKLIST.md
- vercel.json

### Atsauces
- INDEX.md
- README.md
- SITEMAP.md (šis fails)

### Vizuālie
- sheets_visual_guide.html
- README.md

### Sample Dati
- sample_data_speles.csv
- sample_data_prognozes.csv
- sample_data_kopvertejums.csv

---

## ✅ CHECKLIST — PIRMS SĀKŠANAS

Pārbaudī, vai visi faili ir uz vietas:

### Dokumentācija
- [ ] START_HERE.txt
- [ ] MASTER_GUIDE.md
- [ ] INDEX.md
- [ ] README.md
- [ ] QUICK_START.md
- [ ] SETUP.md
- [ ] PROJECT_STRUCTURE.md
- [ ] CODE_OVERVIEW.md
- [ ] GOOGLE_SHEETS_SETUP.md
- [ ] SHEETS_QUICK_REFERENCE.md
- [ ] sheets_visual_guide.html
- [ ] SHEETS_AND_APP_INTEGRATION.md
- [ ] DEPLOY_CHECKLIST.md
- [ ] SITEMAP.md

### Kods
- [ ] src/app/page.tsx
- [ ] src/app/layout.tsx
- [ ] src/app/globals.css
- [ ] src/utils/points.ts
- [ ] src/app/api/predictions/route.ts
- [ ] src/app/api/matches/route.ts
- [ ] src/app/api/leaderboard/route.ts
- [ ] src/app/api/player-history/route.ts
- [ ] src/app/api/cron/update-scores/route.ts

### Konfigurācija
- [ ] package.json
- [ ] tsconfig.json
- [ ] tailwind.config.js
- [ ] next.config.js
- [ ] postcss.config.js
- [ ] vercel.json
- [ ] .gitignore
- [ ] .env.local.example

### Sample Dati
- [ ] sample_data_speles.csv
- [ ] sample_data_prognozes.csv
- [ ] sample_data_kopvertejums.csv

**Ja viss ir ✅, tad esat gatavi sākt!**

---

## 🚀 NĀKAMIE SOĻI

1. Nolasi **START_HERE.txt** (5 min)
2. Nolasi **MASTER_GUIDE.md** (10 min)
3. Seko **QUICK_START.md** (30 min)
4. Sāc ar Google Sheets
5. Sāc ar Next.js
6. Testi lokāli
7. Deploy uz Vercel

---

## 📞 PALĪDZ

Nevar atrast failu? Lietojiet šo sitemap!

Jautājumi par failu? Lasīt **MASTER_GUIDE.md** jautājumu sadaļu.

---

**Veiksmi! 🚀**

---

*Šī sitemap ir jūsu navigācijas orientācijas punkts. Vienmēr var atgriezties šeit.*
