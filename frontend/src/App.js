import { Outlet, useNavigate } from 'react-router-dom'
import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { CartContext } from './AppContainer';
import { FloatButton } from 'antd'
import { UpOutlined } from '@ant-design/icons'
import './App.css';

export default function App() {
  const [cart ,serCart] = useContext(CartContext)
  const [cookie, setCookie, removeCookie] = useCookies()
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')
  const [products, setProducts] = useState([])
  const navigate = useNavigate()
  const second = useRef(0)

  useEffect(() => {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  })

  useEffect(() => {
    fetch('/api/category')
    .then(res => res.json())
    .then(categories => setCategories(categories))
  }, [])

  useEffect(() => {
    if (category !== '') {
      // Show clear category button
      if (document.getElementById('sideMenu').style.display === 'block') {
        document.getElementById('sideMenu').style.animationName = 'fadeOut'
        setTimeout(() => {
          document.getElementById('sideMenu').style.display = 'none'
        }, 200)
      }
      navigate('/product-filter', {
        state: category
      })
      setCategory('')
    }
  }, [category])

  function handleHideSideMenu() {
    if (document.getElementById('sideMenu').style.display === 'block') {
      document.getElementById('sideMenu').style.animationName = 'fadeOut'
      setTimeout(() => {
        document.getElementById('sideMenu').style.display = 'none'
      }, 200)
    }
  }

  return (
    <div id='app'>
      <div id="sideMenu" >
        <div className='categoryContainer'>
          <h4 style={{ textDecoration: 'underline' }}>Danh mục sản phẩm phổ biến</h4>
          {categories.map(category => (
            <div className="categoryItem" key={ category._id } onClick={ () => setCategory(category._id) } style={ category._id === category ? { backgroundColor: '#dedcdc' } : {}} >
              <img src={ category.thumnail } alt="category item" />
              <hr style={{ margin: '0 1rem' }} />
              <p>{ category.name }</p>
            </div>
          ))}
          <div className='categoryItem' id='allCategory' onClick={() => {
            setCategory('all')
          }}>
            <p style={{ textDecoration: 'underline' }}>Tất cả sản phẩm</p>
          </div>
        </div>
        {/* <div id='recentBlogs'>
          <h4 style={{ textDecoration: 'underline' }}>Bài viết gần đây</h4>
          {categories.map(category => (
            <div className="categoryItem" key={ category._id } onClick={ () => setCategory(category._id) } style={ category._id === category ? { backgroundColor: '#dedcdc' } : {}} >
              <p>{ category.name }</p>
            </div>
          ))}
        </div> */}
        { typeof cookie.user !== 'undefined' && cookie.isAdmin ? 
          <div className='categoryContainer' style={{ marginTop: '2em' }}>
                <h4 style={{ textDecoration: 'underline' }}>Thao tác quản lý</h4>
                <div className='categoryItem' onClick={() => {
                  handleHideSideMenu()
                  navigate('/add-new-product', {
                    state: cookie.isAdmin
                  })
                }}>
                    <img src='./add-product.png' alt="category item" />
                    <hr style={{ margin: '0 1rem' }} />
                    <p>Thêm sản phẩm mới</p>
                </div>
                <div className='categoryItem' onClick={() => {
                  handleHideSideMenu()
                  navigate('/add-new-category', {
                    state: cookie.isAdmin
                })
                }} >
                    <img src='./new-category.png' alt="category item" />
                    <hr style={{ margin: '0 1rem' }} />
                    <p>Tạo danh mục mới</p>
                </div>
                <div className='categoryItem' onClick={() => {
                  handleHideSideMenu()
                  navigate('/order-manage', {
                    state: cookie.isAdmin
                })
                }}>
                    <img src='./pending-order.png' alt="category item" />
                    <hr style={{ margin: '0 1rem' }} />
                    <p>Quản lý đơn hàng</p>
                </div>
                <div className='categoryItem' onClick={() => {
                  handleHideSideMenu()
                  navigate('/order-manage', {
                    state: cookie.isAdmin
                })
                }}>
                    <img src='./megaphone.png' alt="category item" />
                    <hr style={{ margin: '0 1rem' }} />
                    <p>Quản lý banner</p>
                </div>
                <div className='categoryItem' onClick={() => {
                  handleHideSideMenu()
                  navigate('/order-manage', {
                    state: cookie.isAdmin
                })
                }}>
                    <img src='./chart.png' alt="category item" />
                    <hr style={{ margin: '0 1rem' }} />
                    <p>Thống kê doanh số</p>
                </div>
            </div>
          : <></>
        }
      </div>
      <div id='content' >
          <Outlet />
          <FloatButton.Group shape='square' style={{ padding: '0' }}>
            <FloatButton shape='square' href='https://zalo.me/0868931400' tooltip='Chat với shop' target='_blank' icon={ 
                <img style={{ width: '100%', height: '100%', objectFit: 'contain' }} src='/zalo.webp' alt='zalo' />
            }/>
            <FloatButton.BackTop shape='square' icon={ <UpOutlined /> } duration={300} visibilityHeight={0} tooltip='Di chuyển về đầu trang' />
          </FloatButton.Group>
          
      </div>
    </div>
  );
}