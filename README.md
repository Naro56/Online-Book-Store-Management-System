📚 Online Book Store Management System
A modern web application for users to browse, purchase, and manage books online — with role-based access for users and admins.

<br />
✨ Features
🔒 User Authentication (Login & Register)

📚 Browse Popular and Latest Books

🛒 Add to Cart and Checkout System

🧾 View Orders and Order Details

🛠️ Admin Panel to Manage Books, Orders, and Users

<br />
🛠 Tech Stack

Frontend	Backend	Database
React.js	Spring Boot (Java)	MySQL
<br />
📁 Project Structure
bash
Copy
Edit
Online-Book-Store-Management-System/
├── backend/    # Spring Boot Application
└── frontend/   # React.js Application
<br />
⚙️ Installation and Setup Instructions
1️⃣ Clone the Repository
bash
Copy
Edit
git clone https://github.com/Naro56/Online-Book-Store-Management-System.git
cd Online-Book-Store-Management-System
<br />
2️⃣ Setup Backend (Spring Boot)
Navigate to the backend folder:

bash
Copy
Edit
cd backend
Update your database credentials inside:

src/main/resources/application.properties

Example:

properties
Copy
Edit
spring.datasource.url=jdbc:mysql://localhost:3306/your_database_name
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
Make sure MySQL is running and database is created.

To run the backend server:

bash
Copy
Edit
./mvnw spring-boot:run
or run BackendApplication.java from your IDE.

Backend will run at ➔ http://localhost:8080

<br />
3️⃣ Setup Frontend (React.js)
Open a new terminal, navigate to frontend folder:

bash
Copy
Edit
cd frontend
Install dependencies:

bash
Copy
Edit
npm install
Start the React development server:

bash
Copy
Edit
npm start
Frontend will run at ➔ http://localhost:3000

<br />