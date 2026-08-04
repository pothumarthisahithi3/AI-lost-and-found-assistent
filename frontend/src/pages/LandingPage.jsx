import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, Sparkles, Bell, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-slate-900 text-white min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full text-blue-400 font-medium text-sm mb-6">
          <Sparkles className="w-4 h-4" /> Powered by FAISS, Sentence Transformers & OpenCLIP
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-100 max-w-4xl mx-auto leading-tight">
          AI-Powered Campus <span className="text-blue-500">Lost & Found</span> Assistant
        </h1>
        <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
          Report lost or found items with text descriptions and optional photos. Our multi-modal AI automatically calculates similarity confidence and alerts you instantly.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/report-lost" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-blue-600/30">
            Report Lost Item <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/report-found" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-600/30">
            Report Found Item <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800">
        <h2 className="text-2xl font-bold text-center mb-12 text-slate-200">Key Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
            <div className="p-3 bg-blue-500/10 w-fit rounded-xl text-blue-400 mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Multi-Modal AI Matching</h3>
            <p className="text-sm text-slate-400 mt-2">
              Uses Sentence-Transformers (all-MiniLM-L6-v2) for semantic text matching and OpenCLIP for visual feature similarity.
            </p>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
            <div className="p-3 bg-emerald-500/10 w-fit rounded-xl text-emerald-400 mb-4">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Automated High-Confidence Alerts</h3>
            <p className="text-sm text-slate-400 mt-2">
              High-confidence matches trigger automated email notifications with collection instructions and location details.
            </p>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
            <div className="p-3 bg-amber-500/10 w-fit rounded-xl text-amber-400 mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Office Admin Resolution</h3>
            <p className="text-sm text-slate-400 mt-2">
              Dedicated admin module for Lost & Found office staff to verify claims, inspect confidence breakdowns, and mark items collected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
