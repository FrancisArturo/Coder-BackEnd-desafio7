import { Router } from "express";
import CartController from "../controllers/cart.controller.js";


export default class cartRoutes {
    path = "/carts";
    router = Router();
    cartController = new CartController

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        //get products from cart
        this.router.get(`${this.path}/:cid`, this.cartController.getProductsCartController );

        //add cart
        this.router.post(`${this.path}`, this.cartController.addCartController);

        //add product to cart
        this.router.post(`${this.path}/:cid/products/:pid`, this.cartController.addProductCartController);

        //delete product from cart
        this.router.delete(`${this.path}/:cid/products/:pid`, this.cartController.deleteProductCartController);

        //delete all products from cart
        this.router.delete(`${this.path}/:cid`, this.cartController.deleteProductsCartController);

        //update quantity product from cart
        this.router.put(`${this.path}/:cid/products/:pid`, this.cartController.updateProductCartController);

        //update products from cart
        this.router.put(`${this.path}/:cid`, this.cartController.updateProductsCartController); 
    }
}