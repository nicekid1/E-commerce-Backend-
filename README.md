# E-commerce API

### Version 1.0.0  
**API Documentation for the E-commerce System**  

---

## Project Overview 📜  

The **E-commerce API** is a complete backend system designed for an online store. It includes features such as user authentication, product management, shopping cart, orders, reviews, and payment integration with the **Zarinpal Payment Gateway**. The admin can manage users, products, comments, and discount codes, providing full control over the store's operations.  

This project is built using **Node.js**, **Express**, **MongoDB**, and **JWT** for secure authentication.

---

## Technologies Used 🛠️  

- **Node.js**  
- **Express.js**  
- **MongoDB** & **Mongoose**  
- **JWT** for user authentication  
- **Swagger** for API documentation  
- **Zarinpal** Payment Gateway  
- **Express Validator** for request validation  

---

## Features ✨  

1. **User Authentication**  
   - Register and log in users  
   - Manage user favorites  

2. **Admin Panel**  
   - Admin user registration and login  
   - Manage users, products, comments, and discount codes  

3. **Product Management**  
   - Add, update, and delete products  
   - View products by category and similar products  

4. **Shopping Cart & Orders**  
   - Add products to the cart  
   - Place and view user orders  

5. **Reviews**  
   - Add and view product reviews  

6. **Payment Integration**  
   - Payment processing with **Zarinpal**  

7. **Discount Codes**  
   - Create and manage discount codes  

---

## API Endpoints 📚  

### User Routes  
| Method | Endpoint                        | Description                              |
|--------|---------------------------------|------------------------------------------|
| POST   | `/users/register`              | Register a new user                      |
| POST   | `/users/login`                 | Log in an existing user                  |
| POST   | `/users/favorites/{productId}` | Add a product to the user's favorites    |
| DELETE | `/users/favorites/{productId}` | Remove a product from favorites          |
| GET    | `/users/favorites`             | Get a list of the user's favorite products|

### Admin Routes  
| Method | Endpoint                         | Description                              |
|--------|----------------------------------|------------------------------------------|
| POST   | `/admin/register`               | Register a new admin                     |
| POST   | `/admin/login`                  | Admin login                              |
| GET    | `/admin/users`                  | Get a list of all users                  |
| DELETE | `/admin/users/{id}`             | Delete a user by ID                      |
| GET    | `/admin/products`               | Get a list of all products               |
| DELETE | `/admin/products/{id}`          | Delete a product by ID                   |
| GET    | `/admin/comments`               | Get a list of all comments               |
| DELETE | `/admin/comments/{id}`          | Delete a comment by ID                   |
| POST   | `/admin/discounts`              | Create a new discount code               |
| GET    | `/admin/discounts`              | Get all discount codes                   |
| DELETE | `/admin/discounts/{id}`         | Delete a discount code by ID             |

### Product Routes  
| Method | Endpoint                     | Description                            |
|--------|------------------------------|----------------------------------------|
| POST   | `/products`                  | Create a new product                   |
| GET    | `/products`                  | Get all products (filter by category)   |
| GET    | `/products/{id}`             | Get product details by ID              |
| PUT    | `/products/{id}`             | Update product by ID                   |
| DELETE | `/products/{id}`             | Delete a product by ID                 |

### Cart & Orders  
| Method | Endpoint                    | Description                              |
|--------|-----------------------------|------------------------------------------|
| POST   | `/cart/{userId}`            | Add product to the user's cart           |
| GET    | `/cart/{userId}`            | Retrieve the user's cart                 |
| POST   | `/orders/{userId}`          | Place a new order                        |
| GET    | `/orders/{userId}`          | Get all orders for a user                |

### Payment Routes  
| Method | Endpoint              | Description                             |
|--------|-----------------------|-----------------------------------------|
| POST   | `/payment/pay`        | Create a payment link                   |
| GET    | `/payment/verify`     | Verify a payment after redirect         |

### Categories Routes  
| Method | Endpoint               | Description                              |
|--------|------------------------|------------------------------------------|
| POST   | `/categories`          | Add a new category                       |
| GET    | `/categories`          | Retrieve all categories                  |

### Reviews Routes  
| Method | Endpoint                     | Description                             |
|--------|------------------------------|-----------------------------------------|
| POST   | `/reviews/{productId}`        | Add a review for a product              |
| GET    | `/reviews/{productId}`        | Get reviews for a specific product      |

---

## Setup & Installation 🚀  

### Prerequisites  
- **Node.js** version `>=14.x`  
- **MongoDB** running and connected  
- **Postman** or a similar tool to test the API  

### Steps to Install  

1. **Clone the repository**  
   ```bash
   git clone https://github.com/yourusername/ecommerce-api.git
   cd ecommerce-api
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Set up environment variables**  
   Rename the `sample.env` file to `.env` and fill in the necessary values:  
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ZARINPAL_MERCHANT_ID=your_zarinpal_merchant_id
   ```

4. **Start the server**  
   ```bash
   npm start
   ```

5. **Access the API**  
   The project will be available at:  
   ```
   http://localhost:5000
   ```  
   The API documentation can be accessed at:  
   ```
   http://localhost:5000/api-docs
   ```

---

## Developer Contact ✍️  

- **Name** :ali mohtarami 
- **Email**:alimohtarami5@gmail.com  
---

