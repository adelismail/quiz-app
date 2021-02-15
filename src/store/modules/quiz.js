import axios from 'axios'
const state = {
    quizs: [],
    questions: [],
    answers: [],
    quizId: null,
};

const actions = {
    async fetchQuizs({commit}) {
        const response = await axios.get('https://printful.com/test-quiz.php?action=quizzes');
        commit('setQuiz', response.data)
    },
    async getQuestions({commit}, quizId) {
        state.quizId = quizId;
        const response = await axios.get(`https://printful.com/test-quiz.php?action=questions&quizId=${quizId}`);
        commit('setQuestions', response.data);
        return response.data
    },
    async getAnswers({commit}, questionId) {
        let quizId = state.quizId;
        const response = await axios.get(`https://printful.com/test-quiz.php?action=answers&quizId=${quizId}&questionId=${questionId}`);
        response.data.forEach(item => {
            item.checked = false
        })
        commit('setAnswers', response.data)
        // return response.data
      
    },
    async quizResult({commit}, data) {
        const response = await axios.get(`https://printful.com/test-quiz.php?action=submit&quizId=${data.quizId}&answers[]=${data.userAnswers}`)
        return response.data
    }
}

const mutations = {
    setQuiz: (state, quizs) => state.quizs = quizs,
    setQuestions: (state, questions) => state.questions = questions,
    setAnswers: (state, answers) => state.answers = answers
}

const getters = {
    allQuizs: state => state.quizs,
    selectedQuestions: state => state.questions,
    answers: state => state.answers
}

export default {
    state,
    getters,
    actions,
    mutations
}