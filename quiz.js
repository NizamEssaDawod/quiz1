// select Elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContaier = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");




//set options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;


function getQuestions(){
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status ===  200) {
            let questionsobject = JSON.parse(this.responseText);
            let qCount = questionsobject.length;
            
            //create Bullets
            createBullets(qCount);

            //Add Question
            addQuestionData(questionsobject[currentIndex], qCount);
            //Start countdown
            countdown(60,qCount);
            //clic 
            submitButton.onclick = () => {
                // get riht answer
                let theRightAnswer = questionsobject[currentIndex].right_answer;
                //increase index
                currentIndex++;
                //check answer
                checkAnswer(theRightAnswer, qCount);

                //rEmove
                quizArea.innerHTML = "";
                answersArea.innerHTML= "";

                addQuestionData(questionsobject[currentIndex], qCount);

                //handle class
                handleBullets();

                //start count
                clearInterval(countdownInterval);
                countdown(60, qCount);
                //show results
                showResults(qCount);
            };
        }
    };
    myRequest.open("GET","html_questions.json",true);
    myRequest.send();
}
getQuestions();

function createBullets(num){
    countSpan.innerHTML = num;
    //Create spans
    for (let i = 0; i < num; i++) {
        //create Bullet
        let theBullet = document.createElement("span");
        if (i===0){
            theBullet.className = "on";
        }

        //Append Bullets to main
        bulletsSpanContaier.appendChild(theBullet);
    }

}



function addQuestionData(obj,count){
    if (currentIndex < count){
    // create h2
    let questionTitle = document.createElement("h2");
    // create Question text
    let questionText = document.createTextNode(obj['title']);
    //Append
    questionTitle.appendChild(questionText);
    // apeed
    quizArea.appendChild(questionTitle);
    //create Answers
    for(let i = 1; i<= 4; i++){
        let mainDiv = document.createElement("div");
        mainDiv.className = 'answer';
        let radioInput = document.createElement("input");
        radioInput.name = 'question';
        radioInput.type = 'radio';
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer = obj[`answer_${i}`];
        //first answer selected
        if(i === 1){
            radioInput.checked = true;
        }
        let thelabel = document.createElement("label");
        thelabel.htmlFor = `answer_${i}`;
        let thelabelText = document.createTextNode(obj[`answer_${i}`]);
        thelabel.appendChild(thelabelText);
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(thelabel);
        //append all divs
        answersArea.appendChild(mainDiv);

    }
}

}
function checkAnswer(rAnswer, count) {

    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for(let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    console.log(`Right Answer is ${rAnswer}`);
    console.log(`Choosen Answer is ${theChoosenAnswer}`);
    console.log(rightAnswers)
    
    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;

    }
    

}

function handleBullets(){
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on";
        }
    });
}
function showResults(count) {
    let theResults;
    if (currentIndex === count ) {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if (rightAnswers> count / 2 && rightAnswers < count) {
            theResults = `<span class="good">good</span>, ${rightAnswers} From ${count} is good. `;
        }else if (rightAnswers === count){
            theResults = `<span class="perfect">perfect</span>,perfect`;

        } else {
            theResults = `<span class="bad">bad</span>, ${rightAnswers} From ${count} `;

        }
        resultsContainer.innerHTML = theResults;


    }
}
function countdown(duration, count) {
    if (currentIndex < count){
        let minutes, seconds;
        countdownInterval = setInterval(function(){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}`: minutes;
            seconds = seconds < 10 ? `0${seconds}`: seconds;


            countdownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }

        }, 1000);
    }
}

