/** @format */

class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }

  //Submit budget method
  submitBudgetForm() {
    const value = this.budgetInput.value;

    if (value === "" || value < 0) {
      this.budgetFeedback.classList.add("showItem");
      this.budgetFeedback.innerHTML = `<p>Cannot be empty or negative</p>`;
      setTimeout(() => {
        this.budgetFeedback.classList.remove("showItem");
      }, 3000);
    } else {
      this.budgetAmount.textContent = value;
      this.budgetInput.value = "";
      this.showBalance();
    }
  }

  //Submit Expense Form
  submitExpensetForm() {
    const expenseValue = this.expenseInput.value;
    const amountValue = this.amountInput.value;

    if (expenseValue === "" || amountValue === "" || amountValue < 0) {
      this.expenseFeedback.classList.add("showItem");
      this.expenseFeedback.innerHTML = `<p>Values cannot be empty or negative</p>`;
      const self = this;
      setTimeout(() => {
        self.expenseFeedback.classList.remove("showItem");
      }, 3000);
    } else {
      let amount = parseInt(amountValue);
      this.expenseInput.value = "";
      this.amountInput.value = "";
      let expense = {
        id: this.itemID,
        title: expenseValue,
        amount
      };
      this.itemID++;
      this.itemList.push(expense);
      this.addExpense(expense);
      this.showBalance();
    }
  }

  //Add Expense
  addExpense(expense) {
    const div = document.createElement("div");
    div.classList.add("expense");
    div.innerHTML = `<div class="expense-item d-flex justify-content-between align-items-baseline">

    <h6 class="expense-title mb-0 text-uppercase list-item">- ${expense.title}</h6>
    <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>

    <div class="expense-icons list-item">

     <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
      <i class="fas fa-edit"></i>
     </a>
     <a href="#" class="delete-icon" data-id="${expense.id}">
      <i class="fas fa-trash"></i>
     </a>
    </div>
   </div>`;
    this.expenseList.appendChild(div);
  }

  //Show Balance
  showBalance() {
    const expense = this.totalExpense();
    const total = parseInt(this.budgetAmount.textContent) - expense;
    this.balanceAmount.textContent = total;
    if (total < 0) {
      this.balance.classList.remove("showGreen", "showBlack");
      this.balance.classList.add("showRed");
    } else if (total === 0) {
      this.balance.classList.remove("showGreen", "showRed");
      this.balance.classList.add("showBlack");
    } else if (total > 0) {
      this.balance.classList.remove("showBlack", "showRed");
      this.balance.classList.add("showGreen");
    }
  }

  //Total Expense
  totalExpense() {
    let total = 0;
    if (this.itemList.length > 0) {
      total = this.itemList.reduce((acc, curr) => {
        acc += curr.amount;
        return acc;
      }, 0);
    }
    this.expenseAmount.textContent = total;
    return total;
  }

  //Edit Expense
  editExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    this.expenseList.removeChild(parent);
    let expense = this.itemList.filter(item => item.id === id);
    let tempList = this.itemList.filter(item => item.id !== id);
    this.itemList = tempList;
    this.showBalance();
    this.expenseInput.value = expense[0].title;
    this.amountInput.value = expense[0].amount;
  }

  //Delete Expense
  deleteExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    this.expenseList.removeChild(parent);
    let tempList = this.itemList.filter(item => item.id !== id);
    this.itemList = tempList;
    this.showBalance();
  }
}

function eventListeners() {
  const budgetForm = document.getElementById("budget-form");
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expense-list");

  //New Inst of UI class
  const ui = new UI();

  //Budget form submit
  budgetForm.addEventListener("submit", event => {
    event.preventDefault();
    ui.submitBudgetForm();
  });

  //Expense form submit
  expenseForm.addEventListener("submit", event => {
    event.preventDefault();
    ui.submitExpensetForm();
  });

  //Expense List click
  expenseList.addEventListener("click", event => {
    if (event.target.parentElement.classList.contains("edit-icon")) {
      ui.editExpense(event.target.parentElement);
    } else if (event.target.parentElement.classList.contains("delete-icon")) {
      ui.deleteExpense(event.target.parentElement);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  eventListeners();
});
