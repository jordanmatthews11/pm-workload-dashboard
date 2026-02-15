import { useState } from 'react';
import { StoreProvider } from './store/useStore';
import Dashboard from './components/Dashboard';
import DataEntry from './components/DataEntry';
import MetricsConfig from './components/MetricsConfig';
import TrendCharts from './components/TrendCharts';
import HistoryView from './components/HistoryView';
import TeamManager from './components/TeamManager';
import {
  LayoutDashboard,
  PenSquare,
  Sliders,
  TrendingUp,
  Clock,
  Users,
  Activity,
} from 'lucide-react';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'entry', label: 'Enter Data', icon: PenSquare },
  { id: 'trends', label: 'Trends', icon: TrendingUp },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'metrics', label: 'Metrics & Weights', icon: Sliders },
  { id: 'team', label: 'Team & Settings', icon: Users },
];

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800 leading-tight">PM Workload</h1>
                <p className="text-xs text-slate-400 leading-tight">Team Capacity Tracker</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2 -mb-px scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'entry' && <DataEntry />}
        {activeTab === 'metrics' && <MetricsConfig />}
        {activeTab === 'trends' && <TrendCharts />}
        {activeTab === 'history' && <HistoryView />}
        {activeTab === 'team' && <TeamManager />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
