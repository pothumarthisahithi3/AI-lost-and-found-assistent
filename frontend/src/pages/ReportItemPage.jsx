import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService } from '../services/api';
import { PlusCircle, Upload, AlertCircle, FileText } from 'lucide-react';

export default function ReportItemPage({ defaultType = 'LOST' }) {
  const [type, setType] = useState(defaultType);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [description, setDescription] = useState('');
  const [dateEvent, setDateEvent] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('date_event', dateEvent);
      formData.append('location', location);
      formData.append('type', type);
      if (image) {
        formData.append('image', image);
      }

      await itemService.createItem(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
          <div className={`p-3 rounded-xl text-white ${type === 'LOST' ? 'bg-red-600' : 'bg-emerald-600'}`}>
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Report {type === 'LOST' ? 'Lost Item' : 'Found Item'}
            </h2>
            <p className="text-sm text-slate-500">Provide accurate details for AI matching</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Report Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-medium"
              >
                <option value="LOST">Lost Item</option>
                <option value="FOUND">Found Item</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="Electronics">Electronics</option>
                <option value="Wallets & Purses">Wallets & Purses</option>
                <option value="ID & Cards">ID & Cards</option>
                <option value="Keys">Keys</option>
                <option value="Clothing & Bags">Clothing & Bags</option>
                <option value="Books & Stationery">Books & Stationery</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Item Title / Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Black Leather Wallet with Card"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Description (Be descriptive for AI Text Matching)</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mention brand, color, stickers, inner contents, distinct marks..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Date {type === 'LOST' ? 'Lost' : 'Found'}</label>
              <input
                type="date"
                required
                value={dateEvent}
                onChange={(e) => setDateEvent(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Location {type === 'LOST' ? 'Lost' : 'Found'}</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Science Building Lab 2"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Item Photo (Optional for OpenCLIP Visual Matching)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl relative hover:bg-slate-50 transition">
              {previewUrl ? (
                <div className="text-center">
                  <img src={previewUrl} alt="Preview" className="max-h-40 mx-auto rounded-lg shadow-sm border mb-2" />
                  <button
                    type="button"
                    onClick={() => { setImage(null); setPreviewUrl(''); }}
                    className="text-xs text-red-600 hover:underline font-semibold"
                  >
                    Remove Photo
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-8 w-8 text-slate-400" />
                  <div className="flex text-sm text-slate-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-semibold text-blue-600 hover:text-blue-500">
                      <span>Upload a file</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white transition shadow-md ${
              type === 'LOST' ? 'bg-red-600 hover:bg-red-500' : 'bg-emerald-600 hover:bg-emerald-500'
            } disabled:opacity-50`}
          >
            {loading ? 'Processing report & running AI similarity search...' : `Submit ${type === 'LOST' ? 'Lost' : 'Found'} Report`}
          </button>
        </form>
      </div>
    </div>
  );
}
