/**
 * EIDU ģimenes hokeja totalizatora punktu aprēķina loģika
 *
 * Noteikumi:
 * - 3 punkti: precīzs gala rezultāts (H-A rezultāts sakrīt)
 * - 2 punkti: uzminēts uzvarētājs UN kādai komandai precīzs golu skaits
 * - 1 punkts: tikai uzvarētājs VAI vienas komandas precīzs golu skaits
 */

interface PredictionResult {
  predictedHome: number;
  predictedAway: number;
  actualHome: number;
  actualAway: number;
}

/**
 * Nosaka uzvārētāju: 1 = mājās, 2 = viesi, 0 = neizšķirts
 */
function getWinner(home: number, away: number): 0 | 1 | 2 {
  if (home > away) return 1;
  if (away > home) return 2;
  return 0;
}

/**
 * Aprēķina punktus par vienu prognozi
 */
export function calculatePoints(prediction: PredictionResult): number {
  const { predictedHome, predictedAway, actualHome, actualAway } = prediction;

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

  // Nav punktu
  return 0;
}

/**
 * Aprēķina kopējos punktus no vairākām prognozēm
 */
export function calculateTotalPoints(predictions: PredictionResult[]): {
  points_3: number;
  points_2: number;
  points_1: number;
  total_points: number;
} {
  let points_3 = 0;
  let points_2 = 0;
  let points_1 = 0;

  predictions.forEach((pred) => {
    const points = calculatePoints(pred);
    if (points === 3) points_3++;
    else if (points === 2) points_2++;
    else if (points === 1) points_1++;
  });

  return {
    points_3,
    points_2,
    points_1,
    total_points: points_3 * 3 + points_2 * 2 + points_1 * 1,
  };
}

/**
 * Pārbauda, vai prognozi vēl var iesniest (1 stunda pirms spēles)
 */
export function canSubmitPrediction(matchDateTimeISO: string): boolean {
  const matchTime = new Date(matchDateTimeISO);
  const now = new Date();
  const oneHourBefore = new Date(matchTime.getTime() - 60 * 60 * 1000);
  return now < oneHourBefore;
}
