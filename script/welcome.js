document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("currentUserName") || "Guest";
    document.getElementById("welcome-message").textContent = `Welcome, ${username}!`;

    document.getElementById("start-btn").addEventListener("click", () => {
        window.location.replace("../html/questions.html");
    });
});

