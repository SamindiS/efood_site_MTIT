
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { X, FileText, User, Mail, Phone, MapPin, DollarSign, Clock } from 'lucide-react'

export default function OrderForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    restaurantId: '',
    items: [],
    customer: { name: '', phone: '', email: '', address: '' },
    paymentMethod: 'cash_on_delivery',
    deliveryTimeEstimate: '',
  })
  const [restaurants, setRestaurants] = useState([])
  const [menuItems, setMenuItems] = useState([])

  useEffect(() => {
    async function fetchData() {
      const resRestaurants = await axios.get('http://localhost:5000/api/restaurants')
      const resMenu = await axios.get('http://localhost:5000/api/menu')
      setRestaurants(resRestaurants.data)
      setMenuItems(resMenu.data)
    }
    fetchData()
  }, [])

  const handleCustomerChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, customer: { ...formData.customer, [name]: value } })
  }

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items]
    updatedItems[index][field] = value
    setFormData({ ...formData, items: updatedItems })
  }

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { menuItemId: '', quantity: 1, price: 0 }] })
  }

  const removeItem = (index) => {
    const updated = [...formData.items]
    updated.splice(index, 1)
    setFormData({ ...formData, items: updated })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const totalAmount = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    try {
      await axios.post('http://localhost:5000/api/orders', { ...formData, totalAmount })
      alert('Order created!')
      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      alert('Error creating order')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative animate-fadeIn overflow-y-auto max-h-screen">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-600">
          <X />
        </button>

        <h2 className="text-2xl font-bold text-sky-700 mb-4 flex items-center">
          <FileText className="mr-2" /> Add New Order
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-semibold">Restaurant</label>
            <select className="w-full border p-2 rounded" value={formData.restaurantId} onChange={e => setFormData({ ...formData, restaurantId: e.target.value })}>
              <option value="">Select Restaurant</option>
              {restaurants.map(r => (
                <option key={r._id} value={r._id}>{r.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-semibold">Items</label>

            {formData.items.map((item, i) => (
                <div key={i} className="border p-2 rounded mb-2">
                    <div className="grid grid-cols-4 gap-2 mb-2">
                    <div className="col-span-4 md:col-span-2">
                        <label className="block text-sm font-medium">Menu Item</label>
                        <select value={item.menuItemId} onChange={e => handleItemChange(i, 'menuItemId', e.target.value)} className="w-full border p-2 rounded">
                        <option value="">Select Item</option>
                        {menuItems.map(mi => (
                            <option key={mi._id} value={mi._id}>{mi.name}</option>
                        ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Quantity</label>
                        <input type="number" min="1" value={item.quantity} onChange={e => handleItemChange(i, 'quantity', parseInt(e.target.value))} className="w-full border p-2 rounded" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Price</label>
                        <input type="number" min="0" value={item.price} onChange={e => handleItemChange(i, 'price', parseFloat(e.target.value))} className="w-full border p-2 rounded" />
                    </div>
                    </div>

                    <div className="text-right">
                    <button type="button" onClick={() => removeItem(i)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700">
                        Remove Item
                    </button>
                    </div>
                </div>
            ))}

            <button type="button" onClick={addItem} className="text-sm text-blue-600 underline">+ Add Item</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField icon={<User />} name="name" placeholder="Customer Name" value={formData.customer.name} onChange={handleCustomerChange} />
            <InputField icon={<Phone />} name="phone" placeholder="Phone" value={formData.customer.phone} onChange={handleCustomerChange} />
            <InputField icon={<Mail />} name="email" placeholder="Email" value={formData.customer.email} onChange={handleCustomerChange} />
            <InputField icon={<MapPin />} name="address" placeholder="Address" value={formData.customer.address} onChange={handleCustomerChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Payment Method</label>
              <select className="w-full border p-2 rounded" value={formData.paymentMethod} onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}>
                <option value="cash_on_delivery">Cash on Delivery</option>
                <option value="card">Card</option>
                <option value="online">Online</option>
              </select>
            </div>
            <InputField icon={<Clock />} name="deliveryTimeEstimate" placeholder="Delivery time (min)" value={formData.deliveryTimeEstimate} onChange={e => setFormData({ ...formData, deliveryTimeEstimate: e.target.value })} />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
            <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-800">Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}

const InputField = ({ icon, name, placeholder, value, onChange }) => (
  <div className="flex items-center border rounded px-2">
    <span className="text-gray-400 mr-2">{icon}</span>
    <input
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-2 outline-none"
      required
    />
  </div>
)
