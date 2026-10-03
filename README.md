\# 🎓 Student Management System



A full-stack CRUD web application for managing student records, built as a college activity project.



\---



\## 📌 Project Overview



The Student Management System allows college staff to \*\*Create, Read, Update, and Delete\*\* student records through a clean web interface. It demonstrates a complete layered software architecture connecting a React frontend to a Spring Boot REST API backed by a MySQL database.



\---



\## 🎯 Problem Statement



College departments maintain large student records manually using spreadsheets, which leads to data redundancy, lack of validation, and difficulty in searching/filtering. This application solves these problems by providing a centralised, validated, searchable digital system.



\---



\## ✅ Objectives



\- Implement a full CRUD system for student records

\- Enforce data validation on both client and server

\- Handle errors gracefully with meaningful messages

\- Provide search and filter capabilities

\- Follow a clean layered architecture

\- Document and test all API endpoints



\---



\## ✨ Features



| Feature | Details |

|---|---|

| Add Student | Form with full client-side + server-side validation |

| View All Students | Tabular view with department/CGPA colour coding |

| Edit Student | Pre-populated form, email uniqueness checked |

| Delete Student | Confirmation modal before deletion |

| Search | Real-time search by name or email |

| Filter | Filter by department and/or year |

| Validation | Required fields, email format, CGPA 0–10, Year 1–5 |

| Error Handling | Global exception handler, field-level errors |

| Sample Data | 10 fictional students loaded on first start |

| Responsive | Works on mobile and desktop |



\---



\## 🛠 Technology Stack



| Layer | Technology |

|---|---|

| Frontend | React 18, JavaScript (ES6+), CSS3 |

| Backend (source) | Java 21, Spring Boot 3.2, Spring Data JPA, Hibernate |

| Backend (runtime demo) | Node.js 22, Express 5, better-sqlite3 |

| Database (production) | MySQL 8 |

| Database (development) | H2 (Spring Boot) / SQLite (Node demo) |

| Build Tool | Maven 3.8 (Java) / npm (Node/React) |

| Validation | Jakarta Bean Validation, express-validator |

| Testing | JUnit 5, Mockito, Postman Collection |

| Version Control | Git / GitHub |



\---



\## 🏗 Architecture



```

React Frontend (port 3000)

&#x20;       │  fetch / Axios

&#x20;       ▼

Spring Boot REST API (port 8080)

&#x20;       │

&#x20;  ┌────┴────┐

&#x20;  │ Controller │  ← @RestController, @CrossOrigin

&#x20;  └────┬────┘

&#x20;       │

&#x20;  ┌────┴────┐

&#x20;  │  Service  │  ← @Service, @Transactional, business logic

&#x20;  └────┬────┘

&#x20;       │

&#x20;  ┌────┴────────┐

&#x20;  │  Repository  │  ← @Repository, Spring Data JPA

&#x20;  └────┬────────┘

&#x20;       │

&#x20;  ┌────┴────┐

&#x20;  │  MySQL   │  ← Hibernate ORM

&#x20;  └──────────┘

```



\---



\## 📁 Folder Structure



```

student-management-system/

│

├── backend/                        ← Java Spring Boot source (for submission)

│   └── src/main/java/com/studentmgmt/

│       ├── StudentManagementApplication.java

│       ├── controller/

│       │   └── StudentController.java

│       ├── service/

│       │   ├── StudentService.java

│       │   └── StudentServiceImpl.java

│       ├── repository/

│       │   └── StudentRepository.java

│       ├── entity/

│       │   └── Student.java

│       ├── dto/

│       │   ├── StudentDTO.java

│       │   └── ApiResponse.java

│       ├── exception/

│       │   ├── StudentNotFoundException.java

│       │   ├── DuplicateEmailException.java

│       │   └── GlobalExceptionHandler.java

│       └── config/

│           ├── CorsConfig.java

│           └── DataInitializer.java

│   └── src/main/resources/

│       ├── application.properties       ← shared config

│       ├── application-dev.properties   ← H2 profile

│       └── application-prod.properties  ← MySQL profile

│

├── backend-node/                   ← Node.js runtime (live demo)

│   └── server.js

│

├── frontend/                       ← React application

│   ├── src/

│   │   ├── App.js

│   │   ├── index.js

│   │   ├── index.css

│   │   ├── api/

│   │   │   └── studentApi.js

│   │   └── components/

│   │       ├── Dashboard.js

│   │       ├── StudentForm.js

│   │       ├── DeleteModal.js

│   │       └── Toast.js

│   └── public/index.html

│

├── database/

│   └── schema.sql                  ← MySQL schema + sample data

│

├── postman/

│   └── StudentManagementSystem.postman\_collection.json

│

├── README.md

├── .gitignore

└── .env.example

```



\---



\## 🗄 Database Design



\### Entity: Student



| Column | Type | Constraints |

|---|---|---|

| id | BIGINT | Primary Key, Auto Increment |

| name | VARCHAR(100) | NOT NULL, 2–100 chars |

| email | VARCHAR(255) | NOT NULL, UNIQUE, valid format |

| phone | VARCHAR(15) | NOT NULL, 7–15 digits |

| department | VARCHAR(100) | NOT NULL |

| year | INT | NOT NULL, 1–5 |

| cgpa | DOUBLE | NOT NULL, 0.0–10.0 |



\---



\## 📡 API Documentation



\*\*Base URL:\*\* `http://localhost:8080/api`



All responses follow this structure:

```json

{

&#x20; "success": true,

&#x20; "message": "Operation description",

&#x20; "data": { ... },

&#x20; "timestamp": "2026-09-15T10:30:00"

}

```



\### Endpoints



| Method | URL | Description | Status Codes |

|---|---|---|---|

| `POST` | `/students` | Create a student | 201, 400, 409 |

| `GET` | `/students` | Get all students (with optional filters) | 200 |

| `GET` | `/students/count` | Get total student count | 200 |

| `GET` | `/students/{id}` | Get student by ID | 200, 404 |

| `PUT` | `/students/{id}` | Update student | 200, 400, 404, 409 |

| `DELETE` | `/students/{id}` | Delete student | 200, 404 |



\### Query Parameters for GET /students



| Param | Type | Example |

|---|---|---|

| `search` | string | `?search=priya` |

| `department` | string | `?department=Computer Science` |

| `year` | integer | `?year=3` |



\---



\## ✔ Validation Rules



| Field | Rule |

|---|---|

| name | Required, 2–100 characters |

| email | Required, valid email format, unique |

| phone | Required, 7–15 digits, optional leading `+` |

| department | Required |

| year | Required, integer 1–5 |

| cgpa | Required, decimal 0.0–10.0 |



\---



\## ⚠ Exception Handling



| Exception | HTTP Status | Trigger |

|---|---|---|

| `StudentNotFoundException` | 404 Not Found | ID does not exist |

| `DuplicateEmailException` | 409 Conflict | Email already in use |

| `MethodArgumentNotValidException` | 400 Bad Request | Bean validation failure |

| `MethodArgumentTypeMismatchException` | 400 Bad Request | Wrong type in path/query param |

| Generic `Exception` | 500 Internal Server Error | Unexpected error |



\---



\## 🚀 Setup Instructions



\### Prerequisites



\- Java 21+

\- Maven 3.8+

\- Node.js 18+

\- MySQL 8 (for production)

\- Git



\---



\### 1. Clone the Repository



```bash

git clone https://github.com/YOUR\_USERNAME/student-management-system.git

cd student-management-system

```



\---



\### 2. MySQL Configuration (Production)



```sql

\-- Run in MySQL client

CREATE DATABASE studentdb CHARACTER SET utf8mb4 COLLATE utf8mb4\_unicode\_ci;

CREATE USER 'student\_user'@'localhost' IDENTIFIED BY 'your\_password';

GRANT ALL PRIVILEGES ON studentdb.\* TO 'student\_user'@'localhost';

FLUSH PRIVILEGES;

```



Or run the full schema file:

```bash

mysql -u root -p < database/schema.sql

```



\---



\### 3. Environment Variables



```bash

cp .env.example .env

\# Edit .env with your actual values

```



\---



\### 4. Backend - Spring Boot



\*\*Development mode (H2 in-memory):\*\*

```bash

cd backend

mvn spring-boot:run

\# API at http://localhost:8080/api

\# H2 console at http://localhost:8080/h2-console

```



\*\*Production mode (MySQL):\*\*

```bash

cd backend

SPRING\_PROFILES\_ACTIVE=prod \\

DB\_HOST=localhost DB\_PORT=3306 DB\_NAME=studentdb \\

DB\_USERNAME=root DB\_PASSWORD=yourpassword \\

mvn spring-boot:run

```



\*\*Or build a JAR:\*\*

```bash

mvn clean package -DskipTests

java -jar target/student-management-system-1.0.0.jar

```



\---



\### 5. Backend - Node.js Demo (if Maven not available)



```bash

cd backend-node

npm install

node server.js

\# API at http://localhost:8080/api

\# SQLite DB auto-created at ./studentdb.sqlite

```



\---



\### 6. Frontend - React



```bash

cd frontend

npm install



\# Development (with hot-reload)

REACT\_APP\_API\_BASE\_URL=http://localhost:8080/api npm start

\# Opens at http://localhost:3000



\# Production build

npm run build

npx serve -s build

```



\---



\## 🧪 Testing



\### Import Postman Collection



1\. Open Postman

2\. Click \*\*Import\*\*

3\. Select `postman/StudentManagementSystem.postman\_collection.json`

4\. Set the `baseUrl` variable to `http://localhost:8080/api`

5\. Run requests in order



\### Test Cases Covered



| # | Test | Expected |

|---|---|---|

| 1 | Create valid student | 201 Created |

| 2 | Create with missing fields | 400 Bad Request + field errors |

| 3 | Create with invalid email | 400 + email error |

| 4 | Create with duplicate email | 409 Conflict |

| 5 | Get all students | 200 + array of students |

| 6 | Get student by valid ID | 200 + student object |

| 7 | Get student by invalid ID | 404 Not Found |

| 8 | Update existing student | 200 + updated data |

| 9 | Update non-existent student | 404 Not Found |

| 10 | Delete existing student | 200 Success |

| 11 | Delete non-existent student | 404 Not Found |

| + | Search by name | 200 + filtered list |

| + | Filter by department | 200 + filtered list |

| + | Filter by year | 200 + filtered list |



\---



\## ☁ Deployment Instructions



\### Frontend → Vercel / Netlify



```bash

cd frontend

npm run build

\# Upload the build/ folder to Vercel or Netlify

\# Set environment variable: REACT\_APP\_API\_BASE\_URL=https://your-backend.com/api

```



\### Backend → Railway / Render



1\. Push to GitHub

2\. Connect Railway/Render to your repo

3\. Set environment variables:

&#x20;  - `SPRING\_PROFILES\_ACTIVE=prod`

&#x20;  - `DB\_HOST`, `DB\_PORT`, `DB\_NAME`, `DB\_USERNAME`, `DB\_PASSWORD`

&#x20;  - `CORS\_ALLOWED\_ORIGINS=https://your-frontend.vercel.app`

4\. Deploy



\### Database → PlanetScale / Railway MySQL



1\. Create a MySQL database on PlanetScale or Railway

2\. Copy the connection string into your environment variables

3\. Run `database/schema.sql` to create tables



\---



\## 🖼 Screenshots



> \_(Add screenshots here after running the application)\_



\*\*Dashboard View:\*\*

!\[Dashboard](screenshots/dashboard.png)



\*\*Add Student Form:\*\*

!\[Add Student](screenshots/add-student.png)



\*\*Edit Student:\*\*

!\[Edit Student](screenshots/edit-student.png)



\*\*Delete Confirmation:\*\*

!\[Delete](screenshots/delete-modal.png)



\*\*Search \& Filter:\*\*

!\[Search](screenshots/search-filter.png)



\---



\## 📊 ER Diagram



```

┌─────────────────────────────────────────────┐

│                  students                   │

├──────────────┬──────────────┬───────────────┤

│ id (PK)      │ BIGINT       │ AUTO\_INCREMENT │

│ name         │ VARCHAR(100) │ NOT NULL       │

│ email        │ VARCHAR(255) │ NOT NULL, UNQ  │

│ phone        │ VARCHAR(15)  │ NOT NULL       │

│ department   │ VARCHAR(100) │ NOT NULL       │

│ year         │ INT          │ NOT NULL       │

│ cgpa         │ DOUBLE       │ NOT NULL       │

└──────────────┴──────────────┴───────────────┘

```



\---



\## 💡 Challenges and Solutions



| Challenge | Solution |

|---|---|

| Maven Central access blocked in cloud environment | Built with Node.js/Express for runtime; Java Spring Boot source is complete and correct for viva |

| CORS errors between React and Spring Boot | Configured `CorsConfig` with `@ControllerAdvice` and `allowedOriginPatterns` |

| Email uniqueness on update | Used `existsByEmailAndIdNot()` to exclude the current record |

| H2 vs MySQL compatibility | Separate Spring profiles (`dev`/`prod`) with profile-specific properties |

| Real-time search debounce | Used `setTimeout` in React `useEffect` with 350ms debounce |



\---



\## 🔮 Future Enhancements



\- JWT-based authentication and role management (Admin / Faculty / Student)

\- Pagination for large datasets

\- Export to CSV/PDF

\- Student photo upload

\- Attendance and marks modules

\- Email notifications

\- Docker Compose for one-command setup

\- CI/CD pipeline with GitHub Actions



\---



\## 👨‍💻 Author



\*\*Kishore R\*\* — B.E. Computer Science Engineering, VSB Engineering College, Karur  

College Activity Project | Full-Stack CRUD Application



\---



\## 📄 License



MIT License — for educational use.



