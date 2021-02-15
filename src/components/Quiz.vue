<template>
    <div class="d-flex flex-column align-items-center justify-content-center">
        <!-- welcome page -->
        <transition name="fade">
            <div class="section welcome shadow-sm" v-show="welcomeSection">
                <h4 class="text-right mb-4 text-success">Techincal Test</h4>
                <form action="" @submit.prevent="handleSubmit">
                    <!-- User name -->
                    <div class="mb-3">
                        <input type="text" 
                        class="form-control" 
                        placeholder="Enter your name"
                        :class="{'is-invalid': userValidate && userName == ''}" 
                        v-model="userName"
                        id="username" aria-describedby="userValidation">
                        <div id="userValidation" class="invalid-feedback">
                            Please provide a username.
                        </div>
                    </div>
                    <!-- Quizs -->
                    <div class="mb-3">
                        <select class="custom-select" 
                            :class="{'is-invalid': quizValidate && quizId == null}"
                            @change="getQuizId($event)"
                            aria-describedby="quizValidation" required>
                            <option selected disabled >Choose test...</option>
                            <option v-for="quiz in allQuizs" :key="quiz.id" :value="quiz.id">{{ quiz.title }}</option>
                        </select>
                        <div id="quizValidation" class="invalid-feedback">
                            Please select test.
                        </div>
                    </div>
                    <!-- Button -->
                    <div class="mb-3">
                        <button class="btn btn-success w-100">Start</button>
                    </div>
                </form>
            </div>
        </transition>
        <!-- questions page -->
        <transition name="fade">
            <div class="questions section" v-show="questionSection">
                <div v-for="question in selectedQuestions.slice(a, b)" :key="question.id" :data-id="question.id">
                    <h5 class="text-right mb-4">Question <span class="text-success">{{ b }}</span> of {{ selectedQuestions.length }}</h5>
                    <p class="question-text" v-if="true ? questionId = question.id:''">{{ question.title }}</p>
                </div>
                <div class="answers">
                    <div class="row mt-4">
                        <div class="col-md-6" v-for="answer in answers" :key="answer.key">
                            <p class="text-answer" :class="{'checked': answer.checked}" @click="checkAnswer(answer)" :data-answerId="answer.id">{{ answer.title }}</p>
                        </div>
                    </div>
                </div>
                <div class="control text-center">
                    <button class="btn btn-success w-50" @click="next">Next</button>
                </div>
            </div>
        </transition>
        <!-- questions result page -->
        <transition name="fade">
            <div class="result section" v-show="resultSection">
                <h4 class="my-4">Thank you <span class="text-success">{{userName}}</span></h4>
                <p>You responded correctly to <span class="text-success">{{ correct }}</span> out of <span class="text-success">{{ total }}</span> questions </p>
            </div>
        </transition>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  data() {
    return {
      userName: '',
      userValidate: false,
      quizValidate: false,

      quizId: null,
      questionId: null,

      a: 0,
      b: 1,

      welcomeSection: true,
      questionSection: false,
      resultSection: false,

      userAnswers: [],
      correct: null,
      total: null,
    }
  },
  computed: {
    ...mapGetters(['allQuizs', 'selectedQuestions', 'answers']), 
  },
  methods: {
    ...mapActions(['fetchQuizs', 'getQuestions', 'getAnswers', 'quizResult']),
    getQuizId(e) {
      this.quizId = parseInt(e.target.value);
    },
    handleSubmit() {
      this.userName === '' ? this.userValidate = true : this.userValidate = false;
      this.quizId === null ? this.quizValidate = true : this.quizValidate = false
      if(this.quizId === null || this.userName === '') {
        return;
      }
      this.getQuestions(this.quizId).then(() => this.getAnswers(this.questionId))
      this.welcomeSection = false
      this.questionSection = true
    },
    next(e) {
       if (this.b == this.selectedQuestions.length) {
            this.resultSection = true;
            this.questionSection = false;
            this.quizResult({
                quizId: this.quizId,
                userAnswers: this.userAnswers
            }).then((response) => {
                this.correct = response.correct;
                this.total = response.total
            })
        }
        this.a++;
        this.b++
        let questionId = e.target.parentElement.previousElementSibling.previousElementSibling.dataset.id;
        this.questionId = questionId
        this.getAnswers(this.questionId)
    },
    checkAnswer(answer) {
        this.userAnswers.push(answer.id)
        return answer.checked = !answer.checked
    },
  },
  created() {
    this.fetchQuizs()
  }
}
</script>
<style lang="scss">
#app {
    height: 100vh;
    background: #00800080;
    padding-top: 50px;
}
.invalid-feedback,
option,
button {
    font-weight: 500 !important;
}
button:focus,
input:focus,
select:focus {
    outline: none;
    box-shadow: none !important;
}
.section {
    width: 40%;
    background: #fafafa;
    padding: 20px;
    border-radius: 5px;
    position: relative;
}
.questions {
    width: 50%;
    min-height: 250px;
    position: absolute;
    top: 50px;
    transition-delay: 1s;
    .question-text {
        font-size: 14px;
        font-weight:500;
    }
    .answers {
        min-height: 165px;
        .text-answer {
            text-align: center;
            border: 1px solid green;
            border-radius: 5px;
            font-weight: 500;
            font-size: 13px;
            padding: 15px;
            cursor: pointer;
            &.checked {
                background-color: rgba(40, 167, 69, .2)
            }
        }
    }
}
.result {
    width: 50%;
    min-height: 210px;
    text-align: center;
    transition-delay: 1s;
    p {
        font-weight: 500;
    }
}
.fade-enter-active, 
.fade-leave-active {
    transition: opacity .5s;
}
.fade-enter, 
.fade-leave-to {
    opacity: 0;
}
@media (max-width: 768px) {
    .welcome,
    .questions,
    .result {
        width: 90% !important
    }
}
</style>