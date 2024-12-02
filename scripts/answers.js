(function () {
    const Answers = {
        person: null,
        personElement: null,
        answersElement: null,
        userResult: null,
        init() {
            const userResultRaw = sessionStorage.getItem('storedResult');
            if (userResultRaw) {
                this.userResult = JSON.parse(userResultRaw);
            } else {
                location.href = 'index.html';
            }
            const name =this.userResult.name;
            const lastName = this.userResult.lastName;
            const email = this.userResult.email;
            this.personElement = document.getElementById('answers-person');
            this.answersElement = document.getElementById('answers-questions');
            if (name && lastName && email) {
                this.person = `${name} ${lastName}, ${email}`;
                this.personElement.innerHTML = this.person;
            } else {
                location.href = 'index.html';
            }
            if (this.userResult.quiz.questions) {
                this.showAnswers.call(this)
            } else {
                location.href = 'index.html';
            }
            document.getElementById('back').addEventListener('click', (e) => {
                location.href = 'result.html';
            })
        },
        showAnswers () {
            this.answersElement.innerHTML = '';
            this.userResult.quiz.questions.forEach((question) => {
                const answerQuestionElement = document.createElement('div');
                answerQuestionElement.className = 'answer-question';

                const answerQuestionTitleElement = document.createElement('div');
                answerQuestionTitleElement.className = 'answer-question-title medium-title';
                answerQuestionTitleElement.innerHTML = `<span>Вопрос ${question.id}: </span>${question.question}`;


                const answersQuestionUlElement = document.createElement('ul');
                answersQuestionUlElement.className = 'answers-question-options'
                question.answers.forEach((answer) => {
                    const answersQuestionLiElement = document.createElement('li');
                    answersQuestionLiElement.className = 'answers-question-option question-option'
                    // getting attribute 'result' from saved quiz (question -> answer),
                    // there are two options (values): 'success' and 'wrong'
                    // or this attribute is absent
                    // if gotten - adding value ('success' or 'wrong') to class list
                    // such classes are described in styles
                    if (answer.result) {
                        answersQuestionLiElement.classList.add(answer.result);
                    }
                    answersQuestionLiElement.innerText = answer.answer
                    answersQuestionUlElement.appendChild(answersQuestionLiElement);
                })

                answerQuestionElement.appendChild(answerQuestionTitleElement);
                answerQuestionElement.appendChild(answersQuestionUlElement);
                this.answersElement.appendChild(answerQuestionElement);
            })
        },

    }

    Answers.init()
})()
