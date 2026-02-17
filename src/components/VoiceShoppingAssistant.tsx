import React, { useState, useEffect } from 'react';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { processVoiceCommand, type ProcessedItem } from '../services/aiService';

// Simple icons for visual polish
const CategoryIcon = ({ category }: { category: string }) => {
  const icons: Record<string, string> = {
    Produce: '🥬', Dairy: '🥛', Bakery: '🍞', Meat: '🥩',
    Frozen: '❄️', Household: '🧻', Pantry: '🥫', General: '📦'
  };
  return <span className="text-xl">{icons[category] || icons['General']}</span>;
};

export const VoiceShoppingAssistant = () => {
  const { isListening, transcript, startListening, stopListening, error, setTranscript } = useVoiceInput();
  
  // LOCAL STATE (No Firebase)
  const [items, setItems] = useState<ProcessedItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-process when silence is detected
  useEffect(() => {
    if (transcript && !isListening) {
      handleVoiceCommand(transcript);
    }
  }, [isListening, transcript]);

  const handleVoiceCommand = async (text: string) => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    console.log("Processing command:", text);

    try {
      // 1. Try AI Processing
      const result = await processVoiceCommand(text);
      
      if (result) {
        console.log("✅ AI Success:", result);
        setItems(prev => [...prev, result]);
      } else {
        throw new Error("AI returned null");
      }
    } catch (err) {
      console.warn("⚠️ AI Failed (Using Fallback):", err);
      
      // 2. Fallback: Add raw text if AI fails (Ensures item appears!)
      const fallbackItem: ProcessedItem = {
        name: text,
        quantity: 1,
        unit: 'pcs',
        category: 'General',
        suggested_substitute: ''
      };
      setItems(prev => [...prev, fallbackItem]);
    } finally {
      setTranscript(''); // Clear the buffer
      setIsProcessing(false);
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-lg mx-auto min-h-[80vh] relative flex flex-col">
      
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Shopping <span className="text-blue-600">Assistant</span>
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          {isListening ? "Listening..." : isProcessing ? "Processing..." : "Tap mic to add items"}
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 border border-red-100">
          <span>⚠️</span> <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* The List */}
      <div className="flex-1 space-y-3 pb-32">
        {items.length === 0 && !isProcessing && (
          <div className="text-center py-20 opacity-80">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-slate-400">Cart is empty.</p>
            <p className="text-xs text-slate-400 mt-2">Try saying "Add Milk" <br></br> "Add Bread" <br></br>"Add Apples"</p>
          </div>
        )}

        {items.map((item, idx) => (
          <div key={idx} className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 mb-3 animate-fade-in">
            {/* Top Row: Icon + Name + Delete */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-2xl">
                  {/* Simple Icon Logic inline for safety */}
                  {item.category === 'Dairy' ? '🥛' : 
                   item.category === 'Produce' ? '🍎' : 
                   item.category === 'Meat' ? '🥩' : '📦'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 capitalize text-lg">{item.name}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    {item.quantity} {item.unit} • {item.category}
                  </p>
                </div>
              </div>
              <button onClick={() => removeItem(idx)} className="h-8 w-8 text-slate-300 hover:text-red-500 transition-colors">✕</button>
            </div>

            {/* --- RECOMMENDATIONS SECTION (The "Smart" Part) --- */}
            <div className="mt-3 pt-3 border-t border-slate-50 flex flex-col gap-2">
              
              {/* 1. Substitute */}
              {item.suggested_substitute && (
                <div className="bg-amber-50 text-amber-700 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2">
                  <span>🔄</span> 
                  <span>
                    Out of stock? Try <span className="font-bold underline">{item.suggested_substitute}</span>
                  </span>
                </div>
              )}

              {/* 2. Complementary Product */}
              {item.complementary_recommendation && (
                <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2">
                  <span>✨</span> 
                  <span>
                    Goes well with: <span className="font-bold">{item.complementary_recommendation}</span>
                  </span>
                </div>
              )}

              {/* 3. Seasonal Note */}
              {item.seasonal_note && (
                <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2">
                  <span>🌱</span> 
                  <span>{item.seasonal_note}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Skeleton */}
        {isProcessing && (
          <div className="flex items-center p-4 bg-white rounded-2xl border border-slate-100 animate-pulse">
            <div className="h-12 w-12 bg-slate-200 rounded-full"></div>
            <div className="ml-4 space-y-2 flex-1">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-3 bg-slate-100 rounded w-1/4"></div>
            </div>
          </div>
        )}
      </div>

      {/* Mic Button (Fixed Bottom) */}
      <div className="fixed bottom-8 left-0 right-0 px-4 flex justify-center z-50">
        <div className="w-full max-w-lg relative">
          {transcript && (
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full text-sm shadow-xl">
               "{transcript}"
            </div>
          )}

          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            className={`
              w-full h-20 rounded-3xl shadow-xl flex items-center justify-center gap-3 text-xl font-bold transition-all
              ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-600 text-white hover:scale-[1.02]'}
              ${isProcessing ? 'bg-slate-300 cursor-wait' : ''}
            `}
          >
            {isListening ? '🛑 Stop' : isProcessing ? 'Thinking...' : '🎙️ Tap to Speak'}
          </button>
        </div>
      </div>
    </div>
  );
};