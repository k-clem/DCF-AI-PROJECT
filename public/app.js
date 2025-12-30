async function analyzeStock() {
  const ticker = document.getElementById("tickerInput").value.toUpperCase();
  const statusEl = document.getElementById("status");
  const resultEl = document.getElementById("result");

  statusEl.textContent = "Analyzing…";

  try {
    const res = await fetch(
      `https://dcf-backend-yojp.onrender.com/analyze?ticker=${ticker}`
    );
    const data = await res.json();

    if (data.status === "queued") {
      statusEl.textContent = "Analysis in progress. Try again shortly.";
      return;
    }

    if (data.status === "complete") {
      statusEl.textContent = "Analysis complete";

      resultEl.innerHTML = `
        <p><strong>DCF Value:</strong> $${data.dcf_value_billion}B</p>
        <p><strong>AI Risk Score:</strong> ${data.risk_score}/100</p>
        <p><strong>Years Analyzed:</strong> ${data.years_used}</p>
      `;
    }
  } catch (err) {
    statusEl.textContent = "Error analyzing stock.";
  }
}
