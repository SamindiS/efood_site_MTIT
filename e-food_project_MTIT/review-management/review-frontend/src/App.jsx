import React, { useState, useEffect } from 'react';
import { getReviews, addReview, getAllRestaurants } from './utils/api';
import {
  Star,
  MessageSquare,
  User,
  Calendar,
  Send,
  TrendingUp,
  Filter,
  Loader2,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [reviews, setReviews] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingRest, setFetchingRest] = useState(true);
  const [formData, setFormData] = useState({
    userId: 'USER_' + Math.floor(Math.random() * 1000), // Mocked for now
    restaurantId: '',
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchReviews();
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setFetchingRest(true);
    try {
      const res = await getAllRestaurants();
      console.log("Fetched restaurants:", res.data);
      setRestaurants(res.data);
    } catch (err) {
      console.error("Failed to fetch restaurants", err);
    } finally {
      setFetchingRest(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await getReviews();
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.restaurantId || !formData.comment) return alert("Please fill all fields");

    try {
      await addReview(formData);
      setFormData({ ...formData, comment: '', rating: 5 });
      fetchReviews();
    } catch (err) {
      alert("Failed to submit review");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-accent py-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
            Customer <span className="text-primary italic">Feedback</span>
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto font-medium">
            Honest reviews from our eFoods community. Help us maintain the highest quality standards.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Form Side */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 sticky top-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <MessageSquare className="text-primary" /> Write a Review
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2 block">Choose Restaurant</label>
                  <div className="relative">
                    <select
                      value={formData.restaurantId}
                      onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none cursor-pointer"
                    >
                      <option value="">Select a restaurant...</option>
                      {restaurants.map(r => (
                        <option key={r._id} value={r._id}>{r.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <TrendingUp size={18} className="rotate-90" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2 block">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: num })}
                        className={`p-3 rounded-xl transition-all ${formData.rating >= num ? 'bg-yellow-400 text-white shadow-lg shadow-yellow-200' : 'bg-gray-100 text-gray-300'}`}
                      >
                        <Star fill={formData.rating >= num ? "currentColor" : "none"} className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2 block">Your Feedback</label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Tell us about your experience..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 h-32 outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-all font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-secondary text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/20 group"
                >
                  Post Review <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          </div>

          {/* List Side */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500 font-bold ml-2">
                <Filter size={16} /> Filter by Recent
              </div>
              <div className="bg-gray-50 px-4 py-2 rounded-xl text-xs font-black text-primary uppercase">
                {reviews.length} Total Testimonials
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {loading ? (
                <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                  <Loader2 className="animate-spin mb-4" size={40} />
                  <span className="font-bold uppercase tracking-widest text-xs">Accessing Reviews...</span>
                </div>
              ) : reviews.length === 0 ? (
                <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-100">
                  <MessageSquare className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest">No feedback yet</h3>
                </div>
              ) : (
                reviews.map((review, i) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 hover:border-primary/30 transition-all group overflow-hidden relative"
                  >
                    <div className="absolute top-0 right-0 w-2 h-full bg-primary/10 group-hover:bg-primary transition-colors"></div>

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary border border-gray-100 font-black">
                          {review.userId?.[5] || 'U'}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm tracking-tight">{review.userId}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-[10px] uppercase font-black text-gray-400 tracking-tighter">
                              <Clock size={12} className="text-gray-300" /> {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">
                              Rest: {review.restaurantId?.slice(-4)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            size={14}
                            fill={review.rating >= star ? "#FBBF24" : "none"}
                            className={review.rating >= star ? "text-yellow-400" : "text-gray-200"}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-600 font-medium leading-relaxed italic pr-4">
                      "{review.comment}"
                    </p>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
