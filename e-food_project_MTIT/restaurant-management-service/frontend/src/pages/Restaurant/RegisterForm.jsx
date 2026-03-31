import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  X, Store, Mail, MapPin, Lock, Phone,
  FileText, ImagePlus, Coins,
  Timer,
  TimerIcon
} from 'lucide-react'

import { Country, State, City } from 'country-state-city'

export default function RegisterForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contact: '',
    description: '',
    deliveryFee: '',
    status: 'pending',
    openingTime: '09:00',
    closingTime: '22:00',
  })

  const [images, setImages] = useState([])

  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  const [countryList, setCountryList] = useState([])
  const [stateList, setStateList] = useState([])
  const [cityList, setCityList] = useState([])

  useEffect(() => {
    const countries = Country.getAllCountries()
    setCountryList(countries)
  }, [])

  useEffect(() => {
    if (selectedCountry) {
      const states = State.getStatesOfCountry(selectedCountry)
      setStateList(states)
      setSelectedState('')
      setCityList([])
    }
  }, [selectedCountry])

  useEffect(() => {
    if (selectedState) {
      const cities = City.getCitiesOfState(selectedCountry, selectedState)
      setCityList(cities)
    }
  }, [selectedState])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setImages([...e.target.files])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = new FormData()
      for (let key in formData) {
        data.append(key, formData[key])
      }

      data.append('address', `${selectedCity}, ${selectedState}, ${selectedCountry}`)

      images.forEach((file) => {
        data.append('images', file)
      })

      await axios.post('http://localhost:5000/api/restaurants/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      alert('Restaurant registered successfully!')
      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      alert('Error registering restaurant')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative animate-fadeIn">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-600">
          <X />
        </button>

        <h2 className="text-2xl font-bold text-sky-700 mb-4 flex items-center">
          <Store className="mr-2" /> Register New Restaurant
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <InputWithIcon icon={<Store />} name="name" placeholder="Restaurant Name" onChange={handleChange} />
          <InputWithIcon icon={<Mail />} name="email" placeholder="Email" onChange={handleChange} />
          <InputWithIcon icon={<Phone />} name="contact" placeholder="Contact" onChange={handleChange} />
          <InputWithIcon icon={<Lock />} name="password" type="password" placeholder="Password" onChange={handleChange} />

          {/* <InputWithIcon icon={<Timer />} name="openingTime" placeholder="Opening Time" onChange={handleChange} />
          <InputWithIcon icon={<TimerIcon />} name="closingTime" placeholder="Closing Time" onChange={handleChange} /> */}

          {/* Location Dropdowns */}
          <div className="col-span-2">
            <label className="block mb-1 font-medium text-gray-700">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
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
              required
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
              required
            >
              <option value="">Select City</option>
              {cityList.map((c, index) => (
                <option key={index} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <InputWithIcon icon={<Coins />} name="deliveryFee" placeholder="Delivery Fee" onChange={handleChange} />

          <div className="flex items-center border rounded px-2 col-span-2">
            <ImagePlus className="text-gray-400 mr-2" />
            <input type="file" name="images" onChange={handleFileChange} multiple className="w-full p-2 outline-none" />
          </div>

          <div className="flex items-start border rounded px-2 col-span-2">
            <FileText className="text-gray-400 mt-2 mr-2" />
            <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full p-2 outline-none" rows={3}></textarea>
          </div>

          <div className="col-span-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-800">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Reusable input with icon
const InputWithIcon = ({ icon, name, placeholder, onChange, type = 'text' }) => (
  <div className="flex items-center border rounded px-2">
    <span className="text-gray-400 mr-2">{icon}</span>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full p-2 outline-none"
      required
    />
  </div>
)
