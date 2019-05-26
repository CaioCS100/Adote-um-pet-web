$(function() {
    
    $('#signUp').click( function (event) {
        event.preventDefault();
        firebase.auth().createUserWithEmailAndPassword($('#email').val(), $('#password').val()).then(function(user) {
            firebase.auth().currentUser.updateProfile({
                displayName: $('#nick').val()
              }).then(function (e){
                window.localStorage.setItem('nome', firebase.auth().currentUser.displayName);
                window.localStorage.setItem('usuario', firebase.auth().currentUser);
                window.location.href = '../index.html';
              });
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
          });
    });
});