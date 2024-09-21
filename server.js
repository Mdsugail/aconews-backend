require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Supported languages
const supportedLanguages = {
  ar: 'Arabic',
  zh: 'Chinese',
  nl: 'Dutch',
  en: 'English',
  fr: 'French',
  de: 'German',
  el: 'Greek',
  he: 'Hebrew',
  hi: 'Hindi',
  it: 'Italian',
  ja: 'Japanese',
  ml: 'Malayalam',
  mr: 'Marathi',
  no: 'Norwegian',
  pt: 'Portuguese',
  ro: 'Romanian',
  ru: 'Russian',
  es: 'Spanish',
  sv: 'Swedish',
  ta: 'Tamil',
  te: 'Telugu',
  uk: 'Ukrainian'
};

// Supported countries
const supportedCountries = {
  au: 'Australia',
  br: 'Brazil',
  ca: 'Canada',
  cn: 'China',
  eg: 'Egypt',
  fr: 'France',
  de: 'Germany',
  gr: 'Greece',
  hk: 'Hong Kong',
  in: 'India',
  ie: 'Ireland',
  il: 'Israel',
  it: 'Italy',
  jp: 'Japan',
  nl: 'Netherlands',
  no: 'Norway',
  pk: 'Pakistan',
  pe: 'Peru',
  ph: 'Philippines',
  pt: 'Portugal',
  ro: 'Romania',
  ru: 'Russian Federation',
  sg: 'Singapore',
  es: 'Spain',
  se: 'Sweden',
  ch: 'Switzerland',
  tw: 'Taiwan',
  ua: 'Ukraine',
  gb: 'United Kingdom',
  us: 'United States'
};
/**
 * Makes an API request to a given URL.
 * @param {string} url - The API endpoint URL.
 * @returns {Promise<Object>} The response object containing status, success, message, and data.
 */
// Helper function for API requests
async function makeApiRequest(url) {
  try {
    const response = await axios.get(url);
    return {
      status: 200,
      success: true,
      message: "Successfully fetched the data",
      data: response.data,
    };
  } catch (error) {
    console.error("API request error:", error.response ? error.response.data : error);
    return {
      status: 500,
      success: false,
      message: "Failed to fetch data from the API",
      error: error.response ? error.response.data : error.message,
    };
  }
}

// Get news by search query
app.get("/search", async (req, res) => {
  const query = req.query.q || 'world';
  const language = req.query.language || '';
  const page = parseInt(req.query.page) || 1;
  const country = req.query.country || '';

  if (language && !supportedLanguages[language]) {
    return res.status(400).json({
      success: false,
      message: "Unsupported language",
    });
  }

  if (country && !supportedCountries[country]) {
    return res.status(400).json({
      success: false,
      message: "Unsupported country",
    });
  }

  let url = `https://gnews.io/api/v4/search?q=${query}&page=${page}&apikey=${process.env.API_KEY}`;
if (language) url += `&lang=${language}`;
if (country) url += `&country=${country}`;


  const result = await makeApiRequest(url);
  res.status(result.status).json(result);
});

// Map custom categories to GNews API categories or queries
const categoryMap = {
  general: 'general',
  world: 'world',
  nation: 'nation',
  business: 'business',
  technology: 'technology',
  entertainment: 'entertainment',
  sports: 'sports',
  science: 'science',
  health: 'health'
};

// Get top headlines by category, country, or language
app.get("/headlines", async (req, res) => {
  let category = req.query.category || '';
  const country = req.query.country || '';
  const language = req.query.language || '';
  const page = parseInt(req.query.page) || 1;

  if (language && !supportedLanguages[language]) {
    return res.status(400).json({
      success: false,
      message: "Unsupported language",
    });
  }

  if (country && !supportedCountries[country]) {
    return res.status(400).json({
      success: false,
      message: "Unsupported country",
    });
  }

  let url = `https://gnews.io/api/v4/top-headlines?page=${page}&apikey=${process.env.API_KEY}`;
  if (category) url += `&category=${categoryMap[category] || 'general'}`;
  if (country) url += `&country=${country}`;
  if (language) url += `&lang=${language}`;

  const result = await makeApiRequest(url);
  res.status(result.status).json(result);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// 20d85c8ec607367b7090d9a5715380d6
// ead056d6b64547ab16dcd72a8fd14bdb