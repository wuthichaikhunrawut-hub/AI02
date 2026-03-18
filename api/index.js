const express = require('express');
const { generateReply } = require('./_ai');
const { getDb } = require('./_db');

const app = express();
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

// Routes
app.use('/api/generate', require('./generate'));
app.use('/api/history', require('./history'));
app.use('/api/health', require('./health'));
app.use('/api/feedback', require('./feedback'));

module.exports.handler = app;
