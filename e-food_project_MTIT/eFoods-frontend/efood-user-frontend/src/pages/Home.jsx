import { Link } from 'react-router-dom';
import {
  MapPin, Star, Timer, Percent, Phone, Mail, ThumbsUp, Smartphone,
  ShoppingCart, Truck, HeartHandshake, Receipt, BellRing, Coffee, ArrowRight, Pizza, Utensils, Clock
} from 'lucide-react';
import UserNavBar from '../components/userNavBar';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import mainphoto from '../assets/hometop.jpg';
import featureSushi from '../assets/sushi.jpg';
import featureBurger from '../assets/burger.jpg';
import featurePizza from '../assets/pizza.jpg';
import driverTracking from '../assets/drivertrack.jpg';
import samindi from '../assets/samindi.png';
import sandeepa from '../assets/sandeepa.png';
import hasini from '../assets/hasini.png';
import geethika from '../assets/geethika.png';
import logo from '../assets/efoods.png';
import google from '../assets/googlePlay.png';
import apple from '../assets/appStore.png';


export default function Home() {
  // Animation on scroll effect
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
      observer.observe(element);
    });

    return () => {
      document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div className="font-sans text-gray-800 overflow-x-hidden">
      <UserNavBar />

      {/* Hero Section - Modernized with gradient and image overlay */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={mainphoto}
            alt="Delicious Food"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#18230F]/90 to-[#255F38]/70"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Delicious Food
            <span className="block text-[#1F7D53]">Delivered to Your Door</span>
          </h1>
          <p className="text-white text-xl mb-8 max-w-2xl mx-auto">
            Experience the finest local cuisine delivered fresh and fast
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/restaurants" className="bg-[#1F7D53] hover:bg-[#255F38] text-white px-8 py-4 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center justify-center group">
              Browse Restaurants
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>

        {/* Floating Information Cards */}
        <div className="absolute -bottom-0 py-3 left-1/2 transform -translate-x-1/2 w-full max-w-5xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-xl p-6 flex items-center">
              <div className="bg-[#255F38]/10 p-3 rounded-full mr-4">
                <Clock className="text-[#255F38]" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Fast Delivery</h3>
                <p className="text-gray-500 text-sm">Under 30 minutes</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-xl p-6 flex items-center">
              <div className="bg-[#255F38]/10 p-3 rounded-full mr-4">
                <Utensils className="text-[#255F38]" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Quality Food</h3>
                <p className="text-gray-500 text-sm">From top restaurants</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-xl p-6 flex items-center">
              <div className="bg-[#255F38]/10 p-3 rounded-full mr-4">
                <MapPin className="text-[#255F38]" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Easy Tracking</h3>
                <p className="text-gray-500 text-sm">Live order updates</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing for floating cards */}
      <div className="h-5"></div>

      {/* Featured Restaurants Section */}
      <section className="py-15 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-[#18230F]">
              <span className="border-b-4 border-[#1F7D53] pb-2">Featured Restaurants</span>
            </h2>
            <Link to="/restaurants" className="text-[#1F7D53] font-medium flex items-center hover:underline">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-on-scroll opacity-0">
            <FeaturedCard
              image={featureSushi}
              name="Sushi Heaven"
              category="Japanese"
              dish="Dragon Roll"
              rating={4.9}
              time="25-35 min"
            />
            <FeaturedCard
              image={featureBurger}
              name="Burger Yard"
              category="American"
              dish="Cheese Blast"
              rating={4.7}
              time="15-25 min"
            />
            <FeaturedCard
              image={featurePizza}
              name="Pizza Bros"
              category="Italian"
              dish="Pepperoni Classic"
              rating={4.6}
              time="20-30 min"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#18230F] mb-16">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center animate-on-scroll opacity-0">
              <div className="bg-[#27391C] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">1</div>
              <h3 className="text-xl font-bold mb-3 text-[#18230F]">Browse Restaurants</h3>
              <p className="text-gray-600">Explore our curated selection of top-rated local restaurants</p>
            </div>

            <div className="text-center animate-on-scroll opacity-0" style={{ animationDelay: "0.2s" }}>
              <div className="bg-[#255F38] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">2</div>
              <h3 className="text-xl font-bold mb-3 text-[#18230F]">Place Your Order</h3>
              <p className="text-gray-600">Select your favorite dishes and customize as needed</p>
            </div>

            <div className="text-center animate-on-scroll opacity-0" style={{ animationDelay: "0.4s" }}>
              <div className="bg-[#1F7D53] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">3</div>
              <h3 className="text-xl font-bold mb-3 text-[#18230F]">Fast Delivery</h3>
              <p className="text-gray-600">Track your order in real-time until it arrives at your doorstep</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Driver Tracking Preview - Enhanced with more modern design */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#18230F] to-[#255F38] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1F7D53]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1F7D53]/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto relative z-10 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h2 className="text-3xl font-bold mb-6">Live Driver Tracking</h2>
            <p className="text-xl mb-8 text-gray-200">Watch your order's journey in real-time from restaurant preparation to your doorstep.</p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-white/10 p-2 rounded-lg mr-4">
                  <Truck className="text-[#1F7D53]" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl">Real-Time Updates</h3>
                  <p className="text-gray-300">Know exactly when your food will arrive</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white/10 p-2 rounded-lg mr-4">
                  <Receipt className="text-[#1F7D53]" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl">Order Status</h3>
                  <p className="text-gray-300">Get notifications at every stage of preparation</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 lg:pl-10 animate-on-scroll opacity-0">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#1F7D53] to-[#27391C] blur-lg opacity-50 rounded-2xl"></div>
              <img src={driverTracking} alt="Driver tracking" className="relative rounded-xl shadow-2xl w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories - With modern cards */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center text-[#18230F]">Browse by Cuisine</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 animate-on-scroll opacity-0">
            {[
              { name: 'Chinese', icon: <Coffee size={24} /> },
              { name: 'Pizza', icon: <Pizza size={24} /> },
              { name: 'Burgers', icon: <ShoppingCart size={24} /> },
              { name: 'Vegan', icon: <HeartHandshake size={24} /> },
              { name: 'Desserts', icon: <Star size={24} /> },
              { name: 'Sri Lankan', icon: <Utensils size={24} /> }
            ].map((category, i) => (
              <div key={i} className="bg-white hover:bg-[#1F7D53] hover:text-white text-[#18230F] rounded-xl shadow-md transition-all duration-300 cursor-pointer group overflow-hidden">
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="mb-3 text-[#1F7D53] group-hover:text-white transition-colors duration-300">
                    {category.icon}
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Enhanced with modern design */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center text-[#18230F]">
            <ThumbsUp className="inline-block mr-2 text-[#1F7D53]" /> Happy Customers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto animate-on-scroll opacity-0">
            <Testimonial
              image={sandeepa}
              text="Absolutely amazing food and super-fast delivery! The tracking feature is fantastic."
              name="S.M Karunathilaka"
            />
            <Testimonial
              image={hasini}
              text="I love how easy it is to use this app! The interface is intuitive and the food always arrives hot."
              name="I.M Hasini Ilanganthilake"
            />
            <Testimonial
              image={geethika}
              text="Great selection of restaurants and the order tracking is really helpful. Highly recommend!"
              name="K.G.G.K.Senavirathna"
            />
            <Testimonial
              image={samindi}
              text="The review system is very transparent. It helps me choose the best restaurants Every time!"
              name="M.H Samindi"
            />

            <Testimonial
              image={samindi}
              text="Best food delivery platform I have ever used. Highly recommended for everyone."
              name="Samindi Sankalpani"
            />
          </div>
        </div>
      </section>

      {/* Promotions & Offers with attractive design */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center text-[#18230F]">
            <Percent className="inline-block mr-2 text-[#1F7D53]" /> Special Offers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-on-scroll opacity-0">
            <OfferCard
              title="New User Special"
              text="Get 20% OFF on your first order"
              code="unavailable"
              bgColor="#255F38"
            />
            <OfferCard
              title="Weekend Deal"
              text="Free delivery on all orders"
              code="unavailable"
              bgColor="#27391C"
            />
            <OfferCard
              title="Family Bundle"
              text="10% OFF on orders above USD 1000"
              code="unavailable"
              bgColor="#1F7D53"
            />
          </div>
        </div>
      </section>

      {/* Mobile App Promo - Modernized */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#18230F] to-[#27391C] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1F7D53]/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto relative z-10 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h2 className="text-3xl font-bold mb-6">Download Our App</h2>
            <p className="text-xl mb-8 text-gray-200">Enjoy a seamless food ordering experience on your mobile device.</p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <div className="bg-[#1F7D53] p-1 rounded-full mr-3">
                  <Star size={14} />
                </div>
                <span>Exclusive mobile-only offers</span>
              </li>
              <li className="flex items-center">
                <div className="bg-[#1F7D53] p-1 rounded-full mr-3">
                  <Star size={14} />
                </div>
                <span>Easy re-ordering of your favorites</span>
              </li>
              <li className="flex items-center">
                <div className="bg-[#1F7D53] p-1 rounded-full mr-3">
                  <Star size={14} />
                </div>
                <span>Real-time order tracking</span>
              </li>
            </ul>

            <div className="flex flex-wrap gap-4">
              <a href="#" className="bg-black hover:bg-gray-900 transition-colors duration-300 px-4 py-3 rounded-lg flex items-center">
                <img src={google} alt="Play Store" className="w-8 h-8 mr-3" />
                <div>
                  <p className="text-xs text-gray-300">Download on</p>
                  <p className="font-medium">Google Play</p>
                </div>
              </a>

              <a href="#" className="bg-black hover:bg-gray-900 transition-colors duration-300 px-4 py-3 rounded-lg flex items-center">
                <img src={apple} alt="App Store" className="w-8 h-8 mr-3" />
                <div>
                  <p className="text-xs text-gray-300">Download on</p>
                  <p className="font-medium">App Store</p>
                </div>
              </a>
            </div>
          </div>

          <div className="lg:w-1/2 lg:pl-10 animate-on-scroll opacity-0">
            <img src={logo} alt="Mobile app" className="mx-auto rounded-3xl shadow-2xl border-8 border-white/10" />
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-[#18230F] to-[#27391C] rounded-3xl p-10 text-white text-center relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1F7D53]/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1F7D53]/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">
                <BellRing className="inline-block mr-2" /> Stay Updated!
              </h2>
              <p className="text-gray-200 mb-8 max-w-xl mx-auto">Sign up for promotions, updates and exclusive offers from your favorite places.</p>

              <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-5 py-3 rounded-lg text-white-800 flex-grow focus:outline-none focus:ring-2 focus:ring-[#1F7D53]"
                />
                <button className="bg-[#1F7D53] hover:bg-[#255F38] transition-colors duration-300 px-6 py-3 rounded-lg font-semibold">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 text-center bg-gray-50">
        <div className="container mx-auto px-6">
          <h3 className="text-2xl font-bold mb-6 text-[#18230F]">Get In Touch</h3>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="bg-[#255F38]/10 p-3 rounded-full">
                <Phone className="text-[#255F38]" size={20} />
              </div>
              <span className="text-gray-700">+94 71 234 5678</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[#255F38]/10 p-3 rounded-full">
                <Mail className="text-[#255F38]" size={20} />
              </div>
              <span className="text-gray-700">support@efoods.lk</span>
            </div>
          </div>
        </div>
      </section>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>

      <Footer />
    </div>
  );
}

const FeaturedCard = ({ image, name, category, dish, rating, time }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
    <div className="relative h-48 overflow-hidden">
      <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-medium text-[#18230F]">
        {time}
      </div>
    </div>
    <div className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-[#18230F]">{name}</h3>
          <p className="text-gray-500 text-sm">{category} • {dish}</p>
        </div>
        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
          <Star className="text-yellow-500 mr-1" size={16} />
          <span className="font-medium text-sm">{rating}</span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-sm text-[#1F7D53] font-medium">Free delivery</span>
        <button className="text-sm font-medium text-[#18230F] hover:text-[#1F7D53] transition-colors duration-300">View Menu</button>
      </div>
    </div>
  </div>
);

const TopRatedCard = ({ image, name, cuisine, rating, delivery }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
    <div className="relative h-40 overflow-hidden">
      <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    </div>
    <div className="p-5">
      <h3 className="font-bold text-lg text-[#18230F]">{name}</h3>
      <p className="text-gray-600 text-sm mb-3">{cuisine}</p>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1">
          <Star className="text-yellow-500" size={16} />
          <span className="font-medium">{rating}</span>
        </div>
        <div className="flex items-center gap-1">
          <Timer className="text-[#1F7D53]" size={16} />
          <span>{delivery}</span>
        </div>
      </div>
    </div>
  </div>
);

const Testimonial = ({ image, text, name }) => (
  <div className="bg-white p-6 rounded-xl shadow-md relative">
    <div className="mb-4">
      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#1F7D53]">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
    </div>
    <p className="text-gray-700 mb-4">{text}</p>
    <div className="flex items-center">
      <div className="flex items-center mr-3">
        <Star className="text-yellow-500" size={14} />
        <Star className="text-yellow-500" size={14} />
        <Star className="text-yellow-500" size={14} />
        <Star className="text-yellow-500" size={14} />
        <Star className="text-yellow-500" size={14} />
      </div>
      <p className="font-semibold text-[#18230F]">{name}</p>
    </div>
  </div>
);

const OfferCard = ({ title, text, code, bgColor }) => (
  <div className="rounded-xl overflow-hidden shadow-lg group hover:shadow-xl transition-shadow duration-300 relative">
    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -mt-10 -mr-10"></div>
    <div className="p-6 relative z-10" style={{ backgroundColor: bgColor }}>
      <h3 className="font-bold text-xl text-white mb-2">{title}</h3>
      <p className="text-white/90 mb-4">{text}</p>
      <div className="bg-white/15 p-3 rounded-lg flex justify-between items-center">
        <span className="font-mono text-white font-bold">{code}</span>
        <button className="bg-white text-[#18230F] hover:bg-gray-100 transition-colors duration-300 px-3 py-1 rounded text-sm font-medium">Copy</button>
      </div>
    </div>
  </div>
);