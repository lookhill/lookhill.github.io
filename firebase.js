var signInButton = $('#sign-in-button');
var signOutButton = $('#sign-out-button');
var splashPage = $('#page-splash');
var splashPageLogged = $('#page-splash-logged');

var currentUID;

var currentdate = new Date();
var rnd = Math.random() * 10000000;
var inverterDataArray = [];


/**
 * Triggers every time there is a change in the Firebase auth state (i.e. user signed-in or user signed out).
 */
function onAuthStateChanged(user) {
  // We ignore token refresh events.
  if (user && currentUID === user.uid) {
    return;
  }

  if (user) {
    console.log('Loggato');
    currentUID = user.uid;
    splashPage.hide();
    splashPageLogged.show();
    
    getData();

  } else {
    // Set currentUID to null.
    currentUID = null;
    // Display the splash page where you can sign-in.
    splashPage.show();
    splashPageLogged.hide();
    
    console.log('NON loggato');
  }

}

/**
 * Saves a new post to the Firebase DB.
 */
function writeNewSample(inverterDataArray) {
   var updates = {};
   
   for (let x = 0; x < inverterDataArray.length; x++) {
    var o = inverterDataArray[x];
    var newSampleKey = firebase.database().ref().child('inverterSamples').push().key;
  
    updates['/inverterSamples/' + o.sn + '/' + newSampleKey] = o.currentData;
   
   }

   console.log(updates);
   return firebase.database().ref().update(updates);
}



function getData(){

  var url = 'iframe.html?rnd=' + rnd + '&&addr='
  var url1 = url + '192.168.1.208';
  var url2 = url + '192.168.1.209';

  $('#remotejs1')[0].src = url1;
  $('#remotejs2')[0].src = url2;

  console.log(url1);
  console.log(url2);

  setInterval(function(){
      window.location.reload();
  },(60000 * 5));
  
}

//Richiamata dagli iFrame
function parseData(myDeviceArray){
  if(myDeviceArray.length == 0){
      console.warn("Dati non disponibile, salto il campionamento")
      return
  }
  var myData = myDeviceArray[0].split(',');

  var inserterSN = myData[0];
  var currentPower = myData[5]*1; //W
  var yeldToday = myData[6]*1/100; //kWh
  var totalYeld = myData[7]*1/10; //kWh

  var currentData = {
      date:currentdate,
      currentPower:currentPower,
      yeldToday:yeldToday,
      totalYeld:totalYeld
  }

  inverterDataArray.push({sn:inserterSN,currentData:currentData});

  if(inverterDataArray.length == $('iframe').length){
      console.log('All data Loaded:');
      console.log(inverterDataArray);

      //writeNewSample(inserterSN, currentData)
      writeNewSample(inverterDataArray)

  }

}

// Bindings on load.
window.addEventListener('load', function() {
    // Bind Sign in button.
    signInButton.on('click', function() {
      var usrName = $('#usrname').val();
      var usrPassword = $('#usrpassword').val();
      firebase.auth().signInWithEmailAndPassword(usrName, usrPassword)
      .then((user) => {
        console.log('SignedIn!')
        // Signed in 
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
      });
    });
  
    // Bind Sign out button.
    signOutButton.on('click', function() {
      firebase.auth().signOut();
    });

    // Listen for auth state changes
    firebase.auth().onAuthStateChanged(onAuthStateChanged);

}, false);


