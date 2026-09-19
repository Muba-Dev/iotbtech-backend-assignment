import fs from 'node:fs';
import path from 'node:path';

// 1. Read process.env.ROWS or default to 10000
const rawRows = process.env.ROWS;
const rowCount = rawRows ? parseInt(rawRows, 10) : 10000;

// 2. Define categories
const categories = ['electronics', 'clothing', 'books', 'home', 'toys', 'food'];

const headers = ['id', 'name', 'category', 'price', 'stock'];
const lines: string[] = [headers.join(',')];

// 3. Generate row data matching required naming scheme
for (let i = 1; i <= rowCount; i++) {
  const category = categories[(i - 1) % categories.length];
  const name = `${category}-${i}`;
  const price = (Math.random() * 495 + 5).toFixed(2); // Decimal price
  const stock = Math.floor(Math.random() * 501);      // Integer between 0 and 500

  lines.push(`${i},${name},${category},${price},${stock}`);
}

// 4. Ensure directory exists and write CSV
const outputDir = path.join(process.cwd(), 'data');
const outputPath = path.join(outputDir, 'products.csv');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');

// 5. Print expected output
console.log(`Generated ${rowCount} rows -> data/products.csv`);