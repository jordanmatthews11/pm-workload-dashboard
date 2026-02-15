import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { calcPMScores } from '../utils/scoring';
import { Save, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

export default function DataEntry() {
  const { state, dispatch } = useStore();
  const { config, teamMembers, entries } = state;

  const today = format(new Date(), 'yyyy-MM-dd');
  const [date, setDate] = useState(today);
  const [label, setLabel] = useState(`Week of ${format(new Date(), 'M/d/yy')}`);
  const [expandedPM, setExpandedPM] = useState(teamMembers[0] ?? '');
  const [saved, setSaved] = useState(false);

  // Initialize form data from existing entry or blank
  const existingEntry = useMemo(() => entries.find((e) => e.date === date), [entries, date]);

  const [formData, setFormData] = useState(() => {
    const data = {};
    teamMembers.forEach((pm) => {
      const existing = existingEntry?.data[pm];
      data[pm] = {
        metrics: {},
        subjective: {},
      };
      config.metrics.forEach((m) => {
        data[pm].metrics[m.id] = existing?.metrics[m.id] ?? 0;
      });
      config.subjectiveMetrics.forEach((m) => {
        data[pm].subjective[m.id] = existing?.subjective[m.id] ?? 0;
      });
    });
    return data;
  });

  // When date changes, reload data
  const handleDateChange = (newDate) => {
    setDate(newDate);
    const entry = entries.find((e) => e.date === newDate);
    const data = {};
    teamMembers.forEach((pm) => {
      const existing = entry?.data[pm];
      data[pm] = { metrics: {}, subjective: {} };
      config.metrics.forEach((m) => {
        data[pm].metrics[m.id] = existing?.metrics[m.id] ?? 0;
      });
      config.subjectiveMetrics.forEach((m) => {
        data[pm].subjective[m.id] = existing?.subjective[m.id] ?? 0;
      });
    });
    setFormData(data);
    setLabel(entry?.label || `Week of ${format(new Date(newDate + 'T12:00:00'), 'M/d/yy')}`);
  };

  const updateMetric = (pm, metricId, value) => {
    setFormData((prev) => ({
      ...prev,
      [pm]: {
        ...prev[pm],
        metrics: { ...prev[pm].metrics, [metricId]: parseFloat(value) || 0 },
      },
    }));
    setSaved(false);
  };

  const updateSubjective = (pm, metricId, value) => {
    setFormData((prev) => ({
      ...prev,
      [pm]: {
        ...prev[pm],
        subjective: { ...prev[pm].subjective, [metricId]: parseFloat(value) || 0 },
      },
    }));
    setSaved(false);
  };

  const handleSave = () => {
    dispatch({
      type: 'SAVE_ENTRY',
      payload: { date, label, data: formData },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    const data = {};
    teamMembers.forEach((pm) => {
      data[pm] = { metrics: {}, subjective: {} };
      config.metrics.forEach((m) => {
        data[pm].metrics[m.id] = 0;
      });
      config.subjectiveMetrics.forEach((m) => {
        data[pm].subjective[m.id] = 0;
      });
    });
    setFormData(data);
    setSaved(false);
  };

  return (
    <div className="space-y-6">
      {/* Date & Label */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Week Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E339C] focus:border-[#4E339C]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E339C] focus:border-[#4E339C]"
              placeholder="e.g. Week of 2/9/26"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all ${
                saved
                  ? 'bg-[#81D994] hover:bg-[#6bc480]'
                  : 'bg-[#4E339C] hover:bg-[#463572]'
              }`}
            >
              <Save className="w-4 h-4" />
              {saved ? 'Saved!' : 'Save Entry'}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* PM Data Forms */}
      <div className="space-y-3">
        {teamMembers.map((pm) => {
          const isExpanded = expandedPM === pm;
          const scores = formData[pm] ? calcPMScores(formData[pm], config) : { loadScore: 0, finalScore: 0 };

          return (
            <div
              key={pm}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* PM Header */}
              <button
                onClick={() => setExpandedPM(isExpanded ? '' : pm)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#ECE5FF] text-[#4E339C] flex items-center justify-center font-bold text-sm">
                    {pm.charAt(0)}
                  </div>
                  <h3 className="font-semibold text-slate-800">{pm}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm text-slate-500">Load: </span>
                    <span className="font-semibold text-slate-700">{scores.loadScore.toFixed(1)}</span>
                    <span className="mx-2 text-slate-300">|</span>
                    <span className="text-sm text-slate-500">Score: </span>
                    <span className="font-bold text-[#4E339C]">{scores.finalScore.toFixed(1)}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expanded Form */}
              {isExpanded && formData[pm] && (
                <div className="px-5 pb-5 border-t border-slate-100">
                  {/* Quantitative Metrics */}
                  <div className="mt-4">
                    <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
                      Quantitative Metrics
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {config.metrics.map((metric) => (
                        <div key={metric.id}>
                          <label className="block text-sm text-slate-600 mb-1">
                            {metric.name}
                            <span className="text-xs text-slate-400 ml-1">(w: {metric.weight})</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={formData[pm].metrics[metric.id] ?? 0}
                            onChange={(e) => updateMetric(pm, metric.id, e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E339C] focus:border-[#4E339C]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subjective Metrics */}
                  <div className="mt-5">
                    <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
                      Subjective Ratings
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {config.subjectiveMetrics.map((metric) => (
                        <div key={metric.id}>
                          <label className="block text-sm text-slate-600 mb-1">
                            {metric.name}
                            <span className="text-xs text-slate-400 ml-1">
                              ({metric.min}-{metric.max}, w: {metric.weight})
                            </span>
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min={metric.min}
                              max={metric.max}
                              step="0.5"
                              value={formData[pm].subjective[metric.id] ?? metric.min}
                              onChange={(e) => updateSubjective(pm, metric.id, e.target.value)}
                              className="flex-1"
                            />
                            <span className="text-lg font-bold text-[#4E339C] w-8 text-center">
                              {formData[pm].subjective[metric.id] ?? 0}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live Score Summary */}
                  <div className="mt-4 bg-[#ECE5FF]/40 rounded-lg p-3 flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      Load Score = {config.metrics
                        .map((m) => `${formData[pm].metrics[m.id] ?? 0} x ${m.weight}`)
                        .join(' + ')}
                      {' = '}
                      <strong>{scores.loadScore.toFixed(1)}</strong>
                    </span>
                    <span className="text-sm font-semibold text-[#4E339C]">
                      Final: {scores.finalScore.toFixed(1)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
