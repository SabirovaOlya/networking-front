const addForm = document.querySelector(".add");
const list = document.querySelector(".todos");
const search = document.querySelector(".search input");
// variables
let task_type = "1";
const apiURL = 'https://uldaulet.araltech.tech/api';

// add new todos
const generateTemplate = (todo, id) => {
    const html = `
        <li class="list-group-item d-flex justify-content-between align-items-center" data-id="${id}">
            <span>${todo}</span>
            <i class="far fa-trash-alt delete" data-id="${id}"></i>
        </li>
    `;
    list.innerHTML += html;
};

// clear todo text box input and prevent inputs with unecessary white space
addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const todo = addForm.add.value.trim();
    if (todo.length) {
        addNewTask(todo);
        addForm.reset();
    }
});

// delete todos
list.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
        const id = e.target.getAttribute('data-id');
        deleteTask(id, e.target.parentElement);
    }
});

const filterTodos = (term) => {
  Array.from(list.children)
    .filter((todo) => !todo.textContent.toLowerCase().includes(term))
    .forEach((todo) => todo.classList.add("filtered"));

  Array.from(list.children)
    .filter((todo) => todo.textContent.toLowerCase().includes(term))
    .forEach((todo) => todo.classList.remove("filtered"));
};

// keyup event
search.addEventListener("keyup", () => {
  const term = search.value.trim().toLowerCase();
  filterTodos(term);
});


// tabs activation
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll('#pills-tab button');

    // Initial data fetch for the default active tab
    const initialTaskType = document.querySelector('.nav-link.active').getAttribute('data-task-type');
    getData(initialTaskType);

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class and update aria-selected for all tabs
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });

            // Add active class and update aria-selected for clicked tab
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            // Fetch data corresponding to the clicked tab
            const taskType = tab.getAttribute('data-task-type');
            getData(taskType);
        });
    });
});

// Modify getData to accept a taskType parameter
const getData = (taskType) => {
    fetch(`${apiURL}/task`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            list.innerHTML = '';  // Clear existing tasks before adding new ones
            data?.forEach(item => {
                if(item?.type === taskType){
                    generateTemplate(item.name, item?.id);
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

// Function to handle POST request
const addNewTask = (taskName) => {
    const initialTaskType = document.querySelector('.nav-link.active').getAttribute('data-task-type');
    task_type = initialTaskType
    fetch(`${apiURL}/task/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: taskName, type: task_type })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        generateTemplate(taskName); 
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
};


// Function to handle DELETE request
const deleteTask = (id, taskElement) => {
    fetch(`${apiURL}/task/${+id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete the task');
        }
        taskElement.remove(); // Remove the task element from the DOM on successful deletion
    })
    .catch(error => {
        console.error('Error:', error);
    });
};


