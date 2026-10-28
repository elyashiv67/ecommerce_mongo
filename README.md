# E-commerce REST API (MongoDB final project)

REST API for managing a virtual store: users, categories, products and orders.

**Stack:** Node.js, Express 5, MongoDB, Mongoose, Zod, Postman.

## Running the project

```bash
npm install
cp .env.example .env    # then put your MongoDB connection string in DB
npm start
```

| Variable | Meaning |
|---|---|
| `HOST` | Host name printed in the startup log (e.g. `localhost`) |
| `PORT` | Server port (default `3000`) |
| `DB`   | MongoDB connection string |

## Postman

Import `postman/ecommerce.postman_collection.json`. The collection has a `baseUrl` variable
(default `http://localhost:4585`) and `userId` / `categoryId` / `productId` / `orderId` variables.
The "create" requests fill them in automatically, so run the folders top to bottom:
Users → Categories → Products → Orders.

## Project structure

```
index.js            app setup, 404 + error handlers
routes/             Express routers (one per resource)
controllers/        request handlers (async/await, try/catch)
schemas/            Mongoose models + validation
middlewares/        validate.js - Zod safeParse() middleware
services/mongoDB.js database connection
services/zod/       Zod schemas for request bodies / params
```

## Data model

- **User**: `name, phone (unique), email (unique), address, role (user | seller | admin)`
- **Category**: `name (unique), desc`
- **Product**: `user_id → User, category_id → Category, title, desc, price, stock (min 0)`
- **Order**: `user_id → User, products: [{ product_id → Product, quantity, total_price }], status, total_price`

## Endpoints

### Users `/user`
| Method | Path | Description |
|---|---|---|
| GET | `/user` | All users |
| GET | `/user/:id` | User by id |
| POST | `/user` | Create user (Zod) |
| PATCH | `/user/:id` | Update user |
| DELETE | `/user/:id` | Delete user (blocked if the user has products / orders) |

### Categories `/category`
| Method | Path | Description |
|---|---|---|
| GET | `/category` | All categories |
| GET | `/category/products-count` | Number of products in each category |
| GET | `/category/:id` | Category by id |
| POST | `/category` | Create category (Zod) |
| PATCH | `/category/:id` | Update category |
| DELETE | `/category/:id` | Delete category (blocked if it has products) |

### Products `/product`
| Method | Path | Description |
|---|---|---|
| GET | `/product` | All products |
| GET | `/product/by-category/:id` | Products of a category |
| GET | `/product/by-user/:id` | Products of a seller |
| GET | `/product/:id` | Product by id |
| POST | `/product` | Create product (Zod, checks user + category exist) |
| PATCH | `/product/:id` | Update product |
| DELETE | `/product/:id` | Delete product (blocked if it is in an open order) |

### Orders `/order`
| Method | Path | Description |
|---|---|---|
| GET | `/order` | All orders |
| GET | `/order/by-user/:id` | All orders of a user (with product details) |
| GET | `/order/:id` | Order with populated user + products |
| POST | `/order` | Create order (Zod): checks products exist and stock, calculates prices on the server, decreases stock |
| PATCH | `/order/:id` | Change status (`pending, working, completed, canceled`); canceling returns the stock |

Example order body:
```json
{
  "user_id": "66f0c0ffee0000000000000a",
  "products": [
    { "product_id": "66f0c0ffee0000000000000b", "quantity": 2 },
    { "product_id": "66f0c0ffee0000000000000c", "quantity": 1 }
  ]
}
```

## Status codes

`200` OK · `201` created · `400` invalid data / not enough stock · `404` not found ·
`409` duplicate value or delete blocked by references · `500` server error
