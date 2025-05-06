document.addEventListener("DOMContentLoaded", () => {
  const resultData = JSON.parse(localStorage.getItem("examResult"));

  let username = "Guest";

  const storedUsername = localStorage.getItem("currentUserName");
  if (storedUsername) {
    username = storedUsername;
  } else {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser.userName) {
      username = currentUser.userName;
    }
  }

  document.getElementById("username-display").textContent = username;

  if (resultData) {
    document.getElementById("total-score").textContent = `${Math.round(
      resultData.score
    )}%`;
    document.getElementById("correct-count").textContent = resultData.correct;
    document.getElementById("incorrect-count").textContent =
      resultData.incorrect;
    document.getElementById("time-taken").textContent = resultData.time;
    document.querySelector(".summary-item:nth-child(3) h3").textContent =
      "Time Spent";
    document.getElementById("time-taken").textContent = resultData.time;
  } else {
    console.error("No result data found in localStorage");
    document.getElementById("total-score").textContent = "N/A";
  }

  document.getElementById("retake-exam-btn").addEventListener("click", () => {
    window.location.href = "../html/questions.html";
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    window.location.replace("../html/login.html");
  });
});
