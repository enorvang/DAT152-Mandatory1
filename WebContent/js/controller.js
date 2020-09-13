"use strict";
/**
 * Controller
 */
const ajax = new AjaxHandler();
const taskListContainer1 = document.getElementById("taskcontainer1");
const gui1 = new GuiHandler(taskListContainer1);
const taskListContainer2 = document.getElementById("taskcontainer2");
const gui2 = new GuiHandler(taskListContainer2);

const taskBoxContainer1 = document.getElementById("taskbox1");
const taskbox1 = new TaskBox(taskBoxContainer1);
const taskBoxContainer2 = document.getElementById("taskbox2");
const taskbox2 = new TaskBox(taskBoxContainer2);

const tasknewbutton1 = taskListContainer1.querySelector("div > button");
const tasknewbutton2 = taskListContainer2.querySelector("div > button");
tasknewbutton1.addEventListener(
  "click",
  (event) => {
    taskbox1.show();
  },
  true
);
tasknewbutton2.addEventListener(
  "click",
  (event) => {
    taskbox2.show();
  },
  true
);

/**
 * Initializes the application, adding callbacks and event handlers.
 */
async function init() {
  const statusesJson = await ajax.getAllStatuses();
  const statuses = statusesJson.allstatuses;
  const tasksJson = await ajax.getTasklist();
  const tasks = tasksJson.tasks;

  gui1.allstatuses = statuses;
  gui2.allstatuses = statuses;

  taskbox1.allstatuses = statuses;
  taskbox2.allstatuses = statuses;

  /*Adds all tasks to the view */
  tasks.forEach((task) => {
    gui1.showTask(task);
    gui2.showTask(task);
  });

  taskbox1.onSubmitCallback = (task) => {
    console.log(
      `New task '${task.title}' with initial status ${task.status} is added by the user.`
    );
    ajax.newTask(task, gui1.showTask.bind(gui1));
    gui2.showTask(task);
    taskbox1.close();
  };

  gui1.newStatusCallback = (id, newStatus) => {
    console.log(
      `User has approved to change the status of task with id ${id} to ${newStatus}.`
    );
    ajax.modifyTask(id, newStatus, gui1.updateTask.bind(gui1));
    gui2.updateTask({"id": id, "status": newStatus});
  };

  gui1.deleteTaskCallback = (id) => {
    console.log(`User has approved the deletion of task with id ${id}.`);
    ajax.deleteTask(id, gui1.removeTask.bind(gui1));
    gui2.removeTask(id);
  };

  gui1.noTask()
    ? (tasknewbutton1.disabled = true)
    : (tasknewbutton1.disabled = false);

  taskbox2.onSubmitCallback = (task) => {
    console.log(
      `New task '${task.title}' with initial status ${task.status} is added by the user.`
    );
    ajax.newTask(task, gui2.showTask.bind(gui2));
    gui1.showTask(task);
    taskbox2.close();
  };

  gui2.newStatusCallback = (id, newStatus) => {
    console.log(
      `User has approved to change the status of task with id ${id} to ${newStatus}.`
    );
    ajax.modifyTask(id, newStatus, gui2.updateTask.bind(gui2));
    gui1.updateTask({"id": id, "status": newStatus})
  };

  gui2.deleteTaskCallback = (id) => {
    console.log(`User has approved the deletion of task with id ${id}.`);
    ajax.deleteTask(id, gui2.removeTask.bind(gui2));
    gui1.removeTask(id);
  };

  gui2.noTask()
    ? (tasknewbutton2.disabled = true)
    : (tasknewbutton2.disabled = false);
}

init();
