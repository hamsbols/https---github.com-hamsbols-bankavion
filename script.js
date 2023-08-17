let accountBalance = 0;
let users = JSON.parse(localStorage.getItem("users")) || [];

function updateLocalStorage() {
  localStorage.setItem("users", JSON.stringify(users));
}

function updateAccountBalanceDisplay() {
  const accountBalanceElement = document.getElementById("accountBalance");
  accountBalanceElement.textContent = `Account Balance: ₱${accountBalance.toFixed(
    2
  )}`;
}

function create_user(userName) {
  users.push({ name: userName, balance: 0 });
  updateLocalStorage();
  updateUserTable();
}

function updateUserTable() {
  const userTableBody = document.getElementById("userTableBody");
  userTableBody.innerHTML = "";
  users.forEach((user, index) => {
    const row = userTableBody.insertRow();
    const userNameCell = row.insertCell(0);
    const balanceCell = row.insertCell(1);
    const passwordCell = row.insertCell(2); // Add password cell
    const actionsCell = row.insertCell(3); // Shift actions cell index

    userNameCell.textContent = user.name;
    balanceCell.textContent = `₱${get_balance(index).toFixed(2)}`;
    passwordCell.textContent = user.password; // Add password value
    const depositButton = createActionButton("Deposit", () => deposit(index));
    const withdrawButton = createActionButton("Withdraw", () =>
      withdraw(index)
    );
    const sendButton = createActionButton("Send", () => send(user.name));
    actionsCell.appendChild(depositButton);
    actionsCell.appendChild(withdrawButton);
    actionsCell.appendChild(sendButton);
  });
}

// Convert usd into peso assuming value of usd is 50 pesos
function get_balance(userIndex) {
  return users[userIndex].balance * 50;
}

// Deposit function
function deposit(userIndex) {
  const amount = parseFloat(prompt("Enter the deposit amount:"));
  if (amount > 0) {
    users[userIndex].balance += amount;
    updateLocalStorage();
    updateAccountBalanceDisplay();
    updateUserTable();
  } else {
    alert("Invalid deposit amount.");
  }
}

// Withdraw function
function withdraw(userIndex) {
  const amount = parseFloat(prompt("Enter the withdrawal amount:"));
  if (amount > 0 && users[userIndex].balance >= amount) {
    users[userIndex].balance -= amount;
    updateLocalStorage();
    updateAccountBalanceDisplay();
    updateUserTable();
  } else {
    alert("Invalid withdrawal amount or insufficient balance.");
  }
}

// Transfer money function
function send(senderName) {
  const recipientName = prompt("Enter the recipient's name:");
  const senderIndex = users.findIndex((user) => user.name === senderName);
  const recipientIndex = users.findIndex((user) => user.name === recipientName);

  if (senderIndex === -1) {
    alert("Sender does not exist.");
    return;
  }

  if (recipientIndex === -1) {
    alert("Recipient does not exist.");
    return;
  }

  if (senderIndex === recipientIndex) {
    alert("Cannot send to the same user.");
    return;
  }

  const amount = parseFloat(prompt("Enter the transfer amount:"));
  if (amount > 0 && users[senderIndex].balance >= amount) {
    users[senderIndex].balance -= amount;
    users[recipientIndex].balance += amount;
    updateLocalStorage();
    updateAccountBalanceDisplay();
    updateUserTable();
  } else {
    alert("Invalid transfer amount or insufficient balance.");
  }
}

function createActionButton(label, onClick) {
  const button = document.createElement("button");
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function list_users() {
  return users.map((user) => user.name);
}

document.getElementById("addUserButton").addEventListener("click", function () {
  const userName = document.getElementById("userName").value.trim();
  if (userName) {
    create_user(userName);
    document.getElementById("userName").value = "";
  }
});

function updateAccountBalanceDisplay() {
  const totalBalance = users.reduce((sum, user) => sum + user.balance, 0) * 50;
  const accountBalanceElement = document.getElementById("accountBalance");
  accountBalanceElement.textContent = `Total Balance: ₱${totalBalance.toFixed(
    2
  )}`;
}

updateAccountBalanceDisplay();
updateUserTable();
