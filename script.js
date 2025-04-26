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
  
  function saveUser(userName, password) {
    const user = { userName, password };
    localStorage.setItem("user", JSON.stringify(user));
  }
  
  function displayError(element, message) {
    element.textContent = message;
  }
  
  function clearError(element) {
    element.textContent = "";
  }
  
  function validateSignUpInputs(userNameInput, passwordInput, confirmPasswordInput, errors) {
    let isValid = true;
  
    if (!isValidUserName(userNameInput.value)) {
      displayError(errors.userName, "Invalid username. Only letters and numbers allowed.");
      isValid = false;
    } else {
      clearError(errors.userName);
    }
  
    if (!isValidPassword(passwordInput.value)) {
      displayError(errors.password, "Password must be at least 8 characters long.");
      isValid = false;
    } else {
      clearError(errors.password);
    }
  
    if (!doPasswordsMatch(passwordInput.value, confirmPasswordInput.value)) {
      displayError(errors.confirmPassword, "Passwords do not match.");
      isValid = false;
    } else {
      clearError(errors.confirmPassword);
    }
  
    return isValid;
  }
  
  function signUpPage() {
    const signUpBtn = document.getElementById("signUp-btn");
    const userNameInput = document.getElementById("userName");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
  
    const errors = {
      userName: document.getElementById("userName-error"),
      password: document.getElementById("password-error"),
      confirmPassword: document.getElementById("confirm-password-error"),
    };
  
    signUpBtn.addEventListener("click", (e) => {
      e.preventDefault();
  
      const isFormValid = validateSignUpInputs(userNameInput, passwordInput, confirmPasswordInput, errors);
      if (!isFormValid) return;
  
      saveUser(userNameInput.value, passwordInput.value);
    });
  }
  
  signUpPage();
  