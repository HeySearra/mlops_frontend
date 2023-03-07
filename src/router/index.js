import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
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