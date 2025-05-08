function createElement(tag, classNames = [], innerHTML = "") {
  const element = document.createElement(tag);
  classNames.forEach((className) => element.classList.add(className));
  element.innerHTML = innerHTML;
  return element;
}
const categoryButtons = document.querySelectorAll(".category-btn");

categoryButtons.forEach((btn) => {
  btn.addEventListener("click", async () => handleCategoryClick(btn));
});

async function handleCategoryClick(button) {
  const categoriesLayout = document.getElementById("categories-layout");
  const loadingScreen = createLoadingScreen();
  categoriesLayout.remove();
  document.body.appendChild(loadingScreen);

  try {
    const questions = await fetchQuestions(button.id);
    const shuffledQuestions = shuffle(questions);
    setTimeout(() => {
      loadingScreen.remove();
      const layout = createQuestionsLayout();
      startExam(shuffledQuestions, layout);
    }, 1000);
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

async function fetchQuestions(id) {
  const response = await fetch(`../assets/questions/${id}.json`);
  return response.json();
}
function shuffle(array) {
  const tempArray = [...array];
  for (let i = tempArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
  }
  return tempArray;
}
function createLoadingScreen() {
  return createElement("div", ["loading-screen"], '<div class="loader"></div>');
}

function createQuestionsLayout() {
  const layout = createElement(
    "div",
    ["questions-layout"],
    `
    <div id="loading-nav"></div> 
    <aside id="sidebar"></aside>
    <section class="question-section">
      <div id="header">
        <div class="timer"></div>
        <div id="flag"></div>
      </div>
      <div class="btns">
        <button class="submit-btn" disabled>Submit</button>
        <div>
          <button class="previous-btn" disabled>Previous</button>
          <button class="next-btn">Next</button>
        </div>
      </div>
    </section>`
  );
  document.body.appendChild(layout);
  return layout;
}

function createQuestionLayout() {
  const div = createElement(
    "div",
    ["question"],
    '<h3 class="title"></h3><ul></ul>'
  );
  return div;
}

function startExam(questions, layout) {
  const userAnswers = {};
  let currentQuestionIndex = 0;
  const timer = 180;
  const startTime = new Date();

  const questionDiv = createQuestionLayout();
  layout.querySelector("#header").after(questionDiv);
  const timerData = { timer, layout, startTime, questions, userAnswers };
  startTimer(timerData);
  displayQuestion(questionDiv, questions, currentQuestionIndex, userAnswers);

  const submitBtn = layout.querySelector(".submit-btn");
  const nextBtn = layout.querySelector(".next-btn");
  const previousBtn = layout.querySelector(".previous-btn");

  const examData = {
    questions,
    currentQuestionIndex,
    questionDiv,
    userAnswers,
    submitBtn,
    nextBtn,
    previousBtn,
  };

  setupAnswerHandler(questionDiv, examData);

  setupNavigation(examData);
  setupSubmitHandler(examData, startTime);
  setupFlagHandler(examData);
  setupSidebarClickHandler(examData);
}

function displayQuestion(container, questions, currentQuestionIndex, answers) {
  renderSidebar(questions, currentQuestionIndex, answers);

  const current = questions[currentQuestionIndex];
  container.setAttribute("index", currentQuestionIndex);
  container.querySelector(".title").textContent = current.question;

  const optionsList = container.querySelector("ul");
  optionsList.innerHTML = "";
  current.options.forEach((option, i) => {
    const isSelected = answers[currentQuestionIndex]?.selectedAnswer === i;
    const checked = isSelected ? "checked" : "";
    const sanitized = option.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    optionsList.innerHTML += `
      <li class="option">
        <label for="${i}">
          <input type="radio" name="option" value="${option}" id="${i}" ${checked}/>
          ${sanitized}
        </label>
      </li>`;
  });
}

function setupAnswerHandler(container, data) {
  container.addEventListener("click", (e) => {
    if (!e.target.closest(".option")) return;
    const input = e.target.querySelector("input") || e.target;
    input.checked = true;

    const index = parseInt(container.getAttribute("index"));
    const question = data.questions[index];

    data.userAnswers[index] = {
      answer: input.value,
      selectedAnswer: parseInt(input.id),
      isRightAnswer: input.value === question.answer,
    };
    localStorage.setItem("userAnswers", JSON.stringify(data.userAnswers));

    enableSubmitIfAllQuestionsAnswered(
      data.userAnswers,
      data.submitBtn,
      data.questions
    );
    renderSidebar(data.questions, index, data.userAnswers);
  });
}

function setupNavigation(data) {
  data.nextBtn.addEventListener("click", () => {
    if (data.currentQuestionIndex < data.questions.length - 1) {
      data.currentQuestionIndex++;
      displayQuestion(
        data.questionDiv,
        data.questions,
        data.currentQuestionIndex,
        data.userAnswers
      );
      data.previousBtn.disabled = false;
      disableNextBtnIfLastQuestion(data);
      enableSubmitBtnIfLastQuestion(data);
    }
  });

  data.previousBtn.addEventListener("click", () => {
    if (data.currentQuestionIndex > 0) {
      data.currentQuestionIndex--;
      displayQuestion(
        data.questionDiv,
        data.questions,
        data.currentQuestionIndex,
        data.userAnswers
      );
      data.nextBtn.disabled = false;
      enablePreviousBtnIfFirstQuestion({
        previousBtn: data.previousBtn,
        currentQuestionIndex: data.currentQuestionIndex,
      });
      enableSubmitIfAllQuestionsAnswered(
        data.userAnswers,
        data.submitBtn,
        data.questions
      );
    }
  });
}
function disableNextBtnIfLastQuestion(data) {
  data.nextBtn.disabled =
    data.currentQuestionIndex === data.questions.length - 1;
}
function enableSubmitBtnIfLastQuestion(data) {
  if (data.currentQuestionIndex === data.questions.length - 1) {
    data.submitBtn.disabled = false;
  }
}
function enablePreviousBtnIfFirstQuestion(data) {
  data.previousBtn.disabled = data.currentQuestionIndex === 0;
}

function setupSubmitHandler(data, startTime) {
  data.submitBtn.addEventListener("click", () => {
    if (Object.keys(data.userAnswers).length !== data.questions.length) {
      handleAllQuestionsNotAnswered();
      return;
    }
    handleAllQuestionsAnswered(data, startTime);
  });
}
function handleAllQuestionsAnswered(data, startTime) {
  const timeSpent = getTimeSpent(startTime);
  const result = getResult(data.userAnswers, data.questions);
  setResult(timeSpent, result);
  window.location.replace("../html/results.html");
}
function handleAllQuestionsNotAnswered() {
  const message = document.querySelector(".message");
  message.classList.remove("hidden");
  setTimeout(() => {
    message.classList.add("hidden");
  }, 2000);
}
function getTimeSpent(startTime) {
  const endTime = new Date();
  const elapsedSeconds = Math.floor((endTime - startTime) / 1000);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeSpent = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
  return timeSpent;
}
function setupFlagHandler(data) {
  const flagBtn = document.querySelector("#flag");
  const sidebar = document.querySelector("#sidebar");

  flagBtn.addEventListener("click", () => {
    const item = sidebar.children[data.currentQuestionIndex];
    const classes = item.classList;

    if (classes.contains("answered-question")) {
      classes.replace("answered-question", "flagged-and-answered-question");
    } else if (classes.contains("flagged-and-active-question")) {
      classes.remove("flagged-and-active-question");
    } else if (classes.contains("flagged-and-answered-question")) {
      classes.replace("flagged-and-answered-question", "answered-question");
    } else {
      classes.toggle("flagged-question");
    }
  });
}

function startTimer({ timer, layout, startTime, questions, userAnswers }) {
  const originalTimer = timer;
  const display = layout.querySelector(".timer");
  const loadingNav = layout.querySelector("#loading-nav");
  updateTimer();
  const interval = setInterval(() => {
    updateTimer();
    if (--timer < 0) {
      clearInterval(interval);
      const timeSpent = getTimeSpent(startTime);
      const result = getResult(userAnswers, questions);
      setResult(timeSpent, result);
      window.location.replace("../html/results.html");
    }
  }, 1000);

  increaseLoadingNav(loadingNav, timer);

  function updateTimer() {
    const min = String(Math.floor(timer / 60)).padStart(2, "0");
    const sec = String(timer % 60).padStart(2, "0");
    display.textContent = `${min}:${sec}`;
    if (timer / originalTimer <= 0.25) {
      display.classList.add("warning");
    }
  }
}
function setResult(timeSpent, result) {
  localStorage.setItem(
    "examResult",
    JSON.stringify({
      score: result.totalScore,
      correct: result.answers.correct,
      incorrect: result.answers.incorrect,
      time: timeSpent,
    })
  );
}

function increaseLoadingNav(nav, duration) {
  const step = 100 / duration;
  let width = 0;
  let secondsPassed = 0;

  const interval = setInterval(() => {
    if (width >= 100) return clearInterval(interval);

    width += step;
    secondsPassed++;

    if (secondsPassed / duration >= 0.75) {
      nav.style.backgroundColor = "#FF0000";
    } else {
      nav.style.backgroundColor = "#007BFF";
    }

    nav.style.width = `${width}%`;
  }, 1000);
}

function renderSidebar(questions, current, answers) {
  const sidebar = document.querySelector("#sidebar");
  const flagged = new Set();
  const keys = Object.keys(answers);

  for (let i = 0; i < sidebar.children.length; i++) {
    const item = sidebar.children[i];
    if ([...item.classList].some((cls) => cls.includes("flagged"))) {
      flagged.add(i);
    }
  }

  sidebar.innerHTML = "";

  questions.forEach((_, i) => {
    let className = "";
    const isFlagged = flagged.has(i);
    const isAnswered = keys.includes(i.toString());
    const isCurrent = i === current;

    if (isFlagged && isAnswered) className = "flagged-and-answered-question";
    else if (isFlagged && isCurrent) className = "flagged-and-active-question";
    else if (isFlagged) className = "flagged-question";
    else if (isAnswered) className = "answered-question";
    else if (isCurrent) className = "active-question";

    sidebar.innerHTML += `
      <div class="question-icon ${className}"><p>${i + 1}</p></div>`;
  });
}

function setupSidebarClickHandler(data) {
  const sidebar = document.querySelector("#sidebar");
  sidebar.addEventListener("click", (e) => {
    const target = e.target.closest(".question-icon");
    if (!target) return;
    const index = parseInt(target.textContent) - 1;
    data.currentQuestionIndex = index;
    displayQuestion(
      data.questionDiv,
      data.questions,
      data.currentQuestionIndex,
      data.userAnswers
    );
    disableNextBtnIfLastQuestion({
      nextBtn: document.querySelector(".next-btn"),
      ...data,
    });
    enablePreviousBtnIfFirstQuestion({
      previousBtn: document.querySelector(".previous-btn"),
      ...data,
    });
  });
}

function enableSubmitIfAllQuestionsAnswered(answers, button, questions) {
  if (Object.keys(answers).length === questions.length) {
    button.disabled = false;
  }
}

function getResult(answers, questions) {
  let correctAnswersNumber = 0;
  for (let i = 0; i < questions.length; i++) {
    if (answers[i]?.isRightAnswer) {
      correctAnswersNumber++;
    }
  }
  const totalScore = (correctAnswersNumber / questions.length) * 100;
  const time = document.querySelector(".timer").textContent;
  return {
    totalScore,
    time,
    answers: {
      correct: correctAnswersNumber,
      incorrect: questions.length - correctAnswersNumber,
    },
  };
}
