import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { itemService, matchService } from '../services/api';
import MatchCard from '../components/MatchCard';
import { PlusCircle, Search, Sparkles, CheckCircle2, Clock, Inbox, FileText } from 'lucide-react';

export default function UserDashboardPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('matches');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [itemsData, matchesData] = await Promise.all([
        itemService.getMyItems(),
        matchService.getMyMatches()
      ]);
      setItems(itemsData);
      setMatches(matchesData);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const lostItems = items.filter(i => i.type === 'LOST');
  const foundItems = items.filter(i => i.type === 'FOUND');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Welcome back, {user?.name}!</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your active lost and found reports and view potential AI matches.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/report-lost" className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-1.5 transition">
            <PlusCircle className="w-4 h-4" /> Report Lost
          </Link>
          <Link to="/report-found" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-1.5 transition">
            <PlusCircle className="w-4 h-4" /> Report Found
          </Link>
        </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase">My Lost Reports</div>
          <div className="text-3xl font-extrabold text-red-600 mt-1">{lostItems.length}</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase">My Found Reports</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-1">{foundItems.length}</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase">Potential Matches</div>
          <div className="text-3xl font-extrabold text-blue-600 mt-1">{matches.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6 flex gap-6">
        <button
          onClick={() => setActiveTab('matches')}
          className={`pb-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition ${
            activeTab === 'matches' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4" /> AI Potential Matches ({matches.length})
        </button>

        <button
          onClick={() => setActiveTab('lost')}
          className={`pb-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition ${
            activeTab === 'lost' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" /> My Lost Reports ({lostItems.length})
        </button>

        <button
          onClick={() => setActiveTab('found')}
          className={`pb-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition ${
            activeTab === 'found' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" /> My Found Reports ({foundItems.length})
        </button>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading dashboard contents...</div>
      ) : activeTab === 'matches' ? (
        matches.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
            <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No AI Matches Found Yet</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
              As soon as another user or office admin files a matching lost/found report, our AI vector matching pipeline will display potential matches here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === 'lost' ? lostItems : foundItems).map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {item.image_path ? (
                <img src={item.image_path} alt={item.name} className="w-full h-44 object-cover" />
              ) : (
                <div className="w-full h-44 bg-slate-100 flex items-center justify-center text-slate-400 text-xs italic">
                  No Image
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-100 text-slate-600">
                    {item.category}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                    item.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900">{item.name}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{item.description}</p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
                  <span>📍 {item.location}</span>
                  <span>📅 {item.date_event}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
