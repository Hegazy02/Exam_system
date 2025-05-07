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

    const score = resultData.score;

    const message = document.getElementById("result-message");

    if (score >= 60) {
      message.textContent = "🎉 Well done!";
      message.classList.remove("hidden");
      message.classList.add("success");
      document.getElementById("success-screen").classList.remove("hidden");
      document.getElementById("score-success").textContent = Math.round(score);

      setTimeout(() => {
        document.getElementById("success-screen").classList.add("hidden");
      }, 2000);

      const canvas = document.getElementById("fireworksCanvas");
      canvas.classList.remove("hidden");
      const ctx = canvas.getContext("2d");

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const fireworks = [];

      class Firework {
        constructor(x, y) {
          this.x = x;
          this.y = y;
          this.particles = [];

          for (let i = 0; i < 100; i++) {
            this.particles.push(new Particle(x, y));
          }
        }

        update() {
          this.particles.forEach((p) => p.update());
        }

        draw() {
          this.particles.forEach((p) => p.draw());
        }

        isDone() {
          return this.particles.every((p) => p.alpha <= 0);
        }
      }

      class Particle {
        constructor(x, y) {
          this.x = x;
          this.y = y;
          this.radius = 2;
          this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
          this.speed = Math.random() * 5 + 2;
          this.angle = Math.random() * 2 * Math.PI;
          this.alpha = 1;
          this.decay = Math.random() * 0.01 + 0.005;
        }

        update() {
          this.x += Math.cos(this.angle) * this.speed;
          this.y += Math.sin(this.angle) * this.speed;
          this.alpha -= this.decay;
        }

        draw() {
          ctx.save();
          ctx.globalAlpha = this.alpha;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
          ctx.fillStyle = this.color;
          ctx.fill();
          ctx.restore();
        }
      }

      function animate() {
        requestAnimationFrame(animate);
        ctx.fillStyle = "rgba(3, 3, 33, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        fireworks.forEach((fw, index) => {
          fw.update();
          fw.draw();
          if (fw.isDone()) {
            fireworks.splice(index, 1);
          }
        });
      }

      function launchFirework() {
        const x = Math.random() * canvas.width;
        const y = (Math.random() * canvas.height) / 2;
        fireworks.push(new Firework(x, y));
      }

      setInterval(launchFirework, 800);
      animate();
    } else {
      message.textContent = "😞 Try Again";
      message.classList.remove("hidden");
    }
  } else {
    console.error("No result data found in localStorage");
    document.getElementById("total-score").textContent = "N/A";
  }

  document.getElementById("retake-exam-btn").addEventListener("click", () => {
    window.location.replace("../html/questions.html");
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    window.location.replace("../html/login.html");
  });
});
