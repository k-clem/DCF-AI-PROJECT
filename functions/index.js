const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const yahooFinance = require("yahoo-finance2").default;

const app = express();
app.use(cors());

app.get("/api/analyze", async (req, res) => {
  try {
    const { ticker } = req.query;
    if (!ticker) return res.status(400).json({ error: "Missing ticker" });
    const quote = await yahooFinance.quote(ticker);
    res.json({ ticker, price: quote.regularMarketPrice });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

exports.api = functions.https.onRequest(app);
