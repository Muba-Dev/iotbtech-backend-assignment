import express from "express";
import productRouter from "./routes/product.routes.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Root test route
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

// Mount the product router
// All product-related endpoints are now accessible at http://localhost:3000/api/products
app.use("/api/products", productRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Products API available at http://localhost:${PORT}/api/products`);
});