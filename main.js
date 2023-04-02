// Select Element 
let countSpan = document.querySelector(".count span");
let Bullets = document.querySelector(".bullets");
let bulletSpanContainer = document.querySelector(".bullets .spans")
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answer-area");
let submitBotton = document.querySelector(".submit-button");
let resultContainer = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");

// Set Option
let currentIndex = 0;
let rightAnwers = 0;
let countDownInterval;

//   
function getQuestions(){
let myRequest = new XMLHttpRequest();

myRequest.onreadystatechange = function () {
    if(this.readyState === 4 && this.status === 200 ) {
        let questionObject = JSON.parse(this.responseText);
        let questionCount = questionObject.length;

        //  Create Bullets + Sets Count
        createBullet(questionCount);

        // Add Question Data
        addQuestionData(questionObject[currentIndex], questionCount);

        // Count Down Timet On
        countdownTimer(5, questionCount);

        // Click On Submit
        submitBotton.onclick = () => {
            // Get Right Answer
            let theRightAnswer = questionObject[currentIndex].right_answer;

            // Icrease Index
            currentIndex++;

            // Chech The Answer
            checkAnswer(theRightAnswer, questionCount);

            // Remove Previous Question
            quizArea.innerHTML = "";
            answerArea.innerHTML = "";

            // Add Second Quesion Data
            addQuestionData(questionObject[currentIndex], questionCount);

            // Handle Bullets Classes
            handleBullets();

            // Show Results
            showResults(questionCount);

            // Count Down Timer Again
            clearInterval(countDownInterval);
            countdownTimer(5, questionCount);

        };
    }
}

myRequest.open("GET", "html_question.json", true);
myRequest.send();
}
getQuestions();

// 
function createBullet(num) {
    countSpan.innerHTML = num;


    // Create Spans
    for (let i = 0; i < num; i++) {
        // Create Span 
        let theBuller = document.createElement("span");

        // Check If Its First Span
        if(i === 0) {
            theBuller.className = "on";
        }
    

        // Append Buulets To Main Bullet Container
        bulletSpanContainer.appendChild(theBuller);
    }
}

//
//
function addQuestionData(obj, cnt) {

    if(currentIndex < cnt) {
        // Create H2 Question Title
        let questionTitle = document.createElement("h2");

        // Create Question Text
        let questionText = document.createTextNode(obj.title);
        
        // Append Text To H2
        questionTitle.appendChild(questionText);

        // Create Quiz Area
        quizArea.appendChild(questionTitle);
    
        // Create The Answers
        for(let i = 1; i < 5; i++) {
            // Create Main Div
            let mainDiv = document.createElement("div");
            // Add Class
            mainDiv.className = "answer";
            // Create Radio Input
            let radioInput = document.createElement("input");
            // Add Type And Nme And ID .......
            radioInput.name = 'question';
            radioInput.type = 'radio';
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];

            // Make Firs Option Selected
            if(i === 1) {
                radioInput.checked = true;
            }

            // Create Lable
            let theLable = document.createElement("lable");
            theLable.htmlFor = `answer_${i}`;

            // Create Lable Text
            let theLableText = document.createTextNode(obj[`answer_${i}`]);

            // Add Text To Lable
            theLable.appendChild(theLableText);

            // Add Input + Lable To Div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLable);

            // Add radio And Lable To Answer  Area
            answerArea.appendChild(mainDiv);
        }
    }

}
function checkAnswer(rAnswer, qCount) {
    let answers = document.getElementsByName("question");
    let theChosenAnswer ;
    // Loop On Question Answer Checked
    for (let i = 0; i < answers.length; i++) {
        if(answers[i].checked) {
            theChosenAnswer = answers[i].dataset.answer;
        }
    }
    if(rAnswer === theChosenAnswer) {
        rightAnwers++;
    }
}
function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if(currentIndex === index) {
            span.className = "on";
        }
    });
}
function showResults(count) {
    let theResult;
    if(currentIndex === count) {
        quizArea.remove();
        answerArea.remove();
        submitBotton.remove();
        Bullets.remove();

        if(rightAnwers > (count / 2) && rightAnwers < count) {
            theResult = `<span class ="good">Good</span>, ${rightAnwers} From ${count}`;
        }
        else if (rightAnwers === count) {
            theResult = `<span class ="perfect">Perfect</span>, ${rightAnwers} From ${count}`;
        }
        else {
            theResult = `<span class ="bad">Bad </span>, ${rightAnwers} From ${count}`;
        }
        resultContainer.innerHTML = theResult;
        resultContainer.style.padding = '10px';
        resultContainer.style.backgroundColor = 'white';
        resultContainer.style.marginTop = '10px';
        resultContainer.style.textAlign = 'center';
    }
}
function countdownTimer(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countDownInterval = setInterval(function() {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes; 
            seconds = seconds < 10 ? `0${seconds}` : seconds; 

            countDownElement.innerHTML = `${minutes}:${seconds}`;
            if(--duration < 0) {
                clearInterval(countDownInterval);
                submitBotton.click();
            } 
        }, 1000)
    }
}