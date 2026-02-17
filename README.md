# 🛒 Voice Shopping Assistant

A robust, voice-activated shopping list application built with **React** and **TypeScript**. This project demonstrates a "Minimalist Interface" design and uses the **Web Speech API** for native voice recognition, paired with an AI simulation for smart product categorization and recommendations.

## 🚀 Features

* **🎙️ Voice-to-Text**: Add items naturally using voice commands (e.g., *"Add 2 cartons of milk"*, *"Add apples"*).
* **🧠 Smart Categorization**: Automatically detects categories like *Dairy*, *Produce*, or *Bakery*.
* **💡 Intelligent Suggestions**:
    * **Substitutes**: Suggests alternatives if an item is out of stock.
    * **Complementary Items**: Recommends products that go well with your purchase.
    * **Seasonal Notes**: Highlights items currently in season.
* **📱 Mobile-First Design**: Glassmorphism UI with a large, thumb-accessible voice trigger.
* **⚡ Fallback Reliability**: Gracefully degrades to a robust local mode if AI services are unreachable.

## 🛠️ Tech Stack

* **Frontend**: React (Vite) + TypeScript
* **Styling**: Tailwind CSS
* **Speech**: Native Web Speech API (Zero dependencies)
* **Logic**: Custom Hook (`useVoiceInput`) + AI Service Layer
* **AI**: Google Gemini API (`gemini-pro`)

## 🏃‍♂️ How to Run Locally

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Ad1tyaKr/Shopping-Assistant
    cd voice-shopping-assistant
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Open the App**
    * Visit `http://localhost:5173` in your browser.
    * **Note**: Please use **Google Chrome** or **Microsoft Edge** for full Web Speech API support.
    * Allow microphone permissions when prompted.

## 📂 Project Structure

```text
/src
├── /components     # UI Components (VoiceShoppingAssistant)
├── /hooks          # Custom Hooks (useVoiceInput)
├── /services       # Logic Layer (AI Service)
└── /types          # TypeScript Interfaces
└── /utils          # Helper functions (text formatters)
└── App.tsx         # Main layout
└── main.tsx        # Entry point