import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  X, Utensils, FileText, ImagePlus, Coins, List, Tag, Clock, Percent, Boxes
} from 'lucide-react';

export default function MenuEditForm({ menuItem, onClose, onSuccess }) {
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
    finalPrice: ''
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (menuItem) {
      setFormData({
        name: menuItem.name || '',
        description: menuItem.description || '',
        price: menuItem.price || '',
        category: menuItem.category || '',
        discount: menuItem.discount || 0,
        prepTime: menuItem.prepTime || '',
        tags: menuItem.tags?.join(', ') || '',
        ingredients: menuItem.ingredients?.join(', ') || '',
        stock: menuItem.stock || '',
        lowStockThreshold: menuItem.lowStockThreshold || '',
        isAvailable: menuItem.isAvailable || false,
        sizes: menuItem.sizes || [],
        addOns: menuItem.addOns || [],
        finalPrice: menuItem.finalPrice || ''
      });

      if (menuItem.image?.[0]) {
        setImagePreview(`http://localhost:5000${menuItem.image[0]}`);
      }
    }
  }, [menuItem]);

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

      if (image) data.append('image', image);

      await axios.put(`http://localhost:5000/api/menu/${menuItem._id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Menu item updated!');
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Full Axios Error:", err);
      alert(err.response?.data?.error || 'Error updating menu item');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white w-full max-w-3xl p-6 rounded-lg relative shadow-md overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-600">
          <X />
        </button>

        <h2 className="text-2xl font-bold text-sky-700 mb-6 flex items-center">
          <Utensils className="mr-2" /> Edit Menu Item
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <Input icon={<Utensils />} name="name" value={formData.name} onChange={handleChange} />
          <Input icon={<Coins />} name="price" value={formData.price} type="number" onChange={handleChange} />
          <Input icon={<List />} name="category" value={formData.category} onChange={handleChange} />
          <Input icon={<Percent />} name="discount" value={formData.discount} type="number" onChange={handleChange} />
          <Input icon={<Clock />} name="prepTime" value={formData.prepTime} type="number" onChange={handleChange} />
          <Input icon={<Tag />} name="tags" value={formData.tags} onChange={handleChange} />
          <Input icon={<Boxes />} name="ingredients" value={formData.ingredients} onChange={handleChange} />
          <Input icon={<Boxes />} name="stock" value={formData.stock} type="number" onChange={handleChange} />
          <Input icon={<Boxes />} name="lowStockThreshold" value={formData.lowStockThreshold} type="number" onChange={handleChange} />
          <Input icon={<Coins />} name="finalPrice" value={formData.finalPrice} type="number" disabled />

          <div className="col-span-2 border p-4 rounded">
            <label className="font-medium mb-2 block">Sizes</label>
            {formData.sizes.map((s, i) => (
              <div key={i} className="flex gap-2 mb-2 items-center">
                <input className="p-2 border rounded w-1/2" value={s.size} onChange={e => handleSizeChange(i, 'size', e.target.value)} />
                <input type="number" className="p-2 border rounded w-1/2" value={s.price} onChange={e => handleSizeChange(i, 'price', e.target.value)} />
                <button type="button" onClick={() => {
                  const updated = [...formData.sizes];
                  updated.splice(i, 1);
                  setFormData({ ...formData, sizes: updated });
                }} className="text-red-500 text-sm hover:text-red-700">❌</button>
              </div>
            ))}
            <button type="button" onClick={handleAddSize} className="text-sky-600 hover:underline text-sm mt-2">+ Add Size</button>
          </div>

          <div className="col-span-2 border p-4 rounded">
            <label className="font-medium mb-2 block">Add-ons</label>
            {formData.addOns.map((a, i) => (
              <div key={i} className="flex gap-2 mb-2 items-center">
                <input className="p-2 border rounded w-1/2" value={a.name} onChange={e => handleAddOnChange(i, 'name', e.target.value)} />
                <input type="number" className="p-2 border rounded w-1/2" value={a.price} onChange={e => handleAddOnChange(i, 'price', e.target.value)} />
                <button type="button" onClick={() => {
                  const updated = [...formData.addOns];
                  updated.splice(i, 1);
                  setFormData({ ...formData, addOns: updated });
                }} className="text-red-500 text-sm hover:text-red-700">❌</button>
              </div>
            ))}
            <button type="button" onClick={handleAddAddOn} className="text-sky-600 hover:underline text-sm mt-2">+ Add Add-on</button>
          </div>

          <div className="col-span-2">
            <label className="block mb-1 text-sm text-gray-700">Change Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded" />
            {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-32 object-cover rounded" />}
          </div>


          <div className="col-span-2">
            <label className="block mb-1 text-sm text-gray-700">Description</label>
            <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full border rounded p-2"></textarea>
          </div>

          <div className="flex items-center col-span-2 space-x-2">
            <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} className="h-4 w-4" />
            <label className="text-gray-700">Available</label>
          </div>

          <div className="col-span-2 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
            <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-800">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const Input = ({ icon, name, placeholder, onChange, type = 'text', value, disabled }) => (
  <div className="flex items-center border rounded px-2">
    <span className="text-gray-400 mr-2">{icon}</span>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      disabled={disabled}
      className="w-full p-2 outline-none"
      required={!disabled}
    />
  </div>
);
