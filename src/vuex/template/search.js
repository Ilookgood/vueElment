/**
 * Created by Administrator on 2017/4/26 0026.
 */
// 应用初始状态
const state = {
    name: ''
}
// 然后给 actions 注册一个事件处理函数，当这个函数被触发时，将状态提交到 mutaions中处理
const actions = {
    NAME_SY(state, name) {
        store.commit('NAME_SY', name)    // 提交到mutations中处理
    }
}
// 定义所需的 mutations
const mutations = {
    NAME_SY(state, name) {
        state.name = name;
    }
}
// 获取状态信息
const getters = {
    NAME_SY(state) {
        console.log(state.name)
        return state.name
    }
}

// 创建 store 实例
export default{
    actions,
    getters,
    state,
    mutations
}
