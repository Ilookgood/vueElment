import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
/*import Main from './views/Main.vue'*/
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import brands from './views/drugs/brands.vue'
import Druglicenselist from './views/HomeAgents/Druglicenselist.vue'
import Deauthorize from './views/HomeAgents/Deauthorize.vue'
import QrCode from './views/HomeAgents/QrCode.vue'
import drugscate from './views/drugs/drugsCate.vue'
import HomeAgentslist from './views/HomeAgents/HomeAgentslist.vue'
import Druglist from './views/drugs/Druglist.vue'
import Thedoctorlist from './views/Thedoctor/Thedoctorlist.vue'
import Patientslist from './views/PatientsControl/Patientslist.vue'
import Prescription from './views/Prescription/Prescriptionlist.vue'
/*import Search from './views/nav1/Search.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'*/

let routes = [
   {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/table',
        component: Home,
        name: '运营管理',
        iconCls: 'el-icon-message',
        children: [
            { path: '/table',component: Table, name: '医院管理' },
            { path: '/form',component: Form, name: '门珍管理' },
            { path: '/user',component: user, name: '患者管理' },
			{ path: '/brands',component: brands, name: '药品品牌' },
			{ path: '/drugscate',component: drugscate, name: '药品类别' },
            { path: '/HomeAgentslist',component: HomeAgentslist, name: '代理列表' },
            { path: '/Druglist',component: Druglist, name: '药品列表' },
            { path: '/Thedoctorlist',component: Thedoctorlist, name: '医生列表' },
            { path: '/Patientslist',component: Patientslist, name: '患者列表' },
            { path: '/Druglicenselist',component: Druglicenselist, name: '药品授权' },
            { path: '/Deauthorize',component: Deauthorize, name: '取消授权' },
            { path: '/QrCode',component: QrCode, name: '扫描二维码成为一级代理' },
            { path: '/Prescription',component: Prescription, name: '处方管理' },

        ]
    },
    /*{
        path: '/',
        component: Home,
        name: '导航二',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/page4', component: Page4, name: '页面4' },
            { path: '/page5', component: Page5, name: '页面5' }
        ]
    },*/
   /* {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: '导航三' }
        ]
    },*/
 /*   {
        path: '/',
        component: Home,
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
]
    },*/
    {
        path: '*',
        hidden: true,
        redirect: { path: '/table' }
    }
];

export default routes;