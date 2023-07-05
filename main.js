const quizSelector = document.getElementById("quiz-selector");
const quizContainer = document.getElementById("quiz-container");
const questionContainer = document.getElementById("question-container");
const answerButtonsContainer = document.getElementById("answer-buttons-container");
const resultsContainer = document.getElementById("results-container");


class Quiz {
    constructor(questions) {
        this.questions = Quiz.shuffleArray(questions);
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.displayQuestion();
    }

    //Method to display the questions and answers in a quiz. 
    displayQuestion() {
        answerButtonsContainer.innerHTML = "";
        const currentQuestion = this.questions[this.currentQuestionIndex];
        questionContainer.textContent = currentQuestion.question;
        const answers = Quiz.shuffleArray(currentQuestion.answers);
        answers.forEach((answer) => {
          const button = document.createElement("button");
          button.classList = ["answer-button"];
          button.textContent = answer;
          button.addEventListener("click", this.checkAnswer.bind(this));
          answerButtonsContainer.appendChild(button);
        });
    }

    //Method to display next questions and record the no. of correct answers.
    checkAnswer(event) {
        const selectedAnswer = event.target.textContent;
        const currentQuestion = this.questions[this.currentQuestionIndex];
        if(selectedAnswer === currentQuestion.correctAnswer) {
            this.score++;
        }

        this.currentQuestionIndex++;

        if(this.currentQuestionIndex < this.questions.length) {
            this.displayQuestion();
        }
        else {
            this.showResult();
        }
    }

    //Method to show the the specific quiz result.
    showResult() {
        questionContainer.style.display = "none";
        quizContainer.style.display = "none";
        resultsContainer.style.display = "block";
        resultsContainer.innerHTML = `
        <h2>Quiz Result</h2>
        <p>You answsered ${this.score} out of ${this.questions.length} questions</p>
        <button id="reload-quiz">Reload All Quiz</button>`;

        const reloadQuiz = document.getElementById("reload-quiz");
        reloadQuiz.addEventListener("click", () => {
            resultsContainer.style.display = "none";
            quizSelector.style.display = "flex";
            quizContainer.style.display = "none";           
        });
    }

    //Method to shuffle the questions and answers.
    static shuffleArray(arr) {
        return [...arr].sort(() => Math.random() - 0.5);
    }
}

//Function to load a particular quiz.
const loadQuiz = (questions) => {
    const quiz = new Quiz(questions);
    quizContainer.style.display = "block";
    quizSelector.style.display = "none";
    questionContainer.style.display = "block";
}

//Function to display all the available quizes.
const loadAllQuiz = async () => {
    const response = await fetch("./quizes.json");
    const quizes = await response.json();

    quizes.forEach((quiz, index) => {
        const quizCard = document.createElement("div");
        quizCard.classList = ("quiz-card");
        quizCard.innerText = "Quiz " + (index + 1);
        quizCard.addEventListener("click", () => loadQuiz(quiz));
        quizSelector.appendChild(quizCard);
    });
};

loadAllQuiz();