# 🖤 Intuita

> **The Next Evolution of Zero-Prompt AI Platforms**

Intuita is a premium, high-fidelity SaaS platform built on the philosophy that users shouldn't have to learn "prompt engineering" to get professional results from AI. By replacing the traditional empty chat window with deeply structured, intent-driven UI wizards, Intuita acts as a seamless bridge between human creativity and the **Google Gemini AI**.

Built with an uncompromising, Awwwards-worthy brutalist monochrome aesthetic, Intuita features smooth GSAP animations, bento-grid layouts, and cinematic micro-interactions that completely redefine the AI user experience.

---

## 🚀 The "Zero-Prompt" Philosophy

Traditional AI platforms rely on users knowing exactly what to type. Intuita flips this model:
1. **Structured Input:** Users fill out intuitive, highly specific UI forms (wizards) tailored to their exact goal (e.g., EssayForge, IdeaMatrix).
2. **Invisible Orchestration:** The Intuita backend dynamically constructs sophisticated, context-rich prompts behind the scenes based on user selections.
3. **Gemini AI Generation:** The Google Gemini API processes the deeply structured prompts for maximum intelligence and output quality.
4. **Live Streaming:** Results are streamed back to the user's workspace in real-time, completely bypassing the outdated "chatbot" paradigm.

---

## ✨ Key Features

- **Purpose-Built Workspaces:** Specialized AI tools designed for specific professional use cases, completely eliminating the need for complex prompt engineering.
- **Google Gemini Integration:** Powered by the cutting-edge reasoning, speed, and generation capabilities of the Gemini AI models.
- **Cinematic Visual Design:** A striking black-and-white brutalist aesthetic featuring complex mesh gradients, glassmorphism, and meticulously crafted GSAP scroll animations.
- **Real-Time Output Streaming:** A highly responsive streaming architecture that renders AI text dynamically as it generates, character by character.
- **Responsive Bento-Grid UI:** A modern, widget-based dashboard layout that looks stunning and functions perfectly on any screen size.

---

## 🛠 Architecture & Tech Stack

Intuita is a fully-typed, modern full-stack application designed for both massive performance and visual excellence.

### **Frontend**
- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Vanilla CSS (Design Tokens) + Tailwind CSS (Layout Utilities)
- **Animations:** GSAP (GreenSock Animation Platform) + ScrollTrigger
- **Icons:** Lucide React

### **Backend**
- **Server:** Node.js with Express.js
- **AI Integration:** Google Gemini API (`@google/generative-ai`)
- **Data Flow:** Server-Sent Events (SSE) for real-time text streaming to the React frontend

---

## 💻 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- A **Google Gemini API Key**

### Local Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Arnav-Sharma21/Intuita.git
   cd Intuita
   ```

2. **Install Frontend and Backend Dependencies**
   ```bash
   # In the root directory (Frontend)
   npm install

   # In the server directory (Backend)
   cd server
   npm install
   cd ..
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the `server` directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

4. **Start the Development Servers**
   You will need to run both the frontend and backend servers simultaneously.
   
   *Terminal 1 (Backend):*
   ```bash
   cd server
   npm run dev
   ```
   
   *Terminal 2 (Frontend):*
   ```bash
   npm run dev
   ```

5. **Open the Application**
   Navigate to `http://localhost:5173` in your browser to experience Intuita.

---

## 📂 Project Structure

```text
intuita/
├── src/                  # React Frontend
│   ├── components/       # UI Components, Layouts, Tool Wizards
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and configurations
│   ├── styles/           # Global CSS, Design Tokens, Typography
│   └── App.tsx           # Main Application Routing
├── server/               # Express.js Backend
│   ├── routes/           # API routes (Gemini integration, streaming)
│   ├── controllers/      # Request handling logic
│   └── server.ts         # Main backend entry point
└── package.json          # Project metadata and scripts
```

---

## 📝 License

This project, including its unique UX workflows and proprietary design system, is strictly confidential.
