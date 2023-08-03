import inquirer from "inquirer";
import axios from "axios";
import chalk from "chalk";
const url = "https://johnmeade-webdev.github.io/chingu_quiz_api/trial.json";
const tobeAskedQuestions = [];
inquirer
  .prompt([
    {
      name: "number",
      message: chalk.green(
        "How many questions would you like to be asked? (1-35)"
      ),
      type: "input",
    },
  ])
  .then(function (answer) {
    if (answer.number > 35 || answer.number <= 0) {
      console.log(chalk.red("I can accept only from 1 to 35"));
      return;
    }
    axios
      .get(url)
      .then((response) => {
        const list = shuffle(response.data).slice(0, answer.number);
        list.forEach((element) => {
          tobeAskedQuestions.push({
            type: "list",
            choices: Object.values(element.choices),
            name: element.id,
            message: chalk.yellow(element.question),
            answer: element.choices[element.answer],
          });
        });
        askQuestions(tobeAskedQuestions);
      })
      .catch((error) => {
        console.log(error);
      });
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });

function askQuestions(questions) {
  let score = 0;
  let correctAnswers = [];
  inquirer
    .prompt(questions)
    .then((answers) => {
      questions.forEach((question) => {
        let isCorrect = false;
        if (question.answer == answers[question.name]) {
          score++;
          isCorrect = true;
        }
        correctAnswers.push({
          question: question.message,
          theAnswer: question.answer,
          yourAnswer: answers[question.name],
          isCorrect: isCorrect,
        });
      });
      
      displayResults(correctAnswers);
      console.log(
        `${chalk.bgBlue("You scored")} ${chalk.red(score)} from ${chalk.green(
          questions.length
        )}`
      );
    })
    .catch((error) => {
      console.error("Error asking questions:", error);
    });
}

const shuffle = (question) => {
  for (let i = question.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [question[i], question[j]] = [question[j], question[i]];
  }
  return question;
};

function displayResults(answers) {
  console.log("Quiz Summary:");
  answers.forEach((answer, index) => {
    console.log(`Question ${index + 1}: ${answer.question}`);
    console.log(`${chalk.bgBlue("The Answer")}: ${answer.theAnswer}`);
    console.log(`${chalk.bgGreen("You Answer")}: ${answer.yourAnswer}`);
    console.log(
      `${chalk.bgYellow("Is Correct?")}: ${answer.isCorrect ? "Yes" : "No"}`
    );
    console.log();
  });
}
