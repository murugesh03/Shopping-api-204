const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/product.routes");
const auth = require("./middleware/auth.middleware");

const app = express();

app.use(cors());

app.use(express.json());
// middleware
app.use(auth);

// routes
app.use("/product", productRoutes);

module.exports = app;
