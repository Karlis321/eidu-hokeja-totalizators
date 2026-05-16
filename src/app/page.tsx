'use client';

import { useState, useEffect } from 'react';

interface Match {
  match_id: string;
  date_time: string;
  home_team: string;
  away_team: string;
  home_score: string;
  away_score: string;
  status: string;
}

interface LeaderboardEntry {
  player_name: string;
  points_3: number;
  points_2: number;
  points_1: number;
  total_points: number;
}

interface MatchResult {
  name: string; // "GBR-AUT", "HUN-FIN", etc.
  points: number; // 0, 1, 2, or 3
}

interface DetailedLeaderboardEntry extends LeaderboardEntry {
  match_points: MatchResult[]; // [{name: "GBR-AUT", points: 3}, ...]
}

interface PlayerHistory {
  match_id: string;
  home_team: string;
  away_team: string;
  predicted_home: number;
  predicted_away: number;
  home_score: string;
  away_score: string;
  points: number;
}

const PLAYERS = ['Kārlis', 'Inga', 'Aivis', 'Dace', 'Jānis D.', 'Jānis S.', 'Andris', 'Elīna'];

const COUNTRY_FLAGS: { [key: string]: string } = {
  AUT: '🇦🇹', // Austria
  BLR: '🇧🇾', // Belarus
  CAN: '🇨🇦', // Canada
  CZE: '🇨🇿', // Czechia
  DEN: '🇩🇰', // Denmark
  FIN: '🇫🇮', // Finland
  FRA: '🇫🇷', // France
  GER: '🇩🇪', // Germany
  GBR: '🇬🇧', // Great Britain
  HUN: '🇭🇺', // Hungary
  ITA: '🇮🇹', // Italy
  JPN: '🇯🇵', // Japan
  KAZ: '🇰🇿', // Kazakhstan
  LAT: '🇱🇻', // Latvia
  NOR: '🇳🇴', // Norway
  ROU: '🇷🇴', // Romania
  SVK: '🇸🇰', // Slovakia
  SLO: '🇸🇮', // Slovenia
  SWE: '🇸🇪', // Sweden
  SUI: '🇨🇭', // Switzerland
  USA: '🇺🇸', // USA
};

// Generate all dates from May 15 to May 31, 2026
const generateChampionshipDates = () => {
  const dates = [];
  for (let day = 15; day <= 31; day++) {
    dates.push(new Date(2026, 4, day)); // May = month 4 (0-indexed)
  }
  return dates;
};

const CHAMPIONSHIP_DATES = generateChampionshipDates();

export default function Home() {
  const [activeTab, setActiveTab] = useState<'predictions' | 'leaderboard'>('predictions');
  const [selectedPlayer, setSelectedPlayer] = useState(PLAYERS[0]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [predictions, setPredictions] = useState<{ [key: string]: { home: string; away: string } }>({});
  const [message, setMessage] = useState('');
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);
  const [playerHistory, setPlayerHistory] = useState<PlayerHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(''); // YYYY-MM-DD format
  const [detailedLeaderboard, setDetailedLeaderboard] = useState<DetailedLeaderboardEntry[]>([]);

  useEffect(() => {
    fetchMatches();
    fetchLeaderboard();
    fetchDetailedLeaderboard();
    // Set initial date to today
    const today = new Date();
    setSelectedDate(formatDateISO(today));
  }, []);

  useEffect(() => {
    // Load existing predictions when player changes
    if (matches.length > 0) {
      loadPlayerPredictions(selectedPlayer);
    }
  }, [selectedPlayer, matches]);

  const fetchMatches = async () => {
    try {
      const res = await fetch('/api/matches');
      if (!res.ok) {
        setMessage('❌ Kļūda ielādējot spēles (nav piekļuves datubāzei)');
        setMatches([]);
        return;
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        setMessage('❌ Kļūda: neparedzēts datu formāts');
        setMatches([]);
        return;
      }
      setMatches(data);
      setPredictions(
        data.reduce((acc: any, m: Match) => {
          acc[m.match_id] = { home: '', away: '' };
          return acc;
        }, {})
      );
      // Set default selected date to today
      const today = new Date();
      setSelectedDate(formatDateISO(today));
    } catch (error) {
      setMessage('❌ Kļūda ielādējot spēles');
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      if (!res.ok) {
        console.error('Leaderboard fetch failed:', res.status);
        setLeaderboard([]);
        return;
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        setLeaderboard([]);
        return;
      }
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLeaderboard([]);
    }
  };

  const fetchDetailedLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard-detailed');
      if (!res.ok) {
        console.error('Detailed leaderboard fetch failed:', res.status);
        setDetailedLeaderboard([]);
        return;
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        setDetailedLeaderboard([]);
        return;
      }
      setDetailedLeaderboard(data);
    } catch (error) {
      console.error('Error fetching detailed leaderboard:', error);
      setDetailedLeaderboard([]);
    }
  };

  const fetchPlayerHistory = async (playerName: string) => {
    try {
      const res = await fetch(`/api/player-history?player=${encodeURIComponent(playerName)}`);
      if (!res.ok) {
        setPlayerHistory([]);
        return;
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        setPlayerHistory([]);
        return;
      }
      setPlayerHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
      setPlayerHistory([]);
    }
  };

  const loadPlayerPredictions = async (playerName: string) => {
    try {
      const res = await fetch(`/api/player-history?player=${encodeURIComponent(playerName)}`);
      if (!res.ok) {
        // Reset predictions if player has none
        setPredictions(
          matches.reduce((acc: any, m: Match) => {
            acc[m.match_id] = { home: '', away: '' };
            return acc;
          }, {})
        );
        return;
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        return;
      }

      // Load existing predictions for this player
      const playerPreds: { [key: string]: { home: string; away: string } } = {};
      matches.forEach((m: Match) => {
        playerPreds[m.match_id] = { home: '', away: '' };
      });

      data.forEach((hist: PlayerHistory) => {
        playerPreds[hist.match_id] = {
          home: String(hist.predicted_home),
          away: String(hist.predicted_away),
        };
      });

      setPredictions(playerPreds);
    } catch (error) {
      console.error('Error loading player predictions:', error);
    }
  };

  const handleSubmitPredictions = async () => {
    if (!selectedPlayer) {
      setMessage('❌ Izvēlieties spēlētāju');
      return;
    }

    const filledPredictions = Object.entries(predictions).filter(([_, pred]) => pred.home && pred.away);
    if (filledPredictions.length === 0) {
      setMessage('❌ Ievadiet vismaz vienu prognozi');
      return;
    }

    try {
      for (const [matchId, pred] of filledPredictions) {
        await fetch('/api/predictions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            player_name: selectedPlayer,
            match_id: matchId,
            predicted_home: parseInt(pred.home),
            predicted_away: parseInt(pred.away),
          }),
        });
      }

      setMessage('✅ Prognozes saglabātas!');
      setPredictions(
        matches.reduce((acc: any, m: Match) => {
          acc[m.match_id] = { home: '', away: '' };
          return acc;
        }, {})
      );
      setTimeout(() => setMessage(''), 3000);
      fetchLeaderboard();
    } catch (error) {
      setMessage('❌ Kļūda saglabājot prognozes');
    }
  };


  const canSubmit = (match: Match) => {
    const now = new Date();
    const matchTime = new Date(match.date_time);
    const hoursBefore = (matchTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursBefore >= 1;
  };

  const formatDateISO = (date: Date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const getMatchDate = (dateTime: string) => {
    const date = new Date(dateTime);
    return formatDateISO(date);
  };

  const getMatchTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('lv-LV', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString('lv-LV', { month: 'short', day: 'numeric' });
  };

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString('lv-LV', { weekday: 'short', month: '2-digit', day: '2-digit' });
  };

  // Filter matches by selected date
  const filteredMatches = selectedDate
    ? matches.filter((match) => getMatchDate(match.date_time) === selectedDate)
    : [];

  if (loading) {
    return <div className="p-8 text-center">Ielādē...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-5xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-8 mt-4">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">🏒 EIDU Hokeja Totalizators</h1>
          <p className="text-gray-600">Ģimenes hokeja prognožu spēle</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('predictions')}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              activeTab === 'predictions'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            ⚽ Iesniegt prognozes
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              activeTab === 'leaderboard'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🏆 Kopvērtējums
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-4 p-4 rounded-lg bg-blue-100 text-blue-900 text-center font-semibold">
            {message}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'predictions' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Player Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Spēlētājs:</label>
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              >
                {PLAYERS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-3">Spēļu datums:</label>
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-2 min-w-max">
                  {CHAMPIONSHIP_DATES.map((date) => {
                    const dateISO = formatDateISO(date);
                    const isSelected = selectedDate === dateISO;
                    const hasGames = matches.some((m) => getMatchDate(m.date_time) === dateISO);

                    return (
                      <button
                        key={dateISO}
                        onClick={() => setSelectedDate(dateISO)}
                        disabled={!hasGames}
                        className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : hasGames
                            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {formatDateDisplay(date)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Matches for Selected Date */}
            <div className="space-y-4">
              {selectedDate && filteredMatches.length > 0 ? (
                <>
                  <div className="text-lg font-semibold text-gray-700 mb-4">
                    Spēles {formatFullDate(new Date(selectedDate))}
                  </div>
                  {filteredMatches.map((match) => (
                    <div key={match.match_id} className="border-2 border-gray-200 rounded-lg p-4">
                      {/* Match Header with Flags and Teams */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {/* Home Team */}
                          <div className="flex flex-col items-center">
                            <span className="text-4xl mb-1">{COUNTRY_FLAGS[match.home_team] || '🏒'}</span>
                            <span className="font-bold text-base">{match.home_team}</span>
                          </div>

                          {/* VS */}
                          <div className="text-gray-400 font-bold mx-2">VS</div>

                          {/* Away Team */}
                          <div className="flex flex-col items-center">
                            <span className="text-4xl mb-1">{COUNTRY_FLAGS[match.away_team] || '🏒'}</span>
                            <span className="font-bold text-base">{match.away_team}</span>
                          </div>
                        </div>

                        {/* Time */}
                        <div className="text-right text-sm text-gray-600">
                          <div className="font-semibold text-base">{getMatchTime(match.date_time)}</div>
                        </div>
                      </div>

                      {/* Submission Status */}
                      {!canSubmit(match) && (
                        <div className="text-xs text-red-600 mb-3">⏰ Laiks prognozēšanai ir beidzies</div>
                      )}

                      {/* Score Input */}
                      <div className="flex items-center gap-3 justify-center">
                        <input
                          type="number"
                          min="0"
                          disabled={!canSubmit(match) || match.status !== 'upcoming'}
                          value={predictions[match.match_id]?.home || ''}
                          onChange={(e) =>
                            setPredictions({
                              ...predictions,
                              [match.match_id]: { ...predictions[match.match_id], home: e.target.value },
                            })
                          }
                          placeholder="0"
                          className="w-20 p-3 border-2 border-gray-300 rounded text-center text-lg font-bold disabled:bg-gray-100"
                        />
                        <span className="text-gray-700 font-bold text-2xl">:</span>
                        <input
                          type="number"
                          min="0"
                          disabled={!canSubmit(match) || match.status !== 'upcoming'}
                          value={predictions[match.match_id]?.away || ''}
                          onChange={(e) =>
                            setPredictions({
                              ...predictions,
                              [match.match_id]: { ...predictions[match.match_id], away: e.target.value },
                            })
                          }
                          placeholder="0"
                          className="w-20 p-3 border-2 border-gray-300 rounded text-center text-lg font-bold disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                  ))}
                </>
              ) : selectedDate ? (
                <div className="text-center text-gray-500 py-8">
                  {formatFullDate(new Date(selectedDate))} nav spēļu
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Izvēlieties datumu, lai redzētu spēles
                </div>
              )}
            </div>

            {/* Submit Button */}
            {filteredMatches.length > 0 && (
              <button
                onClick={handleSubmitPredictions}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
              >
                ✅ Iesniegt prognozes
              </button>
            )}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            {/* Bar Chart */}
            {Array.isArray(detailedLeaderboard) && detailedLeaderboard.length > 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Kopējie punkti</h2>
                <div className="space-y-4">
                  {detailedLeaderboard.map((entry, idx) => {
                    const maxPoints = Math.max(...detailedLeaderboard.map(e => e.total_points));
                    const percentage = maxPoints > 0 ? (entry.total_points / maxPoints) * 100 : 0;

                    return (
                      <div key={entry.player_name}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-700 min-w-24">
                            {idx + 1}. {entry.player_name}
                          </span>
                          <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-600">
                              <span className="text-green-600 font-semibold">{entry.points_3}</span>
                              <span className="text-gray-400 mx-1">×3</span>
                              <span className="text-blue-600 font-semibold">{entry.points_2}</span>
                              <span className="text-gray-400 mx-1">×2</span>
                              <span className="text-yellow-600 font-semibold">{entry.points_1}</span>
                              <span className="text-gray-400 mx-1">×1</span>
                            </div>
                            <span className="font-bold text-lg text-blue-600 min-w-12 text-right">
                              {entry.total_points}p
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-400 to-blue-600 h-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Summary Table with Expandable Details */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">🏆 Izvērstais rezultāts</h2>

                {Array.isArray(detailedLeaderboard) && detailedLeaderboard.length > 0 ? (
                  <div className="space-y-2">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-2 bg-blue-600 text-white p-4 rounded-lg font-bold text-sm">
                      <div className="col-span-4">Spēlētājs</div>
                      <div className="col-span-3 text-center">Statistika</div>
                      <div className="col-span-2 text-center">Kopā</div>
                      <div className="col-span-3 text-center">Detaļas</div>
                    </div>

                    {/* Player Rows */}
                    {detailedLeaderboard.map((entry, idx) => (
                      <div key={entry.player_name}>
                        {/* Summary Row */}
                        <div
                          onClick={() => {
                            setExpandedPlayer(expandedPlayer === entry.player_name ? null : entry.player_name);
                          }}
                          className="grid grid-cols-12 gap-2 p-4 border-b hover:bg-blue-50 cursor-pointer rounded transition items-center"
                        >
                          <div className="col-span-4 font-semibold text-gray-800">
                            {idx + 1}. {entry.player_name}
                          </div>
                          <div className="col-span-3 text-center text-sm text-gray-600">
                            <span className="text-green-600 font-semibold">{entry.points_3}</span>
                            <span className="mx-1">·</span>
                            <span className="text-blue-600 font-semibold">{entry.points_2}</span>
                            <span className="mx-1">·</span>
                            <span className="text-yellow-600 font-semibold">{entry.points_1}</span>
                          </div>
                          <div className="col-span-2 text-center font-bold text-lg text-blue-600">
                            {entry.total_points}
                          </div>
                          <div className="col-span-3 text-center text-blue-600">
                            {expandedPlayer === entry.player_name ? '▼ Aizvērt' : '▶ Atvērt'}
                          </div>
                        </div>

                        {/* Expandable Details */}
                        {expandedPlayer === entry.player_name && (
                          <div className="bg-gray-50 p-4 m-2 rounded border-l-4 border-blue-400">
                            <h3 className="font-semibold text-gray-700 mb-3">Rezultāts pa spēlēm:</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                              {entry.match_points.map((match, matchIdx) => (
                                <div
                                  key={matchIdx}
                                  className={`p-3 rounded text-center font-bold text-white transition ${
                                    match.points === 3
                                      ? 'bg-green-500'
                                      : match.points === 2
                                      ? 'bg-blue-500'
                                      : match.points === 1
                                      ? 'bg-yellow-500'
                                      : 'bg-gray-400'
                                  }`}
                                >
                                  <div className="text-xs opacity-80 truncate">{match.name}</div>
                                  <div className="text-2xl">{match.points}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    ⚠️ Nevar ielādēt kopvērtējumu. Pārliecinieties, ka Google Sheets ir pareizi konfigurēts.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
