import Vue from 'vue'
import Axios from 'axios'
Vue.prototype.$axios=Axios
const  state={
    tableList:[],
    params:{}
};
const getters={
    getTableList:state=>state.tableList
};
const  actions={
    fetchTableList({commit,state}){
       Vue.$axios.get(baseUrl+'hospitals',state.params)
           .then((res)=>{
              commit('changeTableList',res.body.total)
           },(err)=>{

               }
           )
    }
};
const mutations={
    changeTableList(state,tableList){
        state.tableList=tableList
    }
};
export  default {
    state,
    getters,
    actions,
    mutations
}