var password = document.getElementById("password")
  , confirm_password = document.getElementById("confirm-password");

function validatePassword(){
  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    confirm_password.setCustomValidity('');
  }
}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;

$.ajax({
url: 'https://explorersmap.herokuapp.com/',
type: 'POST',
headers: {'Accept': 'application/json;'},
data: {
"subject": "subject",
"message": "some body text"
},
}).done(function (res) {
  console.log(res); // it shows your email sent message.
});