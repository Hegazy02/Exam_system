let loginPage = document.createElement("div");
loginPage.classList.add("login-page");

let userName = document.createElement("input");
userName.className = "userName";
userName.type = "text";
userName.placeholder = "Username";

let password = document.createElement("input");
password.className = "password";
password.type = "password";
password.placeholder = "Password";

let passError = document.createElement("span");
passError.className = "passError";

let loginButton = document.createElement("button");
loginButton.className = "login-button";
loginButton.textContent = "Login";

let errorMsg = document.createElement("span");
errorMsg.className = "errorMsg";

loginPage.appendChild(userName);
loginPage.appendChild(password);
loginPage.appendChild(loginButton);
loginPage.appendChild(errorMsg);
loginPage.appendChild(passError);
document.body.appendChild(loginPage);

loginButton.addEventListener("click", checkLogin);

function checkLogin() {
    passError.textContent = "";
    errorMsg.textContent = "";
    let ennteredUsername = userName.value;
    let enteredPassword = password.value;

    if (passValidation()) {
        let userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
            if (ennteredUsername === userData.userName && enteredPassword === userData.password) {
                loginPage.remove();
            } else {
                errorMsg.textContent = "Username or password is not correct!";
            }
        } else {
            errorMsg.textContent = "Username is not found!";
        }
    }
}
function passValidation() {
    if (password.value.length < 3) {
        passError.textContent = "Password must be more than 3 letters!"
        return false;
    }
    return true;
}



