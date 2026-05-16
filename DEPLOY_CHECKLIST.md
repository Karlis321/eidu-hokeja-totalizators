# ✅ DEPLOYMENT CHECKLIST

Nepieciešams paveikt, pirms publicēt uz Vercel.

---

## 1️⃣ Koda pabeigšana

### Aizpildīšana `.env.local` (lokāli)
- [ ] GOOGLE_TYPE = "service_account"
- [ ] GOOGLE_PROJECT_ID = (no JSON)
- [ ] GOOGLE_PRIVATE_KEY_ID = (no JSON)
- [ ] GOOGLE_PRIVATE_KEY = (no JSON ar \n!)
- [ ] GOOGLE_CLIENT_EMAIL = (no JSON)
- [ ] GOOGLE_CLIENT_ID = (no JSON)
- [ ] GOOGLE_AUTH_URI = https://accounts.google.com/o/oauth2/auth
- [ ] GOOGLE_TOKEN_URI = https://oauth2.googleapis.com/token
- [ ] GOOGLE_AUTH_PROVIDER_CERT_URL = https://www.googleapis.com/oauth2/v1/certs
- [ ] GOOGLE_CLIENT_CERT_URL = (no JSON)
- [ ] GOOGLE_SHEET_ID = (tavs spreadsheet ID)
- [ ] CRON_SECRET = (nejaušs, piemēram, 32 rakstzīmes)

### Lokāla testēšana
- [ ] npm install (jaunas paketes)
- [ ] npm run dev (bez kļūdām)
- [ ] http://localhost:3000 atvērs galveno lapu
- [ ] Dropdown ir pieejams un parāda 8 spēlētājus
- [ ] Var iesniedz prognozes (POST /api/predictions)
- [ ] Leaderboard atjauninās pēc saglabāšanas
- [ ] Noklikšķinis uz spēlētāja vārda — paplašinās vēsture
- [ ] Responsive ui uz mobilā (Dev Tools)

### Vietējā API testēšana
```bash
# Pārbaudī /api/matches
curl http://localhost:3000/api/matches

# Pārbaudī /api/leaderboard
curl http://localhost:3000/api/leaderboard

# Pārbaudī POST /api/predictions
curl -X POST http://localhost:3000/api/predictions \
  -H "Content-Type: application/json" \
  -d '{"player_name":"Kārlis","predictions":[{"match_id":"test","predicted_home":2,"predicted_away":1}]}'

# Pārbaudī Cron (reizini CRON_SECRET no .env.local)
curl http://localhost:3000/api/cron/update-scores \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

- [ ] GET /api/matches grāvējas
- [ ] GET /api/leaderboard grāvējas
- [ ] POST /api/predictions strādā
- [ ] GET /api/cron/update-scores strādā ar pareizu secret

---

## 2️⃣ Git pārsūtīšana

### Pārbaudīt `.gitignore`
```bash
cat .gitignore
```

Viņam jābūt:
- [ ] .env (bez .local!)
- [ ] .env.local ← **KRITISKS!**
- [ ] node_modules/
- [ ] .next/
- [ ] dist/
- [ ] Citiem privātiem failiem

### Pārbaudīt, vai .env.local nav Git'ā

```bash
# Skanus, vai .env.local ir tur
git ls-files | grep env.local

# Ja ES (jānoņem):
git rm --cached .env.local
git commit -m "Remove .env.local from git"
```

- [ ] .env.local nav Git'ā
- [ ] .env.local.example IR Git'ā (ar placeholder)

### Pirmā commita sagatavošana

```bash
git init
git add .
git status  # Pārbaudī, vai .env.local NAV sarakstā
git commit -m "Initial commit: EIDU Hockey Totalizator"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/eidu-totalizators.git
git push -u origin main
```

- [ ] Git inicializēts
- [ ] Pirmā commit izdarīta
- [ ] Main branch ir uz GitHub
- [ ] .env.local nav tur!

---

## 3️⃣ Vercel konts

### Konfigurācija
- [ ] Vercel konta izveidošana (https://vercel.com)
- [ ] GitHub saikne Vercel kontam
- [ ] GitHub repozitorija ir publis (vai privāts, kā vēlies)

### Vercel projekts

1. Aiziet uz https://vercel.com/new
2. Izvēlies savu GitHub repozitoriju
3. Noklikšķini **Import**

- [ ] Projekts importēts Vercel

---

## 4️⃣ Environment variables Vercel

### Dodot variables

1. Vercel → tavs projekts → **Settings** → **Environment Variables**
2. Pievienot katru no `.env.local`:

```env
GOOGLE_TYPE=service_account
GOOGLE_PROJECT_ID=...
GOOGLE_PRIVATE_KEY_ID=...
GOOGLE_PRIVATE_KEY="..."  # ⚠️ Ar \n rindas pausēm!
GOOGLE_CLIENT_EMAIL=...
GOOGLE_CLIENT_ID=...
GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
GOOGLE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
GOOGLE_CLIENT_CERT_URL=...

GOOGLE_SHEET_ID=...
CRON_SECRET=...
```

**Svarīgi**: `GOOGLE_PRIVATE_KEY` ir multiline — ielīmējiet to vienu reizi bez piebilstiem!

- [ ] GOOGLE_TYPE
- [ ] GOOGLE_PROJECT_ID
- [ ] GOOGLE_PRIVATE_KEY_ID
- [ ] GOOGLE_PRIVATE_KEY ← (no JSON fails)
- [ ] GOOGLE_CLIENT_EMAIL
- [ ] GOOGLE_CLIENT_ID
- [ ] GOOGLE_AUTH_URI
- [ ] GOOGLE_TOKEN_URI
- [ ] GOOGLE_AUTH_PROVIDER_CERT_URL
- [ ] GOOGLE_CLIENT_CERT_URL
- [ ] GOOGLE_SHEET_ID
- [ ] CRON_SECRET

---

## 5️⃣ Cron Jobs

### `vercel.json`

Pārbaudī, vai `vercel.json` ir projekta saknē:

```json
{
  "crons": [
    {
      "path": "/api/cron/update-scores",
      "schedule": "0 */4 * * *"
    }
  ]
}
```

- [ ] `vercel.json` ir projekta saknē
- [ ] Path ir pareizs: `/api/cron/update-scores`
- [ ] Schedule ir pareizs: `0 */4 * * *` (ik 4 stundas)

---

## 6️⃣ Pirmais deplojs

### Trigger deplojs

Vercel var automātiski deploy'ot, kad jūs `push` uz `main`:

```bash
git push origin main
```

- [ ] Push veikts uz GitHub
- [ ] Vercel uzsāk deplojs (skatīt Vercel Dashboard)
- [ ] Pēc 2-3 min → Build pabeigts (vai kļūda)

### Pārbaudī deploJs

1. Vercel → Deployments → Latest
2. Pārbaudī build logs (nav kļūdu)
3. Atvērt `https://YOUR_PROJECT.vercel.app`

- [ ] Builds veiksmīgs
- [ ] Public URL pieejams
- [ ] Web app atveras
- [ ] Dropdown darbojās
- [ ] API izsaukumi veiksmīgi

---

## 7️⃣ Production testēšana

### Vercel public URL'ā

- [ ] Atvērt https://YOUR_PROJECT.vercel.app
- [ ] Dropdown parāda 8 spēlētājus
- [ ] Var iesniedz prognozes (POST /api/predictions)
- [ ] Leaderboard parāda rezultātus
- [ ] Noklikšķinis uz spēlētāja — paplašinās vēsture
- [ ] Responsive uz mobilā

### API testēšana Vercel'ā

```bash
# Mājās nomainot localhost → tavs_vercel_url.com

# GET /api/matches
curl https://YOUR_PROJECT.vercel.app/api/matches

# GET /api/leaderboard
curl https://YOUR_PROJECT.vercel.app/api/leaderboard

# POST /api/predictions
curl -X POST https://YOUR_PROJECT.vercel.app/api/predictions \
  -H "Content-Type: application/json" \
  -d '{"player_name":"Kārlis","predictions":[]}'

# GET /api/cron/update-scores (ar secret)
curl https://YOUR_PROJECT.vercel.app/api/cron/update-scores \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

- [ ] GET /api/matches grāvējas
- [ ] GET /api/leaderboard grāvējas
- [ ] POST /api/predictions strādā
- [ ] GET /api/cron/update-scores grāvējas ar pareizu secret

---

## 8️⃣ Google Sheets datu pārbaudīšana

### Lapās "Prognozes" un "Kopvertejums"

1. Atvērt Google Sheet "EIDU Totalizators"
2. Iesniedz prognozes caur https://YOUR_PROJECT.vercel.app
3. Pārbaudī Google Sheet:
   - [ ] Jauni rindas "Prognozes" lapā
   - [ ] "Kopvertejums" lapā atjauninājušie punkti
   - [ ] `total_points` aprēķins pareizs

---

## 9️⃣ Cron Jobs pārbaude (Vercel)

### Lai pārbaudītu, vai Cron darbojas

1. Vercel Dashboard → tavs projekts
2. **Settings** → **Cron Jobs**
3. Jāredz: `GET /api/cron/update-scores` (schedule: `0 */4 * * *`)

- [ ] Cron Job reģistrēts Vercel
- [ ] Schedule ir pareizs
- [ ] Log parāda senu run laikus (pēc 4 stundām)

---

## 🔟 Fināla pārbaude

### Drošības pārbaude

```bash
# Pārbaudī, vai .env.local nav tur
git ls-files | grep -i env.local
# (jāatgriež tukši!)

# Pārbaudī, vai .env.local.example ir
git ls-files | grep .env.local.example
# (jāatgriež: .env.local.example)
```

- [ ] `.env.local` nav Git'ā
- [ ] `.env.local.example` IR Git'ā
- [ ] Private key nav public repozitorijā
- [ ] CRON_SECRET nav public commit message'ā

### Dokumentācija

- [ ] README.md ir
- [ ] SETUP.md ir
- [ ] QUICK_START.md ir
- [ ] .gitignore ir

### Finālais checklists

- [ ] Web app strādā uz localhost
- [ ] Web app strādā uz Vercel
- [ ] Google Sheet saņem datus
- [ ] Leaderboard atjauninās
- [ ] Cron Job ir reģistrēts Vercel
- [ ] Visi API darbojās
- [ ] Dokumentācija ir
- [ ] Git repo ir publis/drošs

---

## 🎉 GATAVS!

Ja viss ir ✅, tad:

1. Dalies ar ģimeni: **https://YOUR_PROJECT.vercel.app**
2. Izņēmis rezultāts Pasaules hokeja čempionātā
3. Sākies totalizators!

🏒🏆

---

## 🚨 Ātrajos gadījumā kaut kas salūzis:

| Kļūda | Risinājums |
|------|-----------|
| "GOOGLE_SHEET_ID nav nosūtīts" | Vercel Settings → skatīt GOOGLE_SHEET_ID vērtību |
| "Prognozes nesaglabājas" | Google Sheet → Share settings → Service Account email ir tu? |
| "401 Unauthorized Cron" | Pārbaudī CRON_SECRET Vercel atbilst .env.local |
| "Build fails" | Vercel Logs → skatīt kļūdu → TypeScript/svarbi |
| "API returns 500" | Vercel Runtime Logs → skatīt kļūdu |

---

**Veiksmi ar deploJS! 🚀**
