import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Store, Mail, Lock, Phone, FileText, ImagePlus, Coins, MapPin, Timer, TimerIcon } from 'lucide-react'
import { Country, State, City } from 'country-state-city'

export default function RegisterRestaurant() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contact: '',
    description: '',
    deliveryFee: '',
    status: 'pending',
  })

  const [images, setImages] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  const [countryList, setCountryList] = useState([])
  const [stateList, setStateList] = useState([])
  const [cityList, setCityList] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    setCountryList(Country.getAllCountries())
  }, [])

  useEffect(() => {
    if (selectedCountry) {
      setStateList(State.getStatesOfCountry(selectedCountry))
      setSelectedState('')
      setCityList([])
    }
  }, [selectedCountry])

  useEffect(() => {
    if (selectedState) {
      setCityList(City.getCitiesOfState(selectedCountry, selectedState))
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
      navigate('/restaurant-signin')
    } catch (err) {
      console.error(err)
      alert('Error registering restaurant')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-sky-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[25rem] h-[25rem] bg-sky-200 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[25rem] h-[25rem] bg-green-200 rounded-full blur-3xl opacity-30 animate-pulse" />

      <form onSubmit={handleSubmit} className="relative z-10 bg-white/80 backdrop-blur-md shadow-2xl p-8 rounded-xl w-full max-w-2xl transition hover:scale-[1.01] grid grid-cols-2 gap-4">
        <h2 className="col-span-2 text-2xl font-bold text-center text-green-800 mb-2 flex items-center justify-center">
          <Store className="w-6 h-6 mr-2" /> Register Your Restaurant
        </h2>

        <Input icon={<Store />} name="name" placeholder="Restaurant Name" onChange={handleChange} />
        <Input icon={<Mail />} name="email" placeholder="Email" type="email" onChange={handleChange} />
        <Input icon={<Phone />} name="contact" placeholder="Contact Number" onChange={handleChange} />
        <Input icon={<Lock />} name="password" placeholder="Password" type="password" onChange={handleChange} />

        <div>
          <label className="block mb-1 text-sm font-semibold">Opening Time :</label>
          <Input icon={<Timer />} name="openingTime" placeholder="Opening Time" type="time" onChange={handleChange} />
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold">Closing Time :</label>
          <Input icon={<TimerIcon />} name="closingTime" placeholder="Closing Time" type="time" onChange={handleChange} />
        </div>

        
        {/* Country, State, City */}
        <div className="col-span-1">
          <label className="block mb-1 text-sm font-semibold">Country</label>
          <select
            value={selectedCountry}
            onChange={e => setSelectedCountry(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select Country</option>
            {countryList.map(c => (
              <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="col-span-1">
          <label className="block mb-1 text-sm font-semibold">State</label>
          <select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select State</option>
            {stateList.map(s => (
              <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="block mb-1 text-sm font-semibold">City</label>
          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select City</option>
            {cityList.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <Input icon={<Coins />} name="deliveryFee" placeholder="Delivery Fee (USD)" type="number" onChange={handleChange} />

        <div className="col-span-2 flex items-center border rounded px-3 py-2">
          <ImagePlus className="text-gray-400 mr-2" />
          <input type="file" name="images" multiple accept="image/*" onChange={handleFileChange} className="w-full outline-none" />
        </div>

        <div className="col-span-2 flex items-start border rounded px-3 py-2">
          <FileText className="text-gray-400 mt-2 mr-2" />
          <textarea
            name="description"
            placeholder="Restaurant Description"
            rows={3}
            onChange={handleChange}
            className="w-full outline-none"
          />
        </div>

        <div className="col-span-2 flex justify-end gap-4 mt-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow"
          >
            Submit
          </button>
        </div>

        <div className="col-span-2 mt-4 text-center">
          <a
            href="/login"
            className="text-sm text-green-600 hover:underline hover:text-sky-800 transition duration-150"
          >
            Already have an account? Login here.
          </a>
        </div>
      </form>
    </div>
  )
}

const Input = ({ icon, name, placeholder, onChange, type = 'text' }) => (
  <div className="flex items-center border rounded px-2">
    <span className="text-gray-400 mr-2">{icon}</span>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      required
      className="w-full p-2 outline-none"
    />
  </div>
)

