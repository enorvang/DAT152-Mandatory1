"use strict";

/**
 * Class that creates a modal box.
 */
class TaskBox {
  constructor(container) {
    this.container = container;
    this.allstatuses = new Array();
    this.onSubmitCallbacks = new Array();

    const closeSpan = this.container.querySelector("div > span");
    const submitButton = this.container.querySelector("button");

    closeSpan.addEventListener("click", this.close.bind(this), true);

    /**Closes the modal if user clicks outside of it. */
    window.addEventListener("click", (event) => {
      if(event.target === this.container){
        this.close();
      }
    }, true);
    submitButton.addEventListener("click", this.submit.bind(this), true);
  }

  /**
   * @param {function} method
   */
  set onSubmitCallback(method) {
    this.onSubmitCallbacks.push(method);
  }

  /**
   * Closes the modal box
   */
  close() {
    this.container.style.display = "none";
  }
 
  show() {
    const selector = this.container.querySelector("select");

    if(selector.length < 1){
      for (let i = 0; i < this.allstatuses.length; i++) {
        let option = document.createElement("option");
        option.setAttribute("value", this.allstatuses[i]);
        option.textContent = this.allstatuses[i];
        selector.appendChild(option);
      }
    }
    this.container.style.display = "block";
  }

  submit() {
    const text = this.container.querySelector("input");
    const selector = this.container.querySelector("select");
    const task = {"title": text.value, "status": selector.value};

    this.onSubmitCallbacks.forEach((method) => method(task));

    text.value= "";
    selector.selectedIndex = 0;

  }

}
