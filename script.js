const balance = document.getElementById("balance");
const incomeTotal = document.getElementById("income");
const expenseTotal = document.getElementById("expense");
const transactionForm = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const transactionList = document.getElementById("transaction-list");
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
function updateTotals() {
    const amounts = transactions.map(transaction => transaction.amount);
    const totalBalance = amounts.reduce((acc, num) => acc + num, 0);
    const income = amounts.filter(num => num > 0).reduce((acc, num) => acc + num, 0);
    const expense = amounts.filter(num => num < 0).reduce((acc, num) => acc + num, 0) * -1;

    balance.textContent = totalBalance;
    incomeTotal.textContent = income;
    expenseTotal.textContent = expense;
}
function displayTransactions() {
    transactionList.innerHTML = "";
    transactions.forEach((transaction, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${transaction.description}</td>
            <td>${transaction.amount > 0 ? "+" : ""}${transaction.amount}</td>
            <td><button class="delete_btn" onclick="deleteTransaction(${index})">X</button></td>
        `;
        transactionList.appendChild(row);
    });
}
transactionForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);

    if (description === "" || isNaN(amount)) {
        alert("Please enter a valid description and amount.");
        return;
    }
    transactions.push({ description, amount });
    localStorage.setItem("transactions", JSON.stringify(transactions));

    descriptionInput.value = "";
    amountInput.value = "";
    displayTransactions();
    updateTotals();
});
function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    displayTransactions();
    updateTotals();
}
document.getElementById("download-btn").addEventListener("click", function () {
    if (transactions.length === 0) {
        alert("No transactions to download.");
        return;
    }
    let csvContent = "Description,Amount\n";
    transactions.forEach(t => {
        csvContent += `${t.description},${t.amount}\n`;
    });
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});
displayTransactions();
updateTotals();
