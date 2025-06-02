# 🚀 My-Store-Management Backend

## 📌 Project Overview
RESTful API for store management system with:
- JWT Authentication
- Role-based Access Control
- Inventory Management
- Sales Tracking

## 🛠️ Tech Stack
- **Runtime**: Node.js 20.x
- **Framework**: Express 4.x
- **ORM**: TypeORM 0.3.x
- **Database**: PostgreSQL 16.x
- **Auth**: JWT

>## 🌐 Some API Endpoints Of User
>POST /Usuario/auth - User authentication
>POST /Usuario/change/pass - Change password (authenticated)
>GET /Usuario - Get all users (authenticated)
>GET /Usuario/:ID - Get user by ID (authenticated)
>POST /Usuario/createUsuario - Create new user (authenticated)
>PUT /Usuario/updateUsuario/:ID - Update user (authenticated)
>DELETE /Usuario/deleteUsuario/:ID - Delete user (authenticated)
>POST /Usuario/api/filtrar - Filter users (authenticated)
>POST /Usuario/ordenar/all - Sort users (authenticated)
>GET /Usuario/tiene_permiso/:id_usuario/:id_permiso - Check if user has permission

## 🗄️ Entity Relationship Diagram of the Database
![Database ER Diagram](./documentatio/ERD_DB.jpg)

## 📚 Additional Documentation
### Business Diagram
![Business](./documentatio/Business%20Diagram.png)

### Object Diagram
![Object](./documentatio/Object%20Diagram.png)

### Flow Diagram of Sell
![Flow](./documentatio/Frow%20Diagram.png)

>## 💻 Local Installation
>1. Create an empty PostgreSQL database with a name of your choice (e.g. "My-Store-Management-DB")
>2. Locate the "DB_backup.sql" file and restore it into your newly created database
>3. Run "npm install" or "yarn install" in the project root to install dependencies
>4. Create a ".env" file in the project root with the following structure:
>DB_HOST=localhost #Database URL
>DB_PORT=5432 #Database port
>DB_USERNAME=postgres #Your PostgreSQL username
>DB_PASSWORD=password #Your PostgreSQL password
>DB_NAME=My-Store-Management-DB #The database name you created
>5. Open a terminal in the project root and execute "npm start" to launch the server
>6. If all steps were followed correctly, the server should run on port 4000
>7. You can obtain an authentication token by making an HTTP request to:
>POST http://localhost:4000/Usuario/auth
>body: {username: administradorGeneral, password: 123456}
