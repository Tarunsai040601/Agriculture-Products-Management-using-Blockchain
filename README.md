# Title :- Agriculture-Products-Management-using-Blockchain

# Introduction
Agriculture Products Management System is a full-stack web application developed to simplify the buying and selling of agricultural products. The main objective of this project is to provide a digital platform where farmers or sellers can showcase their products and customers can easily browse and view them online.

In this project, I developed both the frontend and backend modules. The application allows users to register and log in securely, view different categories of agricultural products, search for products, and view detailed information about each product. Administrators can manage products by adding, updating, or deleting product information.

I implemented a responsive and user-friendly interface using HTML, CSS, JavaScript, React.js, and Bootstrap. For the backend, I used Node.js and Express.js to create RESTful APIs, and MongoDB was used as the database to store user and product information.

# SourceCode : https://github.com/Tarunsai040601/Agriculture-Products-Management-using-Blockchain

# LiveProject : https://agriculture-products-management-usi.vercel.app/

# Flow Diagram:
                    +----------------+
                    |     User       |
                    +----------------+
                             |
                             v
                  +-------------------+
                  | Login / Register  |
                  +-------------------+
                             |
                     Authentication
                             |
               +-------------+-------------+
               |                           |
               v                           v
      +----------------+         +----------------+
      | User Dashboard |         | Admin Dashboard|
      +----------------+         +----------------+
               |                           |
      ------------------         -----------------------
      |        |       |         |        |            |
      v        v       v         v        v            v
 View     Search    Product   Add     Update      Delete
Products Products   Details Product   Product     Product
      |        |       |         |        |            |
      -----------------------------------------------
                             |
                             v
                    +----------------+
                    |    MongoDB     |
                    +----------------+

# Project Architecture (Skeleton Structure)

Agriculture-Products-Management
│
├── client/                 (Frontend - React)
│   │
│   ├── public/
│   │
│   └── src/
│       │
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── ProductCard.jsx
│       │   └── SearchBar.jsx
│       │
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Products.jsx
│       │   ├── ProductDetails.jsx
│       │   └── AdminDashboard.jsx
│       │
│       ├── services/
│       │   └── api.js
│       │
│       ├── App.jsx
│       └── main.jsx
│
├── server/                 (Backend - Node.js)
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Product.js
│   │
│   ├── controllers/
│   │   ├── userController.js
│   │   └── productController.js
│   │
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── productRoutes.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── app.js
│   └── server.js
│
├── package.json
│
└── README.md

# Key Goals

Provide a user-friendly interface for viewing agricultural products.

Enable secure user authentication.

Allow administrators to manage products efficiently.

Store and retrieve data using a database.

Build a scalable full-stack application using modern web technologies.
