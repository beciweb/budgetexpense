const form = document.getElementById('expenseForm');
const expenseNameInput = document.getElementById('expenseName');
const expenseAmountInput = document.getElementById('expenseAmount');
const expenseQuantityInput = document.getElementById('expenseQuantity');
const expenseTableBody = document.querySelector('#expenseTable tbody');
const totalAmountElement = document.getElementById('totalAmount');
const downloadBtn = document.getElementById('downloadBtn');

let expenses = [];

// Function to update the total amount
function updateTotal() {
  const total = expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) * parseInt(expense.quantity)), 0);
  totalAmountElement.textContent = total.toFixed(2);
}

// Function to render the expenses in the table
function renderExpenses() {
  expenseTableBody.innerHTML = '';
  expenses.forEach((expense, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${expense.name}</td>
      <td>$${expense.amount} x ${expense.quantity}</td>
      <td>$${(expense.amount * expense.quantity).toFixed(2)}</td>
    `;
    expenseTableBody.appendChild(row);
  });
  updateTotal();
}

// Handle form submission
form.addEventListener('submit', function(event) {
  event.preventDefault();
  
  const expenseName = expenseNameInput.value.trim();
  const expenseAmount = parseFloat(expenseAmountInput.value.trim());
  const expenseQuantity = parseInt(expenseQuantityInput.value.trim());

  if (expenseName && !isNaN(expenseAmount) && !isNaN(expenseQuantity) && expenseQuantity > 0) {
    expenses.push({ name: expenseName, amount: expenseAmount, quantity: expenseQuantity });
    renderExpenses();

    // Clear the form inputs
    expenseNameInput.value = '';
    expenseAmountInput.value = '';
    expenseQuantityInput.value = '';
  } else {
    alert('Please enter valid expense details');
  }
});

// Generate PDF when download button is clicked
downloadBtn.addEventListener('click', function() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text('Expense Report', 14, 10);
  doc.text('-------------------', 14, 20);

  expenses.forEach((expense, index) => {
    doc.text(`${expense.name}: $${expense.amount} x ${expense.quantity} = $${(expense.amount * expense.quantity).toFixed(2)}`, 14, 30 + (index * 10));
  });

  doc.text('-------------------', 14, 30 + (expenses.length * 10));
  doc.text(`Total: $${totalAmountElement.textContent}`, 14, 40 + (expenses.length * 10));

  doc.save('expense-report.pdf');
});

