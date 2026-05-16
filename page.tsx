'use client';

import React, { useState, useEffect } from 'react';
import { canSubmitPrediction } from '@/utils/points';

interface Spele {
  match_id: string;
  date_time: string;
  home_team: string;
  away_team: string;
  home_score?: number;
  away_score?: number;
  status: 'upcoming' | 'finished';
}

interface Prognose {
  prediction_id: string;
  player_name: string;
  match_id: string;
  predicted_home: number;
  predicted_away: number;
  timestamp: string;
}

interface Speletajs {
  player_name: string;
  points_3: number;
  points_2: number;
  points_1: number;
  total_points: number;
}

const SPELETAJI = [
  'Kārlis',
  'Aivis',
  'Inga',
  'Dace',
  'Jānis D.',
  'Jānis S.',
  'Andris',
  'Elīna',
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'prognozes' | 'kopvertejums'>(
    'prognozes'
  );
  const [selectedPlayer, setSelectedPlayer] = useState<string>('Kārlis');
  const [matches, setMatches] = useState<Spele[]>([]);
  const [predictions, setPredictions] = useState<Record<string, {home: number; away: number}>>({});
  const [leaderboard, setLeaderboard] = useState<Speletajs[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);
  const [playerHistory, setPlayerHistory] = useState<
    Record<string, (Prognose & { actual?: { home: number; away: number } })[]>
  >({});

  // Ielādē spēles un datus
  useEffect(() => {
    fetchMatches();
    fetchLeaderboard();
  }, []);

  async function fetchMatches() {
    try {
      const response = await fetch('/api/matches');
      const data = await response.json();
      setMatches(data.matches || []);
    } catch (error) {
      console.error('Kļūda ielādējot spēles:', error);
    }
  }

  async function fetchLeaderboard() {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error('Kļūda ielādējot leaderboard:', error);
    }
  }

  async function fetchPlayerHistory(playerName: string) {
    try {
      const response = await fetch(`/api/player-history?player=${playerName}`);
      const data = await response.json();
      setPlayerHistory((prev) => ({
        ...prev,
        [playerName]: data.history || [],
      }));
    } catch (error) {
      console.error('Kļūda ielādējot vēsturi:', error);
    }
  }

  function handlePredictionChange(matchId: string, team: 'home' | 'away', value: string) {
    setPredictions((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team === 'home' ? 'home' : 'away']: parseInt(value) || 0,
      },
    }));
  }

  async function handleSubmit() {
    if (!selectedPlayer) {
      setMessage({ type: 'error', text: 'Lūdzu izvēlies spēlētāju!' });
      return;
    }

    const predictionsList = Object.entries(predictions).map(([matchId, { home, away }]) => ({
      match_id: matchId,
      predicted_home: home,
      predicted_away: away,
    }));

    setLoading(true);
    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_name: selectedPlayer,
          predictions: predictionsList,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Prognozes veiksmīgi saglabātas!' });
        setPredictions({});
        fetchLeaderboard();
      } else {
        const error = await response.json();
        setMessage({
          type: 'error',
          text: `Kļūda: ${error.message || 'Neizdabūties saglabāt prognozes'}`,
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Kļūda: ${error instanceof Error ? error.message : 'Nezināma kļūda'}`,
      });
    } finally {
      setLoading(false);
    }
  }

  function togglePlayerHistory(playerName: string) {
    if (expandedPlayer === playerName) {
      setExpandedPlayer(null);
    } else {
      setExpandedPlayer(playerName);
      if (!playerHistory[playerName]) {
        fetchPlayerHistory(playerName);
      }
    }
  }

  function formatDateTime(dateTimeISO: string): string {
    const date = new Date(dateTimeISO);
    return date.toLocaleString('lv-LV', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 pb-10">
      {/* Virsraksts */}
      <header className="bg-blue-600 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-center">🏒 EIDU ģimenes totalizators</h1>
        <p className="text-center text-blue-100 mt-2">Pasaules hokeja čempionāts 2026</p>
      </header>

      {/* Ziņojumi */}
      {message && (
        <div
          className={`mx-4 mt-4 p-4 rounded-lg text-white text-center ${
            message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tabulators */}
      <div className="flex gap-2 p-4 justify-center">
        <button
          onClick={() => setActiveTab('prognozes')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === 'prognozes'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-blue-600 border border-blue-300'
          }`}
        >
          Iesniegt prognozes
        </button>
        <button
          onClick={() => setActiveTab('kopvertejums')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === 'kopvertejums'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-blue-600 border border-blue-300'
          }`}
        >
          Kopvērtējums
        </button>
      </div>

      {/* SATURA SADAĻA */}
      <div className="max-w-2xl mx-auto px-4">
        {activeTab === 'prognozes' ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Spēlētāja izvēle */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Kā tevi sauc?
              </label>
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:border-blue-500"
              >
                {SPELETAJI.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Spēles */}
            <div className="space-y-6">
              {matches.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Spēles nav pieejamas. Tagad nav jaunas spēles nākamajā dienā.
                </p>
              ) : (
                matches.map((match) => {
                  const canSubmit = canSubmitPrediction(match.date_time);
                  const isFinished = match.status === 'finished';

                  return (
                    <div
                      key={match.match_id}
                      className={`border rounded-lg p-4 ${
                        isFinished ? 'bg-gray-50 border-gray-300' : 'bg-blue-50 border-blue-300'
                      }`}
                    >
                      {/* Spēles virsraksts */}
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800">
                            {match.home_team} — {match.away_team}
                          </h3>
                          <p className="text-sm text-gray-600">
                            🕒 {formatDateTime(match.date_time)}
                          </p>
                        </div>
                        {isFinished && (
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Rezultāts</p>
                            <p className="text-2xl font-bold text-gray-800">
                              {match.home_score} — {match.away_score}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Ievades lauki vai paziņojums */}
                      {!canSubmit && !isFinished ? (
                        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-3 rounded-lg text-center font-semibold">
                          ⏰ Prognožu laiks noslēdzies
                        </div>
                      ) : isFinished ? (
                        <p className="text-gray-500 text-center font-semibold">
                          Spēle ir pabeigta
                        </p>
                      ) : (
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              {match.home_team}
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={predictions[match.match_id]?.home || ''}
                              onChange={(e) =>
                                handlePredictionChange(match.match_id, 'home', e.target.value)
                              }
                              className="w-full p-2 border border-gray-300 rounded-lg text-center text-lg focus:outline-none focus:border-blue-500"
                              placeholder="0"
                            />
                          </div>
                          <div className="flex items-end pb-2">
                            <span className="text-2xl font-bold text-gray-600">—</span>
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              {match.away_team}
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={predictions[match.match_id]?.away || ''}
                              onChange={(e) =>
                                handlePredictionChange(match.match_id, 'away', e.target.value)
                              }
                              className="w-full p-2 border border-gray-300 rounded-lg text-center text-lg focus:outline-none focus:border-blue-500"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Saglabāšanas poga */}
            {matches.length > 0 && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full mt-8 py-3 rounded-lg font-bold text-white text-lg transition ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 active:scale-95'
                }`}
              >
                {loading ? '⏳ Saglabā...' : '✅ Saglabāt prognozes'}
              </button>
            )}
          </div>
        ) : (
          /* KOPVĒRTĒJUMS SKAŅA */
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {leaderboard.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Vēl nav datu</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Vieta</th>
                      <th className="px-4 py-3 text-left">Vārds</th>
                      <th className="px-4 py-3 text-center">Precīzi (3p)</th>
                      <th className="px-4 py-3 text-center">Daļēji (2p)</th>
                      <th className="px-4 py-3 text-center">Goli/uzv (1p)</th>
                      <th className="px-4 py-3 text-center font-bold">Kopā</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard
                      .sort((a, b) => b.total_points - a.total_points)
                      .map((player, index) => (
                        <React.Fragment key={player.player_name}>
                          <tr
                            onClick={() => togglePlayerHistory(player.player_name)}
                            className="border-b hover:bg-blue-50 cursor-pointer transition"
                          >
                            <td className="px-4 py-3 font-bold text-lg text-blue-600">
                              #{index + 1}
                            </td>
                            <td className="px-4 py-3 font-semibold text-gray-800">
                              {player.player_name}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full">
                                {player.points_3}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full">
                                {player.points_2}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full">
                                {player.points_1}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center font-bold text-lg text-blue-600">
                              {player.total_points}
                            </td>
                          </tr>

                          {/* Paplašināmā vēsture */}
                          {expandedPlayer === player.player_name && playerHistory[player.player_name] && (
                            <tr className="bg-gray-50">
                              <td colSpan={6} className="px-4 py-4">
                                <div className="space-y-3">
                                  <h4 className="font-bold text-gray-800 mb-3">
                                    📋 Prognožu vēsture:
                                  </h4>
                                  {playerHistory[player.player_name]!.length === 0 ? (
                                    <p className="text-gray-500">Nav prognožu</p>
                                  ) : (
                                    <div className="space-y-2">
                                      {playerHistory[player.player_name]!.map((pred, i) => (
                                        <div
                                          key={i}
                                          className="bg-white border border-gray-200 rounded p-3"
                                        >
                                          <p className="text-sm font-semibold text-gray-700">
                                            {pred.match_id}
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            Prognoza: {pred.predicted_home} — {pred.predicted_away}
                                            {pred.actual && ` | Rezultāts: ${pred.actual.home} — ${pred.actual.away}`}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
