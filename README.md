📚 Online Book Store Management System
A modern, full-stack web application designed for users to browse, purchase, and manage books online, featuring role-based access for customers and administrators.
✨ Features
For Users

🔒 User Authentication: Secure login and registration with JWT-based authentication.
📚 Browse Books: Explore popular, latest, and categorized books with search and filter options.
🛒 Cart & Checkout: Add books to cart, review items, and complete purchases with a seamless checkout process.
🧾 Order Management: View order history and detailed order information.

For Admins

🛠️ Admin Dashboard: Manage books (add, update, delete), monitor orders, and oversee user accounts.
📊 Analytics: View sales and inventory insights (optional, if implemented).

🛠 Tech Stack



Category
Technology



Frontend
React.js, Axios, Bootstrap/Material-UI


Backend
Spring Boot (Java), Spring Security, JPA/Hibernate


Database
MySQL


Tools
Maven, npm, Git


📁 Project Structure
Online-Book-Store-Management-System/
├── backend/                # Spring Boot backend application
│   ├── src/                # Source code
│   └── pom.xml             # Maven dependencies
├── frontend/               # React.js frontend application
│   ├── src/                # Source code
│   └── package.json        # npm dependencies
├── README.md               # Project documentation
└── .gitignore              # Ignored files for Git

⚙️ Installation and Setup Instructions
Follow these steps to set up and run the project locally.
Prerequisites

Java 17+ (for Spring Boot)
Node.js 16+ (for React.js)
MySQL 8.0+ (database)
Git (for cloning the repository)
Maven (for backend dependency management)

1️⃣ Clone the Repository
git clone https://github.com/Naro56/Online-Book-Store-Management-System.git
cd Online-Book-Store-Management-System

2️⃣ Set Up the Backend (Spring Boot)

Navigate to the backend directory:
cd backend


Configure the database in src/main/resources/application.properties:
spring.datasource.url=jdbc:mysql://localhost:3306/bookstore_db
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update


Ensure MySQL is running and create a database named bookstore_db:
CREATE DATABASE bookstore_db;


Run the backend server:
./mvnw spring-boot:run

Alternatively, run BackendApplication.java from your IDE.
The backend will be accessible at: http://localhost:8080


3️⃣ Set Up the Frontend (React.js)

Open a new terminal and navigate to the frontend directory:
cd frontend


Install dependencies:
npm install


Start the React development server:
npm start

The frontend will be accessible at: http://localhost:3000


🚀 Usage

Access the Application:

Open http://localhost:3000 in your browser.
Register a new user account or log in with existing credentials.
Admins can access the dashboard using admin credentials (set up via backend).


Explore Features:

Browse books, add to cart, and place orders as a user.
Manage books, orders, and users via the admin panel.



🛠️ API Endpoints (Optional)
Key API endpoints for reference:



Endpoint
Method
Description



/api/auth/register
POST
Register a new user


/api/auth/login
POST
Authenticate and return JWT


/api/books
GET
Retrieve all books


/api/cart/add
POST
Add book to cart


/api/orders
GET
View user orders


/api/admin/books
POST
Add a new book (admin only)



Note: Refer to the backend code or use tools like Postman to explore all available endpoints.

📝 Additional Notes

Environment Variables: For production, consider using environment variables for sensitive data (e.g., database credentials).
Security: Ensure HTTPS is enabled in production and validate all user inputs to prevent vulnerabilities.
Testing: Add unit and integration tests for backend (JUnit) and frontend (Jest or React Testing Library) for robustness.

🤝 Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Commit your changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a Pull Request.

📜 License
This project is licensed under the MIT License.
📬 Contact
For questions or feedback, open an issue on the GitHub repository.
