import express from 'express'
import { addToCart, myCart, updateQuantity, DeleteCart, clearCart, placeOrder } from '../controllers/cartController.js'

import {auth} from "../middleWare/auth.js";
const cartRoute = express.Router()
cartRoute.post('/cart', auth, addToCart)
cartRoute.get('/cart', auth, myCart)
cartRoute.put('/cart/:id', auth, updateQuantity)
cartRoute.delete('/cart/:id', auth, DeleteCart)
cartRoute.delete('/cart', auth, clearCart)
cartRoute.post('/cart/order', auth, placeOrder)
export default cartRoute
