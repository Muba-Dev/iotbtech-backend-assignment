import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

async function processData() {
  const startTime = performance.now();

  const inputPath = path.join(process.cwd(), 'data', 'products.csv');
  const outputPath = path.join(process.cwd(), 'data', 'category-summary.csv');

  if (!fs.existsSync(inputPath)) {
    console.error(`Error: File not found at ${inputPath}`);
    process.exit(1);
  }

  const categoryTotals = new Map<string, number>();
  let totalRows = 0;
  let isHeader = true;

  const fileStream = fs.createReadStream(inputPath, { encoding: 'utf-8' });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    if (isHeader) {
      isHeader = false;
      continue;
    }

    const parts = trimmedLine.split(',');
    if (parts.length < 5) continue;

    const category = parts[2];
    const price = parseFloat(parts[3]);
    const stock = parseInt(parts[4], 10);

    if (category && !isNaN(price) && !isNaN(stock)) {
      const rowValue = price * stock;
      const currentTotal = categoryTotals.get(category) || 0;
      categoryTotals.set(category, currentTotal + rowValue);
      totalRows++;
    }
  }

  let grandTotal = 0;
  const summaryLines = ['category,total'];

  for (const [category, total] of categoryTotals.entries()) {
    grandTotal += total;
    summaryLines.push(`${category},${total.toFixed(2)}`);
  }

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, summaryLines.join('\n'), 'utf-8');

  const endTime = performance.now();
  const durationMs = Math.round(endTime - startTime);

  console.log(`Row count: ${totalRows}`);
  console.log(`Grand total: $${grandTotal.toFixed(2)}`);
  console.log(`Runtime: ${durationMs} ms`);
}

processData().catch((err) => {
  console.error('Error processing aggregation:', err);
  process.exit(1);
});