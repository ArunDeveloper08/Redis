import express from "express"
import { getProducts, placeOrder, productDetail } from "./controller/products.js";
import { rateLimiter } from "./middleware/redis.js";

const router = express.Router()

router.get('/products',getProducts)
router.get('/product/:id',productDetail)
router.get('/order/:id', rateLimiter(10,20 ), placeOrder)

export default router;   