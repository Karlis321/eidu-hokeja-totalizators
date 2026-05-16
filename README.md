# 🏒 EIDU ģimenes hokeja totalizators

Vienkārša, mobilā hokeja totalizatora aplikācija Pasaules čempionātam.

## ⚙️ Funkcionalitāte

### 1. Iesniegt prognozes lapā
- 📋 Dropdown ar 8 spēlētājiem: Kārlis, Aivis, Inga, Dace, Jānis D., Jānis S., Andris, Elīna
- 🎮 Vienkārs prognožu iesniegšana (divi skaitļi — mājās + viesi goli)
- ⏱️ Automātisks laika bloķējums — prognožes jāiesniedz ≥1 stundu pirms spēles
- 💾 Saglabāšana Google Sheets

### 2. Kopvērtējuma lapā
- 🏆 Leaderboard ar visu spēlētāju punktiem
- 📊 Kolonas: Vieta, Vārds, Precīzi (3p), Daļēji (2p), Tikai uzv./goli (1p), Kopā
- 📖 Uzklikšķinot uz vārda — paplašinās spēlētāja vēsture ar visām prognozēm

## 🎯 Punktu sistēma

| Situācija | Punkti |
|-----------|--------|
| Precīzs rezultāts (H-A atbilst) | **3** |
| Uzvarētājs + vienas komandas goli | **2** |
| Tikai uzvarētājs VAI tikai goli | **1** |
| Nekas nav pareizs | **0** |

## 🔧 Stack

- **Frontend**: Next.js 14 (App Router) + React + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Google Sheets API
- **Hosting**: Vercel
- **Cron**: Vercel Cron Jobs

## 📁 Failā struktūra

```
eidu-totalizators/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Galvenā UI (abi tabulatori)
│   │   ├── layout.tsx
│   │   └── api/
│   │       ├── predictions/
│   │       │   └── route.ts       # POST prognožu saglabāšana
│   │       ├── matches/
│   │       │   └── route.ts       # GET spēles
│   │       ├── leaderboard/
│   │       │   └── route.ts       # GET leaderboard
│   │       ├── player-history/
│   │       │   └── route.ts       # GET spēlētāja vēsture
│   │       └── cron/
│   │           └── update-scores/
│   │               └── route.ts   # Automātiska punktu atjaunināšana
│   └── utils/
│       └── points.ts             # Punktu aprēķina loģika
├── .env.local                     # API atslēgas (NEpublicēt!)
├── vercel.json                    # Cron jobs config
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
└── package.json
```

## 🚀 Ātrs starts

### 1. Setup (skatīt SETUP.md pilnām instrukcijām)

```bash
# 1. Klonēt vai kopēt failus
git clone <repo-url>
cd eidu-totalizators

# 2. Instalēt paketes
npm install

# 3. Iestatīt .env.local ar Google API atslēgām

# 4. Palaist lokāli
npm run dev
```

Atvērt http://localhost:3000

### 2. Deploy uz Vercel

```bash
git push origin main
```

Vercel automātiski deploy'o. Pieejams https://YOUR_PROJECT.vercel.app

## 📋 Google Sheets struktūra

### Lapā "Speles"
| match_id | date_time | home_team | away_team | home_score | away_score | status |
|----------|-----------|-----------|-----------|------------|------------|--------|
| match_1 | 2026-05-20T18:00:00Z | Latvija | Vācija | 2 | 3 | finished |

### Lapā "Prognozes"
| prediction_id | player_name | match_id | predicted_home | predicted_away | timestamp |
|---------------|-------------|----------|----------------|----------------|-----------|
| 1 | Kārlis | match_1 | 2 | 2 | 2026-05-20T10:00:00Z |

### Lapā "Kopvertejums"
| player_name | points_3 | points_2 | points_1 | total_points |
|-------------|----------|----------|----------|--------------|
| Kārlis | 5 | 3 | 2 | 24 |

## 🔐 Environment variables

Iestatīt `.env.local`:

```env
GOOGLE_TYPE=service_account
GOOGLE_PROJECT_ID=...
GOOGLE_PRIVATE_KEY_ID=...
GOOGLE_PRIVATE_KEY="..."
GOOGLE_CLIENT_EMAIL=...
GOOGLE_CLIENT_ID=...
GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
GOOGLE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
GOOGLE_CLIENT_CERT_URL=...

GOOGLE_SHEET_ID=<tavs-sheet-id>

CRON_SECRET=<slepenais-atslega>
```

## 🤖 Automatizācija

### Cron jobs (vercel.json)
```json
{
  "crons": [{
    "path": "/api/cron/update-scores",
    "schedule": "0 */4 * * *"
  }]
}
```

Palaidīs `/api/cron/update-scores` ik 4 stundas.

## 📱 Mobilā piemērotība

- ✅ Responsive Tailwind CSS
- ✅ Touch-friendly UI
- ✅ Labi skatāma uz telefoniem

## 🛠️ Attīstības komandi

```bash
npm run dev       # Lokāla izstrāde
npm run build     # Production build
npm start         # Production server
npm run lint      # Linting
```

## 🧪 Testēšana

### Manuālā testēšana
1. Atvērt http://localhost:3000
2. Izvēlies spēlētāju
3. Ievadi prognozes
4. Noklikšķini "Saglabāt"
5. Pārej uz "Kopvērtējums" un redzēt rezultātus
6. Noklikšķini uz spēlētāja vārda lai redzētu vēsturi

### Automātiskā testēšana
```bash
# Tiešā Cron pārbaudē (ielādē /api/cron/update-scores):
curl -X GET http://localhost:3000/api/cron/update-scores \
  -H "Authorization: Bearer <CRON_SECRET>"
```

## 📊 Punktu aprēķins (points.ts)

```typescript
// Ielādē calculatePoints() - pilna TypeScript loģika
import { calculatePoints } from '@/utils/points';

const points = calculatePoints({
  predictedHome: 2,
  predictedAway: 1,
  actualHome: 2,
  actualAway: 3,
});

console.log(points); // 2 (uzvarētājs + vienas komandas goli pareizi)
```

## 🔗 Useful links

- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Sheets API Docs](https://developers.google.com/sheets/api)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)

## 📝 Licence

Privāts projekts. EIDU ģimene 2026. 🏒

---

**Jautājumi vai problēmas?** Lūk pierakstīti SETUP.md!
