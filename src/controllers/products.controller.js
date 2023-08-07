import ProductsManager from '../dao/managers/dbManagers/products.manager.js';

export default class ProductsController {
    productsManager;
    constructor(){
        this.productsManager = new ProductsManager();
    }
    insertionProductsController = async (req, res ) => {
        try {
            const result = await this.productsManager.insertionProducts();
            res.json({
                message: "Products inserted successfully",
                data: result
            })
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    getallController = async (req, res) => {
        try {
            const products = await this.productsManager.getall();
            return res.json({
                message: "Products retrieved successfully",
                data: products
            })
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    getProductsByIdController = async (req, res) => {
        try {
            const { pid } = req.params;
            const product = await this.productsManager.getProductsById(pid);
            if (product === "No product found") {
                return res.json({
                    message: "No product found",
                })
            }
            return res.json({
                message: "Product retrieved successfully",
                data: product
            })
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    addProductController = async (req, res) => {
        try {
            const { body } = req;
            const newProduct = await this.productsManager.addProduct(body);
            if (newProduct === "Product already exists") {
                return res.json({
                    message: "Product already exists",
                })
            }
            return res.json({
                message: "Product added successfully",
                data: newProduct
            })

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    updateProductController = async (req, res) => {
        try {
            const { pid } = req.params;
            const productFind = await this.productsManager.getProductsById(pid);
            if (productFind === "No product found") {
                return res.json({
                    message: "No product found",
                })
            }
            const product = req.body;
            const updateProduct = await this.productsManager.updateProduct(pid, product);
            return res.json({
                message: "Product updated successfully",
                data: updateProduct
            })
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    deleteProductController = async (req, res) => {
        try {
            const { pid } = req.params;
            const productFind = await this.productsManager.getProductsById(pid);
            if (productFind === "No product found") {
                return res.json({
                    message: "No product found",
                })
            }
            const productDelete = this.productsManager.deleteProduct(pid);
            return res.json({
                message: "Product deleted successfully",
                data: productDelete
            })
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    
}