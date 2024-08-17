import { useCookies } from 'react-cookie'
import { useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CartQuantityContext, CartContext, MessageContext } from '../../AppContainer'
import './header.css'
import { Input, Dropdown, Menu, Avatar, Button } from 'antd'

const { Search } = Input
export default function Header() {
    const [cookie, setCookie, removeCookie] = useCookies()
    const [user, setUser] = useState('Đăng nhập')
    const [items, setItems] = useState([])
    const [showMenu, setShowMenu] = useState('default')
    const [searchResults, setSearchResults] = useState([])
    const [cartQuantity, setCartQuantity] = useContext(CartQuantityContext)
    const [cart, setCart] = useContext(CartContext)
    const [message, setMessage] = useContext(MessageContext)
    const navigate = useNavigate()
    const location = useLocation()
    const userMenu = (
        <Menu>
            <Menu.Item key='1' disabled>{user}</Menu.Item>
            <Menu.Item key='2' danger onClick={handleLogout}>Đăng xuất</Menu.Item>
        </Menu>
    )

    useEffect(() => {
        if ((typeof cookie.user) !== 'undefined') {
            document.getElementById('loginLink').style.display = 'none'
            document.getElementById('userIcon').style.display = 'block'
            setUser(cookie.user)
        }
        else {
            document.getElementById('userIcon').style.display = 'none'
            document.getElementById('userIcon').style.display = 'none'
            document.getElementById('loginLink').style.display = 'block'
        }
    }, [cookie.user])

    function handleLogout() {
        fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            if (response.status === 200) {
                removeCookie('user')
                removeCookie('isAdmin')
                document.body.style.animationName = 'fadeIn'
                navigate('/../')
            }
            else {
                console.log('Logout failed!!')
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }

    function handleSearch(event) {
        if (event.target.value !== '') {
            fetch('/api/search', {
                method: 'POST',
                headers: {
                    "Accept": 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ searchInput: event.target.value })
            })
            .then(results => results.json())
            .then(results => {
                setSearchResults(results)
                let temp = []
                results.forEach(result => {
                    temp.push({ label: (<p onClick={() => navigate('../product', {state: result})}>{result.name}</p>)})
                })
                setItems(temp)
            })
            .catch(err => console.log(err))
        }
        else setItems([])
    }

    function handleCartClick() {
    
        let idArr = []
        cart.forEach(item => {
            idArr.push(item.id)
        })

        fetch('/api/products/getProductsById', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productID: idArr })
        }).then(res => res.json())
        .then(products => {
            products.forEach((product) => {
                cart.forEach(item => {
                    if (item.id === product._id)
                        product.cartQuantity = item.quantity
                })
            })
            navigate('/cart-manage', {
                state: products
            })
        })
        .catch(error => console.log(error))
    }

    function handleSearchLogoClick() {
        document.getElementById('logo').style.display = 'none'
        document.getElementById('userInfo').style.display = 'none'
        document.getElementById('searchLogo').style.display = 'none'
        document.getElementById('dropMenu').style.display = 'none'
        document.getElementById('search').style.width = '100%'
        document.getElementsByClassName('ant-input-group-wrapper')[0].style.display = 'block'
        document.getElementById('back2FullHeader').style.display = 'block'
        
    }

    function handleBack () {
        document.getElementById('logo').style.display = 'block'
        document.getElementById('userInfo').style.display = 'flex'
        document.getElementById('searchLogo').style.display = 'block'
        document.getElementById('dropMenu').style.display = 'block'
        document.getElementById('search').style.width = '30%'
        document.getElementsByClassName('ant-input-group-wrapper')[0].style.display = 'none'
        document.getElementById('back2FullHeader').style.display = 'none'
    }

    useEffect(() => {
        if (showMenu === 'show') {
            document.getElementById('sideMenu').style.animationName = 'fadeIn'
            document.getElementById('sideMenu').style.display = 'block'
        }
        else if (showMenu === 'hide'){
            document.getElementById('sideMenu').style.animationName = 'fadeOut'
            setTimeout(() => {
                document.getElementById('sideMenu').style.display = 'none'
            }, 200)
        }
    }, [showMenu])

    return (
        <div id="header">
            <div id='logo'>
                <a href='/'><img src='logo.png' alt='logo' /></a>
            </div>
            <div id='search'>
                <img alt='drop-menu' src='dropMenu.png' id='dropMenu' onClick={() => showMenu === 'hide' || showMenu === 'default' ? setShowMenu('show') : setShowMenu('hide')} />
                <img alt='search-logo' src='search.png' id='searchLogo' onClick={handleSearchLogoClick} />
                <img id='back2FullHeader' src='back.png' alt='back' onClick={handleBack}/>
                <Dropdown menu={{ items }} placement='bottom' trigger={['click']} style={{ padding: '0' }} >
                    <Search placeholder="Nhập từ khóa để tìm sản phẩm" onChange={handleSearch} onSearch={handleSearch} size='large' enterButton={ <img src='search.png' style={{ maxHeight: '100%', padding: '8px', objectFit: 'contain' }} alt='search-button'/> } onPressEnter={() => {
                        navigate('/product-filter', { state: searchResults, replace: true }) 
                        setItems([])}}/>
                </Dropdown>
            </div>
            
            <div id='userInfo'>
                <div id='cart' >
                    <p id='productQuantityInCart'>{ cartQuantity }</p>
                    <img src='cart.png' alt='cart' onClick={ handleCartClick }/>
                </div>
                <div id='user'>
                    <a id='loginLink' href='/login' style={{textDecoration: 'underline', color: '#0474e4', margin: 'auto', whiteSpace: 'nowrap', overflow: 'hidden'}} >Đăng nhập</a>
                    <Dropdown dropdownRender={() => (userMenu)} arrow placement='bottom'>
                        <img id='userIcon' src='user.png' alt='user'/>
                        {/* <Avatar id='userIcon' shape='square' icon={<UserOutlined />}/> */}
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}