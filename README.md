# 🔍 AuthenticEye – AI Powered Product Review Detection System

AuthenticEye is an **AI-powered web application** that analyzes product reviews and detects whether a review is **genuine or potentially fake**.
The system leverages **Google Gemini AI** to understand the language patterns of reviews and provide intelligent insights about authenticity.

Fake reviews are a major issue in online marketplaces. AuthenticEye helps users **identify misleading or spam reviews**, improving trust and decision-making for online purchases.

---

# 🚀 Features

* 🔍 Analyze product reviews using AI
* 🤖 AI-powered detection using Google Gemini API
* ⚡ Fast frontend built with **React + Vite**
* 📊 Displays AI-generated authenticity analysis
* 🧠 Natural Language Processing based evaluation
* 🔐 Secure API key handling using environment variables

---

# 🛠 Tech Stack

**Frontend**

* React
* Vite
* JavaScript
* CSS

**AI Integration**

* Google Gemini API

---

# 📂 Project Structure

```
authenticEye
│
├── public
├── src
│   ├── assets
│   ├── App.jsx
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

# 🔑 Environment Variables

Create a `.env` file in the root directory:

```
VITE_GEMINI_API_KEY=your_api_key_here
```

You can obtain a Gemini API key from **Google AI Studio**.

---

# ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/Prnc5804/authenticEye.git
```

### 2️⃣ Navigate into the project

```
cd authenticEye
```

### 3️⃣ Install dependencies

```
npm install
```

### 4️⃣ Add your Gemini API key

Create `.env` file:

```
VITE_GEMINI_API_KEY=your_api_key_here
```

### 5️⃣ Run the development server

```
npm run dev
```

The app will run at:

```
http://localhost:5173
```

---

# 🧠 How It Works

1. User enters a product review.
2. The review is sent to the **Gemini AI model**.
3. The AI analyzes linguistic patterns and context.
4. The system returns an **AI-based authenticity assessment**.

---

# 🎯 Applications

* Fake review detection
* E-commerce review verification
* Consumer trust improvement
* Research on AI-powered text analysis

---

# 🔮 Future Improvements

* Fake review probability score
* Sentiment analysis
* Support for multiple languages
* Dataset-based ML model training
* Browser extension for e-commerce websites

---

# 👨‍💻 Team Members

- Prince Kumar
- Srishti Raj
- Rishi Raj Karan
- Rajdeb Sen

---


