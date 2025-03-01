import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit, showDelete } from "./addEdit.js";

let jobsDiv = null;
let jobsTable = null;
let jobsTableHeader = null;

export const handleJobs = () => {
  jobsDiv = document.getElementById("jobs");
  const logoff = document.getElementById("logoff");
  const addJob = document.getElementById("add-job");
  jobsTable = document.getElementById("jobs-table");
  jobsTableHeader = document.getElementById("jobs-table-header");

  jobsDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addJob) {
        showAddEdit(null);
      } else if (e.target === logoff) {
        setToken(null);

        message.textContent = "You have been logged off.";

        jobsTable.replaceChildren([jobsTableHeader]);

        showLoginRegister();
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = "";
        showAddEdit(e.target.dataset.id);
      } else if (e.target.classList.contains("deleteButton")) {
        enableInput(false);
        // showDelete(e.target.dataset.id);
        let method = "DELETE";
        let url = `/api/v1/todos/${e.target.dataset.id}`;
        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();
          if (response.status === 200 || response.status === 204) {
            message.textContent = data.msg;
            await showJobs();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }

        enableInput(true);
      }
    }
  });
};
// to show all jobs/todos
export const showJobs = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/todos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    let children = [jobsTableHeader];

    if (response.status === 200) {
      if (data.count === 0) {
        jobsTable.replaceChildren(...children); // clear this for safety
      } else {
        for (let i = 0; i < data.todos.length; i++) {
          let rowEntry = document.createElement("tr");

          let editButton = `<td><button type="button" class="editButton" data-id=${data.todos[i]._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.todos[i]._id}>delete</button></td>`;
          let rowHTML = `
            <td>${data.todos[i].title}</td>
            <td>${data.todos[i].description}</td>
            <td>${data.todos[i].status}</td>
            <div>${editButton}${deleteButton}</div>`;

          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        jobsTable.replaceChildren(...children);
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
  setDiv(jobsDiv);
};
