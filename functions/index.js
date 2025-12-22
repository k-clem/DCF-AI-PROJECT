const functions = require("firebase-functions");
const yahooFinance = require("yahoo-finance2").default;

exports.analyze = functions.https.onCall(async (data) => {
  const ticker = data?.ticker;
  if (!ticker) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Ticker symbol required"
    );
  }

  try {
    const quote = await yahooFinance.quote(ticker);
    const cashflow = await yahooFinance.cashflow(ticker);

    const fcf =
      cashflow.cashflowStatements?.[0]?.freeCashFlow || 0;

    const growth = 0.05;
    const discount = 0.1;
    const terminal = 0.02;

    let value = 0;
    for (let i = 1; i <= 5; i++) {
      value += (fcf * Math.pow(1 + growth, i)) / Math.pow(1 + discount, i);
    }

    const terminalValue =
      (fcf * Math.pow(1 + growth, 5) * (1 + terminal)) /
      (discount - terminal);

    value += terminalValue / Math.pow(1 + discount, 5);

    return {
      ticker,
      marketPrice: quote.regularMarketPrice,
      intrinsicValue: Math.round(value)
    };
  } catch (err) {
    throw new functions.https.HttpsError("internal", err.message);
  }
});

