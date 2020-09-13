"use strict";

/**
 * Class to handle the GUI
 */
class GuiHandler {
  constructor(container) {
    this.allstatuses = [];
    this.container = container;
    this.deleteTaskCallbacks = new Array();
    this.newStatusCallbacks = new Array();
    this.createTable();
  }

  /**
   * Adds callback methods to an array of callbacks.
   * @param {function} method
   */
  set deleteTaskCallback(method) {
    this.deleteTaskCallbacks.push(method);
  }

  /**
   * Adds callback methods to an array of callbacks.
   * @param {function} method
   */
  set newStatusCallback(method) {
    this.newStatusCallbacks.push(method);
  }

  /**
   * Adds a new task to the view.
   *
   * @param {object} task with id, title and status.
   */
  showTask(task) {
    if (this.taskExists(task.id)) {
      alert(`Task with id ${task.id} already exists.`);
    } else {
      const tbodyRef = this.container.querySelector("table > tbody");
      const newRow = tbodyRef.insertRow(0);

      newRow.setAttribute("data-identity", task.id);

      /*Create select element and options for it */
      const selector = document.createElement("select");
      selector.setAttribute("id", task.id);
      selector.addEventListener(
        "change",
        this.handleModifyTask.bind(this),
        true
      );

      const defaultOption = document.createElement("option");
      defaultOption.setAttribute("value", 0);
      defaultOption.setAttribute("selected", true);
      defaultOption.textContent = "<Modify>";
      defaultOption.setAttribute("disabled", true);
      selector.appendChild(defaultOption);

      for (let i = 0; i < this.allstatuses.length; i++) {
        let option = document.createElement("option");
        option.setAttribute("value", this.allstatuses[i]);
        task.status === this.allstatuses[i]
          ? option.setAttribute("disabled", true)
          : "";
        option.textContent = this.allstatuses[i];
        selector.appendChild(option);
      }

      /*Create button for cell and append to row*/
      const button = document.createElement("button");
      button.setAttribute("type", "button");
      button.setAttribute("data-button-id", task.id);
      button.textContent = "Remove";
      button.addEventListener("click", this.handleDeleteTask.bind(this), true);

      /*Create table cells and append*/
      newRow.insertCell(-1).textContent = task.title;
      newRow.insertCell(-1).textContent = task.status;
      newRow.insertCell(-1).appendChild(selector);
      newRow.insertCell(-1).appendChild(button);

      /**Update the message that tells how many tasks are in the view. */
      this.updateMessage();
    }
  }

  /**
   * Event listener. If user confirms prompt: run all the callbacks in deleteTaskCallbacks with id as parameter
   * @param {event} event
   */
  handleDeleteTask(event) {
    const id = event.target.dataset.buttonId;
    const task =
      event.target.parentNode.parentNode.firstElementChild.textContent;

    if (window.confirm(`Delete task ${task}?`)) {
      this.deleteTaskCallbacks.forEach((method) => method(id));
    }
  }

  /**
   * Removes a task from view
   *
   * @param {number} id Id of task to be removed
   */
  removeTask(id) {
    if (this.taskExists(id)) {
      const rowRef = this.findTaskRowRef(id);
      this.container.querySelector("tbody").removeChild(rowRef);
      this.updateMessage();
    } else {
      alert(`Task not found...`);
    }
  }

  /**
   * Event listener. If user confirms prompt: run all callbacks in newStatusCallbacks with id and newStatus as parameters.
   * @param {event} event
   */
  handleModifyTask(event) {
    const id = event.target.id;
    const newStatus = event.target.value;

    if (window.confirm(`Change status of task to ${newStatus}?`)) {
      this.newStatusCallbacks.forEach((method) => method(id, newStatus));
    }
  }

  /**
   * Updates the status of a given task.
   *
   * @param {object} task Task to be updated
   */
  updateTask(task) {
    let id = task.id;
    let status = task.status;

    if (!this.taskExists(id)) {
      alert(`Task with id ${id} was not found`);
    } else {
      const rowRef = this.findTaskRowRef(id);

      //Get old status and enable its option
      const oldStatus = rowRef.childNodes[1].textContent;
      rowRef
        .querySelector(`select > option[value=${oldStatus}]`)
        .removeAttribute("disabled");

      //Update status and disable the option
      rowRef.childNodes[1].textContent = status;
      rowRef
        .querySelector(`select > option[value=${status}]`)
        .setAttribute("disabled", true);
      //Resets the selector to its initial value (<Modify>)
      const selector = rowRef.querySelector(`select`);
      selector.selectedIndex = 0;
    }
  }

  /**
   * Checks if there are any tasks in the view by checking if tbody has any rows.
   */
  noTask = () =>
    this.container.lastElementChild.querySelectorAll("tbody > tr").length <= 0;

  /**
   * @private
   * Updates the message that displays the number of tasks in the view.
   */
  updateMessage() {
    const messageDiv = this.container.firstElementChild;
    const tasklistDiv = this.container.lastElementChild;
    const numTasks = tasklistDiv.querySelectorAll("tbody > tr").length;

    numTasks <= 0
      ? (messageDiv.textContent = "Waiting for server data...")
      : (messageDiv.textContent = `Found ${numTasks} tasks.`);
  }

  /**
   * @private
   * Creates a new table from scratch using DOM-methods. Appends it to the last child of this.container.
   */
  createTable() {
    const tasklist = this.container.lastElementChild;
    const table = document.createElement("table");
    const thead = table.createTHead();
    const tbody = document.createElement("tbody");
    const headerRow = document.createElement("tr");
    thead.classList.toggle("hline")
    const taskHeader = document.createElement("th");
    const statusHeader = document.createElement("th");

    const taskTextNode = document.createTextNode("Tasks");
    const statusTextNode = document.createTextNode("Status");

    taskHeader.appendChild(taskTextNode);
    statusHeader.appendChild(statusTextNode);

    headerRow.appendChild(taskHeader);
    headerRow.appendChild(statusHeader);

    thead.appendChild(headerRow);

    table.appendChild(thead);
    table.appendChild(tbody);

    tasklist.appendChild(table);
  }

  /**
   * Utility method to check if task exists in view already.
   * @private
   * @param {number} id Id of the task
   * @return {boolean} boolean
   */
  taskExists(id) {
    return this.findTaskRowRef(id) !== null;
  }

  /**
   * Finds the table row that holds the task with given id
   * @private
   * @param {number} id Id of the task
   * @return {object} HTMLTableRowElement
   */
  findTaskRowRef(id) {
    return this.container.querySelector(`tbody > tr[data-identity="${id}"]`);
  }
}
