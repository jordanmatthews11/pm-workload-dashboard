import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Trash2, GripVertical, Scale, Sliders } from 'lucide-react';

export default function MetricsConfig() {
  const { state, dispatch } = useStore();
  const { config } = state;

  const [newMetricName, setNewMetricName] = useState('');
  const [newMetricWeight, setNewMetricWeight] = useState(1);
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjWeight, setNewSubjWeight] = useState(1);
  const [newSubjMin, setNewSubjMin] = useState(1);
  const [newSubjMax, setNewSubjMax] = useState(5);

  const addMetric = () => {
    if (!newMetricName.trim()) return;
    dispatch({
      type: 'ADD_METRIC',
      payload: { name: newMetricName.trim(), weight: newMetricWeight },
    });
    setNewMetricName('');
    setNewMetricWeight(1);
  };

  const addSubjectiveMetric = () => {
    if (!newSubjName.trim()) return;
    dispatch({
      type: 'ADD_SUBJECTIVE_METRIC',
      payload: { name: newSubjName.trim(), weight: newSubjWeight, min: newSubjMin, max: newSubjMax },
    });
    setNewSubjName('');
    setNewSubjWeight(1);
    setNewSubjMin(1);
    setNewSubjMax(5);
  };

  return (
    <div className="space-y-8">
      {/* Load Score Weight */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#ECE5FF] flex items-center justify-center">
            <Scale className="w-5 h-5 text-[#7554C2]" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Final Score Formula</h3>
            <p className="text-sm text-slate-400">
              Final = (Load Score x <strong>{config.loadScoreWeight}</strong>) + Sum(Subjective x weights)
            </p>
          </div>
        </div>
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Load Score Weight in Final Score
          </label>
          <input
            type="number"
            step="0.5"
            min="0"
            value={config.loadScoreWeight}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_LOAD_SCORE_WEIGHT', payload: parseFloat(e.target.value) || 0 })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E339C]"
          />
        </div>
      </div>

      {/* Quantitative Metrics */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#ECE5FF] flex items-center justify-center">
            <Sliders className="w-5 h-5 text-[#4E339C]" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Quantitative Metrics</h3>
            <p className="text-sm text-slate-400">
              These feed into the Load Score. Load = Sum(metric x weight)
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {config.metrics.map((metric) => (
            <div
              key={metric.id}
              className="flex items-center gap-3 bg-slate-50 rounded-lg p-3 group"
            >
              <GripVertical className="w-4 h-4 text-slate-300" />
              <input
                type="text"
                value={metric.name}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_METRIC',
                    payload: { id: metric.id, updates: { name: e.target.value } },
                  })
                }
                className="flex-1 bg-transparent border-none text-sm text-slate-700 focus:outline-none focus:ring-0 font-medium"
              />
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400">Weight:</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={metric.weight}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_METRIC',
                      payload: { id: metric.id, updates: { weight: parseFloat(e.target.value) || 0 } },
                    })
                  }
                  className="w-16 rounded border border-slate-300 px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#4E339C]"
                />
              </div>
              <button
                onClick={() => dispatch({ type: 'REMOVE_METRIC', payload: { id: metric.id } })}
                className="p-1.5 text-slate-400 hover:text-[#F8005E] opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add new metric */}
        <div className="mt-4 flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm text-slate-500 mb-1">New Metric Name</label>
            <input
              type="text"
              value={newMetricName}
              onChange={(e) => setNewMetricName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addMetric()}
              placeholder="e.g. Support Tickets Assigned"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E339C]"
            />
          </div>
          <div className="w-20">
            <label className="block text-sm text-slate-500 mb-1">Weight</label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={newMetricWeight}
              onChange={(e) => setNewMetricWeight(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#4E339C]"
            />
          </div>
          <button
            onClick={addMetric}
            disabled={!newMetricName.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-[#4E339C] text-white rounded-lg text-sm font-medium hover:bg-[#463572] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {/* Subjective Metrics */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#FFA450]/10 flex items-center justify-center">
            <Scale className="w-5 h-5 text-[#FFA450]" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Subjective Rating Metrics</h3>
            <p className="text-sm text-slate-400">
              Self-reported ratings (e.g. 1-5 scale). Added to final score with their weight.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {config.subjectiveMetrics.map((metric) => (
            <div
              key={metric.id}
              className="flex items-center gap-3 bg-slate-50 rounded-lg p-3 group"
            >
              <GripVertical className="w-4 h-4 text-slate-300" />
              <input
                type="text"
                value={metric.name}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_SUBJECTIVE_METRIC',
                    payload: { id: metric.id, updates: { name: e.target.value } },
                  })
                }
                className="flex-1 bg-transparent border-none text-sm text-slate-700 focus:outline-none focus:ring-0 font-medium"
              />
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400">Range:</label>
                <input
                  type="number"
                  value={metric.min}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_SUBJECTIVE_METRIC',
                      payload: { id: metric.id, updates: { min: parseInt(e.target.value) || 0 } },
                    })
                  }
                  className="w-12 rounded border border-slate-300 px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#4E339C]"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  value={metric.max}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_SUBJECTIVE_METRIC',
                      payload: { id: metric.id, updates: { max: parseInt(e.target.value) || 5 } },
                    })
                  }
                  className="w-12 rounded border border-slate-300 px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#4E339C]"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400">Weight:</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={metric.weight}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_SUBJECTIVE_METRIC',
                      payload: { id: metric.id, updates: { weight: parseFloat(e.target.value) || 0 } },
                    })
                  }
                  className="w-16 rounded border border-slate-300 px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#4E339C]"
                />
              </div>
              <button
                onClick={() =>
                  dispatch({ type: 'REMOVE_SUBJECTIVE_METRIC', payload: { id: metric.id } })
                }
                className="p-1.5 text-slate-400 hover:text-[#F8005E] opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add new subjective metric */}
        <div className="mt-4 flex items-end gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-slate-500 mb-1">New Rating Name</label>
            <input
              type="text"
              value={newSubjName}
              onChange={(e) => setNewSubjName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSubjectiveMetric()}
              placeholder='e.g. "Team Collaboration Score"'
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E339C]"
            />
          </div>
          <div className="w-16">
            <label className="block text-sm text-slate-500 mb-1">Min</label>
            <input
              type="number"
              value={newSubjMin}
              onChange={(e) => setNewSubjMin(parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#4E339C]"
            />
          </div>
          <div className="w-16">
            <label className="block text-sm text-slate-500 mb-1">Max</label>
            <input
              type="number"
              value={newSubjMax}
              onChange={(e) => setNewSubjMax(parseInt(e.target.value) || 5)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#4E339C]"
            />
          </div>
          <div className="w-20">
            <label className="block text-sm text-slate-500 mb-1">Weight</label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={newSubjWeight}
              onChange={(e) => setNewSubjWeight(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#4E339C]"
            />
          </div>
          <button
            onClick={addSubjectiveMetric}
            disabled={!newSubjName.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-[#4E339C] text-white rounded-lg text-sm font-medium hover:bg-[#463572] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {/* Formula Preview */}
      <div className="bg-gradient-to-r from-[#4E339C] to-[#7554C2] rounded-xl p-5 text-white shadow-sm">
        <h3 className="font-semibold mb-3">Current Formula Preview</h3>
        <div className="font-mono text-sm space-y-2">
          <p className="text-white/80">
            <span className="text-[#C39CFF]">Load Score</span> ={' '}
            {config.metrics.map((m, i) => (
              <span key={m.id}>
                {i > 0 && ' + '}
                <span className="text-[#FFDF50]">{m.name}</span> x {m.weight}
              </span>
            ))}
          </p>
          <p className="text-white/80">
            <span className="text-[#81D994]">Final Score</span> ={' '}
            <span className="text-[#C39CFF]">Load Score</span> x {config.loadScoreWeight}
            {config.subjectiveMetrics.map((m) => (
              <span key={m.id}>
                {' + '}
                <span className="text-[#FFDF50]">{m.name}</span> x {m.weight}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
