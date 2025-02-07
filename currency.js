const apiKey = 'fa35298123c56c9726839f0c'; // Replace with your API key
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const convertBtn = document.getElementById('convertBtn');
const resultText = document.getElementById('resultText');
const historyBtn = document.getElementById('historyBtn');
const historySection = document.getElementById('historySection');
const historyList = document.getElementById('historyList');

let history = JSON.parse(localStorage.getItem('conversionHistory')) || [];

// Fetch exchange rates
async function fetchExchangeRate(from, to) {
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.conversion_rate;
}

// Convert currency
async function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }

  const rate = await fetchExchangeRate(from, to);
  const result = (amount * rate).toFixed(2);
  resultText.textContent = `${amount} ${from} = ${result} ${to}`;

  // Save to history
  history.push({ amount, from, to, result });
  localStorage.setItem('conversionHistory', JSON.stringify(history));
  updateHistory();
}

// Update history list
function updateHistory() {
  historyList.innerHTML = '';
  history.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.amount} ${item.from} → ${item.result} ${item.to}`;
    historyList.appendChild(li);
  });
}

// Toggle history section
historyBtn.addEventListener('click', () => {
  historySection.classList.toggle('active');
});

// Event listener for convert button
convertBtn.addEventListener('click', convertCurrency);

// Initialize history on page load
updateHistory();