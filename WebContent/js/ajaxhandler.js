"use strict";

class AjaxHandler {
  
  /**
   * Get all statuses from database
   *
   * @async
   */
  async getAllStatuses() {
    const url = "../TaskServices/broker/allstatuses";

    try {
      const response = await fetch(url, { method: "GET" });
      if (response.ok) {
        try {
          const json = await response.json();
          return json;
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Gets all tasks that are currently in database
   *
   * @async
   */
  async getTasklist() {
    const url = "../TaskServices/broker/tasklist";

    try {
      const response = await fetch(url, { method: "GET" });
      if (response.ok) {
        try {
          const json = await response.json();
          return json;
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Changes the status of a task
   * @param {number} id id of task
   * @param {string} status new status
   * @param {function} callbackMethod callback to be run
   * @async
   */
  async modifyTask(id, status, callbackMethod) {
    const url = `../TaskServices/broker/task/${id}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ status: status }),
      });

      if (response.ok) {
        console.log(`Changed status on task with id=${id} to ${status}`);
        callbackMethod({"id": id, "status": status});
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Delete a task
   * @param {number} id id of task
   * @param {function} callbackMethod callback function to run
   * @async
   */
  async deleteTask(id, callbackMethod) {
    const url = `../TaskServices/broker/task/${id}`;

    try {
      const response = await fetch(url, { method: "DELETE" });
      if (response.ok) {
        console.log(`Deleted task with id=${id}`);
        callbackMethod(id);
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Adds a new task to the database.
   * @param {Task} task the task to add
   * @param {function} callbackMethod callback function to be run
   * @async
   */
  async newTask(task, callbackMethod) {
    const url = "../TaskServices/broker/task";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(task),
      });
      if (response.ok) {
        try {
          const json = await response.json();
          task.id = json.task.id;
          callbackMethod(task);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
