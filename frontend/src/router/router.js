import { createBrowserRouter } from 'react-router-dom'
import Homepage from '../components/homepage/homepage'
import About from '../components/about/about'
import ProductPage from '../components/productPage/productpage'
import ProductSection from '../components/productSection/productSection'
import App from '../App'
import Login from '../components/login/login'
import LoginForm from '../components/loginForm/loginForm'
import SignupForm from '../components/login/signupForm/signupForm'
import CartManage from '../components/cartManage/cartManage'
import Blog from '../components/blog/blog'
import Protected from '../components/protected/protected'
import AppContainer from '../AppContainer'
import AddNewProduct from '../components/dashboard/addNewProduct/addNewProduct'
import UpdateUserInfo from '../components/updateUserInfo/updateUserInfo'
import OnlyForwarded from '../components/onlyForwarded/onlyForwarded'
import OrderManage from '../components/dashboard/orderManage/orderManage'
import AddNewCategory from '../components/dashboard/addNewCategory/addNewCategory'

const router = createBrowserRouter([
    {
            path: "/",
            element: <AppContainer />,
            children: [
                {
                    path: '/',
                    element: <App />,
                    children: [
                        {
                            //Homepage
                            path: "/",
                            element: <Homepage />
                        },
                        {
                            //ProductPage
                            path: "/product",
                            element: <ProductPage />
                        },
                        {
                            //List products by category
                            path: "/product-filter",
                            element: <ProductSection />
                        },
                        {
                            //Cart manage
                            path: "/cart-manage",
                            element: <CartManage />
                        },
                        {
                            //Blog
                            path: "/blog",
                            element: <Blog />
                        },
                        {
                            //Update user info
                            path: 'update-user-info',
                            element: <OnlyForwarded>
                                <UpdateUserInfo />
                            </OnlyForwarded>,
                            loader: async () => {
                                return fetch('https://vapi.vnappmob.com/api/province/')
                            }
                        },
                        {
                            path: '/order-manage',
                            element: <OnlyForwarded>
                                    <OrderManage />
                                </OnlyForwarded>
                        },
                        {
                            path: '/add-new-product',
                            element: <Protected><AddNewProduct /></Protected>
                        },
                        {
                            path: '/add-new-category',
                            element: <Protected><AddNewCategory /></Protected>
                        }
                    ]
                },
                {
                    //Login
                    path: "/",
                    element: <Login />,
                    children: [
                        {
                            //LoginForm
                            path: '/login',
                            element: <LoginForm />
                        },
                        {
                            //SignupForm
                            path: '/signup',
                            element: <SignupForm />
                        }
                    ]
                },
                {
                    //About
                    path: "/about",
                    element: <About />
                }
            ]
        }
    ])
export default router