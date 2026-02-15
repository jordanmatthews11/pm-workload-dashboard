import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Trash2, UserPlus, Users, Download, Upload, RotateCcw } from 'lucide-react';

export default function TeamManager() {
  const { state, dispatch } = useStore();
  const { teamMembers } = state;
  const [newName, setNewName] = useState('');

  const addMember = () => {
    if (!newName.trim()) return;
    dispatch({ type: 'ADD_TEAM_MEMBER', payload: newName.trim() });
    setNewName('');
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pm-workload-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (data.config && data.entries && data.teamMembers) {
            dispatch({ type: 'IMPORT_STATE', payload: data });
          } else {
            alert('Invalid file format. Expected PM Workload export.');
          }
        } catch (err) {
          alert('Could not parse file: ' + err.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    if (window.confirm('Reset ALL data to defaults? This will erase all your entries and configuration changes.')) {
      dispatch({ type: 'RESET_ALL' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Members */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Team Members</h3>
            <p className="text-sm text-slate-400">Manage who appears on the dashboard</p>
          </div>
        </div>

        <div className="space-y-2">
          {teamMembers.map((name) => (
            <div
              key={name}
              className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  {name.charAt(0)}
                </div>
                <span className="font-medium text-slate-700">{name}</span>
              </div>
              <button
                onClick={() => dispatch({ type: 'REMOVE_TEAM_MEMBER', payload: name })}
                className="p-1.5 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addMember()}
            placeholder="New team member name"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addMember}
            disabled={!newName.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4">Data Management</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200"
          >
            <Download className="w-4 h-4" /> Export Data
          </button>
          <button
            onClick={handleImport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200"
          >
            <Upload className="w-4 h-4" /> Import Data
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100"
          >
            <RotateCcw className="w-4 h-4" /> Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
