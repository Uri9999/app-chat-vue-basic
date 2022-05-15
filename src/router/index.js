import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Signup from '@/components/Signup'
import Chat from '@/components/Chat'
import Profile from '@/components/Profile'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/chat',
      name: 'Chat',
      component: Chat
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    }
  ]
})
