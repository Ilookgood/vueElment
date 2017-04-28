import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        user_name: '',
        user_id:'',
    },
    mutations: {
        getName(state,name){
            state.user_name = name;
        },
        hosp(state,id){
            state.user_id = id;
        }
    },
    getters: {
        user_name(state){
            return state.user_name;
        },
        user_id(state){
            return state.user_id;
        }
    },
    actions: {
        getName({commit},name){
            commit('getName',name)
        },
        hosp({commit},id){
            commit('hosp',id)
        }
    }
})
export default store