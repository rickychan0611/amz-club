import Vue from 'vue'
import Router from 'vue-router'
// 1.declear where is the file. (the component)
import Home from '@/components/Home'
import PlaceOrder from '@/components/Products/PlaceOrder'
import Item from '@/components/Products/item'
import CreateProduct from '@/components/Products/CreateProduct'
import MicUsb from '@/components/Products/micUsb'
import Profile from '@/components/User/Profile'
import Signup from '@/components/User/Signup'
import Signin from '@/components/User/Signin'
import MyOrders from '@/components/User/MyOrders'
import SubmitReview from '@/components/User/SubmitReview'
import SubmitOrder from '@/components/User/SubmitOrder'
import EditOrder from '@/components/User/EditOrder'
import AuthGuard from './auth-guard'
import RefreshProduct from './refreshProduct'
import Sellers from '@/components/Sellers'
import Myadmin from '@/components/admin/Myadmin'
import ProductList from '@/components/admin/ProductList'
import RebateList from '@/components/admin/RebateList'
import BuyersList from '@/components/admin/BuyersList'
import SellersList from '@/components/admin/SellersList'
// import goTo from 'vuetify/es5/services/goto'

Vue.use(Router)

// 2.
export default new Router({
  scrollBehavior (to, from, savedPosition) {
    // https://router.vuejs.org/guide/advanced/scroll-behavior.html
    if (to.hash) {
      return { selector: to.hash }
    } else if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
      // beforeEnter: RefreshProduct
    },
    {
      path: '/special/micUsb',
      name: 'micUsb',
      component: MicUsb
      // beforeEnter: RefreshProduct
    },
    {
      path: '/placeOrder/:id',
      name: 'PlaceOrder',
      props: true, // send id to props in placeOrder.vue
      component: PlaceOrder,
      beforeEnter: AuthGuard
    },
    {
      path: '/products/new',
      name: 'CreateProduct',
      component: CreateProduct
      // beforeEnter: AuthGuard
    },
    {
      path: '/item/:key',
      name: 'item',
      props: true,
      component: Item
      // beforeEnter: AuthGuard
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: AuthGuard
    },
    {
      path: '/signup',
      name: 'Signup',
      props: true,
      component: Signup
    },
    {
      path: '/myOrders',
      name: 'MyOrders',
      component: MyOrders
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/sellers/:id',
      name: 'Sellers',
      props: true,
      component: Sellers
    },
    {
      path: '/myadmin',
      name: 'Myadmin',
      props: true,
      component: Myadmin
    },
    {
      path: '/myadmin/productList',
      name: 'ProductList',
      props: true,
      component: ProductList
    },
    {
      path: '/myadmin/rebatetList',
      name: 'RebateList',
      props: true,
      component: RebateList
    },
    {
      path: '/myadmin/buyersList',
      name: 'BuyersList',
      props: true,
      component: BuyersList
    },
    {
      path: '/myadmin/sellersList',
      name: 'SellersList',
      props: true,
      component: SellersList
    },
    {
      path: '/submitReview/:index/:id',
      name: 'SubmitReview',
      props: true,
      component: SubmitReview,
      beforeEnter: AuthGuard
    },
    {
      path: '/submitOrder/:index/:id',
      name: 'SubmitOrder',
      props: true,
      component: SubmitOrder,
      beforeEnter: AuthGuard
    },
    {
      path: '/editOrder/:index/:id',
      name: 'EditOrder',
      props: true,
      component: EditOrder,
      beforeEnter: AuthGuard
    }
  ],
  mode: 'history'
})
