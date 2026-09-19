import { Router } from 'express';
import { productController } from '../controllers/product.controller.js';

const router = Router();

// GET /api/products - Fetch all products
router.get('/', (req, res) => productController.getAllProducts(req, res));

// GET /api/products/:id - Fetch a single product by ID
router.get('/:id', (req, res) => productController.getProductById(req, res));

// POST /api/products - Create a new product
router.post('/', (req, res) => productController.createProduct(req, res));

// PUT /api/products/:id - Update an existing product by ID
router.put('/:id', (req, res) => productController.updateProduct(req, res));

// DELETE /api/products/:id - Delete a product by ID
router.delete('/:id', (req, res) => productController.deleteProduct(req, res));

export default router;