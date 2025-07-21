// config/gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Return generative model
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

module.exports = model;