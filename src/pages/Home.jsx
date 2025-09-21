import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, Sparkles, Heart, Shield, Award } from 'lucide-react';
import { fetchProducts } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);
  
  const featuredProducts = products.filter(product => product.featured).slice(0, 4);
  
  useEffect(() => {
    dispatch(fetchProducts({ featured: 'true' }));
  }, [dispatch]);

  const handleAddToCart = (product, variant, quantity) => {
    dispatch(addToCart({ product, variant, quantity }));
  };

  const categories = [
    {
      name: 'Rudraksha Mala',
      image: '/assets/images/banner/category-banners/necklaces-banner.jpg',
      fallbackImage: 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=400',
      href: '/shop?category=rudraksha',
      description: 'Authentic Rudraksha Beads'
    },
    {
      name: 'Karungali Mala',
      image: '/assets/images/banner/category-banners/bracelets-banner.jpg', // Updated banner
      fallbackImage: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=400',
      href: '/shop?category=karungali',
      description: 'Sacred Ebony Wood Mala'
    },
    {
      name: 'Spatika Mala',
      image: '/assets/images/banner/category-banners/pendants-banner.jpg',
      fallbackImage: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400',
      href: '/shop?category=spatika',
      description: 'Crystal Quartz Mala'
    },
    {
      name: 'Tulasi Mala',
      image: '/assets/images/banner/category-banners/rings-banner.jpg',
      fallbackImage: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=400',
      href: '/shop?category=tulasi',
      description: 'Holy Basil Mala'
    }
  ];

  const features = [
    {
      icon: <span className="text-4xl">🕉️</span>,
      title: '100% Authentic',
      description: 'Government certified and lab tested products'
    },
    {
      icon: <span className="text-4xl">🙏</span>,
      title: 'Spiritual Blessing',
      description: 'Each mala is blessed by traditional rituals'
    },
    {
      icon: <span className="text-4xl">🔬</span>,
      title: 'Lab Certified',
      description: 'Every product comes with authentication certificate'
    },
    {
      icon: <span className="text-4xl">🚚</span>,
      title: 'Free Shipping',
      description: 'Free delivery across India with secure packaging'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative text-white min-h-screen flex items-center" style={{paddingTop: '80px'}}>
        <img
          src="/assets/images/banner/category-banners/Banner.png"
          alt="Spiritual Products Banner"
          className="absolute inset-0 w-full h-full object-cover"
          style={{zIndex: 0}}
        />
        <div className="absolute inset-0 bg-black opacity-10" style={{zIndex: 1}}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32" style={{zIndex: 2}}>
          <div className="text-center" style={{marginTop: '40px'}}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white" style={{textShadow: '3px 3px 6px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)'}}>
              <span className="text-yellow-400" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>🕉️</span> DIVINE ELEGANT <span className="text-yellow-400" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>🕉️</span>
            </h1>
            <p className="text-xl md:text-2xl mb-4 max-w-3xl mx-auto text-yellow-100 font-semibold" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
              Authentic Spiritual Jewelry & Mala
            </p>
            <p className="text-lg mb-8 max-w-3xl mx-auto text-white font-medium" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
              🙏 Trusted by 10,000+ Devotees | 100% Certified & Authentic Products 🙏
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/shop"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-red-900 px-8 py-4 rounded-lg text-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
              >
                <span>🛒 Shop Now</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/shop?category=rudraksha"
                className="border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-400 hover:text-red-900 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Rudraksha Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-red-800 mb-4">
              🕉️ Why Choose Divine Elegant 🕉️
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Authentic spiritual products with government certification and traditional blessings
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
                <div className="text-6xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-red-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-red-800 mb-4">
              🛒 Shop Our Best Sellers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Authentic spiritual malas and jewelry, carefully selected and blessed for your spiritual journey
            </p>
          </div>

          {isLoading ? (
            <LoadingSpinner size="xl" className="py-12" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link
              to="/shop"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors duration-300 inline-flex items-center space-x-2"
            >
              <span>View All Products</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              🕉️ Shop by Category 🕉️
            </h2>
            <p className="text-lg text-red-100 max-w-2xl mx-auto">
              Choose from our authentic collection of spiritual malas and jewelry
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.href}
                className="group relative overflow-hidden rounded-xl aspect-square"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = category.fallbackImage;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-300 mb-2">{category.description}</p>
                    <div className="flex items-center text-sm text-yellow-300">
                      <span>Explore Collection</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            🙏 Begin Your Spiritual Journey Today 🙏
          </h2>
          <p className="text-xl mb-8 text-red-100">
            Join 10,000+ devotees who trust Divine Elegant for authentic spiritual products
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="bg-yellow-500 text-red-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-400 transition-colors duration-300 inline-flex items-center space-x-2"
            >
              <span>🛒 Shop Now</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/shop?category=rudraksha"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-red-600 transition-colors duration-300"
            >
              Rudraksha Collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;