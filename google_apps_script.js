// Google Apps Script for EIDU Hokeja Totalizators
// Paste this into Google Sheets: Extensions > Apps Script

const SHEET_ID = '12eLYPMMbvv1ecEzt-AgP1UNU-U4jnQ1jerOzppOcGbs';
const PLAYERS = ['Kārlis', 'Inga', 'Aivis', 'Dace', 'Jānis D.', 'Jānis S.', 'Andris', 'Elīna'];

/**
 * Calculate points for a prediction vs actual score
 * 3 points: exact score match
 * 2 points: correct winner + one correct score
 * 1 point: correct winner OR one correct score
 * 0 points: wrong
 */
function calculatePoints(predHome, predAway, actualHome, actualAway) {
  // Exact match
  if (predHome === actualHome && predAway === actualAway) {
    return 3;
  }

  // Determine winners
  const predWinner = predHome > predAway ? 1 : predAway > predHome ? 2 : 0;
  const actualWinner = actualHome > actualAway ? 1 : actualAway > actualHome ? 2 : 0;

  const homeCorrect = predHome === actualHome;
  const awayCorrect = predAway === actualAway;
  const winnerCorrect = predWinner === actualWinner && predWinner !== 0;

  // 2 points: correct winner + one correct score
  if (winnerCorrect && (homeCorrect || awayCorrect)) {
    return 2;
  }

  // 1 point: correct winner OR one correct score
  if (winnerCorrect || homeCorrect || awayCorrect) {
    return 1;
  }

  return 0;
}

/**
 * Update Kopvertejums sheet with calculated points
 */
function updateLeaderboard() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const spelesSheet = ss.getSheetByName('Speles');
  const prognosesSheet = ss.getSheetByName('Prognozes');
  const kopvertejumsSheet = ss.getSheetByName('Kopvertejums');

  // Get all data
  const spelesData = spelesSheet.getRange('A2:G1000').getValues();
  const prognosesData = prognosesSheet.getRange('A2:F1000').getValues();

  // Build match map: match_id -> {home_team, away_team, home_score, away_score}
  const matches = {};
  const matchIds = [];
  spelesData.forEach((row) => {
    if (row[0]) { // if match_id exists
      const matchId = row[0];
      matches[matchId] = {
        home_team: row[2] || '?',
        away_team: row[3] || '?',
        home_score: parseInt(row[4]) || 0,
        away_score: parseInt(row[5]) || 0,
      };
      matchIds.push(parseInt(matchId));
    }
  });

  // Sort match IDs to maintain order
  matchIds.sort((a, b) => a - b);

  // Calculate points for each player
  const playerPoints = {};
  PLAYERS.forEach((player) => {
    playerPoints[player] = {};
    matchIds.forEach((matchId) => {
      playerPoints[player][matchId] = 0;
    });
  });

  // Process predictions
  prognosesData.forEach((row) => {
    const playerId = row[1]; // player_name
    const matchId = row[2]; // match_id
    const predHome = parseInt(row[3]) || 0;
    const predAway = parseInt(row[4]) || 0;

    if (playerId && matchId && matches[matchId]) {
      const match = matches[matchId];
      const points = calculatePoints(predHome, predAway, match.home_score, match.away_score);
      playerPoints[playerId][matchId] = points;
    }
  });

  // Build headers with actual match names (HOME-AWAY)
  const headers = ['Spēlētājs'];
  matchIds.forEach((matchId) => {
    const match = matches[matchId];
    headers.push(`${match.home_team}-${match.away_team}`);
  });
  headers.push('Kopā', '3p', '2p', '1p');

  // Clear existing data
  kopvertejumsSheet.clearContents();

  // Write headers
  kopvertejumsSheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Write player data
  let rowNum = 2;
  PLAYERS.forEach((player) => {
    const row = [player];

    // Match points in order
    matchIds.forEach((matchId) => {
      row.push(playerPoints[player][matchId] || 0);
    });

    // Calculate totals
    const totalPoints = Object.values(playerPoints[player]).reduce((a, b) => a + b, 0);
    const points3 = Object.values(playerPoints[player]).filter(p => p === 3).length;
    const points2 = Object.values(playerPoints[player]).filter(p => p === 2).length;
    const points1 = Object.values(playerPoints[player]).filter(p => p === 1).length;

    row.push(totalPoints); // Total column
    row.push(points3);     // 3p count
    row.push(points2);     // 2p count
    row.push(points1);     // 1p count

    kopvertejumsSheet.getRange(rowNum, 1, 1, row.length).setValues([row]);
    rowNum++;
  });

  // Format headers
  const headerRange = kopvertejumsSheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#1e40af');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  headerRange.setFontSize(10);

  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    kopvertejumsSheet.autoResizeColumn(i);
  }

  Logger.log('✅ Leaderboard updated successfully with ' + matchIds.length + ' matches');
}

/**
 * Export Kopvertejums to Excel format
 */
function exportToExcel() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const kopvertejumsSheet = ss.getSheetByName('Kopvertejums');

  // Get all data
  const data = kopvertejumsSheet.getDataRange().getValues();

  // Create new spreadsheet
  const excelFile = SpreadsheetApp.create('EIDU Hokeja Totalizators - Rezultāti');
  const excelSheet = excelFile.getActiveSheet();
  excelSheet.setName('Rezultāti');

  // Paste data
  excelSheet.getRange(1, 1, data.length, data[0].length).setValues(data);

  // Format header row
  const headerRange = excelSheet.getRange(1, 1, 1, data[0].length);
  headerRange.setBackground('#1e40af');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');

  // Auto-resize columns
  for (let i = 1; i <= data[0].length; i++) {
    excelSheet.autoResizeColumn(i);
  }

  Logger.log('✅ Excel exported: ' + excelFile.getUrl());
  return excelFile.getUrl();
}

/**
 * Trigger: Run when Speles sheet changes
 */
function onEditSpeles(e) {
  const range = e.range;
  const sheet = range.getSheet();

  // Only trigger if Speles sheet is edited
  if (sheet.getName() !== 'Speles') return;

  // Only trigger if score columns (E or F) are edited
  if (range.getColumn() === 5 || range.getColumn() === 6) {
    Logger.log('Score updated, recalculating leaderboard...');
    updateLeaderboard();
    // Optionally export to Excel (comment out if too slow)
    // exportToExcel();
  }
}

/**
 * Manual trigger for testing
 */
function recalculateLeaderboard() {
  updateLeaderboard();
}

/**
 * Setup trigger (run once)
 */
function setupTrigger() {
  const triggers = ScriptApp.getProjectTriggers();

  // Remove existing triggers
  triggers.forEach((trigger) => {
    if (trigger.getHandlerFunction() === 'onEditSpeles') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Create new trigger
  ScriptApp.newTrigger('onEditSpeles')
    .forSpreadsheet(SHEET_ID)
    .onEdit()
    .create();

  Logger.log('✅ Trigger setup complete');
}
