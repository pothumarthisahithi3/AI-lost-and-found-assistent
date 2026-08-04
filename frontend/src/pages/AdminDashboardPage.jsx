import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import MatchCard from '../components/MatchCard';
import { Shield, Sparkles, CheckCircle, PackageCheck, FileText } from 'lucide-react';

export default function AdminDashboardPage() {
  const [items, setItems] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [allItems, allMatches] = await Promise.all([
        adminService.getAllItems(),
        adminService.getAllMatches()
      ]);
      setItems(allItems);
      setMatches(allMatches);
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMatch = async (matchId) => {
    try {
      await adminService.verifyMatch(matchId);
      fetchAdminData();
    } catch (err) {
      alert("Failed to verify match");
    }
  };

  const handleMarkCollected = async (itemId) => {
    try {
      await adminService.markCollected(itemId);
      fetchAdminData();
    } catch (err) {
      alert("Failed to mark item collected");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Lost & Found Office Admin Module</h1>
            <p className="text-xs text-slate-400 mt-0.5">Monitor all reports, verify high-confidence AI matches, and process item collections.</p>
          </div>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase">Total Reports</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">{items.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase">System AI Matches</div>
          <div className="text-3xl font-extrabold text-blue-600 mt-1">{matches.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase">Verified Matches</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-1">
            {matches.filter(m => m.status === 'VERIFIED').length}
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase">Collected / Resolved</div>
          <div className="text-3xl font-extrabold text-purple-600 mt-1">
            {items.filter(i => i.status === 'COLLECTED').length}
          </div>
        </div>
      </div>

      {/* Admin Section Tabs */}
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-blue-600" /> Pending & Verified AI Matches
      </h2>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading admin overview...</div>
      ) : (
        <div className="space-y-6 mb-12">
          {matches.map((m) => (
            <MatchCard key={m.id} match={m} onVerify={handleVerifyMatch} />
          ))}
        </div>
      )}

      {/* All Inventory Items */}
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-slate-600" /> All Reported Items Inventory
      </h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs text-slate-500 uppercase border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Item Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs">{item.id}</td>
                <td className="px-4 py-3 font-bold text-xs">
                  <span className={item.type === 'LOST' ? 'text-red-600' : 'text-emerald-600'}>
                    {item.type}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900">{item.name}</td>
                <td className="px-4 py-3 text-xs">{item.category}</td>
                <td className="px-4 py-3 text-xs">{item.location}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-slate-100 text-slate-700">
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {item.status !== 'COLLECTED' && (
                    <button
                      onClick={() => handleMarkCollected(item.id)}
                      className="bg-purple-50 text-purple-600 hover:bg-purple-100 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ml-auto border border-purple-200"
                    >
                      <PackageCheck className="w-3.5 h-3.5" /> Mark Collected
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
