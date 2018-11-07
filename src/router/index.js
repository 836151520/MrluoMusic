import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/views/recommend/index.vue'
import Search from '@/views/search/index.vue'
import Ranking from '@/views/ranking/index.vue'
import Singer from '@/views/singer/singer.vue'
import RecommendDetail from '@/views/recommend/detail.vue'
import SingerDetail from '@/views/singer/detail.vue'
import RankList from '@/views/ranking/detail.vue'


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect:"recommend"
    },
    {
      path: '/recommend',
      component: Recommend,
      children:[
        {
          path:"/recommend/:id",
          component:RecommendDetail
        }
      ]
    },
    {
      path: '/search',
      component: Search
    },
    {
    	path: '/ranking',
    	component: Ranking,
      children:[
        {
          path:"/ranking/:id",
          component:RankList
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children:[
        {
          path:"/singer/:id",
          component:SingerDetail
        }
      ]
    }
  ]
})
