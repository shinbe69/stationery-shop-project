import { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CategoryContext } from '../../App'
import Product from '../product/product'
import './productSection.css'

export default function ProductSection() {
    const navigateState = useLocation().state
    const [category, setCategory] = useState()
    const [products, setProducts] = useState([])
    const [filter, setFilter] = useState('default')

    useEffect(() => {
        if (typeof navigateState === 'string') {
            if (navigateState === 'all')
                setCategory(false)
            else {
                setCategory(navigateState)
            }
        }
        else {
            setProducts(navigateState)
        }
    }, [navigateState])

    useEffect(() => {
        if (typeof category !== 'undefined') {
            fetch('/api/products/getProducts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ filter, category })
            }).then(res => res.json())
            .then(products => setProducts(products))
            .catch(err => console.log(err))
        }
    }, [filter, category])

    function handleChangeFilter(event) {
        setFilter(event.target.value)
    }

    return (
        <div id='productSection'>
            <div id='productNavigator'>
                <div className='naviOption'>
                    <label>Sắp xếp theo:</label>
                    <select style={{ fontStyle: 'italic' }} onChange={ handleChangeFilter }>
                        <option value='default'>Mặc định</option>
                        <option value='increase'>Giá thấp &#62; cao</option>
                        <option value='decrease'>Giá cao &#62; thấp</option>
                        <option value='bestsell'>Bán chạy nhất</option>
                        <option value='recently'>Mới thêm gần đây</option>
                    </select>
                </div>
            </div>
            <div id='productContainer'>
                { (products).map(product => (
                    <Product key={product._id} product={ product }/>
                ))}
            </div>
        </div>
    )
}