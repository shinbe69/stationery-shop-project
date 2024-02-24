import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Carousel, Button } from 'antd'
import './homepage.css'
import ProductSection from '../productSection/productSection'
import Product from '../product/product'


export default function Homepage() {
    const contentStyle = {
        height: '160px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
      };
    const navigate = useNavigate()
    const [bestSelling, setBestSelling] = useState([])
    const [recentProducts, setRecentProducts] = useState([])
    const [showButtonContent, setShowButtonContent] = useState('Xem thêm')
    const [loadingStatus, setLoadingStatus] = useState(false)

    useEffect(() => {
        fetch('/api/products/getProducts', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
            body: JSON.stringify({ filter: 'bestsell' })
        })
        .then(res => res.json())
        .then(products => {
            let size = products.length
            if (size !== 0) {
                setBestSelling(products)
                // setInterval(() => {
                //     index.current === size -1 ? index.current = 0 : index.current++
                //     setBestSelling(products[index.current])
                    
                // }, 7000)
            }
        })
        .catch(error => console.log(error))

        fetch('/api/products/getProducts', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
            body: JSON.stringify({ filter: 'recently', limit: '10' })
        })
        .then(res => res.json())
        .then(products => {
            setRecentProducts(products)
        })
        .catch(error => console.log(error))
    }, [])

    function handleShowMore() {
        setLoadingStatus(true)
        fetch('/api/products/getProducts', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
            body: JSON.stringify({ filter: 'recently' })
        })
        .then(res => res.json())
        .then(products => {
            setRecentProducts(products)
            setShowButtonContent('Xem tất cả sản phẩm')
            setLoadingStatus(false)
        })
        .catch(error => console.log(error))
    }

    return (
        <div id="homepage">
            {bestSelling.length !== 0 ? 
            <div id='highlight' >
                <Carousel autoplay autoplaySpeed={8000} effect='fade'>
                    {bestSelling.map(item => (
                        <div key={item._id} className='item' onClick={() => navigate('/product', {
                            state: item
                        })}>
                            <img src={item.thumnail} alt='popular item'  />
                            <div className='itemInfo'>
                                <h4 style={{ fontWeight: 'bold' }}>{ item.name }</h4>
                                <p className='itemDescription'>{ item.description.substring(0, 100).concat('...') }</p>
                            </div>
                        </div>
                    ))}
                </Carousel>
                <div id='banner'>
                    <img id='bannerImg' src='banner.png' alt='banner' />
                </div>
            </div> : <></> }
            <h3 style={{ textAlign: 'left', margin: '1em 0', textDecoration: 'underline' }} >Sản phẩm mới thêm gần đây</h3>
            <div id='recentProducts'>
                { recentProducts.map(product => (
                    <Product key={product._id} product={product} />
                )) }
            </div>
            <Button size='large' loading={loadingStatus} onClick={handleShowMore} type="default" style={{ marginTop: '3em', outline: 'none' }}>{showButtonContent}</Button>
        </div>
    )
}