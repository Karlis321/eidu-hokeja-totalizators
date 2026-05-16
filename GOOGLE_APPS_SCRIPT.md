# 📜 GOOGLE APPS SCRIPT — AUTOMĀTISKS LEADERBOARD

Nokopējams kods, ko ievietot Google Sheets App Script redaktorā.

---

## 🚀 KĀ IESTĀDĪT

### Solis 1: Atvērt Apps Script redaktoru

1. Atvērt jūsu "EIDU Totalizators" Google Sheet
2. Noklikšķini **"Paplašinājumi"** (Extensions) augšējā izvēlnē
3. Noklikšķini **"Apps Script"**
4. Jauns redaktors tiks atvērts

### Solis 2: Dzēst default kodu

Redaktorā redz `myFunction() { ... }` — **dzēs to pilnībā**

### Solis 3: Kopēt-ielīmēt kodu

Kopēj kodu no tālāk ↓ un ielīmē Apps Script redaktorā.

### Solis 4: Saglabāt un aktivizēt

1. Nospied **Ctrl+S** (Save)
2. Nospied **"Palaist"** (Run) — izsauks `onOpen()`
3. Google ļūgs atļaujas — noklikšķini "Allow"

### Solis 5: Atsvaidzināt Sheets

Atvērt savu Google Sheet — redzēsi jaunu menu "Totalizators"!

---

## 💻 KODS — NOKOPĒT ŠO PILNĪBĀ

```javascript
/**
 * EIDU HOKEJA TOTALIZATORS — GOOGLE APPS SCRIPT
 * Automātisks leaderboard atjaunināšana
 * 
 * Funkcijas:
 * - onOpen() — Pievienot menu
 * - recalculateLeaderboard() — Pārrēķināt punktus
 * - calculatePoints() — Punktu formula
 */

// ===== MAIN MENU =====

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🏒 Totalizators')
    .addItem('📊 Pārrēķināt leaderboard', 'recalculateLeaderboard')
    .addItem('✅ Pārbaude', 'checkDataIntegrity')
    .addToUi();
}

// ===== PĀRRĒĶINĀT LEADERBOARD =====

function recalculateLeaderboard() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Iegūt lapas
    const spelesSheet = ss.getSheetByName('Speles');
    const prognozesSheet = ss.getSheetByName('Prognozes');
    const kopvertejumsSheet = ss.getSheetByName('Kopvertejums');
    
    if (!spelesSheet || !prognozesSheet || !kopvertejumsSheet) {
      throw new Error('Lapas "Speles", "Prognozes" vai "Kopvertejums" nav atrastas!');
    }
    
    // Iegūt datus
    const spelesData = spelesSheet.getRange('A2:G' + spelesSheet.getLastRow()).getValues();
    const prognozesData = prognozesSheet.getRange('A2:F' + prognozesSheet.getLastRow()).getValues();
    
    // Parsēt spēles
    const matchesMap = {};
    spelesData.forEach((row) => {
      if (row[0]) { // match_id
        matchesMap[row[0]] = {
          home_score: row[4],
          away_score: row[5],
          status: row[6]
        };
      }
    });
    
    // Parsēt prognozes un aprēķināt punktus
    const playerScores = {};
    
    prognozesData.forEach((row) => {
      const playerName = row[1]; // player_name
      const matchId = row[2]; // match_id
      const predictedHome = row[3]; // predicted_home
      const predictedAway = row[4]; // predicted_away
      
      if (!playerName || !matchId) return;
      
      const match = matchesMap[matchId];
      if (!match || match.status !== 'finished') {
        return; // Tikai pabeigtas spēles
      }
      
      const actualHome = match.home_score;
      const actualAway = match.away_score;
      
      const points = calculatePoints(predictedHome, predictedAway, actualHome, actualAway);
      
      if (!playerScores[playerName]) {
        playerScores[playerName] = {
          points_3: 0,
          points_2: 0,
          points_1: 0
        };
      }
      
      if (points === 3) playerScores[playerName].points_3++;
      else if (points === 2) playerScores[playerName].points_2++;
      else if (points === 1) playerScores[playerName].points_1++;
    });
    
    // Atjaunināt Kopvertejums lapu
    const leaderboardData = [];
    
    Object.entries(playerScores).forEach(([name, scores]) => {
      const total = scores.points_3 * 3 + scores.points_2 * 2 + scores.points_1 * 1;
      leaderboardData.push([
        name,
        scores.points_3,
        scores.points_2,
        scores.points_1,
        total
      ]);
    });
    
    // Sakārtot pēc total_points (dilstošs)
    leaderboardData.sort((a, b) => b[4] - a[4]);
    
    // Notīrīt esošo leaderboard (atstāt tikai virsrakstu)
    const lastRow = kopvertejumsSheet.getLastRow();
    if (lastRow > 1) {
      kopvertejumsSheet.deleteRows(2, lastRow - 1);
    }
    
    // Ievietot jaunus datus
    if (leaderboardData.length > 0) {
      kopvertejumsSheet.getRange(2, 1, leaderboardData.length, 5).setValues(leaderboardData);
    }
    
    // Ziņojums
    SpreadsheetApp.getUi().alert(
      '✅ Leaderboard atjaunināts!\n\n' +
      'Spēlētāji: ' + leaderboardData.length + '\n' +
      'Aprēķinātie punkti: ✓'
    );
    
  } catch (error) {
    SpreadsheetApp.getUi().alert('❌ Kļūda: ' + error.message);
    console.error(error);
  }
}

// ===== PUNKTU APRĒĶINS =====

function calculatePoints(predictedHome, predictedAway, actualHome, actualAway) {
  const predictedWinner = getWinner(predictedHome, predictedAway);
  const actualWinner = getWinner(actualHome, actualAway);
  
  // 3 punkti — precīzs rezultāts
  if (predictedHome === actualHome && predictedAway === actualAway) {
    return 3;
  }
  
  // 2 punkti — uzvarētājs + vienas komandas goli
  const homeGoalsCorrect = predictedHome === actualHome;
  const awayGoalsCorrect = predictedAway === actualAway;
  const winnerCorrect = predictedWinner === actualWinner;
  
  if (winnerCorrect && (homeGoalsCorrect || awayGoalsCorrect)) {
    return 2;
  }
  
  // 1 punkts — tikai uzvarētājs VAI tikai goli
  if (winnerCorrect || homeGoalsCorrect || awayGoalsCorrect) {
    return 1;
  }
  
  return 0;
}

function getWinner(home, away) {
  if (home > away) return 1;
  if (away > home) return 2;
  return 0;
}

// ===== PĀRBAUDE =====

function checkDataIntegrity() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    const spelesSheet = ss.getSheetByName('Speles');
    const prognozesSheet = ss.getSheetByName('Prognozes');
    const kopvertejumsSheet = ss.getSheetByName('Kopvertejums');
    
    let message = '✅ PĀRBAUDE:\n\n';
    
    // Speles
    const spelesRows = spelesSheet.getLastRow() - 1;
    message += `📋 Speles: ${spelesRows} rindas\n`;
    
    // Prognozes
    const prognozesRows = prognozesSheet.getLastRow() - 1;
    message += `📊 Prognozes: ${prognozesRows} rindas\n`;
    
    // Kopvertejums
    const kopvertejumsRows = kopvertejumsSheet.getLastRow() - 1;
    message += `🏆 Kopvertejums: ${kopvertejumsRows} rindas\n`;
    
    SpreadsheetApp.getUi().alert(message);
    
  } catch (error) {
    SpreadsheetApp.getUi().alert('❌ Kļūda: ' + error.message);
  }
}
```

---

## ✅ PĒC IEVIETOŠANAS

### Pārbaudīt vai darbojas

1. **Google Sheet redaktorā**, noklikšķini "Totalizators" menu
2. Noklikšķini **"📊 Pārrēķināt leaderboard"**
3. Atļaut atļaujas (Google ļūgs)
4. Pazīme: **"✅ Leaderboard atjaunināts!"**

### Rezultāts

Lapā "Kopvertejums" automātiski atjauninās:
- ✅ Visu spēlētāju punkti
- ✅ Sakārtoti pēc total_points (dilstošs)
- ✅ Kategorijām sadalīti punkti (3/2/1)

---

## 🔄 PĒC KATRA UPDATE

Kad jūs ieviesat jaunu prognozi vai atjauninājat spēles rezultātus:

1. Noklikšķini **"Totalizators"** menu
2. Noklikšķini **"📊 Pārrēķināt leaderboard"**
3. Leaderboard atjauninās automātiski!

---

## 📝 KODS IZSAUC

### `onOpen()`
- Pievienot "Totalizators" menu
- Tiek izsaukts automātiski, kad atverat Sheet

### `recalculateLeaderboard()`
- Nolasa Speles, Prognozes, Kopvertejums
- Parsē datus
- Aprēķina punktus katram spēlētājam
- Atjaunina Kopvertejums lapu
- Sakārto pēc punktiem

### `calculatePoints()`
- Nokļūst uz 3/2/1 punktu formulu
- Tā pati, kā Next.js `points.ts`

### `getWinner()`
- Nosaka uzvarētāju (1/2/0)

### `checkDataIntegrity()`
- Vienkārša pārbaude — cik rindu katrā lapā

---

## 🎯 ATJAUNINĀŠANAS SECĪBA (Manuāla)

```
1. Jūs ievietat jaunu prognozi lapā "Prognozes"
   ↓
2. Jūs atjauninājiet rezultātus lapā "Speles" (status → finished)
   ↓
3. Noklikšķini "Totalizators" → "Pārrēķināt leaderboard"
   ↓
4. Leaderboard automātiski atjauninās Kopvertejums lapā
   ↓
5. Next.js app ielāde GET /api/leaderboard
   ↓
6. Lietotāji redz jaunus punktus
```

---

## 🔐 DROŠĪBA

- ✅ Kods ir tikai lapā — NAV interneta
- ✅ Dati paliek Google Sheets iekšā
- ✅ Nekas netiek sūtīts ārā
- ✅ Tikai jūs varat palaist skriptu

---

## 🛠️ LABOT / MAINĪT

Ja vēlaties mainīt formulas:

1. **Apps Script redaktorā**, atrodiet `calculatePoints()` funkciju
2. Mainiet loģiku
3. Nospiediet **Ctrl+S** (Save)
4. Palaistiet `recalculateLeaderboard()` vēlreiz

---

## ❓ PROBLĒMAS

### "Lapas nav atrastas"
→ Pārbaudiet, vai lapas nosauktas pareizi: "Speles", "Prognozes", "Kopvertejums"

### "Nav atļaujas"
→ Google ļūgs atļaujas — noklikšķini "Allow"

### "Leaderboard neatjauninās"
→ Pārbaudiet, vai spēles status ir "finished"

### "Punkti neatbilst"
→ Palaistiet `checkDataIntegrity()` un pārbaudiet datus

---

## 📞 PAPILDU RESURSI

- [Google Apps Script dokumentācija](https://developers.google.com/apps-script)
- [Spreadsheet Service](https://developers.google.com/apps-script/reference/spreadsheet)
- [Debugging](https://developers.google.com/apps-script/guides/sheets/functions)

---

**Gatavs! Nokopējiet kodu un ievietojiet Apps Script redaktorā! 🚀**
