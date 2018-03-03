window.addEventListener('load', initialize);

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
  requestSessions();
}

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId());
  showMain();
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
    showLogin();
  });
}

async function requestSessions() {
  const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  const fetchOptions = {
    method: 'GET',
    headers: {'Authorization': 'Bearer ' + token}
  };

  const response = await fetch('/data/sessions', fetchOptions);
  if (!response.ok) {
    console.log(response.status);
    return;
  }

  const data = await response.json();
  const sessionsTemplateEl = document.getElementById('session-display');
  if (data.length == 0) {
    sessionsTemplateEl.innerHTML='You have no sessions today';
    return;
  }
  data.forEach((session) => {
    const seasionCardTemplateEl = document.getElementById('session-card').content.cloneNode(true);
    seasionCardTemplateEl.querySelector('.title').textContent = session.sessionName || 'No Name';
    sessionsTemplateEl.appendChild(seasionCardTemplateEl);
  });
}
