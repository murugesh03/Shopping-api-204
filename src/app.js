const express = require("express");
const productRoutes = require("./routes/product.routes");
const auth = require("./middleware/auth.middleware");

const app = express();

app.use(express.json());
// middleware
app.use(auth);

// routes
app.use("/product", productRoutes);

module.exports = app;
