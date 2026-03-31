import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    X, Utensils, FileText, ImagePlus, Coins, List, Tag, Clock, Percent, Boxes
} from 'lucide-react';

export default function MenuForm({ onClose, onSuccess, restaurantId }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        discount: 0,
        prepTime: '',
        tags: '',
        ingredients: '',
        stock: '',
        lowStockThreshold: '',
        isAvailable: true,
        sizes: [],
        addOns: [],
        finalPrice: '',
    });

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const price = parseFloat(formData.price) || 0;
        const discount = parseFloat(formData.discount) || 0;
        const final = price - (price * discount / 100);
        setFormData(prev => ({ ...prev, finalPrice: final.toFixed(2) }));
    }, [formData.price, formData.discount]);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFileChange = e => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleAddSize = () => {
        setFormData({ ...formData, sizes: [...formData.sizes, { size: '', price: '' }] });
    };

    const handleSizeChange = (index, field, value) => {
        const updated = [...formData.sizes];
        updated[index][field] = value;
        setFormData({ ...formData, sizes: updated });
    };

    const handleAddAddOn = () => {
        setFormData({ ...formData, addOns: [...formData.addOns, { name: '', price: '' }] });
    };

    const handleAddOnChange = (index, field, value) => {
        const updated = [...formData.addOns];
        updated[index][field] = value;
        setFormData({ ...formData, addOns: updated });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (Array.isArray(formData[key])) {
                    data.append(key, JSON.stringify(formData[key]));
                } else {
                    data.append(key, formData[key]);
                }
            });

            data.append('restaurantId', restaurantId);
            if (image) data.append('image', image);

            await axios.post('http://localhost:5010/restaurant-service/api/menu/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('Menu item created!');
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Full Axios Error:", err);
            alert(err.response?.data?.error || 'Error submitting menu item');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] overflow-auto p-4">
            <div className="bg-[#1e293b] w-full max-w-3xl p-8 rounded-3xl relative shadow-2xl overflow-y-auto max-h-[90vh] border border-slate-800">
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
                    <div className="p-2 bg-orange-500 rounded-lg shadow-lg shadow-orange-500/20">
                        <Utensils className="w-6 h-6 text-white" />
                    </div>
                    Add New Menu Item
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                    <div className="space-y-4 col-span-2 md:col-span-1">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Basic Info</label>
                        <Input icon={<Utensils className="w-4 h-4" />} name="name" placeholder="Item Name" onChange={handleChange} />
                        <Input icon={<List className="w-4 h-4" />} name="category" placeholder="Category" onChange={handleChange} />
                        <div className="grid grid-cols-2 gap-4">
                            <Input icon={<Coins className="w-4 h-4" />} name="price" type="number" placeholder="Price" onChange={handleChange} />
                            <Input icon={<Percent className="w-4 h-4" />} name="discount" type="number" placeholder="Discount %" onChange={handleChange} />
                        </div>
                        <Input icon={<Clock className="w-4 h-4" />} name="prepTime" type="number" placeholder="Prep Time (min)" onChange={handleChange} />
                    </div>

                    <div className="space-y-4 col-span-2 md:col-span-1">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Inventory</label>
                        <Input icon={<Boxes className="w-4 h-4" />} name="stock" type="number" placeholder="Initial Stock" onChange={handleChange} />
                        <Input icon={<Boxes className="w-4 h-4" />} name="lowStockThreshold" type="number" placeholder="Low Stock Alert Level" onChange={handleChange} />
                        <Input icon={<Tag className="w-4 h-4" />} name="tags" placeholder="Tags (comma separated)" onChange={handleChange} />
                        <Input icon={<Boxes className="w-4 h-4" />} name="ingredients" placeholder="Ingredients (comma separated)" onChange={handleChange} />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2">Detailed Description</label>
                        <textarea
                            name="description"
                            rows="3"
                            onChange={handleChange}
                            className="w-full bg-[#0f172a] border border-slate-800 rounded-xl p-4 text-white font-bold outline-none focus:ring-1 focus:ring-orange-500 transition-all resize-none"
                            placeholder="Tell us about this dish..."
                        ></textarea>
                    </div>

                    <div className="col-span-2 border border-slate-800 p-6 rounded-2xl bg-[#0f172a]/30">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Variant Sizes</label>
                        {formData.sizes.map((s, i) => (
                            <div key={i} className="flex gap-4 mb-3 items-center">
                                <input placeholder="Size (e.g. Small)" className="flex-1 bg-[#0f172a] border border-slate-800 rounded-xl p-3 text-white font-bold outline-none"
                                    value={s.size} onChange={e => handleSizeChange(i, 'size', e.target.value)} />
                                <input placeholder="Price" type="number" className="flex-1 bg-[#0f172a] border border-slate-800 rounded-xl p-3 text-white font-bold outline-none"
                                    value={s.price} onChange={e => handleSizeChange(i, 'price', e.target.value)} />
                                <button type="button" onClick={() => {
                                    const updated = [...formData.sizes];
                                    updated.splice(i, 1);
                                    setFormData({ ...formData, sizes: updated });
                                }} className="p-3 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddSize} className="text-orange-500 font-black text-[10px] uppercase tracking-widest hover:text-orange-400 transition-colors flex items-center gap-1">
                            + Add New Size
                        </button>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2">Item Visuals</label>
                        <div className="border-2 border-dashed border-slate-800 bg-[#0f172a] rounded-2xl p-6 text-center hover:border-orange-500/50 transition-colors cursor-pointer relative group">
                            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                            {imagePreview ? (
                                <div className="relative h-40 w-full">
                                    <img src={imagePreview} alt="Preview" className="h-full w-full object-contain rounded-xl" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                        <span className="text-white text-xs font-black uppercase tracking-widest">Change Image</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-4">
                                    <ImagePlus className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Drag & drop or catch image</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-span-2 flex items-center gap-3 p-4 bg-[#0f172a]/30 rounded-2xl border border-slate-800">
                        <div className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </div>
                        <label className="text-sm font-bold text-slate-300">Available for Ordering</label>
                    </div>

                    <div className="col-span-2 flex justify-end gap-4 mt-4">
                        <button type="button" onClick={onClose} className="px-8 py-3 text-slate-400 font-bold hover:text-white transition-colors">Cancel</button>
                        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-3 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 transition-all active:scale-95">Save Item</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const Input = ({ icon, name, placeholder, onChange, type = 'text', value, disabled }) => (
    <div className="flex items-center gap-3 bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-3 focus-within:ring-1 focus-within:ring-orange-500 transition-all">
        <div className="text-slate-500">{icon}</div>
        <input
            name={name}
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
            disabled={disabled}
            className="bg-transparent w-full text-white font-bold outline-none placeholder:text-slate-600 placeholder:font-normal"
            required={!disabled}
        />
    </div>
);
