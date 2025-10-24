# Student-Teacher-Management-System

## Backend Persistence

You can use file-based JSON (default) or MySQL for persistence.

### MySQL Setup

Create a `.env` file at the project root with:

```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_DATABASE=edu_manage
```

Then run:

```
npm run server
```

On first run, the table `users` will be created automatically. Register from the UI to create accounts; passwords are hashed with bcrypt.