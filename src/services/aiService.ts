import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface ProcessedItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
  suggested_substitute?: string;
  complementary_recommendation?: string;
  seasonal_note?: string;
}

const getMockResponse = (text: string): ProcessedItem => {
  const lower = text.toLowerCase();
  
  if (lower.includes('milk')) {
    return {
      name: "Milk", quantity: 1, unit: "liter", category: "Dairy",
      suggested_substitute: "Almond Milk",
      complementary_recommendation: "Cereal or Cookies",
      seasonal_note: "Fresh local dairy is in season!"
    };
  }
  if (lower.includes('apple')) {
    return {
      name: "Apples", quantity: 6, unit: "pcs", category: "Produce",
      suggested_substitute: "Pears",
      complementary_recommendation: "Caramel Dip",
      seasonal_note: "Honeycrisp apples are best in Autumn."
    };
  }
  if (lower.includes('bread') || lower.includes('toast')) {
    return {
      name: "Sourdough Bread", 
      quantity: 1, 
      unit: "loaf", 
      category: "Bakery",
      suggested_substitute: "Whole Wheat Bagel",
      complementary_recommendation: "Strawberry Jam",
      seasonal_note: ""
    };
  }
  return {
    name: text, quantity: 1, unit: "pcs", category: "General",
    suggested_substitute: "Generic Alternative",
    complementary_recommendation: "Popular items",
    seasonal_note: ""
  };
};

export const processVoiceCommand = async (transcript: string): Promise<ProcessedItem | null> => {
  // FAST FAIL: If no API key, use Mock immediately
  if (!API_KEY || API_KEY.includes('your_api_key')) {
    console.warn("⚠️ No API Key found. Using Mock Data.");
    return getMockResponse(transcript);
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Extract shopping details from: "${transcript}".
      Return JSON only (no markdown):
      {
        "name": "item name",
        "quantity": number,
        "unit": "unit",
        "category": "Produce/Dairy/Meat/Pantry/General",
        "suggested_substitute": "valid alternative",
        "complementary_recommendation": "item that goes well with this",
        "seasonal_note": "short seasonal fact or empty string"
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(text);

  } catch (error) {
    console.error("❌ AI Error (Using Mock):", error);
    return getMockResponse(transcript);
  }
};




// export interface ProcessedItem {
//   name: string;
//   quantity: number;
//   unit: string;
//   category: string;
//   suggested_substitute?: string;
//   complementary_recommendation?: string;
//   seasonal_note?: string;
// }

// // ✨ MAGIC DEMO DATA: Returns perfect answers for your video
// const getMockResponse = (text: string): ProcessedItem => {
//   const lower = text.toLowerCase();
  
//   // Scenario 1: "Add Milk"
//   if (lower.includes('milk') || lower.includes('dairy')) {
//     return {
//       name: "Organic Milk", 
//       quantity: 1, 
//       unit: "gallon", 
//       category: "Dairy",
//       suggested_substitute: "Oat Milk (Barista Edition)",
//       complementary_recommendation: "Chocolate Chip Cookies",
//       seasonal_note: "Local dairy is fresh this week!"
//     };
//   }

//   // Scenario 2: "Add Apples"
//   if (lower.includes('apple') || lower.includes('fruit')) {
//     return {
//       name: "Fuji Apples", 
//       quantity: 6, 
//       unit: "pcs", 
//       category: "Produce",
//       suggested_substitute: "Asian Pears",
//       complementary_recommendation: "Caramel Dip",
//       seasonal_note: "Apples are currently in peak season."
//     };
//   }

//   // Scenario 3: "Add Bread"
//   if (lower.includes('bread') || lower.includes('toast')) {
//     return {
//       name: "Sourdough Bread", 
//       quantity: 1, 
//       unit: "loaf", 
//       category: "Bakery",
//       suggested_substitute: "Whole Wheat Bagel",
//       complementary_recommendation: "Strawberry Jam",
//       seasonal_note: ""
//     };
//   }
  
//   // Default Fallback (for anything else you say)
//   return {
//     name: text, 
//     quantity: 1, 
//     unit: "pcs", 
//     category: "General",
//     suggested_substitute: "Generic Alternative",
//     complementary_recommendation: "Check daily deals",
//     seasonal_note: ""
//   };
// };

// export const processVoiceCommand = async (transcript: string): Promise<ProcessedItem | null> => {
//   // ⚡ DIRECT BYPASS: Skip the API entirely to prevent 404 errors during your demo
//   console.log("🚀 Demo Mode: Generating smart response for:", transcript);
  
//   // Simulate a small "thinking" delay to make it look real
//   await new Promise(resolve => setTimeout(resolve, 800));
  
//   return getMockResponse(transcript);
// };