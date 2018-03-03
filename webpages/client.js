window.addEventListener('load', initialize);
let pageDisplacer = 0;
let pageType = 'day';

function initialize() {
  showLogin();
}

function showLogin() {
  const loginPage = document.getElementById("login-page").content.cloneNode(true);
  document.getElementById('contentHolder').innerHTML='';
  document.getElementById('contentHolder').appendChild(loginPage);
}

function showMain() {
  const mainPageDay = document.getElementById("day-view-page").content.cloneNode(true);
  document.getElementById('contentHolder').innerHTML='';
  document.getElementById('contentHolder').appendChild(mainPageDay);

  document.getElementById('previous-button').addEventListener('click', showPreviousSessions);
  document.getElementById('next-button').addEventListener('click', showNextSessions);
  document.getElementById('day-button').addEventListener('click', viewInDays);
  document.getElementById('week-button').addEventListener('click', viewInWeeks);
  document.getElementById('month-button').addEventListener('click', viewInMonths);

  requestSessions(pageDisplacer, pageType);
}

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  pageDisplacer = 0;
  pageType = 'day';
  showMain();
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    showLogin();
  });
}

async function showPreviousSessions() {
  if (pageType == 'day') {
    pageDisplacer -= 1;
  } else if (pageType == 'week') {
    pageDisplacer -= 7;
  }
  requestSessions(pageDisplacer, pageType);
}

async function showNextSessions() {
  if (pageType == 'day') {
    pageDisplacer += 1;
  } else if (pageType == 'week') {
    pageDisplacer += 7;
  }
  requestSessions(pageDisplacer, pageType);
}

function viewInDays() {
  pageType = 'day';
  requestSessions(pageDisplacer, pageType);
}

function viewInWeeks() {
  console.log('something was supposed to happen');
  pageType = 'week';
  requestSessions(pageDisplacer, pageType);
}

function viewInMonths() {
  pageType = 'month';
  requestSessions(pageDisplacer, pageType);
}

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

  let todaysDate = new Date();
  let day = 60 * 60 * 24 * 1000;
  let newDate = new Date(todaysDate.getTime() + day * pageDisplacer);
  const formattedDate = newDate.toISOString().substring(0, 10);

  let now = newDate? new Date(newDate) : new Date();
  now.setHours(0,0,0,0);

  let monday = new Date(now);
  monday.setDate(monday.getDate() - monday.getDay() + 1);
  formattedMinDate = monday.toISOString().substring(0, 10);

  let sunday = new Date(now);
  sunday.setDate(sunday.getDate() - sunday.getDay() + 7);
  formattedMaxDate = sunday.toISOString().substring(0, 10);

  if (pageType == 'day') {
    dateForSessionsEl.textContent='Sessions for ' + formattedDate;
  } else if (pageType == 'week') {
    dateForSessionsEl.textContent='Sessions between ' + formattedMinDate + ' and ' + formattedMaxDate;
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
    if (session.typeof == 'deadline') {
      seasionCardTemplateEl.querySelector('.session').style = "background-color: red;"
    }
    sessionsTemplateEl.appendChild(seasionCardTemplateEl);
  });
}
