"use strict";
/**
 * Controller
 */
const ajax = new AjaxHandler();
const taskListContainer = document.getElementById("taskcontainer");
const gui = new GuiHandler(taskListContainer);

const taskBoxContainer = document.getElementById("taskbox");
const taskbox = new TaskBox(taskBoxContainer);

const tasknewbutton = taskListContainer.querySelector("div > button");
tasknewbutton.addEventListener(
  "click",
  (event) => {
    taskbox.show();
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
  taskbox.allstatuses = statuses;

  /*Adds all tasks to the view */
  tasks.forEach((task) => {
    gui.showTask(task);
  });

  taskbox.onSubmitCallback = (task) => {
    console.log(
      `New task '${task.title}' with initial status ${task.status} is added by the user.`
    );
    const taskWithId = ajax.newTask(task, gui.showTask.bind(gui));
    taskbox.close();
  };

  gui.newStatusCallback = (id, newStatus) => {
    console.log(
      `User has approved to change the status of task with id ${id} to ${newStatus}.`
    );
    ajax.modifyTask(id, newStatus, gui.updateTask.bind(gui));
  };

  gui.deleteTaskCallback = (id) => {
    console.log(`User has approved the deletion of task with id ${id}.`);
    ajax.deleteTask(id, gui.removeTask.bind(gui));
  };

  gui.noTask()
    ? (tasknewbutton.disabled = true)
    : (tasknewbutton.disabled = false);
}

init();
