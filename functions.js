function click(elementID, fn) {
  var element = document.getElementById(elementID);
  if(element){
    element.addEventListener("click",fn);
  }
}

function redirect(path) {
  window.location = path;
  return false;
}


function logInGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
    // The signed-in user info.
    var user = result.user;
    console.log(user);
    console.log(user.uid);
    console.log(user.displayName);
    console.log(user.email);
    // Creates a new user, or just redirects to chat.html
    createUser(user.uid,user.displayName,user.email);
  }).catch(function(error) {
    console.log(error.message);
  });
}

function logInFacebook() {
  //login with facebook using firebase
  redirect("chat.html");
}

function logInTwitter() {
  //login with twitter using firebase
  redirect("chat.html");
}

function logInPotter() {
  //login with pottermore using firebase
  redirect("chat.html");
}

function createUser(uid,uname,uemail) {
  var database = firebase.database();
  var usersRef = database.ref("users");

  var user = {
    id: uid,
    name: uname,
    email: uemail
  };

  usersRef.child(uid).set(user).then(function () {
    redirect("chat.html");
  });
}

function ifUserIsLoggedIn(fn) {
    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      window.currentUser = {
        id: user.uid,
        name: user.displayName,
        email: user.email
      };
      fn();
    } else {
      // No user is signed in.
    }
  });
}

function getElement(id) {
  return document.getElementById(id);
}

function updateUserData() {
  var usernameElement = getElement("username");
  usernameElement.textContent = window.currentUser.name;
}

function loadUser(fn) {
  var database = firebase.database();
  var usersRef = database.ref("users");

  usersRef.on('value',function (snapshot) {
    var users = snapshot.val();
    fn(users);
  });
}

function renderUser(user) {
  var uid = user.id;
  var chat_id = getChatID(window.currentUser.id,uid);
  var name = user.name;
  var html = '<div id="' + chat_id + '" class="member">' + name + '</div>';

  return html;
}

function getChatID(ID1,ID2) {
  if(ID1 > ID2)
    return ID1 + "" + ID2;
  else {
    return ID2 + "" + ID1;
  }
}

function onClickMultiple(className, func) {
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains(className)) {
            func(event.target);
        }
    });
}

function loadMessages(chat_id,fn) {
  var database = firebase.database();
  var chatsRef = database.ref("chats");

  chatsRef.child(chat_id).on('value',function (snapshot) {
    var messages = snapshot.val();

    fn(messages);
  })
}

function renderMessage(message) {
  var text = message.text;
  var msgClass ="message";
  if(message.sender_id == window.currentUser.id){
    msgClass = "message-user";
  }
  var html = '<div class="' + msgClass + '">' + text + '</div>';
  return html;
}

function sendMessage(chat_id,mtext) {
  var message = {
    text: mtext,
    sender_id: window.currentUser.id
  };

  var database = firebase.database();
  var chatsRef = database.ref("chats");
  var chat = chatsRef.child(chat_id);
  var newMessageID = chatsRef.push().key;

  chat.child(newMessageID).set(message);
}
