import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, X, ChevronRight } from 'lucide-react';
import Loader from '../Loader/Loader';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    // Initialize speech recognition with better error handling
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        console.error('Speech Recognition API not supported in this browser');
        setSpeechSupported(false);
        return;
      }

      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('Speech recognition started - listening now...');
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        console.log('Speech result event:', event);
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          console.log('Transcript part:', transcript, 'Confidence:', event.results[i][0].confidence, 'isFinal:', event.results[i].isFinal);
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Show interim results
        if (interimTranscript) {
          console.log('Interim:', interimTranscript);
          setTranscript(interimTranscript);
        }
        
        // Process final results
        if (finalTranscript) {
          console.log('Final transcript received:', finalTranscript);
          setTranscript(finalTranscript.trim());
          detectMoodFromVoice(finalTranscript.trim());
          // Stop listening after final result
          recognition.stop();
        }
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'no-speech') {
          alert('No speech detected. Please try again and speak clearly.');
        } else if (event.error === 'network') {
          alert('Network error. Please check your connection.');
        } else {
          alert(`Microphone error: ${event.error}. Please check your microphone and try again.`);
        }
      };

      recognitionRef.current = recognition;
      console.log('Speech Recognition initialized successfully');
    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      setSpeechSupported(false);
    }

    // Fetch menu items from backend
    const fetchMenuItems = async () => {
      setIsLoadingMenu(true);
      try {
        const res = await fetch(`https://backend-i2v9.onrender.com/api/v1/food/getFoodItems`);
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('=== API RESPONSE ===');
        console.log('Backend response structure:', data);
        console.log('Response keys:', Object.keys(data));
        
        // Try different possible response structures
        let items = [];
        
        if (data?.foodList && Array.isArray(data.foodList)) {
          items = data.foodList;
          console.log('Found items in data.foodList');
        } else if (data?.data && Array.isArray(data.data)) {
          items = data.data;
          console.log('Found items in data.data');
        } else if (Array.isArray(data)) {
          items = data;
          console.log('Found items as direct array');
        }
        
        console.log('=== ITEMS SUMMARY ===');
        console.log('Total items retrieved:', items.length);
        
        if (items.length > 0) {
          console.log('First item structure:', items[0]);
          console.log('First item moods field:', items[0]?.moods);
          console.log('First item moods type:', typeof items[0]?.moods);
          
          // Check moods for each item
          console.log('=== MOOD ANALYSIS ===');
          items.forEach((item, idx) => {
            if (item.moods) {
              console.log(`Item ${idx} (${item.name}): moods =`, item.moods, 'Type:', typeof item.moods);
            }
          });
          
          // Count items with moods
          const itemsWithMoods = items.filter(item => item.moods);
          console.log('Items with moods field:', itemsWithMoods.length);
          
          // Check specific moods
          const happyItems = items.filter(item => {
            if (!item.moods) return false;
            if (Array.isArray(item.moods)) return item.moods.some(m => m.toLowerCase() === 'happy');
            if (typeof item.moods === 'string') return item.moods.toLowerCase().includes('happy');
            return false;
          });
          
          const excitedItems = items.filter(item => {
            if (!item.moods) return false;
            if (Array.isArray(item.moods)) return item.moods.some(m => m.toLowerCase() === 'excited');
            if (typeof item.moods === 'string') return item.moods.toLowerCase().includes('excited');
            return false;
          });
          
          console.log('Happy mood items:', happyItems.length);
          console.log('Excited mood items:', excitedItems.length);
          if (happyItems.length > 0) console.log('Sample happy item:', happyItems[0]);
          if (excitedItems.length > 0) console.log('Sample excited item:', excitedItems[0]);
          
          setMenuItems(items);
        } else {
          console.warn('No items found in API response');
          setMenuItems([]);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
        alert(`Error loading menu: ${error.message}`);
        setMenuItems([]);
      } finally {
        setIsLoadingMenu(false);
      }
    };

    fetchMenuItems();

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Error stopping recognition on cleanup:', e);
        }
      }
    };
  }, []);

  // Mood detection from voice input
  const detectMoodFromVoice = (voice) => {
    const lowerVoice = voice.toLowerCase();
    const moodKeywords = {
      happy: ['happy', 'great', 'wonderful', 'amazing', 'love', 'excited', 'fantastic', 'awesome'],
      sad: ['sad', 'down', 'blue', 'depressed', 'lonely', 'upset', 'unhappy'],
      excited: ['excited', 'pumped', 'energetic', 'thrilled', 'fired up', 'hyped'],
      stressed: ['stressed', 'anxious', 'overwhelmed', 'worried', 'tense', 'nervous']
    };

    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some(keyword => lowerVoice.includes(keyword))) {
        setSelectedMood(mood);
        handleMoodSelection(mood);
        return;
      }
    }
  };

  // Handle mood selection
  const handleMoodSelection = (mood) => {
    setSelectedMood(mood);
    
    console.log('=== MOOD SELECTION ===');
    console.log('Selected mood:', mood);
    console.log('Total menu items:', menuItems.length);
    
    // Filter items by mood - with case-insensitive matching
    const itemsByMood = menuItems.filter(item => {
      if (!item.moods) return false;
      
      const moodLower = mood.toLowerCase();
      
      // Handle if moods is an array
      if (Array.isArray(item.moods)) {
        return item.moods.some(m => m.toLowerCase() === moodLower);
      }
      
      // Handle if moods is a string with comma separation
      if (typeof item.moods === 'string') {
        const moods = item.moods.split(',').map(m => m.trim().toLowerCase());
        return moods.includes(moodLower);
      }
      
      return false;
    });

    console.log(`Items found for mood "${mood}":`, itemsByMood.length);
    console.log('Filtered items:', itemsByMood.map(item => ({ name: item.name, moods: item.moods })));
    
    // Only show items that match the mood, no fallback
    if (itemsByMood.length === 0) {
      console.warn(`No items found for mood: ${mood}`);
      setSuggestions({
        mood: mood,
        items: [],
        noItemsFound: true
      });
      // Still trigger speech to inform user
      speakSuggestions({
        mood: mood,
        items: [],
        noItemsFound: true
      });
      return;
    }

    // Show only mood-matched items
    const recommendations = {
      mood: mood,
      items: itemsByMood.slice(0, 6), // Show up to 6 items
      noItemsFound: false
    };

    console.log('Recommendations:', recommendations);
    setSuggestions(recommendations);
    speakSuggestions(recommendations);
  };

  // Text-to-Speech function
  const speakSuggestions = (suggestions) => {
    if (!window.speechSynthesis) return;
    
    if (!suggestions.items || suggestions.items.length === 0) {
      const message = `Sorry, we don't have items available for ${suggestions.mood} mood right now. Please try another mood!`;
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
      return;
    }

    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const mood = suggestions.mood.charAt(0).toUpperCase() + suggestions.mood.slice(1);
    let itemsList = suggestions.items
      .map(item => {
        const desc = item.description || item.name;
        return `${item.name}. ${desc}`;
      })
      .join('. ');
    
    const message = `I found perfect items for your ${mood} mood! Here are my recommendations. ${itemsList}. Would you like to add any of these to your cart?`;

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    try {
      if (!recognitionRef.current) {
        console.error('Speech Recognition not available');
        alert('Speech Recognition is not available in your browser. Please use Chrome, Edge, or Safari.');
        return;
      }
      
      setTranscript(''); // Clear previous transcript
      console.log('Starting speech recognition...');
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      
      // If already running, just continue
      if (error.message && error.message.includes('already started')) {
        console.log('Recognition already running');
        return;
      }
      
      alert(`Error: ${error.message}`);
    }
  };

  const stopListening = () => {
    try {
      if (recognitionRef.current) {
        console.log('Stopping speech recognition...');
        recognitionRef.current.stop();
      }
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  };

  const resetAssistant = () => {
    setSelectedMood(null);
    setSuggestions(null);
    setTranscript('');
    window.speechSynthesis.cancel();
  };

  const moods = [
    { id: 'happy', emoji: '😊', label: 'Happy', color: 'from-yellow-400 to-yellow-600' },
    { id: 'sad', emoji: '😢', label: 'Sad', color: 'from-blue-400 to-blue-600' },
    { id: 'excited', emoji: '🤩', label: 'Excited', color: 'from-pink-400 to-pink-600' },
    { id: 'stressed', emoji: '😰', label: 'Stressed', color: 'from-orange-400 to-orange-600' }
  ];

  return (
    <>
      {/* Floating Voice Assistant Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-40 p-4 bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-full shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Mic size={28} />
      </motion.button>

      {/* Voice Assistant Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-end sm:items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-800 text-white p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Mood-Based Assistant</h3>
                  <p className="text-sm text-primary-100">Tell us your mood & we'll suggest food</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    resetAssistant();
                    setIsOpen(false);
                  }}
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6">
                {isLoadingMenu && (
                  <div className="text-center py-8">
                    <div className="inline-block">
                      <Loader />
                    </div>
                    <p className="text-gray-600 mt-4">Loading menu items...</p>
                  </div>
                )}
                
                {!isLoadingMenu && (
                  <>
                    {/* Debug Info */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg text-xs"
                    >
                      <p className="font-semibold text-gray-700 mb-2">📊 Debug Info:</p>
                      <p className="text-gray-600">Total items loaded: <span className="font-bold text-blue-600">{menuItems.length}</span></p>
                      {menuItems.length > 0 && (
                        <>
                          <p className="text-gray-600 mt-1">Happy mood items: <span className="font-bold text-green-600">{menuItems.filter(i => i.moods && (Array.isArray(i.moods) ? i.moods.some(m => m.toLowerCase() === 'happy') : i.moods.toLowerCase().includes('happy'))).length}</span></p>
                          <p className="text-gray-600 mt-1">Excited mood items: <span className="font-bold text-purple-600">{menuItems.filter(i => i.moods && (Array.isArray(i.moods) ? i.moods.some(m => m.toLowerCase() === 'excited') : i.moods.toLowerCase().includes('excited'))).length}</span></p>
                        </>
                      )}
                    </motion.div>
                    
                    {/* Voice Input Section */}
                    {!suggestions && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <p className="text-gray-700 mb-6 text-center font-medium">Choose or Speak Your Current Mood</p>

                        {/* Instructions */}
                        {!isListening && !transcript && (
                          <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                          >
                            <p className="text-sm text-green-700">
                              💡 Tip: Click the microphone button below and speak clearly. Say "I'm happy", "I'm sad", etc.
                            </p>
                          </motion.div>
                        )}

                        {/* Browser Support Warning */}
                        {!speechSupported && (
                          <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                          >
                            <p className="text-sm text-red-700">
                              ⚠️ Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.
                            </p>
                          </motion.div>
                        )}

                        {/* Transcribed Text */}
                        {transcript && (
                          <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className={`mb-4 p-3 border rounded-lg ${
                              isListening 
                                ? 'bg-yellow-50 border-yellow-200' 
                                : 'bg-blue-50 border-blue-200'
                            }`}
                          >
                            <p className="text-sm text-gray-600">
                              {isListening ? '🎤 Listening...' : '✓ You said:'}
                            </p>
                            <p className={`font-semibold italic ${
                              isListening ? 'text-yellow-700' : 'text-primary-700'
                            }`}>
                              {transcript}
                            </p>
                          </motion.div>
                        )}

                        {/* Mood Selection Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          {moods.map((mood) => (
                            <motion.button
                              key={mood.id}
                              onClick={() => handleMoodSelection(mood.id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`p-4 rounded-xl text-center transition-all ${
                                selectedMood === mood.id
                                  ? `bg-gradient-to-r ${mood.color} text-white shadow-lg`
                                  : 'bg-gray-100 hover:bg-gray-200'
                              }`}
                            >
                              <div className="text-3xl mb-2">{mood.emoji}</div>
                              <div className="text-sm font-semibold">{mood.label}</div>
                            </motion.button>
                          ))}
                        </div>

                        {/* Voice Input Button */}
                        {speechSupported && (
                          <motion.button
                            onClick={isListening ? stopListening : startListening}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
                              isListening
                                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                                : 'bg-primary-600 hover:bg-primary-700'
                            }`}
                          >
                            {isListening ? (
                              <>
                                <MicOff size={20} /> Listening... Tap to Stop
                              </>
                            ) : (
                              <>
                                <Mic size={20} /> Click to Speak Your Mood
                              </>
                            )}
                          </motion.button>
                        )}
                      </motion.div>
                    )}

                    {/* Suggestions Section */}
                    {suggestions && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="text-center mb-4">
                          <div className="text-4xl mb-2">
                            {moods.find(m => m.id === suggestions.mood)?.emoji}
                          </div>
                          <h4 className="text-lg font-bold text-gray-800 capitalize">
                            Perfect for when you're {suggestions.mood}! 🎉
                          </h4>
                        </div>

                        {/* Food Suggestions from Menu */}
                        <div className="space-y-3">
                          {suggestions.items && suggestions.items.length > 0 ? (
                            suggestions.items.map((item, index) => (
                              <motion.div
                                key={index}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                              >
                                {item.image && (
                                  <img 
                                    src={item.image} 
                                    alt={item.name}
                                    className="w-full h-32 object-cover rounded mb-3"
                                  />
                                )}
                                <h6 className="font-semibold text-primary-600 mb-1">{item.name}</h6>
                                <p className="text-sm text-gray-600 mb-2">{item.description || 'A delicious item from our menu'}</p>
                                {item.category && (
                                  <p className="text-xs text-gray-500 mb-2 capitalize">Category: {item.category}</p>
                                )}
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-primary-700 font-bold">₹{item.price}</span>
                                  {item.calories && (
                                    <span className="text-gray-500">{item.calories} cal</span>
                                  )}
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="p-6 text-center bg-orange-50 border border-orange-200 rounded-lg"
                            >
                              <p className="text-lg font-semibold text-orange-800 mb-2">
                                😕 No items available for {suggestions.mood} mood
                              </p>
                              <p className="text-sm text-orange-700 mb-4">
                                We haven't tagged items for this mood yet. Please try a different mood!
                              </p>
                              <div className="grid grid-cols-2 gap-2 mt-4">
                                {moods.map((mood) => (
                                  <button
                                    key={mood.id}
                                    onClick={() => handleMoodSelection(mood.id)}
                                    className={`py-2 px-3 rounded text-sm font-semibold transition-all ${
                                      mood.id === suggestions.mood
                                        ? 'bg-orange-800 text-white'
                                        : 'bg-white text-orange-800 border border-orange-300 hover:bg-orange-100'
                                    }`}
                                  >
                                    {mood.emoji} {mood.label}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        {suggestions.items && suggestions.items.length > 0 && (
                          <div className="flex gap-3 mt-6">
                            <motion.button
                              onClick={() => speakSuggestions(suggestions)}
                              disabled={isSpeaking}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              <Volume2 size={18} /> {isSpeaking ? 'Speaking...' : 'Hear Again'}
                            </motion.button>
                            <motion.button
                              onClick={resetAssistant}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-bold"
                            >
                              Try Again
                            </motion.button>
                          </div>
                        )}
                        
                        {(!suggestions.items || suggestions.items.length === 0) && (
                          <motion.button
                            onClick={resetAssistant}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold mt-4"
                          >
                            Back to Mood Selection
                          </motion.button>
                        )}
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceAssistant;
