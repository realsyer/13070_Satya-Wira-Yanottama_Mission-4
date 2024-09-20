/**
 * DATA STRUCTURE
 * 
 * =============================
 * 
 * Table: User
 * - Name
 * - Occupation
 * - code (combination name+occupation)
 * 
 * 
 * Table: Todo
 * - Title
 * - Description
 * - Due Date
 * - Status (todo/completed)
 * - user_id
 * 
 *  */


const welcomeScreen = document.querySelector('.welcome-screen')
const welcomeContent = document.querySelector('.welcome-content')
const nameInput = document.querySelector('.input-name');
const occupationInput = document.querySelector('.input-occupation');
const loginButton = document.querySelector('.login-button')
const logoutButton = document.querySelector('.logout-button')
const homeContent = document.querySelector('.home-content')

const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
const dataUsers = [];
/**
 * Examplae dataUsers : 
  {
    name: 'John Doe',
    occupation: 'Penulis',
    nameCode: 'john-doe-penulis',
    todos: [
      {
        title: 'Menulis',
        status: 'completed',
        priority: 'high',
        dueDate: new Date()
      },
      {
        title: 'Sketch',
        status: 'todo',
        priority: 'normal',
        dueDate: new Date('2024-09-15')
      }
    ]
  }
 *  */

let selectedUser = null
// let selectedUser = dataUsers[0]

let sampleToDoCard = null;
let sampleCompletedCard = null;

const sendToast = (text) => {
  try {
    // Source: https://github.com/apvarun/toastify-js
    Toastify({
      text: text,
      duration: 3000,
      gravity: "top",
      position: "center",
      className: "text-xs font-bold !p-2 text-white rounded-lg",
      style: {
        background: "#1e1b4b",
      },
    }).showToast();
  } catch (error) {
    alert(text)
  }
}

const avatarUrl = (name) => {
  return `https://ui-avatars.com/api/?background=E0E7FF&color=3730A3&name=${name.split(' ').join('+')}`
}

const formattedDate = (date) => {
  const formattedHour = (date.getHours() > 0 || date.getMinutes() > 0) ? (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() : '';
  const formattedDatetime = days[date.getDay()] + ', ' + date.getDate() + ' ' + months[date.getMonth() - 1] + ' ' + date.getFullYear() + ' ' + formattedHour;

  return formattedDatetime
}

const initScreen = (waitTime = 1000) => {
  if (!welcomeContent) {
    return
  }

  // set Timer 2 second wait before show
  setTimeout(() => {
    welcomeContent.classList.remove('translate-y-[40vh]');
    welcomeContent.classList.remove('opacity-0');
  }, waitTime);

  fetchData()
}

const getNameCode = (name, occupation) => {
  return name.split(' ').join('_').toLowerCase() + '-' + occupation.split(' ').join('_').toLowerCase()
}

const onLoginUser = async () => {
  if (!nameInput || !occupationInput) {
    sendToast('something went wrong')
    return
  }

  const name = nameInput?.value;
  const occupation = occupationInput?.value;

  if (!name) {
    sendToast('Mohon masukkan nama')
    return
  }

  if (!occupation) {
    sendToast('Mohon masukkan pekerjaan')
    return
  }

  const nameCode = getNameCode(name, occupation);

  // GET USER DATA
  if (dataUsers.length === 0) {
    // No Data Exist
    onCreateUser(name, occupation, nameCode);
    return
  }

  getUserData(name, occupation, nameCode)
}

const showHomeContent = () => {
  homeContent?.classList.remove('hidden')
  homeContent?.classList.add('opacity-0')
  setTimeout(() => {
    homeContent?.classList.remove('opacity-0')
  }, 600);
}

const hideHomeContent = () => {
  homeContent?.classList.add('opacity-0')
  homeContent?.classList.add('hidden')
}

const initLoggedUser = () => {
  animateDownLoginCard()
  initUserData()
  fetchData()
  resetLoginForm()
  setTimeout(() => {
    showHomeContent()
  }, 300);
}
const animateDownLoginCard = () => {
  welcomeContent?.classList.add('translate-y-[40vh]')
  welcomeContent?.classList.add('opacity-0')
  setTimeout(() => {
    welcomeScreen?.classList.add('hidden')
  }, 300);
}

const getUserData = (name, occupation, nameCode) => {
  const find = dataUsers.find((item) => item.nameCode == nameCode)

  if (!find) {
    return onCreateUser(name, occupation, nameCode)
  }

  sendToast(`Selamat datang kembali ${name}`)

  selectedUser = find
  initLoggedUser()
  return find
}

const onCreateUser = (name, occupation, nameCode) => {
  const user = dataUsers.push({
    name,
    occupation,
    nameCode,
    todos: []
  })

  if (!welcomeScreen) {
    return
  }

  selectedUser = dataUsers[dataUsers.length - 1]
  initLoggedUser()
  return selectedUser
}

const resetLoginForm = () => {
  nameInput.value = '';
  occupationInput.value = '';
}

const onLogoutUser = () => {
  if (!welcomeContent || !welcomeScreen) {
    return
  }

  hideHomeContent()

  selectedUser = null
  welcomeScreen?.classList.remove('hidden')
  welcomeScreen?.classList.remove('opacity-0')
  welcomeScreen?.classList.remove('translate-[40vh]')

  initScreen(300)
}


const initUserData = () => {
  const nameElements = document.querySelectorAll('.nameValue');
  const occupationElement = document.querySelectorAll('.occupationValue');
  const avatarElements = document.querySelectorAll('.avatar');

  if (!nameElements || nameElements.length === 0 || !selectedUser) {
    return
  }

  nameElements.forEach(nameElem => {
    nameElem.innerText = selectedUser.name;
  });

  if (!occupationElement || occupationElement.length === 0) {
    return
  }

  occupationElement.forEach(occupationElem => {
    occupationElem.innerText = selectedUser.occupation;
  })

  if (!avatarElements || avatarElements.length == 0) {
    return
  }

  avatarElements.forEach(element => {
    element.setAttribute('src', avatarUrl(selectedUser.name))
  });
}

const addBackground = document.querySelector('.add-background');
const addContent = document.querySelector('.add-content');

const noDataSection = document.querySelector('.no-data-section');

// Buttons
const addNewButtons = document.querySelectorAll('.button-add-new');
const cancelAddButton = document.querySelector('.add-cancel-button');
const submitAddButton = document.querySelector('.add-submit-button');
const clearButton = document.querySelector('.clear-button');

//Add Inputs
const titleInput = document.querySelector('.input-add-title')
const priorityInput = document.querySelector('.input-add-priority')
const dueDateInput = document.querySelector('.input-add-duedate')
const dueTimeInput = document.querySelector('.input-add-duetime')

const onWantAddNew = () => {
  if (!addContent) {
    return
  }

  // Show Background
  addBackground?.classList.add('opacity-0');
  addBackground?.classList.remove('hidden')
  setTimeout(() => {
    addBackground?.classList.remove('opacity-0');
  }, 500);

  // Show Content
  addContent?.classList.remove('hidden')
  setTimeout(() => {
    addContent?.classList.remove('translate-y-[360px]')
  }, 300);
}

const resetAddForm = () => {
  titleInput.value = null;
  priorityInput.selectedIndex = 1;
  dueDateInput.value = null;
  dueTimeInput.value = null
}

const onCloseAddNew = () => {
  addContent?.classList.add('translate-y-[360px]')
  setTimeout(() => {
    addContent?.classList.add('hidden')
  }, 400);

  addBackground?.classList.add('opacity-0')
  setTimeout(() => {
    addBackground?.classList.remove('opacity-0');
    addBackground?.classList.add('hidden');
  }, 500);

  resetAddForm()
}
const onCancelAddNew = () => {
  onCloseAddNew();
}

const getSampleToDoCard = () => {
  const sampleTodo = document.querySelector('.todo-card-sample');
  // if first init and sample card not found
  if (!sampleTodo) {
    sendToast('Something went wrong');
    return
  }
  sampleTodo.classList.remove('todo-card-sample');
  sampleToDoCard = sampleTodo.cloneNode(true);
  sampleTodo.remove()
}

const getSampleCompletedCard = () => {
  const sampleCompleted = document.querySelector('.completed-card-sample');
  // if first init and sample card not found
  if (!sampleCompleted) {
    sendToast('Something went wrong');
    return
  }
  sampleCompleted.classList.remove('todo-card-sample');
  sampleCompletedCard = sampleCompleted.cloneNode(true);
  sampleCompleted.remove()
}

const getDataByStatus = (status) => {
  if (!selectedUser) {
    return []
  }
  return selectedUser.todos.filter((item) => item.status === status)
}

const isSameDate = (date1, date2) => {
  if (date1.getDate() !== date2.getDate()) {
    return false
  }

  if (date1.getMonth() !== date2.getMonth()) {
    return false
  }

  if (date1.getFullYear() !== date2.getFullYear()) {
    return false
  }

  return true
}

const getDataByDate = (date, status = '') => {
  if (!selectedUser) {
    return []
  }
  const res = selectedUser.todos.filter((item) => item.dueDate && isSameDate(item.dueDate, date));

  // if status exist then filter the res by its status first, else return res
  return status !== '' ? res.filter((item) => item.status === status) : res
}

const bindTodoCard = (data, index, element, onChecked = null) => {
  if (!element) {
    return element
  }
  const titleElement = element.querySelector('.todo-title');
  titleElement.innerText = data.title

  // If Normal Priority
  if (data.priority === 'normal') {
    const normalPriority = element.querySelector('.todo-normal-priority');
    normalPriority.classList.remove('hidden');
  }
  // If High Priority
  if (data.priority === 'high') {
    const normalPriority = element.querySelector('.todo-high-priority');
    normalPriority.classList.remove('hidden');
  }
  // If Low Priority
  if (data.priority === 'low') {
    const normalPriority = element.querySelector('.todo-low-priority');
    normalPriority.classList.remove('hidden');
  }

  const overdueElement = element.querySelector('.overdue');
  // if Due Date Exist
  if (data.dueDate) {
    const dueDateElemennt = element.querySelector('.todo-due-date');
    if (!dueDateElemennt) {
      return
    }
    const dueDate = new Date(data.dueDate)
    const formattedDatetime = formattedDate(dueDate)

    dueDateElemennt.innerText = formattedDatetime;
    dueDateElemennt.classList.remove('hidden')

    // Overdue Checker
    const nowTime = new Date().getTime();
    const dueTime = dueDate.getTime();
    if (nowTime > dueTime) {
      // if overdue
      overdueElement.classList.remove('hidden')
    }
  } else {
    // else remove the element
    overdueElement.remove()
  }

  //Checkbox
  const checkElement = element.querySelector('.todo-check');
  if (checkElement) {
    checkElement.setAttribute('index', index)

    checkElement.addEventListener('change', async (e) => {
      // Animate it first
      // Swipe left
      element.classList.add('-translate-x-12')
      element.classList.add('opacity-0')

      // set as hidden
      setTimeout(() => {
        element.classList.add('hidden');
        element.classList.remove('-translate-x-12')
        element.classList.remove('opacity-0')

        // then update status
        setTimeout(() => {
          // if checked, then change status to 'completed', else 'todo'
          data.status = e.target.checked ? 'completed' : 'todo'

          if (typeof onChecked === 'function') {
            onChecked()
          }
        }, 300);
      }, 300);
    })
  }

  return element
}

const priorityScaleValue = (text) => {
  if (text.includes('high')) return 5
  if (text.includes('normal')) return 3
  if (text.includes('low')) return 1

  return 0
}

const sortData = (a, b) => {
  if (orderBy === 'date') {
    if (!a.dueDate) return 1
    const date1 = new Date(a.dueDate).getTime()
    const date2 = new Date(b.dueDate).getTime()
    return date1 < date2 ? -1 : 1
  }

  if (orderBy === 'priority') {
    const prioA = priorityScaleValue(a.priority);
    const prioB = priorityScaleValue(a.priority);

    return prioA > prioB ? -1 : 1
  }
  return -1
}

const fetchTodo = () => {
  const todoWrapper = document.querySelector('.todo-wrapper');
  const todoLists = document.querySelector('.todo-list-result');
  const todoCounter = document.querySelector('.todo-counter');

  if (!todoWrapper || !todoLists) {
    return
  }

  const toDoArray = getDataByStatus('todo').sort(sortData);
  if (toDoArray.length <= 0) {
    todoWrapper.classList.add('hidden')
    return
  }

  if (todoCounter) {
    todoCounter.innerText = toDoArray.length
  }

  todoLists.innerHTML = ''

  for (let index = 0; index < toDoArray.length; index++) {
    const element = sampleToDoCard.cloneNode(true);

    if (element) {
      const updatedElem = bindTodoCard(toDoArray[index], index, element, () => refetchData())
      todoLists.append(updatedElem)
    }
  }
  todoWrapper.classList.remove('hidden')
}

const bindCompletedCard = (data, index, element, onChecked = null) => {
  if (!element) {
    return element
  }
  const titleElement = element.querySelector('.completed-title');
  titleElement.innerText = data.title

  // if Due Date Exist
  if (data.dueDate) {
    const dueDateElemennt = element.querySelector('.completed-due-date');
    if (!dueDateElemennt) {
      return
    }
    const date = new Date(data.dueDate)
    const formattedHour = (date.getHours() > 0 || date.getMinutes() > 0) ? (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() : '';
    const formattedDatetime = date.getDate() + ' ' + months[date.getMonth() - 1] + ' ' + date.getFullYear() + ' ' + formattedHour;

    dueDateElemennt.innerText = formattedDatetime;
    dueDateElemennt.classList.remove('hidden')
  }

  //Checkbox
  const checkElement = element.querySelector('.completed-check');
  if (checkElement) {
    checkElement.setAttribute('index', index)

    checkElement.addEventListener('change', (e) => {
      // Animate it first
      // Swipe left
      element.classList.add('-translate-x-12')
      element.classList.add('opacity-0')

      // set as hidden
      setTimeout(() => {
        element.classList.add('hidden');
        element.classList.remove('-translate-x-12')
        element.classList.remove('opacity-0')

        // then update status
        setTimeout(() => {
          // if checked, then change status to 'completed', else 'todo'
          data.status = e.target.checked ? 'completed' : 'todo'
          if (typeof onChecked === 'function') {
            onChecked();
          }
        }, 300);
      }, 300);
    })
  }

  return element
}

const fetchCompleted = () => {
  const completedWrapper = document.querySelector('.completed-wrapper');
  const completedLists = document.querySelector('.completed-list-result');
  const completedCounter = document.querySelector('.completed-counter');

  if (!completedWrapper || !completedLists) {
    return
  }

  const completedArray = getDataByStatus('completed');

  if (completedArray.length <= 0) {
    completedWrapper.classList.add('hidden')
    return
  }

  if (completedCounter) {
    completedCounter.innerText = completedArray.length
  }

  completedLists.innerHTML = ''

  for (let index = 0; index < completedArray.length; index++) {
    const data = completedArray[index];
    const element = sampleCompletedCard.cloneNode(true);
    if (element) {
      const updatedElem = bindCompletedCard(data, index, element, () => refetchData())
      completedLists.append(updatedElem)
    }
  }


  completedWrapper.classList.remove('hidden')
}

const fetchData = async () => {
  if (!sampleToDoCard) {
    getSampleToDoCard()
  }

  if (!sampleCompletedCard) {
    getSampleCompletedCard();
  }

  fetchTodo();
  fetchCompleted();

  if (selectedUser && selectedUser.todos && selectedUser.todos.length > 0) {
    clearButton.classList.remove('hidden');
    noDataSection.classList.add('hidden');
  } else {
    clearButton.classList.add('hidden')
    noDataSection.classList.remove('hidden');
  }
}

const refetchData = () => {
  fetchData()
}

const onSubmitAddNew = () => {
  const title = titleInput?.value;
  const priority = priorityInput.options[priorityInput.selectedIndex]?.value;
  const dueDate = dueDateInput?.value;
  const dueTime = dueTimeInput?.value;

  if (!title) {
    sendToast('Masukkan Judul terlebih dahulu');
    return
  }

  if (dueTime && !dueDate) {
    sendToast('Silahkan pilih tanggal deadline');
    return
  }

  if (!selectedUser) {
    sendToast('something went wrong');
    return
  }

  selectedUser.todos.push({
    title: title,
    priority: priority,
    dueDate: dueDate ? (new Date(dueDate + ' ' + (dueTime ? dueTime : ''))) : null,
    status: 'todo'
  })

  onCloseAddNew();
  fetchData()
}

const clearAll = () => {
  if (!selectedUser) {
    return
  }

  selectedUser.todos = [];
  refetchData();
}

/**
 * ===============================================================
 * SCHEDULE
 */

const backButton = document.querySelector('.calendar-button-back');
const scheduleButton = document.querySelector('.button-schedule');
const scheduleContent = document.querySelector('.calendar-content');

let selectedDate = new Date();

// Calendar Buttons
const twoDateBeforeElement = scheduleContent?.querySelector('.two-date-before');
const oneDateBeforeElement = scheduleContent?.querySelector('.one-date-before');
const currentDateElement = scheduleContent?.querySelector('.current-date');
const oneDateAfterElement = scheduleContent?.querySelector('.one-date-after');
const twoDateAfterElement = scheduleContent?.querySelector('.two-date-after');

const onClickDate = async (element) => {
  const dateAttribute = element.getAttribute('date')
  if (!dateAttribute) {
    return
  }
  const date = new Date(dateAttribute)
  selectedDate = date;

  await refetchDataCalendar()
}

const initDateElem = async (dateElement, date = new Date(), is_current_date = false, is_refetch = true) => {
  if (!dateElement) {
    return
  }
  // Set as Loading state
  dateElement.classList.remove('cursor-pointer')
  dateElement.classList.remove(is_current_date ? 'bg-indigo-500' : 'bg-white')
  dateElement.classList.add('cursor-not-allowed')
  dateElement.classList.add('bg-slate-200')

  const dateElem = dateElement.querySelector('.date');
  if (!dateElem) {
    return
  }
  dateElem.innerText = is_current_date ? `${days[date.getDay()]}, ${date.getDate()}` : date.getDate();

  const subElem = dateElement.querySelector('.subtitle');
  if (!subElem) {
    return
  }
  subElem.innerText = is_current_date ? `${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}` : days[date.getDay()].substring(0, 3)

  // set value in attribute
  const formatDate = date.toISOString();
  await dateElement.setAttribute('date', formatDate)

  // restore UI
  dateElement.classList.remove('hidden')
  dateElement.classList.remove('cursor-not-allowed')
  dateElement.classList.remove('bg-slate-200')
  dateElement.classList.add('cursor-pointer')
  dateElement.classList.add(is_current_date ? 'bg-indigo-500' : 'bg-white')
}

const initCalendarButtons = (is_refetch = false) => {
  // current Date
  initDateElem(currentDateElement, selectedDate, true, is_refetch)

  // Two Days before
  const twoDateBefore = new Date(selectedDate);
  twoDateBefore.setDate(selectedDate.getDate() - 2)
  initDateElem(twoDateBeforeElement, twoDateBefore, false, is_refetch)

  // One Days before
  const oneDateBefore = new Date(selectedDate);
  oneDateBefore.setDate(selectedDate.getDate() - 1)
  initDateElem(oneDateBeforeElement, oneDateBefore, false, is_refetch)

  // One Days after
  const oneDateAfter = new Date(selectedDate);
  oneDateAfter.setDate(selectedDate.getDate() + 1)
  initDateElem(oneDateAfterElement, oneDateAfter, false, is_refetch)

  // Two Days after
  const twoDateAfter = new Date(selectedDate);
  twoDateAfter.setDate(selectedDate.getDate() + 2)
  initDateElem(twoDateAfterElement, twoDateAfter, false, is_refetch)

}

const initCalendarTodos = () => {
  if (!sampleToDoCard) {
    getSampleToDoCard()
  }

  const calendarContentElem = document.querySelector('.calendar-list-content');

  const toDoWrapperElem = calendarContentElem.querySelector('.todo-wrapper');
  const listResultsElem = calendarContentElem.querySelector('.todo-list-result');
  const counterElement = calendarContentElem.querySelector('.todo-counter');


  const dataArray = getDataByDate(selectedDate, 'todo');

  if (dataArray.length === 0) {
    toDoWrapperElem.classList.add('hidden');
    return
  }
  counterElement.innerText = dataArray.length;

  listResultsElem.innerHTML = ''

  for (let index = 0; index < dataArray.length; index++) {
    const element = sampleToDoCard.cloneNode(true);

    if (element) {
      const updatedElem = bindTodoCard(dataArray[index], index, element, () => refetchDataCalendar())
      listResultsElem.append(updatedElem)
    }
  }
  toDoWrapperElem.classList.remove('hidden')
}

const initCalendarCompleteds = () => {
  if (!sampleCompletedCard) {
    getSampleCompletedCard()
  }

  
  const calendarContentElem = document.querySelector('.calendar-list-content');

  const wrapperElem = calendarContentElem.querySelector('.completed-wrapper');
  const listResultsElem = calendarContentElem.querySelector('.completed-list-result');
  const counterElement = calendarContentElem.querySelector('.completed-counter');


  const dataArray = getDataByDate(selectedDate, 'completed');

  if (dataArray.length === 0) {
    wrapperElem.classList.add('hidden');
    return
  }
  counterElement.innerText = dataArray.length;

  listResultsElem.innerHTML = ''

  for (let index = 0; index < dataArray.length; index++) {
    const element = sampleCompletedCard.cloneNode(true);

    if (element) {
      const updatedElem = bindCompletedCard(dataArray[index], index, element, () => refetchDataCalendar())
      listResultsElem.append(updatedElem)
      
    }
  }
  wrapperElem.classList.remove('hidden')
}


const initCalendarContent = () => {
  initCalendarTodos()
  initCalendarCompleteds()

  const calendarContentElem = document.querySelector('.calendar-list-content');
  const emptySection = calendarContentElem.querySelector('.no-data-calendar-section')
  
  const dataArray = getDataByDate(selectedDate);

  if (dataArray.length > 0) {
    emptySection.classList.add('hidden');
  }else{
    emptySection.classList.remove('hidden');
  }
}

const initCalendar = (is_refetch = false) => {
  initCalendarButtons(is_refetch)
  initCalendarContent()
}

const refetchDataCalendar = async () => {
  initCalendar(true)
}

const onBackFromSchedule = () => {
  if (!scheduleContent) {
    return
  }

  refetchData()
  scheduleContent.classList.add('translate-x-[40vw]')
  setTimeout(() => {
    scheduleContent.classList.add('hidden')
    homeContent?.classList.remove('hidden')
  }, 500);
}

const onShowScheduleScreen = () => {
  if (!homeContent || !scheduleContent) {
    return
  }

  initCalendar();
  // Animate Slide Schedule Screen from right
  scheduleContent.classList.remove('hidden')
  scheduleContent.classList.add('translate-x-[40vw]')
  setTimeout(() => {
    homeContent.classList.add('opacity-80')
    scheduleContent.classList.remove('translate-x-[40vw]')

    setTimeout(() => {
      homeContent.classList.remove('opacity-80')
    }, 500);
  }, 200);

}

scheduleButton?.addEventListener('click', onShowScheduleScreen);
backButton?.addEventListener('click', onBackFromSchedule);

// Init Calendar Button Listener
window.addEventListener('DOMContentLoaded', () => {
  twoDateBeforeElement.addEventListener('click', () => onClickDate(twoDateBeforeElement))
  oneDateBeforeElement.addEventListener('click', () => onClickDate(oneDateBeforeElement))
  oneDateAfterElement.addEventListener('click', () => onClickDate(oneDateAfterElement))
  twoDateAfterElement.addEventListener('click', () => onClickDate(twoDateAfterElement))

})

/**
 * End Of SCHEDULE Function
 */

/**
 * Order Button
 * 
 */

const filterButton = document.querySelector('.filter-button');
const filterContent = document.querySelector('.filter-content');
const filterOverlay = document.querySelector('.overlay-background');
let orderBy = 'date'; // date | priority
let addedListener = false

const orderByDateOpt = filterContent.querySelector('.order-by-date');
const orderByPriorityOpt = filterContent.querySelector('.order-by-priority');

const initOrderValue = () => {
  // Clear all Check
  const checkElems = filterContent.querySelectorAll('.check-icon');
  checkElems.forEach(element => {
    element.classList.add('opacity-0')
  });

  if (orderBy === 'date') {
    const checkElem = orderByDateOpt.querySelector('.check-icon');
    checkElem.classList.remove('opacity-0')
    return
  }
  
  if (orderBy === 'priority') {
    const checkElem = orderByPriorityOpt.querySelector('.check-icon');
    checkElem.classList.remove('opacity-0')
    return
  }
}

const onChooseOrder = (value = 'date', onSuccess = null) => {
  orderBy = value;
  onCloseFilter();
  if (typeof onSuccess === 'function') {
    onSuccess()
  }  
}

const initCheckOpts = () => {
  orderByDateOpt.addEventListener('click', () => onChooseOrder('date', () => refetchData()));
  orderByPriorityOpt.addEventListener('click', () => onChooseOrder('priority', () => refetchData()));
}

const onShowFilter = () => {
  if (!filterContent) {
    return
  }

  filterOverlay.classList.add('opacity-0')
  filterOverlay.classList.remove('hidden')
  
  filterContent.classList.add('translate-y-4')
  filterContent.classList.add('opacity-0')
  filterContent.classList.remove('hidden')
  setTimeout(() => {
    filterOverlay.classList.remove('opacity-0')
    setTimeout(() => {
      filterContent.classList.remove('opacity-0')
      filterContent.classList.remove('translate-y-4')
    }, 200);
  }, 300);

  initOrderValue()
  if (!addedListener) {
    initCheckOpts()
    addedListener = true
  }
}

const onCloseFilter = () => {
  filterContent.classList.add('translate-y-4')
  filterContent.classList.add('opacity-0')
  setTimeout(() => {
    filterOverlay.classList.add('opacity-0');
    
    setTimeout(() => {
      filterContent.classList.add('hidden')
      filterContent.classList.remove('opacity-0')
      filterContent.classList.remove('translate-y-4')
      
      filterOverlay.classList.add('hidden');
      filterOverlay.classList.remove('opacity-0');
    }, 300);
  }, 200);
}
filterButton.addEventListener('click', onShowFilter)
filterOverlay.addEventListener('click', onCloseFilter)

/**
 * End of Order Button
 */

addBackground.addEventListener('click', onCancelAddNew);
cancelAddButton.addEventListener('click', onCancelAddNew);
submitAddButton.addEventListener('click', onSubmitAddNew)
clearButton.addEventListener('click', clearAll);

addNewButtons.forEach(addNewButton => {
  addNewButton.addEventListener('click', onWantAddNew);
});

// ================================================================
window.addEventListener('DOMContentLoaded', async () => {
  initScreen()
})

loginButton?.addEventListener('click', onLoginUser)
logoutButton?.addEventListener('click', onLogoutUser)