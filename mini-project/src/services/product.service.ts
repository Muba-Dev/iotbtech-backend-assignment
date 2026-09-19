import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

// 1. Define the Product domain interface
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export type CreateProductData = Omit<Product, 'id'>;
export type UpdateProductData = Partial<CreateProductData>;

export class ProductService {
  private products: Product[] = [];
  private filePath: string;
  private isLoaded: boolean = false;

  constructor() {
    this.filePath = path.join(process.cwd(), 'data', 'products.csv');
  }

  /**
   * Load products from CSV into memory using streams.
   */
  public async loadProducts(): Promise<void> {
    if (this.isLoaded) return;

    if (!fs.existsSync(this.filePath)) {
      this.products = [];
      this.isLoaded = true;
      return;
    }

    const fileStream = fs.createReadStream(this.filePath, { encoding: 'utf-8' });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    const loadedProducts: Product[] = [];
    let isHeader = true;

    for await (const line of rl) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      if (isHeader) {
        isHeader = false;
        continue;
      }

      const parts = trimmedLine.split(',');
      if (parts.length < 5) continue;

      const id = parseInt(parts[0], 10);
      const name = parts[1].replace(/^"|"$/g, ''); // strip quotes if present
      const category = parts[2];
      const price = parseFloat(parts[3]);
      const stock = parseInt(parts[4], 10);

      if (!isNaN(id) && !isNaN(price) && !isNaN(stock)) {
        loadedProducts.push({ id, name, category, price, stock });
      }
    }

    this.products = loadedProducts;
    this.isLoaded = true;
  }

  /**
   * Sync the current in-memory array back to data/products.csv
   */
  private async persist(): Promise<void> {
    const headers = ['id', 'name', 'category', 'price', 'stock'];
    const lines = [headers.join(',')];

    for (const p of this.products) {
      const formattedName = p.name.includes(',') ? `"${p.name}"` : p.name;
      lines.push(`${p.id},${formattedName},${p.category},${p.price.toFixed(2)},${p.stock}`);
    }

    const outputDir = path.dirname(this.filePath);
    if (!fs.existsSync(outputDir)) {
      await fs.promises.mkdir(outputDir, { recursive: true });
    }

    await fs.promises.writeFile(this.filePath, lines.join('\n'), 'utf-8');
  }

  /**
   * Get all products
   */
  public async findAllProducts(): Promise<Product[]> {
    await this.loadProducts();
    return this.products;
  }

  /**
   * Find a single product by ID
   */
  public async findProductById(id: number): Promise<Product | null> {
    await this.loadProducts();
    const product = this.products.find((p) => p.id === id);
    return product || null;
  }

  /**
   * Create a new product and assign an auto-incrementing ID
   */
  public async createProduct(data: CreateProductData): Promise<Product> {
    await this.loadProducts();

    const maxId = this.products.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const newProduct: Product = {
      id: maxId + 1,
      ...data,
    };

    this.products.push(newProduct);
    await this.persist();

    return newProduct;
  }

  /**
   * Update an existing product by ID
   */
  public async updateProduct(id: number, data: UpdateProductData): Promise<Product | null> {
    await this.loadProducts();

    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return null;
    }

    const existing = this.products[index];
    const updatedProduct: Product = {
      ...existing,
      ...data,
      id: existing.id, // Prevent overriding ID
    };

    this.products[index] = updatedProduct;
    await this.persist();

    return updatedProduct;
  }

  /**
   * Delete a product by ID
   */
  public async deleteProduct(id: number): Promise<boolean> {
    await this.loadProducts();

    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return false;
    }

    this.products.splice(index, 1);
    await this.persist();

    return true;
  }
}

// Export a singleton instance for controller consumption
export const productService = new ProductService();