import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/action-history',
    name: 'ActionHistory',
    component: () => import(/* webpackChunkName: "actionHistory" */ '../views/ActionHistory.vue'),
    props: (route) => ({ actionType: +route.query.type || 0})
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
