import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/datasets',
        name: 'Data',
        component: () =>
            import ('../views/Datasets/Datasets.vue')
    },
    {
        path: '/datadetails/:id',
        name: 'DataDetails',
        component: () =>
            import ('../views/Datasets/DataDetails.vue')
    },
    {
        path: '/datadetail/:id',
        name: 'DataDetails_wang',
        component: () =>
            import ('../views/Datasets/DataDetails_wang.vue')
    },
    {
        path: '/new_datasets',
        name: 'NewData',
        component: () =>
            import ('../views/Datasets/NewData.vue')
    },
    {
        path: '/model',
        name: 'Model',
        component: () =>
            import ('../views/ModelPage/Model.vue')
    },
    {
        path: '/modeldetails/:id',
        name: 'ModelDetails',
        component: () =>
            import ('../views/ModelPage/ModelDetails.vue')
    },
    {
        path: '/experiment',
        name: 'Experiment',
        component: () =>
            import ('../views/Experiment/Experiment.vue')
    },
    {
        path: '/new_experiment',
        name: 'NewExperiment',
        component: () =>
            import ('../views/Experiment/NewExperiment.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Account/Login')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/Account/Register')
    },
    {
        path: '/visualize',
        name: 'Visualize',
        component: () =>
            import ('../views/Visualize/Visualize.vue'),
        props: route => ({param: route.query.param})
    },
    {
        path: '/modelana',
        name: 'ModelAnalyse',
        component: () =>
            import ('../views/Visualize/ModelAnalyse.vue'),
    },
    {
        path: '/flow-experiments',
        beforeEnter() {location.href = 'http://162.105.88.214:5000/#/experiments/0?searchFilter=&orderByKey=attributes.start_time&orderByAsc=false&startTime=ALL&lifecycleFilter=Active&modelVersionFilter=All%20Runs&selectedColumns=attributes.%60Source%60,attributes.%60Models%60&isComparingRuns=false&compareRunCharts=dW5kZWZpbmVk';},
    },
    {
        path: '/flow-model',
        beforeEnter() {location.href = 'http://162.105.88.214:5000/#/models';},
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
          return savedPosition
        } else {
          return { x: 0, y: 0 }
        }
      }
    
})

export default router