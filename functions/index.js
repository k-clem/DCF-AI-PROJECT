const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const yahooFinance = require("yahoo-finance2").default;

const app = express();
app.use(cors());

app.get("/api/analyze", async (req, res) => {
  try {
    const { ticker } = req.query;
    const quote = await yahooFinance.quote(ticker);
    const cashflow = await yahooFinance.cashflow(ticker);
    const fcf = cashflow.cashflowStatements[0]?.freeCashFlow || 0;

    const growth = 0.05;
    const discount = 0.1;
    const terminal = 0.02;

    let value = 0;
    for (let i = 1; i <= 5; i++) {
      value += (fcf * Math.pow(1 + growth, i)) / Math.pow(1 + discount, i);
    }

    const terminalValue =
      (fcf * Math.pow(1 + growth, 5) * (1 + terminal)) / (discount - terminal);

    value += terminalValue / Math.pow(1 + discount, 5);

    res.json({ ticker, price: quote.regularMarketPrice, intrinsicValue: value });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

exports.api = functions.https.onRequest(app);
