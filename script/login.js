function isValidPassword(password) {
  const passwordRegex = /^[a-zA-Z0-9]{8,}$/;
  return passwordRegex.test(password);
}
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.com+$/;
  return emailRegex.test(email);
}
const loginButton = document.getElementById("login-btn");
const emailErrorMessage = document.getElementById("email-error");
const passwordErrorMessage = document.getElementById("password-error");
const errorMsg = document.getElementById("error-message");
const email = document.getElementById("email");
const password = document.getElementById("password");
const signUpLink = document.getElementById("signup-link");

password.addEventListener("input", passValidation);
email.addEventListener("input", emailValidation);

loginButton.addEventListener("click", checkLogin);

function displayElement(element, text) {
  element.textContent = text;
  element.style.display = "block";
}

function hideElement(element) {
  element.style.display = "none";
}

function checkLogin(e) {
  e.preventDefault();
  const isPasswordValid = passValidation();
  const isemailValid = emailValidation();

  hideElement(errorMsg);
  let enteredemail = email.value;
  let enteredPassword = password.value;

  if (isPasswordValid && isemailValid) {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find((user) => user.email === enteredemail);

    if (user) {
      if (user.password === enteredPassword) {
        localStorage.setItem("currentUser", JSON.stringify(user));

        setTimeout(() => {
          window.location.replace("../html/questions.html");
        }, 1000);
      } else {
        displayElement(errorMsg, "email or password is not correct!");
      }
    } else {
      displayElement(errorMsg, "email is not found!");
    }
  }
}

function passValidation() {
  if (!isValidPassword(password.value)) {
    passwordErrorMessage.textContent = "Password must be more than 8 letters!";
    password.classList.add("error-border");
    return false;
  } else {
    passwordErrorMessage.textContent = "";
    password.classList.remove("error-border");
    return true;
  }
}

function emailValidation() {
  if (!isValidEmail(email.value)) {
    emailErrorMessage.textContent = "Enter a valid email!";
    email.classList.add("error-border");
    return false;
  } else {
    emailErrorMessage.textContent = "";
    email.classList.remove("error-border");
    return true;
  }
}
