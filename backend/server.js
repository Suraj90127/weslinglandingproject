const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// ===== ROUTES =====
const bannerRoutes = require('./routes/bannerRoutes');
const eventRoutes = require('./routes/eventRoutes');
const playerRoutes = require('./routes/playerRoutes');
const contentRoutes = require('./routes/contentRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');


// ===== DB CONNECT =====
const connectDB = require('./config/database');
connectDB();

const app = express();

// Trust proxy for VPS environments (Hostinger/Nginx)
app.set('trust proxy', 1);

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      const allowedOrigins = [

        "https://www.aweprowrestling.com",
        "http://www.aweprowrestling.com",
        "http://aweprowrestling.com",
        "https://aweprowrestling.com",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5110"


      ];

      // Check if origin is in allowed list or is a subdomain of aweprowrestling.com
      const isAllowed = allowedOrigins.includes(origin) ||
        origin.endsWith(".aweprowrestling.com");

      if (isAllowed) {
        callback(null, true);
      } else {
        console.log("🚫 CORS blocked for origin:", origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);


// ===== UPLOADS =====
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ================= API ROUTES =================
app.use('/api/auth', authRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/contact', contactRoutes);


// ================= STATIC PATHS =================

// dashboard build folder
const dashboardPath = path.join(__dirname, "../dashboard/dist");

// frontend build folder
const frontendPath = path.join(__dirname, "../my-project/dist");


// ===== ADMIN STATIC FIRST =====
app.use('/admin', express.static(dashboardPath));


// ===== FRONTEND STATIC =====
app.use(express.static(frontendPath));


// ================= SPA FALLBACK =================

// admin SPA fallback
app.get(['/admin', '/admin/*'], (req, res) => {
  res.sendFile(path.join(dashboardPath, 'index.html'), (err) => {
    if (err) {
      console.error('Admin index.html not found:', err.message);
      res.status(404).send('Admin panel not built. Run: cd dashboard && npm run build');
    }
  });
});

// frontend SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
    if (err) {
      console.error('Frontend index.html not found:', err.message);
      res.status(404).send('Frontend not built. Run: cd my-project && npm run build');
    }
  });
});


// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});


// ===== PORT =====
const PORT = process.env.PORT || 5110;

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});


// ===== UNHANDLED PROMISE =====
process.on('unhandledRejection', (err) => {
  console.log(`❌ Error: ${err.message}`);
  server.close(() => process.exit(1));
});



