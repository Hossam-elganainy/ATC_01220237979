# Areeb Backend

A Django-based backend system with Docker support, designed to handle reservations, events, and user management.

## 🚀 Features

- User authentication and management
- Event management system
- Reservation handling
- RESTful API endpoints
- Docker containerization
- Admin dashboard with Django Unfold
- JWT authentication
- API documentation with Swagger/OpenAPI

## 🛠️ Tech Stack

- **Framework**: Django
- **API**: Django REST Framework
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Documentation**: drf-yasg (Swagger/OpenAPI)
- **Containerization**: Docker & Docker Compose
- **Admin Interface**: Django Unfold
- **Task Queue**: Celery with Redis
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **Web Server**: Nginx
- **Production Server**: Docker

## 📋 Prerequisites

- Python 3.x
- Docker and Docker Compose
- Git

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd areeb
```

2. Create and activate a virtual environment:
```bash
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
Create a `.env` file in the root directory with necessary environment variables.

5. Run migrations:
```bash
python manage.py migrate
```

6. Create a superuser:
```bash
python manage.py createsuperuser
```

## 🚀 Running the Application

### Development
```bash
python manage.py runserver
```

### Production
```bash
./deploy.sh
```

## 🌐 Live Deployment

The application is deployed and running at:
- API Documentation: [https://areeb.cowdly.com/en/api/swagger/](https://areeb.cowdly.com/en/api/swagger/)

The deployment stack includes:
- Docker containers for the application
- Nginx as the reverse proxy
- PostgreSQL as the production database
- Gunicorn as the WSGI server

## 📚 API Documentation

You can access the API documentation at:
- Swagger UI: `http://127.0.0.1:8000/api/swagger/` (Development)
- Live Swagger UI: [https://areeb.cowdly.com/en/api/swagger/](https://areeb.cowdly.com/en/api/swagger/) (Production)

You can access the Admin panel at:
- Admin panel: `http://127.0.0.1:8000/admin` (Development)
- Live Admin panel: [https://areeb.cowdly.com/en/admin/](https://areeb.cowdly.com/en/admin/) (Production)

## 📁 Project Structure

```
areeb/
├── areeb/              # Main project configuration
├── core/              # Core functionality
├── events/            # Events management
├── reservations/      # Reservation handling
├── users/             # User management
├── type/              # Type definitions
├── templates/         # HTML templates
├── static/            # Static files
├── media/             # User-uploaded files
├── infrastructure/    # Infrastructure configurations
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Docker Compose configuration
└── requirements.txt   # Python dependencies
```

## 🔐 Environment Variables

Create a `.env` file with the following variables:
```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Hossam Elganainy

## 🙏 Acknowledgments

- Django Documentation
- Django REST Framework
- Docker Documentation 