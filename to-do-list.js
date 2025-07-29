let todolist = JSON.parse(localStorage.getItem('todolist')) || [];
let currentFilter = 'all'; // 'all', 'completed', 'pending'

renderToDoList();

function renderToDoList() {
  let todolistHTML = '';

  const filteredList = todolist.filter(todo => {
    if (currentFilter === 'completed') return todo.completed;
    if (currentFilter === 'pending') return !todo.completed;
    return true;
  });

  for (let i = 0; i < filteredList.length; i++) {
    const todoObject = filteredList[i];
    const index = todolist.indexOf(todoObject); // original index for toggle/delete

    const html = `
      <div>
        <input type="checkbox" onchange="toggleComplete(${index})" ${todoObject.completed ? 'checked' : ''}>
        <span class="${todoObject.completed ? 'completed' : ''}">${todoObject.name}</span>
      </div>
      <div>${todoObject.dueDate}</div>
      <button class="delete-button" onclick="
        todolist.splice(${index}, 1);
        saveAndRender();
      ">Delete</button>
    `;
    todolistHTML += html;
  }

  document.querySelector('.js-todo-list').innerHTML = todolistHTML;
  updateFilterTitle();
}

function addToDo() {
  const inputElement = document.querySelector('.js-name-input');
  const name = inputElement.value;

  const dateInputElement = document.querySelector('.js-date-input');
  const dueDateRaw = dateInputElement.value;

  const timeInputElement = document.querySelector('.js-time-input');
  const timeRaw = timeInputElement.value;

  if (name && dueDateRaw && timeRaw) {
    const dateParts = dueDateRaw.split('-'); // [yyyy, mm, dd]
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // dd-mm-yyyy

    let [hour, minute] = timeRaw.split(':');
    let ampm = 'AM';
    hour = parseInt(hour);
    if (hour >= 12) {
      ampm = 'PM';
      if (hour > 12) hour -= 12;
    }
    if (hour === 0) hour = 12;
    const formattedTime = `${hour}:${minute} ${ampm}`;

    todolist.push({
      name,
      dueDate: `${formattedDate} ${formattedTime}`,
      completed: false
    });

    inputElement.value = '';
    dateInputElement.value = '';
    timeInputElement.value = '';
    renderToDoList();
  }
}


function toggleComplete(index) {
  todolist[index].completed = !todolist[index].completed;
  saveAndRender();
}

function setFilter(filter) {
  currentFilter = filter;
  renderToDoList();
}

function updateFilterTitle() {
  const titleElement = document.querySelector('.js-filter-title');
  if (currentFilter === 'all') {
    titleElement.textContent = '📋 All Tasks';
  } else if (currentFilter === 'completed') {
    titleElement.textContent = '✅ Completed Tasks';
  } else if (currentFilter === 'pending') {
    titleElement.textContent = '🕒 Pending Tasks';
  }
}

function saveAndRender() {
  localStorage.setItem('todolist', JSON.stringify(todolist));
  renderToDoList();
}
