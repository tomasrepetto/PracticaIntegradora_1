import { Router } from 'express';
import { addProductInCart, createCart, getCartsById } from '../controllers/carts.js';


const router = Router();

router.get('/:cid', getCartsById);
router.post('/', createCart);
router.post('/:cid/product/:pid', addProductInCart);

export default router;