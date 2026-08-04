import React from 'react';
import { Sparkles, MapPin, Calendar, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function MatchCard({ match, onVerify }) {
  const isHigh = match.confidence_score >= 75;
  const isMedium = match.confidence_score >= 50 && match.confidence_score < 75;

  const badgeColor = isHigh
    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-300'
    : isMedium
    ? 'bg-amber-500/10 text-amber-600 border-amber-300'
    : 'bg-slate-500/10 text-slate-600 border-slate-300';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-slate-800 text-sm">Potential AI Match</span>
        </div>
        <div className={`px-3 py-1 rounded-full border text-xs font-semibold flex items-center gap-1 ${badgeColor}`}>
          <span>{match.confidence_level} Confidence</span>
          <span>({match.confidence_score}%)</span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lost Item Details */}
        <div className="p-4 bg-red-50/50 rounded-lg border border-red-100">
          <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Lost Report</div>
          {match.lost_item?.image_path ? (
            <img
              src={match.lost_item.image_path}
              alt={match.lost_item.name}
              className="w-full h-40 object-cover rounded-md mb-3 border border-slate-200"
            />
          ) : (
            <div className="w-full h-40 bg-slate-100 rounded-md mb-3 flex items-center justify-center text-slate-400 text-sm italic">
              No Image Provided
            </div>
          )}
          <h4 className="font-bold text-slate-900">{match.lost_item?.name}</h4>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{match.lost_item?.description}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {match.lost_item?.location}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {match.lost_item?.date_event}</span>
          </div>
        </div>

        {/* Found Item Details */}
        <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-100">
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Found Report</div>
          {match.found_item?.image_path ? (
            <img
              src={match.found_item.image_path}
              alt={match.found_item.name}
              className="w-full h-40 object-cover rounded-md mb-3 border border-slate-200"
            />
          ) : (
            <div className="w-full h-40 bg-slate-100 rounded-md mb-3 flex items-center justify-center text-slate-400 text-sm italic">
              No Image Provided
            </div>
          )}
          <h4 className="font-bold text-slate-900">{match.found_item?.name}</h4>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{match.found_item?.description}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {match.found_item?.location}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {match.found_item?.date_event}</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          Text Match: {(match.text_similarity * 100).toFixed(1)}% | Image Match: {(match.image_similarity * 100).toFixed(1)}%
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600">Status: <b>{match.status}</b></span>
          {onVerify && match.status === 'POTENTIAL' && (
            <button
              onClick={() => onVerify(match.id)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
            >
              <ShieldCheck className="w-4 h-4" /> Verify Match
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
