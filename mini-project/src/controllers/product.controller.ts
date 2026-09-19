import { Request, Response } from 'express';
import { productService } from '../services/product.service.js';

export class ProductController {
  /**
   * GET /products
   * Fetch all products or optionally filter/paginate
   */
  public async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await productService.findAllProducts();
      res.status(200).json({
        success: true,
        count: products.length,
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve products',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /products/:id
   * Fetch a single product by ID
   */
  public async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid product ID format. ID must be an integer.',
        });
        return;
      }

      const product = await productService.findProductById(id);
      if (!product) {
        res.status(404).json({
          success: false,
          message: `Product with ID ${id} not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve product',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * POST /products
   * Create a new product
   */
  public async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { name, category, price, stock } = req.body;

      if (!name || !category || price === undefined || stock === undefined) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields: name, category, price, and stock are required.',
        });
        return;
      }

      const newProduct = await productService.createProduct({
        name,
        category,
        price: Number(price),
        stock: Number(stock),
      });

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: newProduct,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create product',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * PUT /products/:id
   * Update an existing product by ID
   */
  public async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid product ID format. ID must be an integer.',
        });
        return;
      }

      const { name, category, price, stock } = req.body;

      const updatedProduct = await productService.updateProduct(id, {
        ...(name !== undefined && { name }),
        ...(category !== undefined && { category }),
        ...(price !== undefined && { price: Number(price) }),
        ...(stock !== undefined && { stock: Number(stock) }),
      });

      if (!updatedProduct) {
        res.status(404).json({
          success: false,
          message: `Product with ID ${id} not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update product',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * DELETE /products/:id
   * Delete a product by ID
   */
  public async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid product ID format. ID must be an integer.',
        });
        return;
      }

      const deleted = await productService.deleteProduct(id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: `Product with ID ${id} not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `Product with ID ${id} deleted successfully`,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete product',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export const productController = new ProductController();