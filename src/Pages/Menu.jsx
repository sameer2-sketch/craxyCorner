import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Utensils, Wine, Cookie, ShoppingBag, Plus, Minus, Sun, Moon, Heart, Zap } from 'lucide-react';
import useCartStore from '../components/Store/cartStore';
import Loader from '../components/Loader/Loader';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeMood, setActiveMood] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [moodFilters, setMoodFilters] = useState([]);
  const [category, setCategory] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const { items, addItem, updateQuantity, removeItem } = useCartStore();

  const getFoodItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://backend-i2v9.onrender.com/api/v1/food/getFoodItems`);
      const data = await res.json();
      setMenuData(data?.foodList);
      const moods = data?.foodList?.map(item => ({ id: item.moods, moods: item.moods }));
      const category = data?.foodList?.map(item => item?.category);
      const removeDupCat = [...new Set(category)]
      removeDupCat.unshift('all');
      setCategory(removeDupCat);
      const moodsList = moods.map(el => el.moods).flat();
      const removeDup = [...new Set(moodsList)];
      let finalMoods = removeDup?.map(el => ({ id: el, label: el }));
      finalMoods.unshift({ id: 'all', label: 'All' });
      setMoodFilters(finalMoods);
      handleFilters(data?.foodList);
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getFoodItems();
  }, []);

  const handleFilters = (data = menuData) => {
    const filteredItems = data?.filter(item => {
      const categoryMatch = activeCategory === 'all' || item.category === activeCategory;
      const moodMatch = activeMood === 'all' || item.moods.includes(activeMood);
      return categoryMatch && moodMatch;
    });
    setFilteredItems(filteredItems);
  }

  const getItemQuantity = (itemId) => {
    const cartItem = items.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleQuantityChange = (item, change) => {
    const currentQuantity = getItemQuantity(item.id);
    const newQuantity = currentQuantity + change;

    if (newQuantity === 0) {
      removeItem(item.id);
    } else if (newQuantity > 0) {
      if (currentQuantity === 0) {
        addItem(item);
      } else {
        updateQuantity(item.id, newQuantity);
      }
    }
  };

  useEffect(() => {
    handleFilters()
  }, [activeMood])

  useEffect(() => {
    handleFilters()
  }, [activeCategory])

  return (
    <div className="pt-16">
      {isLoading && <Loader showLoader={(isLoading)} />}
      <div className="relative h-80 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/7438530/pexels-photo-7438530.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"
        }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Menu</h1>
          <p className="text-xl max-w-xl mx-auto">
            Discover dishes that match your mood and cravings
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-4 pb-2">
            {moodFilters.map(filter => {
              return (
                <button
                  key={filter.id}
                  className={`flex items-center px-6 py-3 rounded-full transition-all ${activeMood === filter.id
                    ? 'bg-primary-800 text-white'
                    : 'bg-white text-primary-800 hover:bg-primary-100'
                    }`}
                  onClick={() => setActiveMood(filter.id)}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Navigation */}
        <div className="mb-12 overflow-x-auto">
          <div className="flex space-x-2 md:space-x-4 min-w-max md:justify-center pb-2">
            {category.map(cat => {
              return (
                <button
                  key={cat}
                  className={`px-6 py-2 rounded-full transition-all ${activeCategory === cat
                    ? 'bg-primary-800 text-white'
                    : 'bg-white text-primary-800 hover:bg-primary-100'
                    }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Items */}
        <AnimatePresence mode="wait">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems?.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="card group hover:translate-y-[-5px] mt-7"
              >
                <div className="relative overflow-hidden rounded-t-lg h-48 mb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    {item.moods.map(mood => (
                      <span key={mood} className="px-2 py-1 bg-white/90 rounded-full text-xs font-medium text-primary-800">
                        {mood}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4" style={{ height: '150px' }}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-xl font-bold text-primary-800">
                      {item.name}
                    </h3>
                    <span className="text-secondary-500 font-medium">
                      ₹{item.price}
                    </span>
                  </div>
                  <p className="text-accent-600 text-sm">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center gap-2" style={{ float: 'right' }}>
                  {getItemQuantity(item.id) > 0 ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item, -1)}
                        className="p-1 rounded-full hover:bg-primary-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{getItemQuantity(item.id)}</span>
                      <button
                        onClick={() => handleQuantityChange(item, 1)}
                        className="p-1 rounded-full hover:bg-primary-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleQuantityChange(item, 1)}
                      className="btn btn-primary flex items-center"
                      style={{ float: 'right' }}
                    >
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Add to Cart
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>

      {/* Special Dietary Requirements */}
      <section className="bg-primary-50 py-16">
        <div className="container-custom">
          <h2 className="section-title text-center">Special Dietary Requirements</h2>
          <p className="text-center mb-10 text-accent-600 max-w-2xl mx-auto">
            We understand that many of our guests have specific dietary needs or preferences.
            Please inform our staff about any allergies or restrictions, and we'll do our best to accommodate you.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Vegetarian', description: 'Plant-based items without meat' },
              { label: 'Vegan', description: 'No animal products including dairy and eggs' },
              { label: 'Gluten-Free', description: 'Items without wheat, barley, or rye' },
              { label: 'Dairy-Free', description: 'No milk, cheese, or other dairy products' }
            ].map((item, index) => (
              <div key={index} className="card text-center hover:shadow-medium">
                <div className="inline-block p-3 rounded-full bg-primary-100 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary-800 flex items-center justify-center text-white font-bold">
                    {item.label.charAt(0)}
                  </div>
                </div>
                <h3 className="font-serif text-xl font-bold text-primary-800 mb-2">
                  {item.label}
                </h3>
                <p className="text-accent-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Menu;