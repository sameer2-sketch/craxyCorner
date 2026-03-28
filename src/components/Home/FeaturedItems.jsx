import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Heart, Zap, Coffee, Users, Award, ShoppingBag, Minus, Plus, UtensilsCrossed } from 'lucide-react';
import Loader from '../Loader/Loader';
import useCartStore from '../Store/cartStore';

const FeaturedItems = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeMood, setActiveMood] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [moodFilters, setMoodFilters] = useState([]);
  const [category, setCategory] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const { items, addItem, updateQuantity, removeItem } = useCartStore();

  const getFoodItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://backend-i2v9.onrender.com/api/v1/food/getFoodItems`);
      const data = await res.json();
      const featuredItems = data?.foodList?.filter(item => item.isFeatured === true);
      setFeaturedItems(featuredItems)
      const moods = featuredItems?.map(item => ({ id: item.moods, moods: item.moods }));
      const category = featuredItems?.map(item => item?.category);
      const removeDupCat = [...new Set(category)]
      removeDupCat.unshift('all');
      setCategory(removeDupCat);
      const moodsList = moods.map(el => el.moods).flat();
      const removeDup = [...new Set(moodsList)];
      let finalMoods = removeDup?.map(el => ({ id: el, label: el }));
      finalMoods.unshift({ id: 'all', label: 'All' });
      setMoodFilters(finalMoods);
      handleFilters(featuredItems);
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getFoodItems();
  }, []);

  const handleFilters = (data = featuredItems) => {
    const filteredItems = data?.filter(item => {
      const categoryMatch = activeCategory === 'all' || item.category === activeCategory;
      const moodMatch = activeMood === 'all' || item.moods.includes(activeMood);
      return categoryMatch && moodMatch;
    });
    setFilteredItems(filteredItems);
  }

  useEffect(() => {
    handleFilters()
  }, [activeMood])

  useEffect(() => {
    handleFilters()
  }, [activeCategory])


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

  return (
    <section className="py-20 bg-cream">
      {isLoading && <Loader showLoader={(isLoading)} />}
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">Our Featured Items</h2>
          <p className="section-subtitle">
            Discover items that match your mood and cravings
          </p>

          {/* Mood Filter */}
          <div className="flex space-x-4 mb-8 overflow-x-auto">
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

          <div className="flex justify-center space-x-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredItems.length === 0 ? (
              <div className="text-center">
                <UtensilsCrossed className="h-16 w-16 text-accent-400 mx-auto mb-4" />
                <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4">No Food Found</h2>
                <p className="text-accent-600 mb-8">Select based on your mood!</p>
              </div>) : (
              <>
                {filteredItems.map((item) => (
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
                ))}</>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedItems;