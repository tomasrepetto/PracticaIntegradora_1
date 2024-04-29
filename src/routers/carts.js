import { Router } from 'express';
import { addProductInCart, createCart, getCartsById } from '../dao/cartsDB.js';


const router = Router();

router.get('/:cid', getCartsById);
router.post('/', createCart);
router.post('/:cid/product/:pid', addProductInCart);

export default router;