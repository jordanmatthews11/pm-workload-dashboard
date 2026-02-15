import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { calcPMScores, getScoreBarColor } from '../utils/scoring';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Users, Activity, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const { state } = useStore();
  const { config, teamMembers, entries } = state;

  const latestEntry = entries.length > 0 ? entries[entries.length - 1] : null;
  const previousEntry = entries.length > 1 ? entries[entries.length - 2] : null;

  const pmScores = useMemo(() => {
    if (!latestEntry) return [];
    return teamMembers.map((pm) => {
      const pmData = latestEntry.data[pm];
      if (!pmData) return { name: pm, loadScore: 0, finalScore: 0, delta: 0 };
      const scores = calcPMScores(pmData, config);

      let delta = 0;
      if (previousEntry?.data[pm]) {
        const prevScores = calcPMScores(previousEntry.data[pm], config);
        delta = scores.finalScore - prevScores.finalScore;
      }

      return { name: pm, ...scores, delta, data: pmData };
    });
  }, [latestEntry, previousEntry, teamMembers, config]);

  const maxScore = useMemo(() => {
    const scores = pmScores.map((p) => p.finalScore);
    return Math.max(...scores, 50);
  }, [pmScores]);

  const teamAvg = useMemo(() => {
    if (pmScores.length === 0) return 0;
    return pmScores.reduce((sum, p) => sum + p.finalScore, 0) / pmScores.length;
  }, [pmScores]);

  const highestWorkload = useMemo(() => {
    if (pmScores.length === 0) return null;
    return pmScores.reduce((max, p) => (p.finalScore > max.finalScore ? p : max), pmScores[0]);
  }, [pmScores]);

  if (!latestEntry) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-500">No Data Yet</h2>
          <p className="text-slate-400 mt-2">Head to "Enter Data" to log your first weekly entry.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Team Size</p>
              <p className="text-2xl font-bold text-slate-800">{teamMembers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
              <Activity className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Team Avg Score</p>
              <p className="text-2xl font-bold text-slate-800">{teamAvg.toFixed(1)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Highest Workload</p>
              <p className="text-2xl font-bold text-slate-800">
                {highestWorkload?.name ?? '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Week Label */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-700">
          {latestEntry.label || latestEntry.date}
        </h2>
        <span className="text-sm text-slate-400">{entries.length} weeks tracked</span>
      </div>

      {/* PM Score Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {pmScores.map((pm) => (
          <div
            key={pm.name}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: getScoreBarColor(pm.finalScore, maxScore * 1.1) }}
                >
                  {pm.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{pm.name}</h3>
                  <p className="text-xs text-slate-400">Load: {pm.loadScore.toFixed(1)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold" style={{ color: getScoreBarColor(pm.finalScore, maxScore * 1.1) }}>
                  {pm.finalScore.toFixed(1)}
                </p>
                {pm.delta !== 0 && (
                  <div className={`flex items-center gap-1 text-xs ${pm.delta > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {pm.delta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {pm.delta > 0 ? '+' : ''}{pm.delta.toFixed(1)}
                  </div>
                )}
                {pm.delta === 0 && previousEntry && (
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Minus className="w-3 h-3" /> No change
                  </div>
                )}
              </div>
            </div>

            {/* Metric breakdown */}
            {pm.data && (
              <div className="space-y-1.5">
                {config.metrics.map((metric) => (
                  <div key={metric.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 truncate pr-2">{metric.name}</span>
                    <span className="font-medium text-slate-700">{pm.data.metrics[metric.id] ?? 0}</span>
                  </div>
                ))}
                <div className="border-t border-slate-100 pt-1.5 mt-1.5">
                  {config.subjectiveMetrics.map((metric) => (
                    <div key={metric.id} className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 truncate pr-2">{metric.name}</span>
                      <span className="font-medium text-slate-700">
                        {pm.data.subjective[metric.id] ?? 0}/{metric.max}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-700 mb-4">Workload Comparison</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={pmScores} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 13 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
              }}
              formatter={(value) => [value.toFixed(1), 'Score']}
            />
            <Bar dataKey="finalScore" radius={[6, 6, 0, 0]} maxBarSize={60}>
              {pmScores.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getScoreBarColor(entry.finalScore, maxScore * 1.1)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
