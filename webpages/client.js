window.addEventListener('load', initialize);

// Global varibles
let pageDisplacer = 0;
let pageType = 'day';
let todaysDate = new Date();
const day = 60 * 60 * 24 * 1000;
let newDate = new Date(todaysDate.getTime() + day * pageDisplacer);
let currentView = 'session';

//Intially load the page with the login page
function initialize() {
  showLogin();
}

//Show login and change to main after login
function showLogin() {
  const loginPage = document.getElementById("login-page").content.cloneNode(true);
  document.getElementById('contentHolder').innerHTML='';
  document.getElementById('contentHolder').appendChild(loginPage);
}

//Show main page and get all the session on thew day
function showMain() {
  const mainPageDay = document.getElementById("day-view-page").content.cloneNode(true);
  document.getElementById('contentHolder').innerHTML='';
  document.getElementById('contentHolder').appendChild(mainPageDay);

  document.getElementById('day-button').addEventListener('click', viewInDays);
  document.getElementById('week-button').addEventListener('click', viewInWeeks);
  document.getElementById('month-button').addEventListener('click', viewInMonths);

  showSessionView();
}

//Shows the session template
function showSessionView() {
  currentView = 'session';
  const sessionsViewed = document.getElementById("defulat-view").content.cloneNode(true);
  document.getElementById('sub-content-holder').innerHTML='';
  document.getElementById('sub-content-holder').appendChild(sessionsViewed);
  document.getElementById('previous-button').addEventListener('click', showPreviousSessions);
  document.getElementById('next-button').addEventListener('click', showNextSessions);
  document.getElementById('addNewSession').addEventListener('click', addNewSession);
  requestSessions(pageDisplacer, pageType);
}

//Functions for adding sessions

function addNewSession() {
  currentView = 'add';
  const addingSession = document.getElementById("add-session").content.cloneNode(true);
  document.getElementById('sub-content-holder').innerHTML='';
  document.getElementById('sub-content-holder').appendChild(addingSession);
  document.getElementById('backToSessions-button').addEventListener('click', showSessionView);
  document.getElementById('submit-button').addEventListener('click', submitASession);
}


async function submitASession() {
  const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  const fetchOptions = {
    method: 'POST',
    headers: {'Authorization': 'Bearer ' + token}
  };

  const titleEl = document.getElementById('title-input');
  const dateEl = document.getElementById('date-input');
  const timeEl = document.getElementById('time-input');
  const descEl = document.getElementById('description-input');
  const sessionRadioEl = document.getElementById('session-input');
  const deadlineRadioEl = document.getElementById('deadline-input');
  const errorAppender = document.getElementById('error-appender');

  if (!titleEl.checkValidity() ||
      !dateEl.checkValidity() ||
      !timeEl.checkValidity() ||
      !descEl.checkValidity() ||
      !sessionRadioEl.checkValidity()) {
    document.getElementById('error-appender').innerHTML='ERROR';
    return;
  }

  document.getElementById('error-appender').innerHTML='';

  let url = '/data/sessions';

  url += '?title=' + encodeURIComponent(titleEl.value);
  url += '&date=' + encodeURIComponent(dateEl.value);
  url += '&time=' + encodeURIComponent(timeEl.value);
  url += '&desc=' + encodeURIComponent(descEl.value);
  if (sessionRadioEl.value == 'session') {
    url += '&type=' + encodeURIComponent(sessionRadioEl.value);
  } else {
    url += '&type=' + encodeURIComponent(deadlineRadioEl.value);
  }

  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    console.log(response.status);
    return;
  }

  showSessionView();
}

//When sgined in on google load the main view and authenticate
function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  pageDisplacer = 0;
  pageType = 'day';
  checkServer();
  showMain();
}

async function checkServer() {
  const id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;

  const fetchOptions = {
    credentials: 'same-origin',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + id_token },
  };
  const response = await fetch('/api/hello', fetchOptions);
  if (!response.ok) {
    // if theres an error
    return;
  }
}

//Wehn signed out go to login page
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    showLogin();
  });
}

//Functions for next and previous arrows
function getDaysInMonth() {
  year = newDate.getFullYear();
  month = newDate.getMonth();
  return new Date(year, month, 0).getDate();
}

async function showPreviousSessions() {
  if (pageType == 'day') {
    pageDisplacer -= 1;
  } else if (pageType == 'week') {
    pageDisplacer -= 7;
  } else if (pageType == 'month') {
    pageDisplacer -= getDaysInMonth();
  }
  requestSessions(pageDisplacer, pageType);
}

async function showNextSessions() {
  if (pageType == 'day') {
    pageDisplacer += 1;
  } else if (pageType == 'week') {
    pageDisplacer += 7;
  } else if (pageType == 'month') {
    pageDisplacer += getDaysInMonth();
  }
  requestSessions(pageDisplacer, pageType);
}

/*Functions for changeing the view type from day week and month and
check if the session template needs to be reloaded*/
function detectReload() {
  if (currentView == 'session') {
    requestSessions(pageDisplacer, pageType);
  } else {
    showSessionView();
  }
}

function viewInDays() {
  pageType = 'day';
  detectReload();
}

function viewInWeeks() {
  pageType = 'week';
  detectReload();
}

function viewInMonths() {
  pageType = 'month';
  detectReload();
}

//Add all the sessions to the page
async function requestSessions(pageDisplacer, pageType) {
  const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  const fetchOptions = {
    method: 'GET',
    headers: {'Authorization': 'Bearer ' + token}
  };

  let url = '/data/sessions';
  url += '?page=' + pageDisplacer;
  url += '&type=' + pageType;

  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    console.log(response.status);
    return;
  }

  const data = await response.json();
  const sessionsTemplateEl = document.getElementById('session-helper');
  const dateForSessionsEl = document.getElementById('session-dates');

  newDate = new Date(todaysDate.getTime() + day * pageDisplacer);
  const formattedDate = newDate.toISOString().substring(0, 10);

  if (pageType == 'day') {
    dateForSessionsEl.textContent='Sessions for ' + formattedDate;
  } else if (pageType == 'week') {
    let now = newDate? new Date(newDate) : new Date();
    now.setHours(0,0,0,0);

    let monday = new Date(now);
    monday.setDate(monday.getDate() - monday.getDay() + 1);
    formattedMinDate = monday.toISOString().substring(0, 10);

    let sunday = new Date(now);
    sunday.setDate(sunday.getDate() - sunday.getDay() + 7);
    formattedMaxDate = sunday.toISOString().substring(0, 10);
    dateForSessionsEl.textContent='Sessions between ' + formattedMinDate + ' and ' + formattedMaxDate;
  } else if (pageType == 'month') {
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    dateForSessionsEl.textContent='All Sessions for ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear();
  }
  sessionsTemplateEl.innerHTML='';

  if (data.length == 0) {
    sessionsTemplateEl.innerHTML='<h3>You have no sessions</h3>';
    return;
  }

  data.forEach((session) => {
    const seasionCardTemplateEl = document.getElementById('session-card').content.cloneNode(true);
    seasionCardTemplateEl.querySelector('.title').textContent = session.sessionName || 'No Name';
    seasionCardTemplateEl.querySelector('.date').textContent = 'Date: ' + session.sessionDate.substring(0, 10) || 'No Date';
    seasionCardTemplateEl.querySelector('.time').textContent = 'Time: ' + session.sessionTime.substring(0, 5) || 'No Time';
    if (session.typeOfSession == 'deadline') {
      seasionCardTemplateEl.querySelector('.session').style = "background-color: red;"
    }
    sessionsTemplateEl.appendChild(seasionCardTemplateEl);
  });
}
