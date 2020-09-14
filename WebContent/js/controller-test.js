"use strict";
/**
 * Controller for use with index-test.html
 */
const ajax = new AjaxHandler();
const taskListContainer1 = document.getElementById("taskcontainer1");
const gui1 = new GuiHandler(taskListContainer);
const taskListContainer2 = document.getElementById("taskcontainer2");
const gui2 = new GuiHandler(taskListContainer2);

const taskBoxContainer1 = document.getElementById("taskbox1");
const taskbox1 = new TaskBox(taskBoxContainer);
const taskBoxContainer2 = document.getElementById("taskbox2");
const taskbox2 = new TaskBox(taskBoxContainer2);

const tasknewbutton1 = taskListContainer.querySelector("div > button");
const tasknewbutton2 = taskListContainer2.querySelector("div > button");
tasknewbutton.addEventListener(
  "click",
  (event) => {
    taskbox.show();
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

  gui.allstatuses = statuses;
  gui2.allstatuses = statuses;

  taskbox.allstatuses = statuses;
  taskbox2.allstatuses = statuses;

  /*Adds all tasks to the view */
  tasks.forEach((task) => {
    gui.showTask(task);
    gui2.showTask(task);
  });

  taskbox.onSubmitCallback = (task) => {
    console.log(
      `New task '${task.title}' with initial status ${task.status} is added by the user.`
    );
    const taskWithId = ajax.newTask(task, gui.showTask.bind(gui));
    gui2.showTask(taskWithId);
    taskbox.close();
  };

  gui.newStatusCallback = (id, newStatus) => {
    console.log(
      `User has approved to change the status of task with id ${id} to ${newStatus}.`
    );
    ajax.modifyTask(id, newStatus, gui.updateTask.bind(gui));
    gui2.updateTask({"id": id, "status": newStatus});
  };

  gui.deleteTaskCallback = (id) => {
    console.log(`User has approved the deletion of task with id ${id}.`);
    ajax.deleteTask(id, gui.removeTask.bind(gui));
    gui2.removeTask(id);
  };

  gui.noTask()
    ? (tasknewbutton.disabled = true)
    : (tasknewbutton.disabled = false);

  taskbox2.onSubmitCallback = (task) => {
    console.log(
      `New task '${task.title}' with initial status ${task.status} is added by the user.`
    );
    ajax.newTask(task, gui2.showTask.bind(gui2));
    gui.showTask(task);
    taskbox2.close();
  };

  gui2.newStatusCallback = (id, newStatus) => {
    console.log(
      `User has approved to change the status of task with id ${id} to ${newStatus}.`
    );
    ajax.modifyTask(id, newStatus, gui2.updateTask.bind(gui2));
    gui.updateTask({"id": id, "status": newStatus})
  };

  gui2.deleteTaskCallback = (id) => {
    console.log(`User has approved the deletion of task with id ${id}.`);
    ajax.deleteTask(id, gui2.removeTask.bind(gui2));
    gui.removeTask(id);
  };

  gui2.noTask()
    ? (tasknewbutton2.disabled = true)
    : (tasknewbutton2.disabled = false);
}

init();
