
# Modern CMS Application

This is a full-stack Content Management System (CMS) application built with React for the frontend and Node.js/Express for the backend, using a MySQL database.

## Features

*   **User Authentication:** Secure login and registration with CAPTCHA.
*   **Content Management:**
    *   Create, Read, Update, and Delete (CRUD) posts.
    *   Manage pages (basic structure).
    *   Media library with upload functionality.
*   **Admin Dashboard:** Overview of site analytics and quick actions.
*   **Settings:**
    *   General site settings.
    *   Theme customization (Light/Dark mode).
    *   User password change functionality.
*   **Responsive Design:** Adapts to different screen sizes.
*   **About Us Page:** Static page with embedded Google Maps.

## Project Structure

*   `/`: Frontend React application (Vite based)
    *   `src/`: Main source code for the React app.
        *   `components/`: (Implicit) Reusable UI components.
        *   `pages/` or `views/`: (Implicit) Page-level components like `LoginPage.jsx`, `RegistrationPage.jsx`, `AboutUsPage.jsx`.
        *   `App.jsx`: Main application component with routing and state management.
        *   `main.jsx`: Entry point for the React application.
*   `server/`: Backend Node.js/Express application
    *   `routes/`: API route definitions (e.g., `auth.js`, `posts.js`).
    *   `db.js`: Database connection setup (MySQL).
    *   `index.js`: Main server entry point.

## Technologies Used

**Frontend:**

*   React 19
*   Vite
*   JavaScript (ES6+)
*   CSS (with CSS Variables for theming)
*   ESLint

**Backend:**

*   Node.js
*   Express.js
*   MySQL2 (for MySQL database interaction)
*   dotenv (for environment variables)
*   CORS

**Development:**

*   `concurrently` to run frontend and backend servers simultaneously.
*   `nodemon` for automatic server restarts during development.

## Prerequisites

*   Node.js (v18.x or later recommended)
*   npm (comes with Node.js)
*   MySQL Server

## Setup and Installation

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <your-repository-url>
    cd cms-app
    ```

2.  **Backend Setup:**
    *   Navigate to the server directory:
        ```bash
        cd server
        ```
    *   Install backend dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env` file in the `server` directory by copying `server/.env.example` (if you create one) or by creating it manually.
        Your `server/.env` should look like this (adjust values as per your MySQL setup):
        ```env
        DB_USER=root
        DB_HOST=localhost
        DB_DATABASE=cms_db
        DB_PASSWORD=your_mysql_password
        DB_PORT=3306
        PORT=5001 # Backend server port
        # JWT_SECRET=your_jwt_secret_key # Add this if/when you implement JWT
        ```
    *   **Database Setup:**
        *   Ensure your MySQL server is running.
        *   Create the database (e.g., `cms_db`) and the necessary tables. You'll need tables for `users` and `posts`.
        *   Example `users` table schema (adjust as needed):
            ```sql
            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL, -- Consider hashing passwords!
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            ```
        *   Example `posts` table schema (adjust as needed):
            ```sql
            CREATE TABLE posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT,
                status VARCHAR(50) DEFAULT 'draft',
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
            ```

3.  **Frontend Setup:**
    *   Navigate back to the project root directory:
        ```bash
        cd ..
        ```
    *   Install frontend dependencies:
        ```bash
        npm install
        ```

## Running the Application

1.  **Start the Backend Server:**
    *   Navigate to the `server` directory:
        ```bash
        cd server
        ```
    *   Start the backend server in development mode (with nodemon):
        ```bash
        npm run dev
        ```
    *   Or, for production:
        ```bash
        npm start
        ```
    The backend will typically run on `http://localhost:5001`.

2.  **Start the Frontend Development Server:**
    *   Open a new terminal.
    *   Navigate to the project root directory (`cms-app`):
        ```bash
        cd /path/to/your/cms-app
        ```
    *   Start the frontend development server:
        ```bash
        npm run dev
        ```
    The frontend will typically run on `http://localhost:5173` (or another port specified by Vite) and will proxy API requests to the backend.

3.  **Run Both Frontend and Backend Concurrently (from the root `cms-app` directory):**
    ```bash
    npm run dev:all
    ```
    This command will start both the Vite frontend development server and the Node.js backend server.

## Available Scripts

**Root Directory (`cms-app`):**

*   `npm run dev`: Starts the Vite frontend development server.
*   `npm run build`: Builds the frontend application for production.
*   `npm run lint`: Lints the frontend code.
*   `npm run preview`: Serves the production build locally.
*   `npm run server:dev`: Starts the backend server in development mode (from the root).
*   `npm run server:start`: Starts the backend server in production mode (from the root).
*   `npm run dev:all`: Starts both frontend and backend development servers concurrently.

**Server Directory (`cms-app/server`):**

*   `npm start`: Starts the backend server.
*   `npm run dev`: Starts the backend server in development mode using `nodemon`.

## API Endpoints (Backend - `/api`)

*   **Auth (`/api/auth`):**
    *   `POST /login`: User login.
    *   `POST /register`: User registration.
    *   `POST /change-password`: Change user password.
*   **Posts (`/api/posts`):**
    *   `GET /`: Get all posts.
    *   `GET /:id`: Get a single post by ID.
    *   `POST /`: Create a new post.
    *   `PUT /:id`: Update an existing post.
    *   `DELETE /:id`: Delete a post.

*(Add more endpoints as you develop them, e.g., for pages, media)*

## Future Enhancements

*   Implement proper password hashing (e.g., using `bcryptjs`).
*   Use JSON Web Tokens (JWT) for session management.
*   Full CRUD functionality for Pages and Media.
*   Advanced role-based access control.
*   More detailed analytics.
*   WYSIWYG editor for content creation.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
```// filepath: c:\Users\Datta Madasu\Desktop\fsad\cms-app\cms-app\README.md
# Modern CMS Application

This is a full-stack Content Management System (CMS) application built with React for the frontend and Node.js/Express for the backend, using a MySQL database.

## Features

*   **User Authentication:** Secure login and registration with CAPTCHA.
*   **Content Management:**
    *   Create, Read, Update, and Delete (CRUD) posts.
    *   Manage pages (basic structure).
    *   Media library with upload functionality.
*   **Admin Dashboard:** Overview of site analytics and quick actions.
*   **Settings:**
    *   General site settings.
    *   Theme customization (Light/Dark mode).
    *   User password change functionality.
*   **Responsive Design:** Adapts to different screen sizes.
*   **About Us Page:** Static page with embedded Google Maps.

## Project Structure

*   `/`: Frontend React application (Vite based)
    *   `src/`: Main source code for the React app.
        *   `components/`: (Implicit) Reusable UI components.
        *   `pages/` or `views/`: (Implicit) Page-level components like `LoginPage.jsx`, `RegistrationPage.jsx`, `AboutUsPage.jsx`.
        *   `App.jsx`: Main application component with routing and state management.
        *   `main.jsx`: Entry point for the React application.
*   `server/`: Backend Node.js/Express application
    *   `routes/`: API route definitions (e.g., `auth.js`, `posts.js`).
    *   `db.js`: Database connection setup (MySQL).
    *   `index.js`: Main server entry point.

## Technologies Used

**Frontend:**

*   React 19
*   Vite
*   JavaScript (ES6+)
*   CSS (with CSS Variables for theming)
*   ESLint

**Backend:**

*   Node.js
*   Express.js
*   MySQL2 (for MySQL database interaction)
*   dotenv (for environment variables)
*   CORS

**Development:**

*   `concurrently` to run frontend and backend servers simultaneously.
*   `nodemon` for automatic server restarts during development.

## Prerequisites

*   Node.js (v18.x or later recommended)
*   npm (comes with Node.js)
*   MySQL Server

## Setup and Installation

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <your-repository-url>
    cd cms-app
    ```

2.  **Backend Setup:**
    *   Navigate to the server directory:
        ```bash
        cd server
        ```
    *   Install backend dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env` file in the `server` directory by copying `server/.env.example` (if you create one) or by creating it manually.
        Your `server/.env` should look like this (adjust values as per your MySQL setup):
        ```env
        DB_USER=root
        DB_HOST=localhost
        DB_DATABASE=cms_db
        DB_PASSWORD=your_mysql_password
        DB_PORT=3306
        PORT=5001 # Backend server port
        # JWT_SECRET=your_jwt_secret_key # Add this if/when you implement JWT
        ```
    *   **Database Setup:**
        *   Ensure your MySQL server is running.
        *   Create the database (e.g., `cms_db`) and the necessary tables. You'll need tables for `users` and `posts`.
        *   Example `users` table schema (adjust as needed):
            ```sql
            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL, -- Consider hashing passwords!
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            ```
        *   Example `posts` table schema (adjust as needed):
            ```sql
            CREATE TABLE posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT,
                status VARCHAR(50) DEFAULT 'draft',
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
            ```

3.  **Frontend Setup:**
    *   Navigate back to the project root directory:
        ```bash
        cd ..
        ```
    *   Install frontend dependencies:
        ```bash
        npm install
        ```

## Running the Application

1.  **Start the Backend Server:**
    *   Navigate to the `server` directory:
        ```bash
        cd server
        ```
    *   Start the backend server in development mode (with nodemon):
        ```bash
        npm run dev
        ```
    *   Or, for production:
        ```bash
        npm start
        ```
    The backend will typically run on `http://localhost:5001`.

2.  **Start the Frontend Development Server:**
    *   Open a new terminal.
    *   Navigate to the project root directory (`cms-app`):
        ```bash
        cd /path/to/your/cms-app
        ```
    *   Start the frontend development server:
        ```bash
        npm run dev
        ```
    The frontend will typically run on `http://localhost:5173` (or another port specified by Vite) and will proxy API requests to the backend.

3.  **Run Both Frontend and Backend Concurrently (from the root `cms-app` directory):**
    ```bash
    npm run dev:all
    ```
    This command will start both the Vite frontend development server and the Node.js backend server.

## Available Scripts

**Root Directory (`cms-app`):**

*   `npm run dev`: Starts the Vite frontend development server.
*   `npm run build`: Builds the frontend application for production.
*   `npm run lint`: Lints the frontend code.
*   `npm run preview`: Serves the production build locally.
*   `npm run server:dev`: Starts the backend server in development mode (from the root).
*   `npm run server:start`: Starts the backend server in production mode (from the root).
*   `npm run dev:all`: Starts both frontend and backend development servers concurrently.

**Server Directory (`cms-app/server`):**

*   `npm start`: Starts the backend server.
*   `npm run dev`: Starts the backend server in development mode using `nodemon`.

## API Endpoints (Backend - `/api`)

*   **Auth (`/api/auth`):**
    *   `POST /login`: User login.
    *   `POST /register`: User registration.
    *   `POST /change-password`: Change user password.
*   **Posts (`/api/posts`):**
    *   `GET /`: Get all posts.
    *   `GET /:id`: Get a single post by ID.
    *   `POST /`: Create a new post.
    *   `PUT /:id`: Update an existing post.
    *   `DELETE /:id`: Delete a post.

*(Add more endpoints as you develop them, e.g., for pages, media)*

## Future Enhancements

*   Implement proper password hashing (e.g., using `bcryptjs`).
*   Use JSON Web Tokens (JWT) for session management.
*   Full CRUD functionality for Pages and Media.
*   Advanced role-based access control.
*   More detailed analytics.
*   WYSIWYG editor for content creation.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
