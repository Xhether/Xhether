# Backend Architecture

This folder contains the Python backend for the application.

## Technology Stack

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) - High performance, easy to learn, fast to code, ready for production.
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL) - Open source Firebase alternative.
- **ORM/Client**: [Supabase Python Client](https://github.com/supabase-community/supabase-py) or [SQLAlchemy](https://www.sqlalchemy.org/) (optional).

## Structure

- `main.py`: The entry point of the application. Defines the API app and routes.
- `models.py`: Pydantic models (Schemas) that define the data structure for API requests/responses.
- `requirements.txt`: Python dependencies.

## Data Models

### Lead
Represents a sales lead.
- `id`: Unique identifier
- `company`: Company name
- `contact`: Contact person name
- `email`: Contact email
- `score`: AI-calculated score (0-100)
- `stage`: Pipeline stage (new, contacted, qualified, proposal, closed)

### Activity
Represents an interaction with a lead.
- `lead_id`: Foreign key to Lead
- `type`: Type of activity (email, call, meeting)
- `action`: Description
- `grok_generated`: Whether AI generated this activity

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

