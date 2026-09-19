import express from "express";
const app = express();
const PORT = process.env.PORT ?? 3000;
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Hello from the backend!");
});
app.get("/products", (req, res) => {
    res.json([
        { id: 1, name: "Laptop" },
        { id: 2, name: "Mouse" }
    ]);
});
app.post("/products", (req, res) => {
    const product = req.body;
    res.status(201).json({
        message: "Product created",
        product
    });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
