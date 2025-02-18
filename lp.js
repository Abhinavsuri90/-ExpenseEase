
document.getElementById('currency-converter-btn').addEventListener('click', () => {
    window.location.href = 'currency.html'; // Replace with your Currency Converter HTML file name
  });
  
  document.getElementById('expense-tracker-btn').addEventListener('click', () => {
    window.location.href = 'expense.html'; // Replace with your Expense Tracker HTML file name
  });
  

  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const body = document.body;
  
  darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    } else {
      darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    }
  });
