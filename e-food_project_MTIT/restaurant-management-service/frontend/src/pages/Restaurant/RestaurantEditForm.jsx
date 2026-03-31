import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  X, Store, Mail, MapPin, Lock, Phone,
  FileText, ImagePlus, Coins,
  Timer,
  Clock,
  AlertCircle
} from 'lucide-react'

import { Country, State, City } from 'country-state-city'
import { useNavigate } from 'react-router-dom';

export default function RestaurantEditForm({ onClose, onSuccess }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    contact: '',
    description: '',
    deliveryFee: '',
    status: '',
    openingTime: '',
    closingTime: '',
  })

  const [images, setImages] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  const [countryList, setCountryList] = useState([])
  const [stateList, setStateList] = useState([])
  const [cityList, setCityList] = useState([])

  // Fetch current restaurant data
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        if (!token) {
          console.error('No token found')
          return
        }

        const response = await axios.get('http://localhost:5000/api/restaurants/me', {
          headers: { Authorization: `Bearer ${token}` }
        })

        const restaurant = response.data
        
        // Set form data from restaurant details
        setFormData({
          name: restaurant.name || '',
          email: restaurant.email || '',
          password: '', // Don't populate password
          confirmPassword: '', // Don't populate confirm password
          contact: restaurant.contact || '',
          description: restaurant.description || '',
          deliveryFee: restaurant.deliveryFee || '',
          status: restaurant.status || 'pending',
          openingTime: restaurant.openingTime || '09:00',
          closingTime: restaurant.closingTime || '22:00',
        })

        // Set images if available
        if (restaurant.image && restaurant.image.length > 0) {
          setImageUrls(restaurant.image)
        }

        // Parse address components if available
        if (restaurant.country) setSelectedCountry(restaurant.country)
        if (restaurant.state) setSelectedState(restaurant.state)
        if (restaurant.city) setSelectedCity(restaurant.city)

        setLoading(false)
      } catch (err) {
        console.error('Error fetching restaurant data:', err)
        setLoading(false)
      }
    }

    fetchRestaurantData()
  }, [])

  useEffect(() => {
    const countries = Country.getAllCountries()
    setCountryList(countries)
  }, [])

  useEffect(() => {
    if (selectedCountry) {
      const states = State.getStatesOfCountry(selectedCountry)
      setStateList(states)
      if (!states.find(state => state.isoCode === selectedState)) {
        setSelectedState('')
        setCityList([])
      }
    }
  }, [selectedCountry, selectedState])

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const cities = City.getCitiesOfState(selectedCountry, selectedState)
      setCityList(cities)
    }
  }, [selectedCountry, selectedState])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // Clear error when changing password fields
    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      setError('')
    }
  }

  const handleFileChange = (e) => {
    setImages([...e.target.files])
  }

  const validateForm = () => {
    // Check if password and confirm password match if either is provided
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate passwords match
    if (!validateForm()) {
      return
    }
    
    try {
      const data = new FormData()
      
      // Only append non-empty fields to avoid overwriting with empty values
      for (let key in formData) {
        // Skip the confirmPassword field as it's only for front-end validation
        if (key === 'confirmPassword') continue
        
        if (formData[key] !== '') {
          data.append(key, formData[key])
        }
      }

      if (selectedCountry) data.append('country', selectedCountry)
      if (selectedState) data.append('state', selectedState)
      if (selectedCity) data.append('city', selectedCity)
      
      // Create full address string if all location components are selected
      if (selectedCity && selectedState && selectedCountry) {
        const countryName = countryList.find(c => c.isoCode === selectedCountry)?.name || ''
        const stateName = stateList.find(s => s.isoCode === selectedState)?.name || ''
        data.append('address', `${selectedCity}, ${stateName}, ${countryName}`)
      }

      // Only append images if new ones are selected
      if (images.length > 0) {
        images.forEach((file) => {
          data.append('images', file)
        })
      }

      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No token found')
        return
      }

      await axios.put('http://localhost:5000/api/restaurants/update', data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      })

      alert('Restaurant updated successfully!')
      navigate('/restaurant-my')
      if (onSuccess) onSuccess()
      if (onClose) onClose()
    } catch (err) {
      console.error(err)
      alert('Error updating restaurant: ' + (err.response?.data?.error || err.message))
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 text-center">
          <p>Loading restaurant information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        <button onClick={() => navigate('/restaurant-my')} className="absolute top-4 right-4 text-gray-500 hover:text-red-600 z-10">
          <X />
        </button>

        <h2 className="text-2xl font-bold text-sky-700 mb-4 flex items-center sticky top-0 bg-white py-2">
          <Store className="mr-2" /> Edit Restaurant Profile
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Restaurant Details */}
        <InputWithIcon 
            icon={<Store />} 
            name="name" 
            className="w-full p-2"
            placeholder="Restaurant Name" 
            value={formData.name}
            onChange={handleChange} 
          />

          <br />
          
          <InputWithIcon 
            icon={<Mail />} 
            name="email" 
            placeholder="Email" 
            value={formData.email}
            onChange={handleChange} 
          />
          
          <InputWithIcon 
            icon={<Phone />} 
            name="contact" 
            placeholder="Contact" 
            value={formData.contact}
            onChange={handleChange} 
          />
          
          {/* Password Fields */}
          <div className="col-span-1">
            <label className="block mb-1 font-medium text-gray-700">New Password</label>
            <InputWithIcon 
              icon={<Lock />} 
              name="password" 
              type="password" 
              placeholder="New Password (leave empty to keep current)" 
              value={formData.password}
              onChange={handleChange} 
              required={false}
            />
          </div>
          
          <div className="col-span-1">
            <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
            <InputWithIcon 
              icon={<Lock />} 
              name="confirmPassword" 
              type="password" 
              placeholder="Confirm New Password" 
              value={formData.confirmPassword}
              onChange={handleChange} 
              required={false}
            />
          </div>

          {/* Error message for password mismatch */}
          {error && (
            <div className="col-span-2 flex items-center text-red-500 text-sm">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          <div className="col-span-1">
            <label className="block mb-1 font-medium text-gray-700">Opening Time</label>
            <div className="flex items-center border rounded px-2">
              <Clock className="text-gray-400 mr-2" />
              <input
                name="openingTime"
                type="time"
                value={formData.openingTime}
                onChange={handleChange}
                className="w-full p-2 outline-none"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label className="block mb-1 font-medium text-gray-700">Closing Time</label>
            <div className="flex items-center border rounded px-2">
              <Clock className="text-gray-400 mr-2" />
              <input
                name="closingTime"
                type="time"
                value={formData.closingTime}
                onChange={handleChange}
                className="w-full p-2 outline-none"
              />
            </div>
          </div>

          {/* Location Dropdowns */}
          <div className="col-span-2">
            <label className="block mb-1 font-medium text-gray-700">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Country</option>
              {countryList.map((c) => (
                <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="col-span-1">
            <label className="block mb-1 font-medium text-gray-700">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full border rounded px-3 py-2"
              disabled={!selectedCountry}
            >
              <option value="">Select State</option>
              {stateList.map((s) => (
                <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="col-span-1">
            <label className="block mb-1 font-medium text-gray-700">City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full border rounded px-3 py-2"
              disabled={!selectedState}
            >
              <option value="">Select City</option>
              {cityList.map((c, index) => (
                <option key={index} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="col-span-1">
            <InputWithIcon 
              icon={<Coins />} 
              name="deliveryFee" 
              placeholder="Delivery Fee" 
              value={formData.deliveryFee}
              onChange={handleChange} 
            />
          </div>

          <div className="col-span-1">
            <label className="block mb-1 font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Current Images */}
          {imageUrls.length > 0 && (
            <div className="col-span-2">
              <label className="block mb-1 font-medium text-gray-700">Current Images</label>
              <div className="flex flex-wrap gap-2">
                {imageUrls.map((url, index) => (
                  <div key={index} className="h-16 w-16 relative">
                    <img 
                      src={`http://localhost:5000${url}`} 
                      alt={`Restaurant image ${index + 1}`} 
                      className="h-full w-full object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="col-span-2">
            <label className="block mb-1 font-medium text-gray-700">Upload New Images</label>
            <div className="flex items-center border rounded px-2">
              <ImagePlus className="text-gray-400 mr-2" />
              <input 
                type="file" 
                name="images" 
                onChange={handleFileChange} 
                multiple 
                className="w-full p-2 outline-none" 
              />
            </div>
          </div>

          <div className="col-span-2">
            <label className="block mb-1 font-medium text-gray-700">Restaurant Description</label>
            <div className="flex items-start border rounded px-2">
              <FileText className="text-gray-400 mt-2 mr-2" />
              <textarea 
                name="description" 
                placeholder="Description" 
                value={formData.description}
                onChange={handleChange} 
                className="w-full p-2 outline-none" 
                rows={4}
              ></textarea>
            </div>
          </div>

          <div className="col-span-2 flex justify-end space-x-2 sticky bottom-0 bg-white py-3">
            <button
              type="button"
              onClick={() => navigate('/restaurant-my')}            
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-800">
              Update Restaurant Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Reusable input with icon
const InputWithIcon = ({ icon, name, placeholder, onChange, type = 'text', value = '', required = true }) => (
  <div className="flex items-center border rounded px-2">
    <span className="text-gray-400 mr-2">{icon}</span>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-2 outline-none"
      required={required}
    />
  </div>
)