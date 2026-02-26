# Story 1: User Registration with Secure Validation (Isolated)

This folder contains the isolated code for the User Registration story (SRP-2). All logic unrelated to registration (login, profile, admin, etc.) has been pruned.

## Structure

```
Story1_Registration/
├── backend/
│   └── src/main/java/com/sunline/sunline_backend/
│       ├── controller/AuthController.java (Register endpoint only)
│       ├── dto/request/RegisterRequest.java (Validation logic)
│       ├── entity/User.java (Basic User entity)
│       ├── repository/UserRepository.java (Email uniqueness check)
│       └── service/UserService.java (Registration logic)
└── frontend/
    └── src/
        ├── pages/RegisterPage.jsx (Registration UI & validation)
        └── services/
            ├── api.js (Axios configuration)
            └── authService.js (Register API call only)
```

## How to Run This Story Independently

### 1. Prerequisites
- **MySQL Server**: Ensure MySQL is running on your machine.
- **Java 17+**: Installed and configured (for backend).
- **Node.js**: Installed (for frontend).
- **Maven**: (Optional if using `./mvnw`, but good to have).

### 2. Backend Setup
1.  **Configure Environment**: (Optional) Update `backend/src/main/resources/application.properties` with your MySQL username and password if different from `root/root`. The database `sunline_db` will be created automatically.
2.  **Run Backend**:
    - Open a terminal in `Story1_Registration/backend`.
    - Run: `mvn spring-boot:run`

### 3. Frontend Setup
1.  **Navigate to Frontend**: Open a new terminal in `Story1_Registration/frontend`.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Run Frontend**:
    ```bash
    npm run dev
    ```
4.  **Access**: Open [http://localhost:5173/register](http://localhost:5173/register) in your browser.

## Features Included
- **Scenario 1 - Successful Registration**: Submit the form and verify the success message.
- **Scenario 2 - Duplicate Email**: Try registering with the same email twice.
- **Scenario 3 - Weak Password**: Try a password like `password123`.
- **Scenario 4 - Password Mismatch**: Enter different passwords in the two fields.
- **Scenario 5 - Mandatory Fields**: Leave fields empty and try to submit.
