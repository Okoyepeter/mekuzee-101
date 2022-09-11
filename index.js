
const welcomeScreen = document.querySelector('.welcome')
const quiz = document.querySelector('#quiz')
const nameInput = document.querySelector('#username-input')
const startBtn = document.querySelector('#start-btn')
const questionCount = document.querySelector('#question-count')
const question = document.querySelector('#question')
const options = document.querySelector('#options')
const prevBtn = document.querySelector('#prev')
const nextBtn = document.querySelector('#next')
const submitBtn = document.querySelector('#submit')
const resultScreen = document.querySelector('#results-screen')
const greetingH1 = document.querySelector('#greetings')
const score = document.querySelector('#score')
const retryBtn = document.querySelector('#results-screen button')

let questions = []
let currentQuestion = 0

const url = location.origin + '/index.json'

fetch(url)
.then(response => response.json())
.then(data => {
    questions = data.questions
})

let username = ''
startBtn.disabled = true

nameInput.oninput = (evt) => {
    username = evt.target.value
    startBtn.disabled = (username.length >= 2) ? false : true
}

startBtn.onclick = (evt) => {
    welcomeScreen.style.display = 'none'
    quiz.style.display = 'flex'
    renderQuestion()
}

prevBtn.onclick = (evt) => {
    currentQuestion--

    if (currentQuestion < 0) {
        currentQuestion = 0
    }

    renderQuestion()
}

nextBtn.onclick = (evt) => {
    if (!('chosenIndex' in questions[currentQuestion])) return

    currentQuestion++
    
    if (currentQuestion === questions.length) {
        currentQuestion = questions.length - 1
    }

    renderQuestion()
}

submitBtn.onclick = (evt) => {
    let totalScore = 0
    questions.forEach(question => {
        if (question.chosenIndex === question.correctIndex) {
            totalScore++
        }
    })

    let greetingMsg = ''
    if (totalScore < 5) {
        greetingMsg += username
    } else if (totalScore >= 5 && totalScore <= 7) {
        greetingMsg = `Good Job, ${username}!`
    } else {
        greetingMsg = `Excellent Job, ${username}!`
    }

    greetingH1.innerText = greetingMsg
    score.innerText = `${totalScore}/${questions.length}`
    quiz.style.display = 'none'
    resultScreen.style.display = 'flex'
}

retryBtn.onclick = (evt) => {
    currentQuestion = 0
    renderQuestion()
    quiz.style.display = 'flex'
    resultScreen.style.display = 'none'
    questions.forEach(question => {
        delete question.chosenIndex
    })
    document.querySelectorAll('.option')
    .forEach(option => option.classList.remove('selected'))
}

function renderQuestion () {
    questionCount.innerText = `Question ${currentQuestion + 1}/${questions.length}`
    question.innerText = questions[currentQuestion]?.question
    options.innerHTML = ''

    if (currentQuestion === questions.length - 1) {
        submitBtn.style.display = 'inline-block'
        nextBtn.style.display = 'none'
    } else {
        submitBtn.style.display = 'none'
        nextBtn.style.display = 'inline-block'
    }

    questions[currentQuestion]?.answers.forEach((option, index) => {
        const li = document.createElement('li')
        li.classList.add('option')
        li.classList.add(
            index === questions[currentQuestion].chosenIndex ? 'selected' : 'not-selected'
        )
        const span = document.createElement('span')
        span.innerText = index + 1
        li.append(span)
        li.append(option)
        options.append(li)
        li.onclick = (evt) => {
            document.querySelectorAll('.option')
            .forEach(opt => opt.classList.remove('selected'))
            li.classList.add('selected')
            questions[currentQuestion].chosenIndex = index
        }
    })
}