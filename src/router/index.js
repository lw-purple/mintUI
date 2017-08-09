import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import Hello from '@/components/Hello'
const home = r => require.ensure([], () => r(require('@/page/home')), 'home')
const login = r => require.ensure([], () => r(require('@/page/login/login')), 'login')
Vue.use(Router)

export default new Router({
  routes: [{
		path: '/',
    component: App, //顶层路由，对应index.html
    children: [ 
			 {
            path: '',
            redirect: '/home'
        },
        //首页城市列表页
        {
            path: '/home',
            component: home
				},
					{
            path: '/login',
            component: login
        },
		]
	}],
  scrollBehavior (to, from, savedPosition) {
	    if (savedPosition) {
		    return savedPosition
		} else {
			if (from.meta.keepAlive) {
				from.meta.savedPosition = document.body.scrollTop;
			}
		    return { x: 0, y: to.meta.savedPosition ||0}
		}
	}
})
