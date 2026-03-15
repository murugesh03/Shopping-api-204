# Shopping API - Complete Application Documentation

## 📋 Project Overview

**Shopping API** is a RESTful API built with Node.js, Express, and MongoDB.
It provides endpoints for managing products in an e-commerce system with authentication middleware and a service-oriented architecture.

**Node.js Version:** 24.13.1

---

## 🏗️ Architecture & Project Structure

```
shopping-api/
├── src/
│   ├── app.js                          # Express application setup
│   ├── server.js                       # Server entry point
│   ├── config/
│   │   └── db.js                       # MongoDB connection configuration
│   ├── controllers/
│   │   └── product.controller.js       # Product request handlers
│   ├── middleware/
│   │   └── auth.middleware.js          # Authentication middleware
│   ├── models/                         # (Empty - needs implementation)
│   ├── routes/
│   │   └── product.routes.js           # Product API routes
│   ├── services/
│   │   └── product.service.js          # Product business logic
│   └── utils/                          # (Empty - for utility functions)
├── docs/
│   └── node.md                         # Documentation
├── package.json                        # Project dependencies & scripts
├── readme.md                           # Project readme
└── .env                                # Environment variables (not tracked)
```

---

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Running the Application

**Development Mode** (with auto-reload):

```bash
npm run dev
```

**Production Mode**:

```bash
npm start
```

### Configuration

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGO_URI=
```

---

```javascript
require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");
const port = process.env.PORT || 5000;

connectDB();
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

### 2. **Express App** - [src/app.js](src/app.js)

- Configures Express middleware
- Applies JSON parsing middleware
- Registers authentication middleware globally
- Mounts product routes

### 3. **Database Configuration** - [src/config/db.js](src/config/db.js)

- Connects to MongoDB using Mongoose
- Handles connection errors
- Exits process on connection failure

### 4. **Authentication Middleware** - [src/middleware/auth.middleware.js](src/middleware/auth.middleware.js)

- Validates Authorization header
- Returns 401 Unauthorized if token is missing
- Allows request to proceed if token exists (basic implementation)

**Current Status:** ⚠️ Basic token presence check only - no token validation/verification

### 5. **Routes** - [src/routes/product.routes.js](src/routes/product.routes.js)

- Defines RESTful product endpoints
- Maps HTTP methods to controller actions
- Supports CRUD operations

### 6. **Controllers** - [src/controllers/product.controller.js](src/controllers/product.controller.js)

- Handles incoming HTTP requests
- Validates request data
- Calls service layer for business logic
- Sends appropriate HTTP responses

**Methods:**

- `getAllProducts()` - Retrieves all products
- `createProduct()` - Creates new product (returns 201 Created)
- `updateProduct()` - Updates existing product
- `deleteProduct()` - Deletes product (returns 204 No Content)

### 7. **Services** - [src/services/product.service.js](src/services/product.service.js)

- Contains business logic for product operations
- Interfaces with database models
- Returns data to controllers

**Current Status:** ⚠️ Incomplete implementation - methods need database integration

---

## ⚠️ Implementation Status & Improvements Needed

### Completed ✅

- Project structure and file organization
- Express server setup and configuration
- MongoDB connection configuration
- Route definitions
- Controller structure
- Basic authentication middleware
- Middleware integration

### In Progress / Incomplete ⚠️

1. **Product Model** - [src/models/](src/models/)
   - Database schema not defined
   - Need to create: Product Schema with fields (name, price, description, etc.)

2. **Service Layer** - [src/services/product.service.js](src/services/product.service.js)
   - Methods are stubs with no implementation
   - Need to implement CRUD operations using MongoDB queries

3. **Authentication** - [src/middleware/auth.middleware.js](src/middleware/auth.middleware.js)
   - Only checks token presence
   - Need: JWT verification, token expiration, user identification

4. **Error Handling**
   - Missing try-catch blocks in controllers
   - No global error handling middleware
   - No validation for request data

5. **Utilities** - [src/utils/](src/utils/)
   - Empty folder
   - Could contain helpers for validation, error responses, etc.

---

## 🔐 Security Considerations

### Current Issues

- ⚠️ Authentication is not properly implemented (no token validation)
- ⚠️ No input validation on requests
- ⚠️ No error handling for database operations
- ⚠️ No CORS configuration
- ⚠️ No rate limiting

### Recommended Improvements

1. Implement JWT token verification
2. Add input validation using libraries like Joi or express-validator
3. Add global error handling middleware
4. Configure CORS for cross-origin requests
5. Implement rate limiting
6. Add request logging

---

## 📝 Example Usage Flow

```
Client Request
    ↓
Authentication Middleware (checks Authorization header)
    ↓
Route Handler (/product)
    ↓
Controller (productController.getAllProducts)
    ↓
Service Layer (productService.getAllProducts)
    ↓
MongoDB Database Query
    ↓
Response Back to Client
```

---

## 📚 Environment Variables Template

Create `.env` file:

````
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=

---

## 🔗 Commands Reference

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Run tests (when configured)
npm test
````

//POST, UPDATE, DELETE, GET, PATCH

GET - It is use fetch the information by default GET
POST - It you want to create a new information or want to update any information we can use POST
DELETE - If you want to delete a sepcific info
PATCH - update the info alone

HTTP status code categories

1xx - information
2xx - success
3xx - Redirection
4xx - client error (client side browser or front end)
5xx - server error (backend server)

Common status code followed in industry

200 - GET success
201 - Resources created
204 - Resources deleted
400 - Bad Request
401 - Unauthorized
403 - Forbidden
404 - Not found
409 - conflict
422 - Validation error
500 - Server error

Super Admin (Product owner)

Registered User - Admin/ User
