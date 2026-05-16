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

  useEffect(() => {
    fetchMatches();
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    // Load existing predictions when player changes
    loadPlayerPredictions(selectedPlayer);
  }, [selectedPlayer]);

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

  const getMatchTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('lv-LV', { hour: '2-digit', minute: '2-digit' });
  };

  const getMatchDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('lv-LV', { month: '2-digit', day: '2-digit' });
  };

  if (loading) {
    return <div className="p-8 text-center">Ielādē...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-4">
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
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 relative z-10"
              >
                {PLAYERS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Matches */}
            <div className="space-y-4">
              {Array.isArray(matches) && matches.length > 0 ? (
                matches.map((match) => (
                  <div key={match.match_id} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{COUNTRY_FLAGS[match.home_team] || '🏒'}</span>
                        <div className="flex flex-col">
                          <span className="font-bold text-lg">{match.home_team}</span>
                        </div>
                        <span className="text-gray-500 mx-2">—</span>
                        <div className="flex flex-col">
                          <span className="font-bold text-lg">{match.away_team}</span>
                        </div>
                        <span className="text-3xl">{COUNTRY_FLAGS[match.away_team] || '🏒'}</span>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <div className="font-semibold">{getMatchDate(match.date_time)}</div>
                        <div>{getMatchTime(match.date_time)}</div>
                      </div>
                    </div>

                    {!canSubmit(match) && (
                      <div className="text-xs text-red-600 mb-2">⏰ Laiks prognozēšanai ir beidzies</div>
                    )}

                    <div className="flex gap-3">
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
                        placeholder="Mājas"
                        className="w-16 p-2 border-2 border-gray-300 rounded text-center disabled:bg-gray-100"
                      />
                      <span className="flex items-center text-gray-700 font-bold">:</span>
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
                        placeholder="Viesi"
                        className="w-16 p-2 border-2 border-gray-300 rounded text-center disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  ⚠️ Nevar ielādēt spēles. Pārliecinieties, ka Google Sheets ir pareizi konfigurēts.
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitPredictions}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
            >
              ✅ Iesniegt prognozes
            </button>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="space-y-2 p-4">
              <div className="grid grid-cols-5 gap-4 font-bold bg-blue-600 text-white p-4 rounded-lg">
                <div className="text-left">Spēlētājs</div>
                <div className="text-center">3 p.</div>
                <div className="text-center">2 p.</div>
                <div className="text-center">1 p.</div>
                <div className="text-center">Kopā</div>
              </div>
              {Array.isArray(leaderboard) && leaderboard.length > 0 ? (
                leaderboard.map((entry, idx) => (
                  <div key={entry.player_name}>
                    <div
                      className="grid grid-cols-5 gap-4 p-4 border-b hover:bg-blue-50 cursor-pointer rounded"
                      onClick={() => {
                        setExpandedPlayer(expandedPlayer === entry.player_name ? null : entry.player_name);
                        if (expandedPlayer !== entry.player_name) {
                          fetchPlayerHistory(entry.player_name);
                        }
                      }}
                    >
                      <div className="font-semibold">
                        {idx + 1}. {entry.player_name}
                      </div>
                      <div className="text-center">{entry.points_3}</div>
                      <div className="text-center">{entry.points_2}</div>
                      <div className="text-center">{entry.points_1}</div>
                      <div className="text-center font-bold text-blue-600">
                        {entry.total_points}
                      </div>
                    </div>
                    {expandedPlayer === entry.player_name && (
                      <div className="bg-gray-50 p-4 rounded ml-4 mr-4 mb-2">
                        <div className="text-sm space-y-2">
                          {Array.isArray(playerHistory) && playerHistory.length > 0 ? (
                            playerHistory.map((hist, i) => (
                              <div key={i} className="flex justify-between text-gray-700">
                                <span>
                                  {COUNTRY_FLAGS[hist.home_team] || '🏒'} {hist.home_team} —{' '}
                                  {COUNTRY_FLAGS[hist.away_team] || '🏒'} {hist.away_team}
                                </span>
                                <span>
                                  {hist.predicted_home}:{hist.predicted_away} → {hist.home_score}:
                                  {hist.away_score} = <strong>{hist.points}p</strong>
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="text-gray-400">Nav prognožu datu</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  ⚠️ Nevar ielādēt kopvērtējumu. Pārliecinieties, ka Google Sheets ir pareizi konfigurēts.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
