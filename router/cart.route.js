import express from 'express'
import { addToCart, myCart, updateQuantity, DeleteCart, clearCart, placeOrder } from '../controllers/cartController.js'

import {auth} from "../middleWare/auth.js";
const cartRoute = express.Router()
cartRoute.post('/', auth, addToCart)
cartRoute.get('/', auth, myCart)
cartRoute.put('/:id', auth, updateQuantity)
cartRoute.delete('/:productId', auth, DeleteCart) //deleteone by product-id   
cartRoute.delete('/', auth, clearCart)
cartRoute.post('/order', auth, placeOrder)
export default cartRoute
