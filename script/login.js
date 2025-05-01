const loginButton = document.getElementById("login-btn");
const userNameErrorMessage = document.getElementById("userName-error");
const passwordErrorMessage = document.getElementById("password-error");
const errorMsg = document.getElementById("error-message");
const userName = document.getElementById("userName");
const password = document.getElementById("password");
const signUpLink = document.getElementById("signup-link");

loginButton.addEventListener("click", checkLogin);
password.addEventListener("input", passValidation);
userName.addEventListener("input", userNameValidation);

if (signUpLink) {
    signUpLink.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "signUp.html";
    });
}

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
    const isUserNameValid = userNameValidation();

    hideElement(errorMsg);
    let enteredUsername = userName.value;
    let enteredPassword = password.value;

    if (isPasswordValid && isUserNameValid) {
        let users = JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(user => user.userName === enteredUsername);

        if (user) {
            if (user.password === enteredPassword) {

                localStorage.setItem("currentUser", JSON.stringify(user));

                setTimeout(() => {
                    window.location.href = "signUp.html";
                }, 1000);
            } else {
                displayElement(errorMsg, "Username or password is not correct!");
            }
        } else {
            displayElement(errorMsg, "Username is not found!");
        }
    }
}

function passValidation() {
    if (password.value.length < 8) {
        passwordErrorMessage.textContent = "Password must be more than 8 letters!";
        password.classList.add("error-border");
        return false;
    } else {
        passwordErrorMessage.textContent = "";
        password.classList.remove("error-border");
        return true;
    }
}

function userNameValidation() {
    if (userName.value.length < 1) {
        userNameErrorMessage.textContent = "Username shouldn't be empty!";
        userName.classList.add("error-border");
        return false;
    } else {
        userNameErrorMessage.textContent = "";
        userName.classList.remove("error-border");
        return true;
    }
}