import { useState } from 'react';
import { AuthProvider, useAuth } from './store/AuthContext';
import { StoreProvider, useStore } from './store/useStore';
import LoginPage from './components/LoginPage';
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
  LogOut,
  Loader2,
} from 'lucide-react';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'entry', label: 'Enter Data', icon: PenSquare },
  { id: 'trends', label: 'Trends', icon: TrendingUp },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'metrics', label: 'Metrics & Weights', icon: Sliders },
  { id: 'team', label: 'Team & Settings', icon: Users },
];

function LoadingScreen({ message }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-[#4E339C] animate-spin mx-auto mb-4" />
        <p className="text-slate-500 text-sm">{message || 'Loading...'}</p>
      </div>
    </div>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, signOut } = useAuth();
  const { firestoreReady, seeding } = useStore();

  if (seeding) {
    return <LoadingScreen message="Setting up your workspace..." />;
  }

  if (!firestoreReady) {
    return <LoadingScreen message="Loading data..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img
                src={import.meta.env.BASE_URL + 'storesight-logo.png'}
                alt="Storesight"
                className="h-8"
              />
              <div className="w-px h-8 bg-slate-200" />
              <div>
                <h1 className="text-sm font-bold text-slate-800 leading-tight">PM Workload</h1>
                <p className="text-xs text-slate-400 leading-tight">Team Capacity Tracker</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#ECE5FF] text-[#4E339C] flex items-center justify-center font-bold text-sm">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
                  </div>
                )}
                <span className="text-sm font-medium text-slate-700 hidden sm:block">
                  {user?.displayName || user?.email}
                </span>
              </div>
              <button
                onClick={signOut}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
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
                      ? 'bg-[#ECE5FF] text-[#4E339C]'
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

function AuthGate() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
