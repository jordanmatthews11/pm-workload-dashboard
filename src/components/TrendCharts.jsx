import { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { calcPMScores } from '../utils/scoring';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts';

const PM_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export default function TrendCharts() {
  const { state } = useStore();
  const { config, teamMembers, entries } = state;
  const [chartType, setChartType] = useState('finalScore');

  // Build trend data
  const trendData = useMemo(() => {
    return entries.map((entry) => {
      const point = {
        date: entry.label || entry.date,
        rawDate: entry.date,
      };
      teamMembers.forEach((pm) => {
        const pmData = entry.data[pm];
        if (pmData) {
          const scores = calcPMScores(pmData, config);
          point[`${pm}_final`] = parseFloat(scores.finalScore.toFixed(1));
          point[`${pm}_load`] = parseFloat(scores.loadScore.toFixed(1));
          // Individual metrics
          config.metrics.forEach((m) => {
            point[`${pm}_metric_${m.id}`] = pmData.metrics[m.id] ?? 0;
          });
          config.subjectiveMetrics.forEach((m) => {
            point[`${pm}_subj_${m.id}`] = pmData.subjective[m.id] ?? 0;
          });
        }
      });
      return point;
    });
  }, [entries, teamMembers, config]);

  const chartOptions = [
    { value: 'finalScore', label: 'Final Score' },
    { value: 'loadScore', label: 'Load Score' },
    ...config.metrics.map((m) => ({ value: `metric_${m.id}`, label: m.name })),
    ...config.subjectiveMetrics.map((m) => ({ value: `subj_${m.id}`, label: m.name })),
  ];

  const getDataKey = (pm) => {
    if (chartType === 'finalScore') return `${pm}_final`;
    if (chartType === 'loadScore') return `${pm}_load`;
    return `${pm}_${chartType}`;
  };

  if (entries.length < 2) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-xl font-semibold text-slate-500">Not enough data for trends</p>
          <p className="text-slate-400 mt-2">Enter at least 2 weeks of data to see trend charts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chart Type Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="text-sm font-medium text-slate-600">Show:</label>
          <div className="flex flex-wrap gap-2">
            {chartOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setChartType(opt.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  chartType === opt.value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Trend Line Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-700 mb-4">
          {chartOptions.find((o) => o.value === chartType)?.label} Over Time
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748b', fontSize: 11 }}
              angle={-30}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
              }}
            />
            <Legend />
            {teamMembers.map((pm, i) => (
              <Line
                key={pm}
                type="monotone"
                dataKey={getDataKey(pm)}
                name={pm}
                stroke={PM_COLORS[i % PM_COLORS.length]}
                strokeWidth={2.5}
                dot={{ r: 4, fill: PM_COLORS[i % PM_COLORS.length] }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Individual PM Area Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {teamMembers.map((pm, i) => (
          <div key={pm} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: PM_COLORS[i % PM_COLORS.length] }}
              />
              {pm}
            </h4>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id={`gradient-${pm}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PM_COLORS[i % PM_COLORS.length]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={PM_COLORS[i % PM_COLORS.length]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} width={30} />
                <Tooltip
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={getDataKey(pm)}
                  name={chartOptions.find((o) => o.value === chartType)?.label}
                  stroke={PM_COLORS[i % PM_COLORS.length]}
                  fill={`url(#gradient-${pm})`}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}
