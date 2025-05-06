# Credit Union Bank

## Overview

BU Banking is a banking application designed to manage user accounts, transactions, and business interactions. It includes features such as round-up savings, account management, and transaction tracking. The project is built using Django for the backend and React for the frontend, with Docker for containerization.

---

## Project Structure

The project is organized into the following main directories and files:

### Root Directory

- **`docker-compose.yaml`**: Defines the services for the project, including the backend and frontend.
- **`manage.py`**: Django's command-line utility for administrative tasks.
- **`README.md`**: Documentation for the project.
- **`Jenkinsfile`**: Configuration for CI/CD pipelines.
- **`db.sqlite3`**: SQLite database file (used for local development).

### Backend (`backend/`)

- **`models.py`**: Defines the database models, including `Account`, `Transaction`, and `Business`.
- **`views.py`**: Contains the API views for handling requests.
- **`serializers.py`**: Serializes and deserializes data for API endpoints.
- **`urls.py`**: Maps URLs to views.
- **`auth_views.py`**: Handles authentication-related views.
- **`registration_view.py`**: Manages user registration logic.
- **`signals.py`**: Contains Django signals for handling events like user creation.
- **`tests.py`**: Includes unit tests for the backend functionality.
- **`Dockerfile`**: Docker configuration for the backend service.
- **`requirements.txt`**: Lists Python dependencies for the backend.

### Frontend (`frontend/react-code/`)

- **`Dockerfile`**: Docker configuration for the frontend service.
- **React Components**: Contains React components for the user interface.
- **API Integration**: Handles communication with the backend API.

### Migrations (`migrations/`)

- Contains migration files for database schema changes.

### CI/CD (`ci-cd/`)

- **`docker-compose.yaml`**: Defines services for CI/CD pipelines.
- **`Dockerfile`**: Docker configuration for CI/CD.

### Extra (`extra_credit_union/`)

- **`settings.py`**: Django settings for the project.
- **`urls.py`**: Root URL configuration.
- **`wsgi.py`**: WSGI configuration for deployment.

---

## Models

### Account

- **Fields**:
  - `id`: Unique identifier for the account.
  - `name`: Name of the account.
  - `starting_balance`: Initial balance of the account.
  - `current_balance`: Current balance of the account.
  - `round_up_enabled`: Boolean indicating if round-up savings is enabled.
  - `round_up_pot`: Amount saved through round-up transactions.
  - `user`: Foreign key linking the account to a user.
  - `account_type`: Type of account (e.g., current, savings).

### Transaction

- **Fields**:
  - `transaction_type`: Type of transaction (e.g., payment, withdrawal, deposit).
  - `amount`: Amount of the transaction.
  - `from_account`: Account initiating the transaction.
  - `to_account`: Account receiving the transaction.
  - `business`: Business associated with the transaction.
  - `timestamp`: Timestamp of the transaction.

### Business

- **Fields**:
  - `id`: Unique identifier for the business.
  - `name`: Name of the business.
  - `category`: Category of the business.
  - `sanctioned`: Boolean indicating if the business is sanctioned.

---

## Functionality

1. **User Registration**:

   - Users can register with their details.
   - Email verification can be added for accuracy.

2. **Account Management**:

   - Users can create and manage multiple accounts.
   - Round-up savings can be enabled for accounts.

3. **Transactions**:

   - Users can perform payments, withdrawals, deposits, and transfers.
   - Round-up savings are automatically calculated for payments.

4. **Business Management**:

   - Users can associate transactions with businesses.
   - Sanctioned businesses are flagged.

5. **Reporting**:
   - Spending summaries and transaction histories are available.

---

## How to Run the Project

### Prerequisites

- Docker and Docker Compose installed.
- Python 3.12+ installed (for local development).

### Steps

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd banking
   ```

2. **Start the Services**:

   - Using Docker Compose:
     ```bash
     docker-compose up --build
     ```
   - This will start the backend and frontend services.

3. **Access the Application**:

   - Backend API: `http://127.0.0.1:8000/`
   - Frontend: `http://127.0.0.1:3000/`

4. **Run Migrations**:

   ```bash
   docker exec -it <backend-container-name> python manage.py migrate
   ```

5. **Create a Superuser**:

   ```bash
   docker exec -it <backend-container-name> python manage.py createsuperuser
   ```

6. **Run Tests**:
   ```bash
   docker exec -it <backend-container-name> python manage.py test
   ```

---

## Future Improvements

- Implement email verification for user registration.
- Add more detailed reporting and analytics.
- Enhance the frontend UI for better user experience.
- Integrate third-party payment gateways.

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

---

## License

This project is licensed under the MIT License.
