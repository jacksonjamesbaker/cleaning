// Netlify Functions entry — reuses the single source of truth in /api/checkout.js
exports.handler = require("../../api/checkout.js").handler;
