function getUsers() {
  return JSON.parse(localStorage.getItem("users")) ?? [];
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.com+$/;
  return emailRegex.test(email);
}

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

function saveUser(userName, email, password, users, errorMessage) {
  const user = { userName, email, password };
  if (isUserExists(userName, users, errorMessage)) {
      return false;
  }
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
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
  emailInput,
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
          isValidEmail(emailInput.value),
          emailInput,
          errors.email,
          "Invalid email format."
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
          "Password does not match"
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
  const emailInput = document.getElementById("email");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const errorMessage = document.getElementById("error-message");
  const successMessage = document.getElementById("success-message");

  const errors = {
      userName: document.getElementById("userName-error"),
      email: document.getElementById("email-error"),
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

  emailInput.addEventListener("input", () => {
      validate(
          isValidEmail(emailInput.value),
          emailInput,
          errors.email,
          "Invalid email format."
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
          emailInput,
          passwordInput,
          confirmPasswordInput,
          errors
      );

      if (!isFormValid) return;

      const users = getUsers();

      const userSaved = saveUser(
          userNameInput.value,
          emailInput.value,
          passwordInput.value,
          users,
          errorMessage
      );

      if (userSaved) {
          displayElement(successMessage, "User registered successfully.");

          setTimeout(() => {
              window.location.href = "loginarchieve.html";
          }, 1000);
      }
  });
}

signUpPage();