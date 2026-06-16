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

# Technology Stack

| Layer           | Technology                                 |
| --------------- | ------------------------------------------ |
| Frontend        | HTML, CSS, JavaScript, React.js, Bootstrap |
| Backend         | Node.js, Express.js                        |
| Database        | MongoDB                                    |
| API Testing     | Postman                                    |
| Version Control | Git & GitHub                               |


# Working Flow

Step 1: User opens the application.

Step 2: User registers or logs in.

Step 3: After successful authentication:

User can view all products.

User can search products.

User can view product details.

Step 4: Admin logs in.

Step 5: Admin performs:

Update Product

Delete Product

View Products

Step 6: All data is stored and retrieved from MongoDB through REST APIs built with Node.js and Express.js.

# RegisterPage
<img width="1918" height="864" alt="Screenshot 2026-06-16 103120" src="https://github.com/user-attachments/assets/ec2b79d2-70dc-44c3-93a1-61f736386097" />

# LoginPage
<img width="1920" height="870" alt="Screenshot 2026-06-16 104037" src="https://github.com/user-attachments/assets/e595eaa2-bd4e-4f3e-b48a-775381b0ed7d" />

# AdminDashBoard

# AdminHomePage
<img width="1897" height="881" alt="Screenshot 2026-06-16 104147" src="https://github.com/user-attachments/assets/cb2ce64e-439a-4a9c-ab08-a24b026c42c3" />

# Admin_Create_Farmer And Dealer
<img width="1899" height="871" alt="Screenshot 2026-06-16 104222" src="https://github.com/user-attachments/assets/dff27e3a-0384-44f1-9766-50f889187600" />

# ShowFarmers
<img width="1886" height="862" alt="Screenshot 2026-06-16 104401" src="https://github.com/user-attachments/assets/13531f19-bea6-40af-9de3-30c10ec24168" />

# ShowDealers
<img width="1898" height="869" alt="Screenshot 2026-06-16 104445" src="https://github.com/user-attachments/assets/8ea17a32-c4b3-4cd2-81b4-57dbc8dacb8e" />

# FarmerDashBoard

# FarmerHomePage
<img width="1896" height="862" alt="Screenshot 2026-06-16 104644" src="https://github.com/user-attachments/assets/ce7469b1-c424-422b-8d60-ed9a4c2183c9" />

# FarmerUploadProducts
<img width="1899" height="876" alt="Screenshot 2026-06-16 104805" src="https://github.com/user-attachments/assets/6c2ad951-9ff7-48b3-ac86-e3264bff0d1a" />

# Show all Products
<img width="1899" height="776" alt="Screenshot 2026-06-16 104857" src="https://github.com/user-attachments/assets/cf91b252-ebb1-4791-aff9-a082c93c08bd" />

# Orders Recevied
<img width="1911" height="869" alt="Screenshot 2026-06-16 104934" src="https://github.com/user-attachments/assets/97fa788e-f518-49b2-9ae3-792aa35858c6" />

# ShowDealers
<img width="1898" height="871" alt="Screenshot 2026-06-16 105052" src="https://github.com/user-attachments/assets/3cfdd4e1-a60b-449a-b3df-a95c63245bde" />

# DealersDashBoard

# DealerHomePage
<img width="1905" height="889" alt="Screenshot 2026-06-16 105312" src="https://github.com/user-attachments/assets/27da90d4-6f76-47c3-8301-16b0d7e585d1" />

# ShowMyOrders
<img width="1894" height="867" alt="Screenshot 2026-06-16 105400" src="https://github.com/user-attachments/assets/7af40c1b-c0e1-43c5-b592-68a281023aec" />

#  CustomerDashBoard

# CustomerHomePage
<img width="1896" height="867" alt="Screenshot 2026-06-16 105509" src="https://github.com/user-attachments/assets/30a6afdc-f8fc-43ca-91d7-f8b12127ef99" />

# AboutUs
<img width="1890" height="865" alt="Screenshot 2026-06-16 105547" src="https://github.com/user-attachments/assets/6ad3d975-5301-488e-8427-49c4d9e863b2" />

<img width="1898" height="880" alt="Screenshot 2026-06-16 105620" src="https://github.com/user-attachments/assets/38c7580e-32c0-4f84-8d1f-a44f30de27d0" />

<img width="1903" height="847" alt="Screenshot 2026-06-16 105652" src="https://github.com/user-attachments/assets/69ba0615-8ddb-4e80-b75a-d93a733f6962" />

<img width="1899" height="630" alt="Screenshot 2026-06-16 105720" src="https://github.com/user-attachments/assets/91528f95-5c3f-4c2d-b9ed-2c78b1d96a3f" />

<img width="1901" height="845" alt="Screenshot 2026-06-16 105748" src="https://github.com/user-attachments/assets/a75880a1-3ecf-4a23-b4f0-b67c74b4c1e4" />

# Products
<img width="1895" height="763" alt="Screenshot 2026-06-16 105843" src="https://github.com/user-attachments/assets/5090d6cf-5a4c-44c2-86e0-b89e2dacc792" />
<img width="1891" height="639" alt="Screenshot 2026-06-16 105910" src="https://github.com/user-attachments/assets/ea17209c-5d95-4fb7-a8a9-0f29e70b3c5a" />
<img width="1854" height="724" alt="Screenshot 2026-06-16 105937" src="https://github.com/user-attachments/assets/28664bdc-56bd-42a3-a1b2-748a395ca062" />

# MyOrders
<img width="1903" height="871" alt="Screenshot 2026-06-16 110034" src="https://github.com/user-attachments/assets/9eec90bf-9f96-4e9a-b6b8-049a28fcb0a4" />

# Tracking My Order
<img width="1902" height="881" alt="Screenshot 2026-06-16 110104" src="https://github.com/user-attachments/assets/a881fa79-3625-4a2f-9de0-dc7deb7314c4" />
<img width="1900" height="743" alt="Screenshot 2026-06-16 110142" src="https://github.com/user-attachments/assets/70c25a0c-499b-4011-a3d5-955cb0a93132" />

# Reviews Page
<img width="1895" height="874" alt="Screenshot 2026-06-16 110212" src="https://github.com/user-attachments/assets/7155d93d-e30c-438b-8629-511b06062004" />

# Responsiveness 
<img width="1793" height="821" alt="Screenshot 2026-06-16 110329" src="https://github.com/user-attachments/assets/8f396c3e-6ea8-4a18-92a9-6006ce64bb2e" />






















