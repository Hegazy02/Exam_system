function isValidUserName(userName) {
  const userNameRegex = /^[a-zA-Z0-9]+$/;
  return userNameRegex.test(userName);
}

function isValidPassword(password) {
  const passwordRegex = /^[a-zA-Z0-9]{8,}$/;
  return passwordRegex.test(password);
}

function doPasswordsMatch(password, confirmPassword) {
  return password === confirmPassword;
}

function createUser(userName, password, users, errorMessage) {
  const user = { userName, password };
  if (isUserExists(userName, users, errorMessage)) {
    return false;
  }
  users.push(user);
  saveToLocalStorage("users", users);
  return true;
}
function isUserExists(userName, users, errorMessage) {
  if (users.some((user) => user.userName === userName)) {
    displayElement(errorMessage, "User name already exists.");
    return true;
  }
  hideElement(errorMessage);
  return false;
}

function displayElement(element, text) {
  element.textContent = text;
  element.style.display = "block";
}
function hideElement(element) {
  element.style.display = "none";
}

function displayError(element, message, input) {
  element.textContent = message;
  input.classList.add("error-border");
}

function clearError(element) {
  element.textContent = "";
}

function validate(isValidInput, input, element, errorMessage) {
  let isValid = true;
  if (!isValidInput) {
    displayError(element, errorMessage, input);
    isValid = false;
  } else {
    input.classList.remove("error-border");
    clearError(element);
  }
  return isValid;
}
function validateSignUpInputs(
  userNameInput,
  passwordInput,
  confirmPasswordInput,
  errors
) {
  let isValid = true;

  if (
    !validate(
      isValidUserName(userNameInput.value),
      userNameInput,
      errors.userName,
      "Invalid username. Only letters and numbers allowed."
    )
  ) {
    isValid = false;
  }
  if (
    !validate(
      isValidPassword(passwordInput.value),
      passwordInput,
      errors.password,
      "Password must be at least 8 characters long."
    )
  ) {
    isValid = false;
  }
  if (
    !validate(
      doPasswordsMatch(passwordInput.value, confirmPasswordInput.value),
      confirmPasswordInput,
      errors.confirmPassword,
      "Password must be at least 8 characters long."
    )
  ) {
    isValid = false;
  }

  return isValid;
}

function signUpPage() {
  const signUpBtn = document.getElementById("signUp-btn");
  const userNameInput = document.getElementById("userName");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const errorMessage = document.getElementById("error-message");
  const successMessage = document.getElementById("success-message");

  const errors = {
    userName: document.getElementById("userName-error"),
    password: document.getElementById("password-error"),
    confirmPassword: document.getElementById("confirm-password-error"),
  };
  userNameInput.addEventListener("input", () => {
    validate(
      isValidUserName(userNameInput.value),
      userNameInput,
      errors.userName,
      "Invalid username. Only letters and numbers allowed."
    );
  });

  passwordInput.addEventListener("input", () => {
    validate(
      isValidPassword(passwordInput.value),
      passwordInput,
      errors.password,
      "Password must be at least 8 characters long."
    );
  });

  confirmPasswordInput.addEventListener("input", () => {
    validate(
      doPasswordsMatch(passwordInput.value, confirmPasswordInput.value),
      confirmPasswordInput,
      errors.confirmPassword,
      "Password does not match."
    );
  });
  signUpBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const isFormValid = validateSignUpInputs(
      userNameInput,
      passwordInput,
      confirmPasswordInput,
      errors
    );

    if (!isFormValid) return;
    const users = getFromLocalStorage("users");
    console.log(users);
    const isUserCreated = createUser(
      userNameInput.value,
      passwordInput.value,
      users,
      errorMessage,
      successMessage
    );

    if (!isUserCreated) return;
    displayElement(successMessage, "User registered successfully.");

    setTimeout(() => {
      window.location.href = "../html/login.html";
    }, 1000);
  });
}
const secretKey = "my-secret-key";

function encryptData(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
}

function decryptData(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData);
}

function saveToLocalStorage(key, data) {
  const encryptedData = encryptData(data);
  localStorage.setItem(key, encryptedData);
}

function getFromLocalStorage(key) {
  const encryptedData = localStorage.getItem(key);
  if (!encryptedData) return [];
  return decryptData(encryptedData);
}

signUpPage();
