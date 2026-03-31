import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/SideBar';
import axios from 'axios';
import MenuForm from './MenuForm';
import MenuEditForm from './MenuEditForm';
import { FilePlus, Download, Pencil, Trash2, Search, X, ChevronRight } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
const token = localStorage.getItem('token');

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // const fetchMenuItems = async () => {
  //   try {
  //     const res = await axios.get('http://localhost:5010/restaurant-service/api/menu');
  //     setMenuItems(res.data);
  //     setLoading(false);
  //   } catch (err) {
  //     console.error('Error fetching menu items:', err);
  //   }
  // };

  // In your Menu.js React component
  const fetchMenuItems = async () => {
    try {
      // Get restaurantId from localStorage or your auth state
      const restaurantId = localStorage.getItem('restaurantId');
      // alert(localStorage.getItem('restaurantName')); 

      const res = await axios.get(`http://localhost:5010/restaurant-service/api/menu?restaurantId=${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMenuItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching menu items:', err);
    }
  };

  const handleDelete = async (item, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      try {
        await axios.delete(`http://localhost:5010/restaurant-service/api/menu/${item._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Show success toast
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg transition-opacity duration-500';
        toast.innerHTML = `<div class="flex items-center"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Item "${item.name}" deleted successfully!</div>`;
        document.body.appendChild(toast);

        setTimeout(() => {
          toast.style.opacity = '0';
          setTimeout(() => {
            document.body.removeChild(toast);
          }, 500);
        }, 3000);

        fetchMenuItems(); // refresh the list
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

  const handleExportExcel = () => {
    const data = menuItems.map(({ name, category, price, discount, stock, isAvailable }) => ({
      Name: name,
      Category: category,
      Price: price,
      Discount: discount,
      Stock: stock,
      Available: isAvailable ? 'Yes' : 'No',
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'MenuItems');
    XLSX.writeFile(wb, 'MenuItems.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const rows = menuItems.map(item => [
      item.name, item.category, `US$. ${item.price}`, `${item.discount}%`, item.stock, item.isAvailable ? 'Yes' : 'No'
    ]);
    doc.autoTable({
      head: [['Name', 'Category', 'Price', 'Discount', 'Stock', 'Available']],
      body: rows
    });
    doc.save('MenuItems.pdf');
  };

  // Get unique categories
  const categories = ['All', ...new Set(menuItems.map(item => item.category).filter(Boolean))];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-sky-700">Menu Items</h1>
            <h1>{menuItems.name}</h1>
            <p className="text-gray-500 mt-1">Manage your restaurant menu items</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center bg-gradient-to-r from-sky-600 to-sky-800 text-white px-5 py-2.5 rounded-lg hover:shadow-lg transition duration-300 font-medium"
          >
            <FilePlus className="mr-2" size={18} /> Add New Item
          </button>
        </div>

        {showForm && (
          <MenuForm
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              fetchMenuItems();
              setShowForm(false);
            }}
          />
        )}

        {showEditForm && (
          <MenuEditForm
            menuItem={editItem}
            onClose={() => setShowEditForm(false)}
            onSuccess={() => {
              fetchMenuItems();
              setShowEditForm(false);
            }}
          />
        )}

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name or category..."
                className="border border-gray-300 pl-10 pr-4 py-2.5 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              {searchText && (
                <button
                  onClick={() => setSearchText('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={handleExportExcel}
                className="flex items-center justify-center bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition duration-300 w-full md:w-auto"
              >
                <Download className="mr-2" size={18} /> Excel
              </button>
              {/* <button 
                onClick={handleExportPDF} 
                className="flex items-center justify-center bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition duration-300 w-full md:w-auto"
              >
                <FileText className="mr-2" size={18} /> PDF
              </button> */}
            </div>
          </div>

          <div className="flex overflow-x-auto pb-2 mb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 whitespace-nowrap mr-2 rounded-full text-sm font-medium transition-all ${activeCategory === category
                    ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No menu items found</h3>
              <p className="mt-1 text-gray-500">Try changing your search or filter criteria</p>
            </div>
          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(item => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer group transition duration-300 hover:shadow-lg hover:border-sky-300"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative">
                    {item.image?.[0] ? (
                      <img
                        src={`http://localhost:5010/restaurant-service${item.image[0]}`}
                        alt={item.name}
                        className="w-full h-52 object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-52 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Discount badge */}
                    {item.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white font-bold py-1 px-3 rounded-lg text-sm">
                        {item.discount}% OFF
                      </div>
                    )}

                    {/* Stock badge */}
                    {item.stock <= 5 && item.stock > 0 && (
                      <div className="absolute top-3 right-3 bg-amber-500 text-white font-bold py-1 px-3 rounded-lg text-sm">
                        Only {item.stock} left
                      </div>
                    )}

                    {item.stock === 0 && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white font-bold py-1 px-3 rounded-lg text-sm">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">{item.name}</h2>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                      <span
                        className={`inline-flex h-6 items-center px-2 py-0.5 text-xs font-medium rounded-full ${item.isAvailable
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                          }`}
                      >
                        {item.isAvailable ? 'Available' : 'Hidden'}
                      </span>
                    </div>

                    <div className="mt-3 flex items-end justify-between">
                      <div>
                        {item.discount > 0 ? (
                          <div className="flex items-baseline gap-2">
                            <p className="font-bold text-lg text-sky-700">
                              US$. {(item.price * (1 - item.discount / 100)).toFixed(0)}
                            </p>
                            <p className="text-sm text-gray-500 line-through">US$. {item.price}</p>
                          </div>
                        ) : (
                          <p className="font-bold text-lg text-sky-700">US$. {item.price}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => handleEdit(item, e)}
                          className="p-2 text-gray-500 hover:text-sky-600 hover:bg-sky-50 rounded-full transition duration-200"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(item, e)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition duration-200"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Prep time: {item.prepTime || '—'} min
                      </div>
                      <button className="text-sky-600 hover:text-sky-800 text-sm font-medium flex items-center">
                        Details <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal with detailed view */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={() => setSelectedItem(null)}>
            <div
              className="bg-white rounded-xl p-6 max-w-2xl w-full relative animate-scaleIn shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col md:flex-row gap-6">
                {selectedItem.image?.[0] ? (
                  <img
                    src={`http://localhost:5010/restaurant-service${selectedItem.image[0]}`}
                    alt={selectedItem.name}
                    className="w-full md:w-1/3 h-64 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full md:w-1/3 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-gray-800">{selectedItem.name}</h2>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedItem.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {selectedItem.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-sky-600">
                      US$. {(selectedItem.price * (1 - selectedItem.discount / 100)).toFixed(0)}
                    </span>
                    {selectedItem.discount > 0 && (
                      <>
                        <span className="text-lg text-gray-400 line-through">US$. {selectedItem.price}</span>
                        <span className="text-sm font-medium text-red-500">({selectedItem.discount}% off)</span>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-4">
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium">{selectedItem.category || '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Preparation Time</p>
                      <p className="font-medium">{selectedItem.prepTime || '—'} min</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Stock</p>
                      <p className="font-medium">{selectedItem.stock || '0'} items</p>
                    </div>
                  </div>

                  {selectedItem.description && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="text-gray-700 mt-1">{selectedItem.description}</p>
                    </div>
                  )}

                  {selectedItem.ingredients?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Ingredients</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedItem.ingredients.map((ingredient, idx) => (
                          <span key={idx} className="bg-gray-100 px-2 py-1 rounded-md text-sm">
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedItem.tags?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Tags</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedItem.tags.map((tag, idx) => (
                          <span key={idx} className="bg-sky-100 text-sky-800 px-2 py-1 rounded-md text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedItem.sizes?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Available Sizes</p>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {selectedItem.sizes.map((size, idx) => (
                          <div key={idx} className="border border-gray-200 rounded p-2 text-center">
                            <p className="font-medium">{size.size}</p>
                            <p className="text-sm text-gray-500">US$. {size.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedItem.addOns?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Add-ons</p>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {selectedItem.addOns.map((addon, idx) => (
                          <div key={idx} className="flex justify-between items-center border-b border-gray-100 py-1">
                            <span>{addon.name}</span>
                            <span className="text-sky-600">US$. {addon.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex gap-3 justify-end">
                    <button
                      onClick={(e) => {
                        handleEdit(selectedItem, e);
                        setSelectedItem(null);
                      }}
                      className="flex items-center px-4 py-2 bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100"
                    >
                      <Pencil size={16} className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={(e) => {
                        handleDelete(selectedItem, e);
                        setSelectedItem(null);
                      }}
                      className="flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

