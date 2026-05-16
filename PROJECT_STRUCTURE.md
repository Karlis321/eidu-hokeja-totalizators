# 📁 Projekta failā struktūra

## Pilna mapa hierarhija

```
eidu-totalizators/
│
├── src/
│   ├── app/
│   │   ├── page.tsx                          # 🎨 Galvenā UI (abi tabulatori)
│   │   ├── layout.tsx                        # 🏗️ Root layout
│   │   ├── globals.css                       # 🎨 Globālie stili
│   │   └── api/
│   │       ├── predictions/
│   │       │   └── route.ts                  # 💾 POST prognožu saglabāšana
│   │       ├── matches/
│   │       │   └── route.ts                  # 📋 GET spēles
│   │       ├── leaderboard/
│   │       │   └── route.ts                  # 🏆 GET leaderboard
│   │       ├── player-history/
│   │       │   └── route.ts                  # 📖 GET spēlētāja vēsture
│   │       └── cron/
│   │           └── update-scores/
│   │               └── route.ts              # 🤖 Automātiska atjaunināšana
│   └── utils/
│       └── points.ts                         # 🎯 Punktu aprēķina loģika
│
├── public/                                    # Statiskais saturs (nav izmantots)
│
├── .env.local                                # 🔐 Vietējās vidi variābles (GIT IGNORE)
├── .env.local.example                        # 📝 Template (drīkst saglabāt)
├── .gitignore                                # 📛 Git izņēmumi
│
├── vercel.json                               # ⏰ Cron jobs config
├── next.config.js                            # ⚙️ Next.js konfigurācija
├── tailwind.config.js                        # 🎨 Tailwind CSS konfigurācija
├── tsconfig.json                             # 📘 TypeScript konfigurācija
│
├── package.json                              # 📦 Izpildāmais manifest
├── package-lock.json                         # 🔒 Blokētās versijas (auto)
│
├── README.md                                 # 📖 Galvenā dokumentācija
├── SETUP.md                                  # 🔧 Detalizētas setup instrukcijas
├── QUICK_START.md                            # ⚡ Ātrs starts
├── CODE_OVERVIEW.md                          # 📖 Koda apskats
└── PROJECT_STRUCTURE.md                      # 📁 Šis fails

```

---

## Failu nozīmes

### 🎨 Frontend (`src/app/`)

| Fails | Nozīme |
|------|--------|
| **page.tsx** | Viss UI — abi tabulatori, dropdown, formas, leaderboard |
| **layout.tsx** | Root HTML struktura, metadata |
| **globals.css** | Tailwind import, globālie stili |

### 🧮 Loģika (`src/utils/`)

| Fails | Nozīme |
|------|--------|
| **points.ts** | Punktu aprēķins, laika bloķējums pārbaude |

### 🔗 API (`src/app/api/`)

| Fails | Nozīme |
|------|--------|
| **predictions/route.ts** | POST — prognozes saglabāšana + leaderboard atjaunināšana |
| **matches/route.ts** | GET — spēļu nolasīšana no Google Sheets |
| **leaderboard/route.ts** | GET — kopējais leaderboard |
| **player-history/route.ts** | GET — spēlētāja vēsture |
| **cron/update-scores/route.ts** | GET — aģents punktu pārrēķināšanai |

### ⚙️ Konfigurācija

| Fails | Nozīme |
|------|--------|
| **.env.local** | **Slepena!** — Google API atslēgas |
| **.env.local.example** | Template — drīkst saglabāt Git'ā |
| **vercel.json** | Cron jobs plāns (ik 4 stundas) |
| **next.config.js** | Next.js iestatījumi |
| **tailwind.config.js** | Tailwind CSS tēma |
| **tsconfig.json** | TypeScript kompilācijas iestatījumi |
| **package.json** | npm dependencies |

### 📖 Dokumentācija

| Fails | Nozīme |
|------|--------|
| **README.md** | Galvenā — apreizi, stack, struktūra |
| **SETUP.md** | Soli-pa-solim Google Cloud + Next.js + Vercel |
| **QUICK_START.md** | Ātrs 30-minūšu starts |
| **CODE_OVERVIEW.md** | Detalizēts koda apskats |
| **PROJECT_STRUCTURE.md** | Šis fails — mapi hierarhija |

---

## Darbības tabula

### Ielādes secība (Frontend)
```
Browser ↓
next.config.js (konfigurācija)
↓
src/app/layout.tsx (HTML shell + CSS imports)
↓
src/app/page.tsx (React komponente)
↓
useEffect() — izsauc /api/matches un /api/leaderboard
↓
UI renderējas ar datiem
```

### Prognožu iesniegšanas secība
```
User ieraksta prognozes un noklikšķini "Saglabāt"
↓
handleSubmit() (page.tsx)
↓
POST /api/predictions
↓
predictions/route.ts
  - Iegūst nākamo prediction_id
  - Ievieš rindas Google Sheets (Prognozes)
  - Izsauc updateLeaderboard()
    - Parsē Prognozes + Speles
    - Aprēķina punktus (points.ts loģika)
    - Atjaunina Kopvertejums
↓
Frontend atsvaidzina leaderboard
```

### Cron atjaunināšanas secība (ik 4h)
```
Vercel Cron → GET /api/cron/update-scores
↓
Pārbauda autentifikāciju (CRON_SECRET)
↓
Iegūst visas spēles un prognozes
↓
fetchRealScores() — mēģina iegūt reālos rezultātus
↓
Atjaunina Speles lapu ar jauniem rezultātiem
↓
Izsauc updateLeaderboard() — pārrēķina punktus
↓
Dati atsvaidzināti visiem
```

---

## Dev darbplūsma

### 1. Lokālā izstrāde
```bash
cd eidu-totalizators
npm install
npm run dev
# → http://localhost:3000
```

### 2. Koda izmaiņas
```
Editē src/app/page.tsx (vai jebkāds cits .tsx/.ts)
↓
Hot Reload (next dev pārrūpē)
↓
Pārlādē pārlūku
```

### 3. Testi
```bash
# Manuāli
http://localhost:3000 → ievadi datus → "Saglabāt" → pēkšņi Google Sheets

# API testēšana
curl http://localhost:3000/api/matches
curl http://localhost:3000/api/leaderboard
curl -X POST http://localhost:3000/api/predictions \
  -H "Content-Type: application/json" \
  -d '{"player_name":"Kārlis","predictions":[]}'
```

### 4. Versionēšana
```bash
git add .
git commit -m "Feature: Add player history"
git push origin main
# → Vercel automātiski deploy
```

---

## Performance & Scalability

### Pašreiz optimizēts
- ✅ React `'use client'` direktīva (client-side rendering kur nepieciešams)
- ✅ Google Sheets API batch updates (updateLeaderboard)
- ✅ Conditional rendering (tabām)
- ✅ Tailwind CSS — minimāls CSS

### Iespējamie bottlenecks
1. **Liels spēļu skaits** — lapošana `GET /api/matches`
2. **Vienu lielu prognožu saraksts** — Sheets API `values.get()` lēns
3. **Cron atjaunināšanas lēnums** — integrācija ar sporta API

### Ieteiktie uzlabojumi
1. Pievienot **database** (Supabase/Firebase) papildu Google Sheets
2. **Caching** — Redis vai ISR (Incremental Static Regeneration)
3. **Pagination** — prognožu sarakstam
4. **WebSockets** — real-time leaderboard atjaunināšana

---

## Drošības uzraudzības piezīmes

### 🔐 Svarīgi

- **`.env.local` nekad Git'ā!** Tas satur `GOOGLE_PRIVATE_KEY`
- **CRON_SECRET** jāsargā (vērtībai jābūt nejaušai, piemēram, 32 rakstzīmes)
- **Service Account email** drīkst saglabāt GitHub (viņš nav slepenais)
- **Vercel env variābles** ir aizliegtas — nav pieejamas public konfigurācijā

### Ieteikumi
1. Pārbaudīt `/api/cron/update-scores` header `Authorization` (ņemt no koda)
2. Rotēt `CRON_SECRET` periodiski
3. Audita Google Cloud logs (Service Account darbības)

---

## Git repo setup

```bash
git init
git add .
git commit -m "Initial commit: EIDU Hockey Totalizator"
git branch -M main
git remote add origin https://github.com/YOUR/REPO.git
git push -u origin main

# .gitignore jau ietver:
# - .env.local
# - node_modules/
# - .next/
# - dist/
```

---

## Vercel deployment checklist

- [ ] `.env.local` **nav** Git'ā (`.gitignore` sargā)
- [ ] `.env.local.example` **ir** Git'ā (ar placeholder)
- [ ] `vercel.json` konfigurēts ar cron schedule
- [ ] GitHub repo publisks (vai privāts, kas jums pieņemams)
- [ ] Vercel konta saikne ar GitHub
- [ ] Environment variables iestatīti Vercel projekta Settings
- [ ] Deploy sūtīts uz `main` branch
- [ ] Pēc 2-3 minūtēm → Atvērt `https://YOUR_PROJECT.vercel.app` ✅

---

## Jautājumi? 

- **Setup problēmas?** → Lasīt `SETUP.md`
- **Ātrs starts?** → `QUICK_START.md`
- **Koda apskats?** → `CODE_OVERVIEW.md`
- **API structure?** → `CODE_OVERVIEW.md` → "3. API maršruti"

---

**Laimes ar totalizatoru! 🏒**
