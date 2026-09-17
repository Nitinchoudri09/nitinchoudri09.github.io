require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Security middleware ───────────────────────────────────────
app.use(helmet());
app.use(express.json({ limit: '10kb' }));

// ─── CORS ─────────────────────────────────────────────────────
// Production origin: https://nitinchoudri09.github.io
// Render service:    https://nitinchoudri09-github-io.onrender.com
// Dev origins: localhost variants for Live Server
const allowedOrigins = [
  'https://nitinchoudri09.github.io',
  // Local development (Live Server)
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:5501',
  'http://127.0.0.1:5501',
  'http://localhost:5502',
  'http://127.0.0.1:5502',
  'http://localhost:5503',
  'http://127.0.0.1:5503',
  'http://localhost:5504',
  'http://127.0.0.1:5504',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow no-origin requests (curl, Postman, Render health pings)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// ─── Rate limiting: 20 requests per 15 minutes per IP ─────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many requests. Please try again in a few minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// ─── Validate API key on startup ──────────────────────────────
if (!process.env.GEMINI_API_KEY) {
  console.error('[ERROR] GEMINI_API_KEY is not set. Please add it to your .env file.');
  process.exit(1);
}

// ─── Portfolio knowledge base / system prompt ─────────────────
const SYSTEM_PROMPT = `You are the AI portfolio assistant for Nitin Choudri. Your job is to help visitors — recruiters, clients, and collaborators — learn about Nitin's education, skills, projects, experience, and career interests.

STRICT RULES:
1. Answer ONLY using the information provided below. Never invent or assume any details.
2. Never fabricate: work experience, salary, company details, project features, marks, certifications, or contact info not listed here.
3. Be professional, friendly, and concise. Format lists with bullet points.
4. If a question cannot be answered from the knowledge base, respond exactly: "I'm not sure about that. You can contact Nitin directly through his LinkedIn (https://www.linkedin.com/in/nitin-choudri-809204262) or GitHub (https://github.com/Nitinchoudri09)."
5. Do not answer questions unrelated to Nitin's portfolio (e.g., general coding help, world events, or personal opinions).
6. When sharing links, present them as plain URLs.

=== NITIN CHOUDRI – PORTFOLIO KNOWLEDGE BASE ===

PERSONAL:
• Name: Nitin Choudri
• Location: Bangalore, India
• Email: nitinchoudri6@gmail.com
• Phone: +91 98803 59114

PROFESSIONAL ROLES:
• AI Engineer
• Full Stack Developer
• Python Developer
• Data Analyst
• QA / Testing Engineer

EDUCATION:
• Bachelor of Engineering in Computer Science
  Institution: Jain College of Engineering and Research, Belagavi
  Duration: 2022 – 2026 | CGPA: 8.1
• Pre-University (PCMB)
  Institution: Shri Channabasaveshwar Gurukul, Bhalki
  Duration: 2020 – 2022 | Percentage: 79%

TECHNICAL SKILLS:
• Languages: Python, C, SQL, JavaScript
• Web Technologies: HTML5, CSS3, Django, Flask, React, Next.js
• AI / Machine Learning: Machine Learning, NLP, Scikit-learn, Pandas, NumPy, Matplotlib
• Databases: MySQL, PostgreSQL
• Backend / API: GraphQL, GraphQL Yoga, Prisma ORM, Bun runtime, Node.js, Express
• DevOps & Tools: Git, GitHub, VS Code, Bootstrap, Power BI, Excel, Docker, JWT, Selenium, Jira
• Testing & QA: Manual Testing, Selenium Automation, Software QA concepts

CERTIFICATIONS:
• Python for Data Science – NPTEL
• Python Internship Certificate
• Cybersecurity Internship Certificate

WORK EXPERIENCE:

1. AI and Data Science Engineer
   Company: Sirpi Products And Services Private Limited
   Duration: Apr 2026 – Aug 2026
   Responsibilities:
   • Built ML models for predictive analysis using Python
   • Worked with Pandas, NumPy, Scikit-learn, Matplotlib
   • Performed data cleaning, preprocessing, and feature engineering on real datasets
   • Built classification and regression models for business use cases
   • Created data visualizations and dashboards to present insights
   • Collaborated on end-to-end ML projects from data collection to model deployment
   Skills used: Python, Machine Learning, Data Analysis, Data Visualization, Pandas, NumPy, Scikit-learn, Matplotlib

2. Python & Machine Learning Intern
   Company: Karunadu Technologies Pvt Ltd – Bangalore, India
   Duration: Feb 2026 – June 2026
   Responsibilities:
   • Hands-on training in Python programming and Machine Learning
   • Worked with algorithms: Linear Regression, SVM, Random Forest, Naive Bayes
   • Data preprocessing, feature selection, and model testing using Scikit-learn, Pandas, NumPy
   • Integrated ML models into web applications using Django
   Skills used: Python, Machine Learning, Data Analysis, Model Training, Django Integration, Pandas, NumPy, Scikit-learn

PROJECTS:

1. HirePilot – AI Resume Analyzer (Main / Featured Project)
   Description: An AI-powered career platform that provides resume analysis, skill gap identification, and personalized interview preparation.
   Technologies: Python, Flask, Machine Learning, NLP
   GitHub: https://github.com/Nitinchoudri09/AI-RESUME-ANALYZER-Prep2hire-
   Live Demo: https://prep-kril.onrender.com/
   Key Features:
   • Resume analysis using advanced NLP
   • Skill gap identification against job requirements
   • Personalized interview preparation recommendations
   • Smart career guidance powered by AI

2. TypeSpeed – Typing Speed Game (Full Stack)
   Description: A full-stack typing speed game that challenges users to type 20 randomly generated letters as quickly and accurately as possible.
   Technologies: Next.js, Bun, GraphQL Yoga, Prisma ORM, PostgreSQL, urql, JWT authentication, Docker
   GitHub: https://github.com/Nitinchoudri09/typespeed
   Key Features:
   • Real-time typing gameplay with 20 random letters
   • Countdown timer and progress tracking
   • Accuracy score calculation
   • JWT-based secure user authentication
   • Global leaderboard for competitive comparison
   • Containerized with Docker

3. Happy Living PG & Mess Management
   Description: A comprehensive web-based system for managing Paying Guest accommodations and mess facilities.
   Technologies: HTML5, CSS3, JavaScript
   GitHub: https://github.com/Nitinchoudri09/HAPPYLIVING
   Live: https://nitinchoudri09.github.io/HAPPYLIVING/
   Key Features:
   • Digital billing for PG accommodation and mess
   • Meal tracking and menu management
   • Separate student and admin panels
   • Notification and communication management

4. MEDITECH – AI Diabetes Risk Prediction
   Description: An AI-powered web application that predicts the risk of diabetes based on medical parameters using Machine Learning.
   Technologies: Python, Machine Learning, AI, Web Application
   GitHub: https://github.com/Nitinchoudri09/MEDITECH.git
   Key Features:
   • Medical parameter input form
   • ML-based risk assessment model
   • Accurate diabetes risk prediction
   • Health monitoring dashboard

5. ProctorAccess – Online Exam Proctoring System
   Description: An AI-driven online exam proctoring system that ensures integrity with real-time monitoring.
   Technologies: Python, Flask, MySQL, AI/ML
   GitHub: https://github.com/Nitinchoudri09/online-exam-Proctoring-system-ProctorAccess-
   Key Features:
   • Real-time exam monitoring
   • AI-driven proctoring and anomaly detection
   • Secure student authentication
   • Admin management panel

LINKS:
• Portfolio: https://nitinchoudri09.github.io/
• GitHub: https://github.com/Nitinchoudri09
• LinkedIn: https://www.linkedin.com/in/nitin-choudri-809204262
• Email: nitinchoudri6@gmail.com

CAREER INTERESTS:
• AI and Data Science engineering
• Full Stack web development (Python, React, Next.js)
• Quality Assurance and software testing
• Machine Learning applications for real-world problems
• Open to full-time roles, internships, and freelance projects

=== END OF KNOWLEDGE BASE ===`;

// ─── Initialize Gemini ────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function getModel(modelName) {
  return genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: SYSTEM_PROMPT,
  });
}

// Primary model, fallback if primary is overloaded
const PRIMARY_MODEL   = 'gemini-3.5-flash-lite';
const FALLBACK_MODEL  = 'gemini-3.6-flash';

// ─── Health check ──────────────────────────────────────────────
const healthResponse = {
  status: 'online',
  service: 'Nitin Chatbot Backend',
  version: '1.0.0',
};

app.get('/',       (_req, res) => res.json(healthResponse));
app.get('/health', (_req, res) => res.json(healthResponse));

// ─── Chat endpoint ─────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversation = [] } = req.body;

    // Input validation
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string.' });
    }

    const trimmed = message.trim();

    if (trimmed.length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    if (trimmed.length > 500) {
      return res.status(400).json({ error: 'Message is too long. Maximum 500 characters allowed.' });
    }

    // Build conversation history (Gemini format), limit to last 10 messages
    const history = [];
    if (Array.isArray(conversation) && conversation.length > 0) {
      const recent = conversation.slice(-10);
      for (const msg of recent) {
        if (msg.role && msg.content && typeof msg.content === 'string') {
          history.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content.substring(0, 1000) }],
          });
        }
      }
    }

    const genConfig = { maxOutputTokens: 600, temperature: 0.6 };

    // Helper: try a model, return reply or throw
    async function tryModel(modelName) {
      const chat = getModel(modelName).startChat({ history, generationConfig: genConfig });
      const result = await chat.sendMessage(trimmed);
      return result.response.text();
    }

    let reply;
    try {
      reply = await tryModel(PRIMARY_MODEL);
    } catch (primaryErr) {
      const msg = primaryErr.message || '';
      const isOverloaded = msg.includes('503') || msg.includes('overloaded') ||
                           msg.includes('high demand') || msg.includes('unavailable') ||
                           msg.includes('not found') || msg.includes('404');
      if (isOverloaded) {
        console.warn(`[Fallback] Primary model (${PRIMARY_MODEL}) failed, trying ${FALLBACK_MODEL}`);
        reply = await tryModel(FALLBACK_MODEL);
      } else {
        throw primaryErr; // re-throw non-overload errors
      }
    }

    res.json({ reply });

  } catch (err) {
    console.error('[Chat Error]', err.message);

    if (err.message?.includes('API_KEY') || err.message?.includes('PERMISSION_DENIED')) {
      return res.status(500).json({ error: 'Server configuration error. Please contact the site owner.' });
    }

    if (err.message?.includes('SAFETY')) {
      return res.status(400).json({ error: 'Your message was flagged by safety filters. Please rephrase.' });
    }

    if (err.message?.includes('503') || err.message?.includes('overloaded') || err.message?.includes('high demand')) {
      return res.status(503).json({ error: 'AI service is busy right now. Please try again in a moment.' });
    }

    res.status(500).json({ error: 'Something went wrong. Please try again in a moment.' });
  }
});


// ─── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// ─── Start server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n Chatbot server running on http://localhost:${PORT}`);
  console.log(` POST http://localhost:${PORT}/api/chat\n`);
});
