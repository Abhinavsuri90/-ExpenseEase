// DOM ke saare elements

const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const paymentMethodInput = document.getElementById('paymentMethod');
const dateInput = document.getElementById('date');
const addExpenseButton = document.getElementById('addExpense');
const expensesList = document.getElementById('expenses');
const pieChartCanvas = document.getElementById('pieChart').getContext('2d');
const barChartCanvas = document.getElementById('barChart').getContext('2d');
const budgetGoalInput = document.getElementById('budgetGoal');
const setBudgetGoalButton = document.getElementById('setBudgetGoal');
const progressBar = document.getElementById('progress');
const goalStatus = document.getElementById('goalStatus');
const exportCSVButton = document.getElementById('exportCSV');
const resetButton = document.getElementById('resetButton');

//PIe chart yaha se hai 
let pieChart = new Chart(pieChartCanvas, {
  type: 'pie',
  data: {
    labels: [],
    datasets: [{
      label: 'Spending Breakdown',
      data: [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    }]
  },
  options: {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(2) + '%';
            return `${label}: ₹${value} (${percentage})`;
          }
        }
      }
    }
  }
});

// bar chart ki js yaha hai 
let barChart = new Chart(barChartCanvas, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: 'Spending Analysis',
      data: [],
      backgroundColor: '#FFD700', // Gold
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return '₹' + value;
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return '₹' + context.raw;
          }
        }
      }
    }
  }
});

// expense from local storage here 
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let budgetGoal = parseFloat(localStorage.getItem('budgetGoal')) || 0;

// expense ko update karna ka function
function renderExpenses() {
  expensesList.innerHTML = '';
  expenses.forEach((expense, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${expense.description}: ₹${expense.amount} (${expense.category}, ${expense.paymentMethod}, ${expense.date})
      <button onclick="deleteExpense(${index})">Delete</button>
    `;
    expensesList.appendChild(li);
  });
  updateCharts();
  updateBudgetGoalProgress();
}

// Axpense ko ad karna 
addExpenseButton.addEventListener('click', () => {
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;
  const paymentMethod = paymentMethodInput.value;
  const date = dateInput.value;

  if (description && amount > 0 && category && paymentMethod && date) {
    const expense = { description, amount, category, paymentMethod, date };
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses();
    descriptionInput.value = '';
    amountInput.value = '';
  } else {
    alert('Please fill out all fields correctly.');
  }
});

// Delete expense
function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  renderExpenses();
}

// funtion chart ko update karna ka
function updateCharts() {
  const categories = {};
  expenses.forEach(expense => {
    if (categories[expense.category]) {
      categories[expense.category] += expense.amount;
    } else {
      categories[expense.category] = expense.amount;
    }
  });

  // Update Pie Chart
  pieChart.data.labels = Object.keys(categories);
  pieChart.data.datasets[0].data = Object.values(categories);
  pieChart.update();

  // Update Bar Chart
  barChart.data.labels = Object.keys(categories);
  barChart.data.datasets[0].data = Object.values(categories);
  barChart.update();
}

// budjet goial set karna ka feature
setBudgetGoalButton.addEventListener('click', () => {
  const goal = parseFloat(budgetGoalInput.value);
  if (goal > 0) {
    budgetGoal = goal;
    localStorage.setItem('budgetGoal', budgetGoal);
    updateBudgetGoalProgress();
  } else {
    alert('Please enter a valid budget goal.');
  }
});

// budjet goal ko update karna ka function 
function updateBudgetGoalProgress() {
  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  const progress = (totalExpenses / budgetGoal) * 100;
  progressBar.style.width = `${Math.min(progress, 100)}%`;

  if (budgetGoal > 0) {
    goalStatus.textContent = `₹${totalExpenses.toFixed(2)} / ₹${budgetGoal.toFixed(2)}`;
  } else {
    goalStatus.textContent = 'Set a budget goal to track progress.';
  }
}

// csv file 
exportCSVButton.addEventListener('click', () => {
  const csvContent = "data:text/csv;charset=utf-8," +
    "Description,Amount,Category,Payment Method,Date\n" +
    expenses.map(expense => 
      `${expense.description},${expense.amount},${expense.category},${expense.paymentMethod},${expense.date}`
    ).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "expenses.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Reset all data
resetButton.addEventListener('click', () => {
  expenses = [];
  budgetGoal = 0;
  localStorage.removeItem('expenses');
  localStorage.removeItem('budgetGoal');
  renderExpenses();
  updateBudgetGoalProgress();
  alert('All data has been reset.');
});


renderExpenses();
