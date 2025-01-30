import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showJobs } from "./jobs.js";

let addEditDiv = null;
let title = null;
let description = null;
let status = null;
let addingJob = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-job");
  title = document.getElementById("title");
  description = document.getElementById("description");
  status = document.getElementById("status");
  addingJob = document.getElementById("adding-job");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingJob) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/todos";
        // edit functionality
        if (addingJob.textContent === "update") {
          method = "PATCH";
          url = `/api/v1/todos/${addEditDiv.dataset.id}`;
        }
        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: title.value,
              description: description.value,
              status: status.value,
            }),
          });

          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            if (response.status === 200) {
              // a 200 is expected for a successful update
              message.textContent = "The job entry was updated.";
            } else {
              // a 201 is expected for a successful create
              message.textContent = "The job entry was created.";
            }
            title.value = "";
            description.value = "";
            status.value = "pending";

            showJobs();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }

        // delete
        if (addingJob.textContent === "delete") {
          method = "DELETE";
          console.log(">>>>>>", addEditDiv.dataset.id);
          url = `/api/v1/todos/${addEditDiv.dataset.id}`;
          try {
            const response = await fetch(url, {
              method: method,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            const data = await response.json();
            if (response.status === 200 || response.status === 201) {
              showJobs();
              message.textContent = data.msg;
            } else {
              showJobs();
              message.textContent = data.msg;
            }
          } catch (err) {
            console.log(err);
            message.textContent = "A communication error occurred.";
          }
        }

        enableInput(true);
      } else if (e.target === editCancel) {
        message.textContent = "";
        showJobs();
      }
    }
  });
};

export const showAddEdit = async (todoId) => {
  if (!todoId) {
    title.value = "";
    description.value = "";
    status.value = "pending";
    addingJob.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/todos/${todoId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        title.value = data.todo.title;
        description.value = data.todo.description;
        status.value = data.todo.status;
        addingJob.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = todoId;

        setDiv(addEditDiv);
      } else {
        // might happen if the list has been updated since last display
        message.textContent = "The jobs entry was not found";
        showJobs();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showJobs();
    }

    enableInput(true);
  }
};

export const showDelete = async (todoId) => {
  if (!todoId) {
    title.value = "";
    description.value = "";
    status.value = "pending";
    addingJob.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/todos/${todoId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        title.value = data.todo.title;
        description.value = data.todo.description;
        status.value = data.todo.status;
        addingJob.textContent = "delete";
        message.textContent = "Are you sure to DELETE this todo? ";
        addEditDiv.dataset.id = todoId;

        setDiv(addEditDiv);
      } else {
        // might happen if the list has been updated since last display
        message.textContent = "The jobs entry was not found";
        showJobs();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showJobs();
    }

    enableInput(true);
  }
};
