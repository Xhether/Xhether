
  # xAI Takehome

  This is a code bundle for xAI Takehome. The original project is available at https://www.figma.com/design/9C38WekE3XBks1LJShH3tH/xAI-Takehome.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
  ## Setup Instructions
  Create .env (root): Add your env vars (Supabase/XAI).
  Build & Run (from project root):
  build
    docker-compose up --build
  Frontend: http://localhost:5173
  Backend: http://localhost:8000
  Local DB (if used): Connect via postgres://postgres:password@localhost:5432/grok_sdr (use Supabase dashboard for cloud).
  Dev Notes:
  Hot-reload: Changes in code sync via volumes.
  Stop: docker-compose down.
  Local DB: Run migrations/seed.py inside container if needed (docker-compose exec backend python seed.py).
  For production: Remove --reload in CMD, use multi-stage build for smaller image.