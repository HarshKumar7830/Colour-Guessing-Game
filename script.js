let timer = document.getElementsByClassName("timer")[0];
let quizContainer = document.getElementById("container");
let nextButton = document.getElementById("next-button");
let numOfQuestions = document.getElementsByClassName("number-of-questions")[0];
let displayContainer = document.getElementById("display-container");
let scoreContainer = document.querySelector(".score-container");
let restart = document.getElementById("restart");
let userScore = document.getElementById("user-score");
let startScreen = document.querySelector(".start-screen");
let startButton = document.getElementById("start-button");

let questionCount;
let scoreCount = 0;
let count = 10;
let countdown;

// Hex letters array
let letters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
let quizArray = [];

// Generate random value
const generateRandomValue = (array) => array[Math.floor(Math.random() * array.length)];

// Generate random hex color
const colorGenerator = () => {
  let newColor = "#";
  for (let i = 0; i < 6; i++) {
    newColor += generateRandomValue(letters);
  }
  return newColor;
};

// Populate quiz with random questions
function populateQuiz() {
  quizArray = [];
  for (let i = 0; i < 5; i++) {
    let correctColor = colorGenerator();
    let optionsArray = [correctColor];
    while (optionsArray.length < 4) {
      let color = colorGenerator();
      if (!optionsArray.includes(color)) {
        optionsArray.push(color);
      }
    }
    quizArray.push({
      correct: correctColor,
      options: optionsArray,
    });
  }
}

// Timer display
const timerDisplay = () => {
  countdown = setInterval(() => {
    timer.innerHTML = `<span>Time Left:</span> ${count}s`;
    count--;
    if (count === 0) {
      clearInterval(countdown);
      displayNext();
    }
  }, 1000);
};

// Display quiz card
const quizDisplay = (questionCount) => {
  let quizCards = document.querySelectorAll(".container-mid");
  quizCards.forEach((card) => card.classList.add("hide"));
  quizCards[questionCount].classList.remove("hide");
};

// Create quiz cards
function quizCreator() {
  quizArray.sort(() => Math.random() - 0.5);
  for (let i of quizArray) {
    i.options.sort(() => Math.random() - 0.5);

    let div = document.createElement("div");
    div.classList.add("container-mid", "hide");

    numOfQuestions.innerHTML = `1 of ${quizArray.length} Questions`;

    let questionDiv = document.createElement("div");
    questionDiv.classList.add("question-color");
    questionDiv.innerText = i.correct;
    questionDiv.style.backgroundColor = i.correct;
    div.appendChild(questionDiv);

    let optionsHTML = `<div class="button-container">`;
    for (let option of i.options) {
      optionsHTML += `<button class="option-div" data-option="${option}" style="background-color:${option}"></button>`;
    }
    optionsHTML += `</div>`;

    div.innerHTML += optionsHTML;
    quizContainer.appendChild(div);
  }

  let optionButtons = document.querySelectorAll(".option-div");
  optionButtons.forEach((button) => {
    button.addEventListener("click", function () {
      checker(this);
    });
  });
}

// Check user answer
function checker(userOption) {
  let userSolution = userOption.getAttribute("data-option");
  let question = document.getElementsByClassName("container-mid")[questionCount];
  let options = question.querySelectorAll(".option-div");

  if (userSolution === quizArray[questionCount].correct) {
    userOption.classList.add("correct");
    scoreCount++;
  } else {
    userOption.classList.add("incorrect");
    options.forEach((element) => {
      if (element.getAttribute("data-option") === quizArray[questionCount].correct) {
        element.classList.add("correct");
      }
    });
  }

  clearInterval(countdown);
  options.forEach((element) => (element.disabled = true));
  nextButton.classList.remove("hide");
}

// Display next question
function displayNext() {
  questionCount++;
  if (questionCount === quizArray.length) {
    displayContainer.classList.add("hide");
    scoreContainer.classList.remove("hide");
    userScore.innerHTML = `Your score is ${scoreCount} out of ${quizArray.length}`;
  } else {
    numOfQuestions.innerHTML = `${questionCount + 1} of ${quizArray.length} Questions`;
    quizDisplay(questionCount);
    count = 10;
    clearInterval(countdown);
    timerDisplay();
  }
  nextButton.classList.add("hide");
}

nextButton.addEventListener("click", displayNext);

// Initialize quiz
function initial() {
  nextButton.classList.add("hide");
  quizContainer.innerHTML = "";
  questionCount = 0;
  scoreCount = 0;
  clearInterval(countdown);
  count = 10;
  timerDisplay();
  quizCreator();
  quizDisplay(questionCount);
}

// Restart quiz
restart.addEventListener("click", () => {
  populateQuiz();
  initial();
  displayContainer.classList.remove("hide");
  scoreContainer.classList.add("hide");
});

// Start quiz
startButton.addEventListener("click", () => {
  startScreen.classList.add("hide");
  displayContainer.classList.remove("hide");
  populateQuiz();
  initial();
});
