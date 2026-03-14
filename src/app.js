const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/product.routes");
const auth = require("./middleware/auth.middleware");
const errorHandler = require("./middleware/error.middleware");
const requestLogger = require("./middleware/requestLogger.middleware");

const app = express();

app.use(cors());

app.use(express.json());
// middleware
app.use(requestLogger);
app.use(auth);

// routes
app.use("/product", productRoutes);

app.use(errorHandler);

module.exports = app;
