# 🏆 MASTER GUIDE — EIDU HOKEJA TOTALIZATORS

Pilnīga vadīte no nulles līdz Production.

---

## 📖 DOKUMENTĀCIJAS KARTE

```
MASTER_GUIDE.md (tu iesi šeit) ← SĀKT TE
│
├─ FAZES:
│  ├─ 1. Google Sheets izveide
│  │  └─ GOOGLE_SHEETS_SETUP.md
│  │     ├─ SHEETS_QUICK_REFERENCE.md (ātrs)
│  │     └─ sheets_visual_guide.html (vizuāls)
│  │
│  ├─ 2. Next.js Setup & Development
│  │  └─ QUICK_START.md (30 min)
│  │     ├─ SETUP.md (detalizēts)
│  │     └─ PROJECT_STRUCTURE.md
│  │
│  ├─ 3. Integrācija
│  │  └─ SHEETS_AND_APP_INTEGRATION.md
│  │     └─ CODE_OVERVIEW.md
│  │
│  └─ 4. Production
│     └─ DEPLOY_CHECKLIST.md
│
├─ ĀTRĀS ATSAUCES:
│  ├─ README.md
│  ├─ START_HERE.txt
│  └─ INDEX.md
│
└─ SAMPLE DATA:
   ├─ sample_data_speles.csv
   ├─ sample_data_prognozes.csv
   └─ sample_data_kopvertejums.csv
```

---

## ⏱️ TIMELINE

### DIENA 1: Setup (2-3 stundas)

**Solis 1.1: Google Cloud (30 min)**
```
1. Izveidot Google Cloud projektu
2. Iespējot Google Sheets API
3. Izveidot Service Account
4. Lejupielādēt JSON atslēgu
```
→ [SETUP.md → Soļi 1.1-1.4]

**Solis 1.2: Google Sheets (20 min)**
```
1. Izveidot jaunu Spreadsheet
2. Izveidot 3 lapas (Speles, Prognozes, Kopvertejums)
3. Ievadīt virsrakstus + pietestu datus
4. Kopēt Spreadsheet ID
5. Share ar Service Account
```
→ [GOOGLE_SHEETS_SETUP.md VAI SHEETS_QUICK_REFERENCE.md]

**Solis 1.3: Next.js (40 min)**
```
1. Inicializēt Next.js projektu
2. Instalēt googleapis
3. Kopēt kodus (src/ fails)
4. Konfigurēt .env.local
5. Palaist npm run dev
```
→ [QUICK_START.md → Solis 3-5]

**Solis 1.4: Testēšana (30 min)**
```
1. Atvērt http://localhost:3000
2. Pārbaudīt UI (abi tabulatori)
3. Ievadīt prognozes un iesniedz
4. Skatīt leaderboard atjauninājumus
5. Skatīt Google Sheets atjauninājumus
```
→ [SHEETS_AND_APP_INTEGRATION.md]

---

### DIENA 2: Deployment (1-2 stundas)

**Solis 2.1: Git (20 min)**
```
1. git init
2. git add .
3. git commit
4. git push uz GitHub
```
→ [DEPLOY_CHECKLIST.md → 2. Git pārsūtīšana]

**Solis 2.2: Vercel (20 min)**
```
1. Atvērt vercel.com
2. Importēt GitHub repo
3. Pievienot .env variābles
4. Deploy
```
→ [SETUP.md → Solis 3]

**Solis 2.3: Production testēšana (20 min)**
```
1. Atvērt https://YOUR_PROJECT.vercel.app
2. Pārbaudīt UI un API
3. Pārbaudīt Cron logs
4. Dalies ar ģimeni!
```
→ [DEPLOY_CHECKLIST.md → 7. Production testēšana]

---

## 🎯 SOLI-PA-SOLIM

### Solis 1: Dokumentācija
Izlasi vienu no šiem:
- **Ātri**: START_HERE.txt
- **Galatīgs**: INDEX.md
- **Master**: Šis fails (MASTER_GUIDE.md)

### Solis 2: Google Sheets
Izveido Sheets un ievadi datus:
- **Vizuāls guide**: sheets_visual_guide.html (atvērt pārlūkā)
- **Īss guide**: SHEETS_QUICK_REFERENCE.md
- **Detalizēts**: GOOGLE_SHEETS_SETUP.md

### Solis 3: Next.js Setup
Atbilstoši tavām prasībām:
- **30 minūtes**: QUICK_START.md
- **Vidējais**: SETUP.md
- **Detalizēts**: PROJECT_STRUCTURE.md

### Solis 4: Integrācija
Sapratne, kā lietas darbojas:
- **Darbības plūsma**: SHEETS_AND_APP_INTEGRATION.md
- **Kods paskaidrojums**: CODE_OVERVIEW.md

### Solis 5: Production
Pārbaudīt un deploج:
- **Checklist**: DEPLOY_CHECKLIST.md
- **Vercel**: SETUP.md → Solis 3

---

## 🔍 ĀTRAS ATBILDES

| Jautājums | Dokuments |
|-----------|-----------|
| "Sākt ar ko?" | START_HERE.txt VAI INDEX.md |
| "Ātrais setup (30 min)?" | QUICK_START.md |
| "Detalizēts setup?" | SETUP.md |
| "Google Sheets?" | GOOGLE_SHEETS_SETUP.md VAI SHEETS_QUICK_REFERENCE.md |
| "Vizuālis Sheets guide?" | sheets_visual_guide.html |
| "Kā dati plūst?" | SHEETS_AND_APP_INTEGRATION.md |
| "Kāds kods?" | CODE_OVERVIEW.md |
| "Mapa struktūra?" | PROJECT_STRUCTURE.md |
| "Pre-deploy pārbaude?" | DEPLOY_CHECKLIST.md |
| "Vercel deploy?" | SETUP.md → Solis 3 |

---

## 📦 KAS IR IEKĻAUTS

### ✅ Kods (Production-ready)
- ✅ `src/app/page.tsx` — Frontend UI (abi tabulatori)
- ✅ `src/app/api/predictions/route.ts` — Prognožu API
- ✅ `src/app/api/matches/route.ts` — Spēļu API
- ✅ `src/app/api/leaderboard/route.ts` — Leaderboard API
- ✅ `src/app/api/player-history/route.ts` — Vēstures API
- ✅ `src/app/api/cron/update-scores/route.ts` — Cron automātika
- ✅ `src/utils/points.ts` — Punktu aprēķins

### ✅ Konfigurācija
- ✅ `package.json` — dependencies
- ✅ `tsconfig.json` — TypeScript
- ✅ `tailwind.config.js` — CSS
- ✅ `next.config.js` — Next.js
- ✅ `vercel.json` — Cron config
- ✅ `.env.local.example` — Template

### ✅ Dokumentācija
- ✅ 10+ Markdown faili
- ✅ 1 HTML vizuāls guide
- ✅ 3 CSV sample datu faili

### ✅ Instrukcijas
- ✅ Google Sheets setup
- ✅ Next.js setup
- ✅ Vercel deploy
- ✅ Integrācija
- ✅ Debugging

---

## ⚡ ĀTRU KOMANDU SARAKSTS

```bash
# Setup
npm install                    # Instalēt paketes
npm run dev                    # Localhost (http://localhost:3000)

# Build
npm run build                  # Production build
npm start                      # Production server
npm run lint                   # Linting

# Git
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR/REPO.git
git push -u origin main

# Vercel Deploy
# (automāts no Git, nav nepieciešama CLI)
```

---

## 🔐 DROŠĪBAS CHECKLIST

- [ ] `.env.local` **NAV** Git'ā
- [ ] `.env.local.example` **IR** Git'ā
- [ ] `GOOGLE_PRIVATE_KEY` satur `\n` pareizi
- [ ] `CRON_SECRET` ir nejaušs (32+ rakstzīmes)
- [ ] Service Account e-pasts **NAV** slepenais
- [ ] `.gitignore` sargā .env
- [ ] Vercel Environment Variables iestatīti
- [ ] repo ir publis (vai privāts, kā vēlies)

---

## ✅ GATAVĪBAS CHECKLIST

**Pirms Deployment:**
- [ ] Google Sheet izveidots ar 3 lapām
- [ ] Virsraksti ir pareizi
- [ ] Pietestu dati ievadīti
- [ ] Service Account savienots (Share)
- [ ] GOOGLE_SHEET_ID kopēts
- [ ] Next.js inicializēts
- [ ] Viss kods kopēts
- [ ] `.env.local` aizpildīts
- [ ] `npm run dev` darbojas
- [ ] http://localhost:3000 pieejams
- [ ] API tests veiksmīgi
- [ ] Prognožu iesniegšana strādā
- [ ] Leaderboard parāda datus
- [ ] Git push veikts uz GitHub
- [ ] Vercel projekts importēts
- [ ] Env variābles Vercel iestatītas
- [ ] Deployment pabeidzies
- [ ] Public URL atveras
- [ ] Production tests veiksmīgi

---

## 🎓 DOKUMENTĀCIJAS HIERARHIJA

```
START_HERE.txt (ļoti īss)
  ↓
INDEX.md (ātrs indekss)
  ↓
QUICK_START.md (30 min setup)
  ↓
SETUP.md (detalizēts)
  ↓
CODE_OVERVIEW.md (koda apskats)
  ↓
PROJECT_STRUCTURE.md (failā struktūra)
  ↓
DEPLOY_CHECKLIST.md (pre-deploy)
```

---

## 🚀 SĀKUMĀ IETEIKTĀ SECĪBA

**1. Pirmais lasījums (5 min):**
```
START_HERE.txt
```

**2. Setup (2-3 stundas):**
```
QUICK_START.md
  → Google Sheets setup
  → Next.js setup
  → Localhost testēšana
```

**3. Izpratne (30 min):**
```
SHEETS_AND_APP_INTEGRATION.md
CODE_OVERVIEW.md
```

**4. Production (1 stunda):**
```
DEPLOY_CHECKLIST.md
SETUP.md (Solis 3)
```

---

## 📞 PROBLĒMU RISINĀJUMS

| Problēma | Risinājums |
|----------|-----------|
| "Nevar ieviest prognozes" | SHEETS_AND_APP_INTEGRATION.md |
| "API kļūda 500" | SETUP.md → "6. Problēmu risinājums" |
| "Sheets nesūta datus" | GOOGLE_SHEETS_SETUP.md → "6. Pārbaude" |
| "Vercel deploy fails" | DEPLOY_CHECKLIST.md → "🚨 Ātrajos gadījumā" |

---

## 🎉 BEIGĀS

Pēc tam kad vienmērīgi turpinājāt:

1. ✅ Izveide Google Sheets
2. ✅ Setup Next.js
3. ✅ Lokāla testēšana (localhost)
4. ✅ Production deploy (Vercel)
5. 🏆 **GATAVS!**

Dalies ar ģimeni: **https://YOUR_PROJECT.vercel.app**

---

## 📚 PAPILDU RESURSI

- [Google Sheets API Docs](https://developers.google.com/sheets/api)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Vercel Docs](https://vercel.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

## 🏁 JŪSU GALAMĒRĶIS

```
🏒 EIDU ģimenes hokeja totalizators
   Pasaules čempionāts → Prognozes → Leaderboard
   
   ✅ Ikviens var ieviest prognozes
   ✅ Automātiska punktu aprēķina
   ✅ Dzīvs leaderboard
   ✅ Uz viņu telefoniem
   ✅ Vercel (ātrs & drošs)
```

---

**Sāksim! 🚀**

Pirmais solis: Nolasi **START_HERE.txt** vai **QUICK_START.md**

---

*Laimes! Bija jauks darbs ar jums! 🏆*
