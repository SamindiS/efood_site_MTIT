import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../utils/api';
import {
    Search,
    MapPin,
    Star,
    Trash2,
    CheckCircle,
    XCircle,
    ExternalLink,
    Plus,
    X,
    Upload,
    Edit2,
    Loader2,
    Utensils,
    ShoppingBag
} from 'lucide-react';

const RestaurantManager = () => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        contact: '',
        description: '',
        deliveryFee: '',
        address: '',
        city: '',
        state: '',
        country: '',
        openingTime: '',
        closingTime: '',
        status: 'active'
    });

    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const res = await restaurantAPI.get('/restaurants');
            setRestaurants(res.data);
        } catch (err) {
            console.error("Failed to fetch restaurants", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (res) => {
        setEditingId(res._id);
        setFormData({
            name: res.name || '',
            email: res.email || '',
            password: '', // Don't show password
            contact: res.contact || '',
            description: res.description || '',
            deliveryFee: res.deliveryFee || '',
            address: res.address || '',
            city: res.city || '',
            state: res.state || '',
            country: res.country || '',
            openingTime: res.openingTime || '',
            closingTime: res.closingTime || '',
            status: res.status || 'active'
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            name: '', email: '', password: '', contact: '',
            description: '', deliveryFee: '', address: '',
            city: '', state: '', country: '',
            openingTime: '', closingTime: '', status: 'active'
        });
        setSelectedFiles([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'password' && !formData[key]) return; // Skip empty password on edit
                data.append(key, formData[key]);
            });

            selectedFiles.forEach(file => {
                data.append('images', file);
            });

            if (editingId) {
                // Use a dedicated admin update endpoint or the generic one
                await restaurantAPI.put(`/restaurants/${editingId}`, data);
            } else {
                await restaurantAPI.post('/restaurants/register', data);
            }

            setIsModalOpen(false);
            resetForm();
            fetchRestaurants();
        } catch (err) {
            console.error("Submission failed", err);
            alert("Failed to save restaurant details.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this restaurant and all associated data?')) return;
        try {
            await restaurantAPI.delete(`/restaurants/${id}`);
            fetchRestaurants();
        } catch (err) {
            alert("Failed to delete restaurant");
        }
    };

    const handleStatusToggle = async (id, currentStatus) => {
        const nextStatus = currentStatus === 'active' ? 'pending' : 'active';
        try {
            await restaurantAPI.put(`/restaurants/${id}`, { status: nextStatus });
            fetchRestaurants();
        } catch (err) {
            alert("Status update failed");
        }
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Restaurant Portfolio</h1>
                    <p className="text-slate-400 mt-1">Total Control over partner restaurants and listings.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Add Restaurant
                </button>
            </div>

            {/* Stats Mini Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800">
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Total</p>
                    <p className="text-2xl font-black text-white">{restaurants.length}</p>
                </div>
                <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800">
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Active</p>
                    <p className="text-2xl font-black text-emerald-500">{restaurants.filter(r => r.status === 'active').length}</p>
                </div>
                <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800">
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Pending</p>
                    <p className="text-2xl font-black text-orange-500">{restaurants.filter(r => r.status === 'pending').length}</p>
                </div>
            </div>

            <div className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
                <div className="p-6 border-b border-slate-800 bg-[#0f172a]/50 flex items-center justify-between">
                    <h2 className="font-bold text-slate-300">Detailed Listings</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by name, city..."
                            className="w-80 pl-10 pr-4 py-2 bg-[#0f172a] border border-slate-800 rounded-lg focus:ring-1 focus:ring-orange-500 outline-none transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#0f172a]/30 text-slate-500 text-[10px] uppercase tracking-widest font-black border-b border-slate-800">
                                <th className="px-6 py-4">Identity</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Performance</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Moderation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {restaurants.map((res) => (
                                <tr key={res._id} className="hover:bg-slate-800/20 transition-colors group">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex-shrink-0 flex items-center justify-center text-white font-black overflow-hidden relative">
                                                {res.image && res.image[0] ? (
                                                    <img src={`http://localhost:5010/restaurant-service${res.image[0]}`} alt={res.name} className="w-full h-full object-cover" />
                                                ) : res.name.substring(0, 2).toUpperCase()}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Edit2 className="w-4 h-4 text-white" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white leading-none mb-1">{res.name}</p>
                                                <p className="text-xs text-slate-500 font-medium">{res.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-slate-300">
                                                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                                                <span className="text-sm font-bold">{res.city || '--'}</span>
                                            </div>
                                            <span className="text-[10px] text-slate-500 ml-5 font-bold uppercase tracking-wider">{res.country || '--'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/5 border border-amber-500/10 rounded-xl w-fit">
                                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                            <span className="text-base font-black text-amber-500">{res.rating || '0.0'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <button
                                            onClick={() => handleStatusToggle(res._id, res.status)}
                                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border transition-all
                    ${res.status === 'active'
                                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
                                                    : 'bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20'}`}
                                        >
                                            {res.status}
                                        </button>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/restaurants/${res._id}/menu`)}
                                                className="p-3 text-sky-400 hover:text-white hover:bg-sky-500/20 rounded-xl transition-all"
                                                title="Manage Menu"
                                            >
                                                <Utensils className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => navigate(`/restaurants/${res._id}/orders`)}
                                                className="p-3 text-emerald-400 hover:text-white hover:bg-emerald-500/20 rounded-xl transition-all"
                                                title="View Orders"
                                            >
                                                <ShoppingBag className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(res)}
                                                className="p-3 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-all"
                                                title="Edit Profile"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(res._id)}
                                                className="p-3 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                title="Delete Permanently"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {loading && (
                    <div className="p-20 flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                        <p className="text-slate-500 font-bold animate-pulse">Syncing Database...</p>
                    </div>
                )}
            </div>

            {/* Modal - Unified Add/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/60">
                    <div className="bg-[#1e293b] border border-slate-800 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-[#0f172a]/30">
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                                    {editingId ? 'Edit Restaurant Portfolio' : 'Onboard New Partner'}
                                </h3>
                                <p className="text-slate-500 text-sm">{editingId ? 'Modify existing credentials and details.' : 'Create a fresh listing for eFoods.'}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Basic Info */}
                                <div className="space-y-6">
                                    <h4 className="text-xs font-black text-orange-500 uppercase tracking-widest">Basic Information</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Restaurant Name</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-orange-500 transition-all text-white font-bold"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Official Email</label>
                                                <input
                                                    required
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-orange-500 transition-all text-white font-bold"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">{editingId ? 'Set New Password' : 'Password'}</label>
                                                <input
                                                    required={!editingId}
                                                    type="password"
                                                    placeholder={editingId ? 'Leave blank to keep current' : ''}
                                                    value={formData.password}
                                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                    className="w-full bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-orange-500 transition-all text-white font-bold placeholder:font-normal placeholder:text-xs"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Business Description</label>
                                            <textarea
                                                rows="3"
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-orange-500 transition-all text-white font-bold resize-none"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                {/* Operations & Media */}
                                <div className="space-y-6">
                                    <h4 className="text-xs font-black text-orange-500 uppercase tracking-widest">Operations & Media</h4>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Delivery Fee ($)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={formData.deliveryFee}
                                                    onChange={e => setFormData({ ...formData, deliveryFee: e.target.value })}
                                                    className="w-full bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-orange-500 transition-all text-white font-bold"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Contact Number</label>
                                                <input
                                                    type="text"
                                                    value={formData.contact}
                                                    onChange={e => setFormData({ ...formData, contact: e.target.value })}
                                                    className="w-full bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-orange-500 transition-all text-white font-bold"
                                                />
                                            </div>
                                        </div>

                                        {/* Image Upload */}
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Brand Visuals (Images)</label>
                                            <div className="border-2 border-dashed border-slate-800 bg-[#0f172a] rounded-2xl p-6 text-center group hover:border-orange-500/50 transition-colors relative cursor-pointer">
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={e => setSelectedFiles([...e.target.files])}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                                <Upload className="w-8 h-8 text-slate-600 mx-auto mb-2 group-hover:text-orange-500 transition-colors" />
                                                <p className="text-xs font-bold text-slate-500">{selectedFiles.length > 0 ? `${selectedFiles.length} files selected` : 'Drag & drop or click to upload'}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Opening Time</label>
                                                <input
                                                    type="time"
                                                    value={formData.openingTime}
                                                    onChange={e => setFormData({ ...formData, openingTime: e.target.value })}
                                                    className="w-full bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-orange-500 transition-all text-white font-bold"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Closing Time</label>
                                                <input
                                                    type="time"
                                                    value={formData.closingTime}
                                                    onChange={e => setFormData({ ...formData, closingTime: e.target.value })}
                                                    className="w-full bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-orange-500 transition-all text-white font-bold"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Location Row */}
                            <div className="mt-8 pt-8 border-t border-slate-800">
                                <h4 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-6">Geographic Details</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">City</label>
                                        <input type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-3 outline-none text-white font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">State</label>
                                        <input type="text" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} className="w-full bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-3 outline-none text-white font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Country</label>
                                        <input type="text" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} className="w-full bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-3 outline-none text-white font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Address</label>
                                        <input type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-3 outline-none text-white font-bold" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex items-center justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-8 py-4 text-slate-400 font-bold hover:text-white transition-colors"
                                >
                                    Discard Changes
                                </button>
                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-orange-500/10 active:scale-95 flex items-center gap-3"
                                >
                                    {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                                    {submitting ? 'Propagating...' : (editingId ? 'Update Listing' : 'Finalize Onboarding')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantManager;
