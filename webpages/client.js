window.addEventListener('load', initialize);

// Global varibles
let pageDisplacer = 0;
let pageType = 'day';
let todaysDate = new Date();
const day = 60 * 60 * 24 * 1000;
let newDate = new Date(todaysDate.getTime() + day * pageDisplacer);
let currentView = 'session';
let currentID;

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

//When signed in on google, load the main view and authenticate
function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  pageDisplacer = 0;
  pageType = 'day';
  checkServer();
  showMain();
}

//Authentication function
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

//When signed out go to login page
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    showLogin();
  });
}

//Show main page and get all the session on the day and load event listener
function showMain() {
  const mainPageDay = document.getElementById("day-view-page").content.cloneNode(true);
  document.getElementById('contentHolder').innerHTML='';
  document.getElementById('contentHolder').appendChild(mainPageDay);

  document.getElementById('day-button').addEventListener('click', viewInDays);
  document.getElementById('week-button').addEventListener('click', viewInWeeks);
  document.getElementById('month-button').addEventListener('click', viewInMonths);

  showSessionView();
}

//Shows the session template and add al event listener
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

/* ######  Functions for displaying sessions ###### */

//Functions for next and previous arrows
//sub function to calculate how many days there are in a specific month
// @return {int} returns how many days in the week as an int
function getDaysInMonth() {
  year = newDate.getFullYear();
  month = newDate.getMonth();
  return new Date(year, month, 0).getDate();
}

//Loads the session on the previous day/week/month
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

//Loads the sessions on the next day/week/month
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

//Changes the view to day
function viewInDays() {
  pageType = 'day';
  detectReload();
}

//changes the view to week
function viewInWeeks() {
  pageType = 'week';
  detectReload();
}

//changes the view to month
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

  //url to include the view and what day
  let url = '/data/sessions';
  url += '?page=' + pageDisplacer;
  url += '&type=' + pageType;

  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    console.log(response.status);
    return;
  }

  const data = await response.json();
  const sessionsDivEl = document.getElementById('session-helper');
  const dateForSessionsEl = document.getElementById('session-dates');

  newDate = new Date(todaysDate.getTime() + day * pageDisplacer);
  const formattedDate = newDate.toUTCString().substring(0, 16);

  //If the view is in dady then display the day as a header
  //If in week show between the 2 dates
  //if in month show that months name
  if (pageType == 'day') {
    dateForSessionsEl.textContent='Sessions for ' + formattedDate;
  } else if (pageType == 'week') {
    let now = newDate? new Date(newDate) : new Date();
    now.setHours(0,0,0,0);

    let monday = new Date(now);
    monday.setDate(monday.getDate() - monday.getDay() + 1);
    formattedMinDate = monday.toUTCString().substring(5, 16);

    let sunday = new Date(now);
    sunday.setDate(sunday.getDate() - sunday.getDay() + 7);
    formattedMaxDate = sunday.toUTCString().substring(5, 16);
    dateForSessionsEl.textContent='Sessions for ' + formattedMinDate + ' to ' + formattedMaxDate;
  } else {
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    dateForSessionsEl.textContent='All Sessions for ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear();
  }
  //Make the session template blank to stop duplicate sessions from appearing
  sessionsDivEl.innerHTML='';

  if (data.length == 0) {
    if (pageType == 'day') {
      sessionsDivEl.innerHTML='<h2>You have no sessions or deadlines today</h2>';
      return;
    } else if (pageType == 'week') {
      sessionsDivEl.innerHTML='<h2>You have no sessions or deadlines for this week</h2>';
      return;
    } else {
      sessionsDivEl.innerHTML='<h2>You have no sessions or deadlines for this month</h2>';
      return;
    }
  }

  if (pageType == 'week') {
    daysInWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (i = 0; i < 7; i++) {
      const div = document.createElement('div');
      div.id = daysInWeek[i];
      div.className += "weekday";
      div.innerHTML = '<h2>' + daysInWeek[i] +'</h2>'
      sessionsDivEl.appendChild(div);
    }
  }

  //for all the sessions returned add them to the page in a session card template
  data.forEach((session) => {
    const sessionCardTemplateEl = document.getElementById('session-card').content.cloneNode(true);
    sessionCardTemplateEl.querySelector('.title').textContent = session.sessionName || 'No Name';
    let sessionsDate = new Date(session.sessionDate);
    sessionCardTemplateEl.querySelector('.date').textContent = 'Date: ' + sessionsDate.toUTCString().substring(5, 16) || 'No Date';
    sessionCardTemplateEl.querySelector('.time').textContent = 'Time: ' + session.sessionTime.substring(0, 5) || 'No Time';
    if (session.typeOfSession == 'deadline') {
      sessionCardTemplateEl.querySelector('.session').style = "background-color: #fc5d19;";
    }
    //Add the id of the session from the db as an id to the class
    sessionCardTemplateEl.querySelector('.session').id = session.id;
    //add to the page and give it an event listner to be clicked
    if (pageType == 'day') {
      sessionsDivEl.appendChild(sessionCardTemplateEl);
    } else if (pageType == 'week') {
      switch (sessionsDate.getDay()) {
        case 0:
          document.getElementById('Sunday').appendChild(sessionCardTemplateEl);
          break;
        case 1:
          document.getElementById('Monday').appendChild(sessionCardTemplateEl);
          break;
        case 2:
          document.getElementById('Tuesday').appendChild(sessionCardTemplateEl);
          break;
        case 3:
          document.getElementById('Wednesday').appendChild(sessionCardTemplateEl);
          break;
        case 4:
          document.getElementById('Thursday').appendChild(sessionCardTemplateEl);
          break;
        case 5:
          document.getElementById('Friday').appendChild(sessionCardTemplateEl);
          break;
        case 6:
          document.getElementById('Saturday').appendChild(sessionCardTemplateEl);
      }
      //sessionsDivEl.appendChild(sessionCardTemplateEl);
    } else {
      sessionsDivEl.appendChild(sessionCardTemplateEl);
    }
    //sessionsDivEl.appendChild(sessionCardTemplateEl);
    document.getElementById(session.id).addEventListener('click', editSession);
  });
}

/* ###### End of display functions ##### */

/* ###### Functions for adding new sessions ##### */
//addNewSession and submitASession

//shows the template for adding a session and adds venet listener
function addNewSession() {
  currentView = 'add';
  const addingSession = document.getElementById("add-session").content.cloneNode(true);
  document.getElementById('sub-content-holder').innerHTML='';
  document.getElementById('sub-content-holder').appendChild(addingSession);
  document.getElementById('backToSessions-button').addEventListener('click', showSessionView);
  document.getElementById('submit-button').addEventListener('click', submitASession);
}

//calls the server to add a session using the input boxes
async function submitASession() {
  let errors = false;
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

  document.getElementById('error-appender').innerHTML='';
  //check for errors and add in appropriate messages for the errors
  if (!titleEl.checkValidity()) {
    document.getElementById('error-appender').innerHTML+='<p>Invalid title, this field must not be blank.</p>';
    errors = true;
  }
  if (!dateEl.checkValidity()) {
    document.getElementById('error-appender').innerHTML+='<p>Invalid date, this field must not be blank.</p>';
    errors = true;
  }
  if (!timeEl.checkValidity()) {
    document.getElementById('error-appender').innerHTML+='<p>Invalid time, this feild must not be blank.</p>';
    errors = true;
  }
  if (!descEl.checkValidity()) {
    document.getElementById('error-appender').innerHTML+='<p>Invalid description</p>';
    errors = true;
  }
  if (errors) {
    return;
  }

  let url = '/data/sessions';

  url += '?title=' + encodeURIComponent(titleEl.value);
  url += '&date=' + encodeURIComponent(dateEl.value);
  url += '&time=' + encodeURIComponent(timeEl.value);
  url += '&desc=' + encodeURIComponent(descEl.value);
  if (sessionRadioEl.checked) {
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

/* ###### End of functions for adding new sessions ##### */

/* ###### Functions for editing exsisting sessions ##### */
//Add all the data into the edit page when a session is clickd from any display page
async function editSession() {
  currentID = this.id;
  currentView = 'editor';
  const editView = document.getElementById("edit-session").content.cloneNode(true);
  document.getElementById('sub-content-holder').innerHTML='';
  document.getElementById('sub-content-holder').appendChild(editView);
  document.getElementById('backToSessions-button').addEventListener('click', showSessionView);
  document.getElementById('submit-button').addEventListener('click', saveASession);
  document.getElementById('delete-button').addEventListener('click', deleteASession);

  const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;

  const fetchOptions = {
    method: 'GET',
    headers: {'Authorization': 'Bearer ' + token}
  };

  let url = '/data/sessions/single/';
  url += '?sessionid=' + currentID;

  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    console.log(response.status);
    return;
  }

  const data = await response.json();
  data.forEach((session) => {
    const formattedDate = session.sessionDate.substring(0, 10);
    document.getElementById('title-input').value = session.sessionName || '';
    document.getElementById('date-input').value = formattedDate || '';
    document.getElementById('time-input').value = session.sessionTime || '';
    document.getElementById('description-input').textContent = session.description || '';
    if (session.typeOfSession == 'session') {
      document.getElementById('session-input').checked = true;
    } else {
      document.getElementById('deadline-input').checked = true;
    }
  });
}

//Save the values in the edit page back to the database
async function saveASession() {
  let errors = false;
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

  document.getElementById('error-appender').innerHTML='';
  //check fro errors on the page
  if (!titleEl.checkValidity()) {
    document.getElementById('error-appender').innerHTML+='<p>Invalid title, this field must not be blank.</p>';
    errors = true;
  }
  if (!dateEl.checkValidity()) {
    document.getElementById('error-appender').innerHTML+='<p>Invalid dat, this field must not be blank.</p>';
    errors = true;
  }
  if (!timeEl.checkValidity()) {
    document.getElementById('error-appender').innerHTML+='<p>Invalid time, this feild must not be blank.</p>';
    errors = true;
  }
  if (!descEl.checkValidity()) {
    document.getElementById('error-appender').innerHTML+='<p>Invalid description</p>';
    errors = true;
  }
  if (errors) {
    return;
  }

  let url = '/data/sessions/edit/';

  url += '?title=' + encodeURIComponent(titleEl.value);
  url += '&date=' + encodeURIComponent(dateEl.value);
  url += '&time=' + encodeURIComponent(timeEl.value);
  url += '&desc=' + encodeURIComponent(descEl.value);
  if (sessionRadioEl.checked) {
    url += '&type=' + encodeURIComponent(sessionRadioEl.value);
  } else {
    url += '&type=' + encodeURIComponent(deadlineRadioEl.value);
  }
  url += '&sessionid=' + encodeURIComponent(currentID);

  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    console.log(response.status);
    return;
  }

  showSessionView();
}

/* ###### End of functions for editing exsisting sessions ##### */

/* ###### Functions for deleteing ###### */
//Delete the sessions based of the id it has
async function deleteASession() {
  console.log('delete');
  const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  const fetchOptions = {
    method: 'DELETE',
    headers: {'Authorization': 'Bearer ' + token}
  };

  let url = '/data/sessions/delete/';

  url += '?sessionid=' + encodeURIComponent(currentID);

  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    console.log(response.status);
    return;
  }

  showSessionView();
}

/* ###### End of functions for deleteing ###### */
