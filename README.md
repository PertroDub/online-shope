# Online shop

## Environment Setup

Copy the example file and configure variables:
```bash
cp .env.example .env.development
```

## Migrations

Install dependencies:
```bash
npm install
```

Run migrations:
```bash
npm run migration:run
```

## Startup

Start database and Redis (via Docker):
```bash
docker-compose up -d
```

Start the application:
```bash
# For development
npm run start:dev

# For production
npm run start:prod
```

The application will be available at `http://localhost:8000`