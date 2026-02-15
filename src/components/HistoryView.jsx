import { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { calcPMScores } from '../utils/scoring';
import { Trash2, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

export default function HistoryView() {
  const { state, dispatch } = useStore();
  const { config, teamMembers, entries } = state;
  const [expandedDate, setExpandedDate] = useState(null);

  // Reverse for newest-first display
  const sortedEntries = useMemo(() => [...entries].reverse(), [entries]);

  const handleDelete = (date) => {
    if (window.confirm('Delete this week\'s entry? This cannot be undone.')) {
      dispatch({ type: 'DELETE_ENTRY', payload: date });
    }
  };

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-xl font-semibold text-slate-500">No History</p>
          <p className="text-slate-400 mt-2">Start tracking weekly data to build history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-slate-700">Weekly History</h2>
        <span className="text-sm text-slate-400">{entries.length} entries</span>
      </div>

      {sortedEntries.map((entry) => {
        const isExpanded = expandedDate === entry.date;

        return (
          <div
            key={entry.date}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setExpandedDate(isExpanded ? null : entry.date)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-slate-400" />
                <div className="text-left">
                  <h3 className="font-semibold text-slate-800">
                    {entry.label || entry.date}
                  </h3>
                  <p className="text-xs text-slate-400">{entry.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* Quick score summary */}
                <div className="hidden sm:flex items-center gap-3">
                  {teamMembers.map((pm) => {
                    const pmData = entry.data[pm];
                    if (!pmData) return null;
                    const scores = calcPMScores(pmData, config);
                    return (
                      <span key={pm} className="text-xs text-slate-500">
                        {pm}: <strong className="text-slate-700">{scores.finalScore.toFixed(1)}</strong>
                      </span>
                    );
                  })}
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="px-5 pb-5 border-t border-slate-100">
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wider text-slate-400">
                        <th className="pb-2 pr-4">PM</th>
                        {config.metrics.map((m) => (
                          <th key={m.id} className="pb-2 pr-4 text-center whitespace-nowrap">
                            {m.name}
                          </th>
                        ))}
                        {config.subjectiveMetrics.map((m) => (
                          <th key={m.id} className="pb-2 pr-4 text-center whitespace-nowrap">
                            {m.name}
                          </th>
                        ))}
                        <th className="pb-2 pr-4 text-center">Load</th>
                        <th className="pb-2 text-center">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamMembers.map((pm) => {
                        const pmData = entry.data[pm];
                        if (!pmData) return null;
                        const scores = calcPMScores(pmData, config);
                        return (
                          <tr key={pm} className="border-t border-slate-50">
                            <td className="py-2 pr-4 font-medium text-slate-700">{pm}</td>
                            {config.metrics.map((m) => (
                              <td key={m.id} className="py-2 pr-4 text-center text-slate-600">
                                {pmData.metrics[m.id] ?? 0}
                              </td>
                            ))}
                            {config.subjectiveMetrics.map((m) => (
                              <td key={m.id} className="py-2 pr-4 text-center text-slate-600">
                                {pmData.subjective[m.id] ?? 0}
                              </td>
                            ))}
                            <td className="py-2 pr-4 text-center font-medium text-slate-700">
                              {scores.loadScore.toFixed(1)}
                            </td>
                            <td className="py-2 text-center font-bold text-blue-600">
                              {scores.finalScore.toFixed(1)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleDelete(entry.date)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Entry
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
