import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MenuForm from '../components/menu/MenuForm';
import MenuEditForm from '../components/menu/MenuEditForm';
import {
    FilePlus,
    Download,
    Pencil,
    Trash2,
    Search,
    X,
    ChevronRight,
    ChevronLeft,
    Utensils,
    Info,
    AlertCircle
} from 'lucide-react';


export default function MenuManager() {
    const { id: restaurantId } = useParams();
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]);
    const [restaurantName, setRestaurantName] = useState('');
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [editItem, setEditItem] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        fetchRestaurantDetails();
        fetchMenuItems();
    }, [restaurantId]);

    const fetchRestaurantDetails = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/restaurants/${restaurantId}`);
            setRestaurantName(res.data.name);
        } catch (err) {
            console.error("Failed to fetch restaurant details", err);
        }
    };

    const fetchMenuItems = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/menu?restaurantId=${restaurantId}`);
            setMenuItems(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching menu items:', err);
            setLoading(false);
        }
    };

    const handleDelete = async (item, e) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
            try {
                await axios.delete(`http://localhost:5000/api/menu/${item._id}`);
                fetchMenuItems();
            } catch (err) {
                console.error(err);
                alert('Error deleting menu item');
            }
        }
    };

    const handleEdit = (item, e) => {
        e.stopPropagation();
        setEditItem(item);
        setShowEditForm(true);
    };

    const categories = ['All', ...new Set(menuItems.map(item => item.category).filter(Boolean))];

    const filteredItems = menuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.category?.toLowerCase().includes(searchText.toLowerCase());
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/restaurants')}
                        className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl border border-slate-700 transition-all active:scale-95"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                            Menu Portfolio: <span className="text-orange-500">{restaurantName || 'Loading...'}</span>
                        </h1>
                        <p className="text-slate-400 mt-1">Curate and modulate the culinary offerings of this establishment.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                    >
                        <FilePlus className="w-5 h-5" /> Add New Dish
                    </button>
                </div>
            </div>

            {showForm && (
                <MenuForm
                    onClose={() => setShowForm(false)}
                    onSuccess={fetchMenuItems}
                    restaurantId={restaurantId}
                />
            )}

            {showEditForm && (
                <MenuEditForm
                    menuItem={editItem}
                    onClose={() => setShowEditForm(false)}
                    onSuccess={fetchMenuItems}
                />
            )}

            <div className="bg-[#1e293b] rounded-3xl border border-slate-800 p-8 shadow-2xl space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Filter by name, category, or tag..."
                            className="w-full bg-[#0f172a] border border-slate-700 pl-12 pr-4 py-3 rounded-xl text-white font-bold outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-5 py-2 whitespace-nowrap rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${activeCategory === category
                                    ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20'
                                    : 'bg-[#0f172a] border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-96 space-y-4">
                        <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-black uppercase tracking-widest text-xs animate-pulse">Syncing Kitchen Data...</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="p-6 bg-slate-800/50 rounded-full border border-slate-700">
                            <Utensils className="w-12 h-12 text-slate-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">No Culinary Assets Found</h3>
                            <p className="text-slate-500">Add some delicious dishes to get started.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredItems.map(item => (
                            <div
                                key={item._id}
                                className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden cursor-pointer group transition-all hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/5"
                                onClick={() => setSelectedItem(item)}
                            >
                                <div className="relative aspect-video">
                                    {item.image?.[0] ? (
                                        <img
                                            src={`http://localhost:5000${item.image[0]}`}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-800 flex items-center justify-center p-8">
                                            <Utensils className="w-12 h-12 text-slate-700 opacity-50" />
                                        </div>
                                    )}

                                    {item.discount > 0 && (
                                        <div className="absolute top-4 left-4 bg-orange-500 text-white font-black py-1.5 px-3 rounded-lg text-[10px] uppercase tracking-widest shadow-lg">
                                            {item.discount}% OFF
                                        </div>
                                    )}

                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button
                                            onClick={(e) => handleEdit(item, e)}
                                            className="p-2.5 bg-black/50 backdrop-blur-md text-white rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-500"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(item, e)}
                                            className="p-2.5 bg-black/50 backdrop-blur-md text-white rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-lg font-black text-white leading-tight mb-1 group-hover:text-orange-500 transition-colors uppercase tracking-tight">{item.name}</h2>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.category}</p>
                                        </div>
                                        <div className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border ${item.isAvailable
                                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                            {item.isAvailable ? 'LIVE' : 'HIDDEN'}
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1 font-bold uppercase tracking-widest">Market Price</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-black text-emerald-500">$ {item.finalPrice}</span>
                                                {item.discount > 0 && (
                                                    <span className="text-xs text-slate-600 line-through">$ {item.price}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 mb-1 font-bold uppercase tracking-widest">Stock Level</p>
                                            <span className={`text-sm font-black ${item.stock <= item.lowStockThreshold ? 'text-orange-500' : 'text-slate-300'}`}>
                                                {item.stock} UNITS
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal - Detail View */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6" onClick={() => setSelectedItem(null)}>
                    <div
                        className="bg-[#1e293b] rounded-3xl p-8 max-w-4xl w-full relative shadow-2xl border border-slate-800 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-full transition-colors">
                            <X size={24} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                                <div className="aspect-square rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                                    {selectedItem.image?.[0] ? (
                                        <img
                                            src={`http://localhost:5000${selectedItem.image[0]}`}
                                            alt={selectedItem.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                            <Utensils className="w-20 h-20 text-slate-700" />
                                        </div>
                                    )}
                                </div>
                                <div className="mt-8 flex gap-4">
                                    <div className="flex-1 p-4 bg-[#0f172a] rounded-2xl border border-slate-800">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Prep Time</p>
                                        <p className="text-xl font-black text-white">{selectedItem.prepTime} MIN</p>
                                    </div>
                                    <div className="flex-1 p-4 bg-[#0f172a] rounded-2xl border border-slate-800">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Stock</p>
                                        <p className={`text-xl font-black ${selectedItem.stock <= selectedItem.lowStockThreshold ? 'text-orange-500' : 'text-emerald-500'}`}>{selectedItem.stock} PCS</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{selectedItem.category}</span>
                                        <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">#{selectedItem._id.substring(18)}</span>
                                    </div>
                                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 leading-none">{selectedItem.name}</h2>
                                    <p className="text-slate-400 font-medium leading-relaxed italic border-l-2 border-orange-500/30 pl-4">"{selectedItem.description || 'No description provided.'}"</p>
                                </div>

                                <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-800">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Selling Price</p>
                                        <p className="text-3xl font-black text-emerald-500">$ {selectedItem.finalPrice}</p>
                                        {selectedItem.discount > 0 && <p className="text-sm text-slate-600 line-through font-bold mt-1">$ {selectedItem.price}</p>}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Inventory Alert</p>
                                        <div className="flex items-center justify-end gap-2 mt-2">
                                            <AlertCircle className={`w-4 h-4 ${selectedItem.stock <= selectedItem.lowStockThreshold ? 'text-orange-500' : 'text-slate-700'}`} />
                                            <span className="text-sm font-bold text-slate-300">Trigger at {selectedItem.lowStockThreshold} units</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                                    {selectedItem.ingredients?.length > 0 && (
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Key Ingredients</p>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedItem.ingredients.map((ing, idx) => (
                                                    <span key={idx} className="bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-700">{ing}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedItem.sizes?.length > 0 && (
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Sizing Options</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {selectedItem.sizes.map((s, idx) => (
                                                    <div key={idx} className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 flex justify-between items-center group hover:border-orange-500/30 transition-all">
                                                        <span className="text-xs font-black text-slate-300 uppercase">{s.size}</span>
                                                        <span className="text-sm font-black text-orange-500">$ {s.price}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto pt-8 flex gap-4">
                                    <button
                                        onClick={(e) => { handleEdit(selectedItem, e); setSelectedItem(null); }}
                                        className="flex-1 bg-[#0f172a] hover:bg-slate-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest border border-slate-800 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Pencil className="w-5 h-5" /> Edit Profile
                                    </button>
                                    <button
                                        onClick={(e) => { handleDelete(selectedItem, e); setSelectedItem(null); }}
                                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-4 rounded-2xl font-black uppercase tracking-widest border border-red-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="w-5 h-5" /> Delete Asset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
