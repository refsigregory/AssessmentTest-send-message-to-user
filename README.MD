# Message Sender for User
Curent message support:
- Happy Birthday
## Run App

### Install
- Rename `env` to `.env`
- Create Postgres database with name: `send_birthday_db`
- Run `npm install`

### Serving
- Run `npm start`
- Open `localhost:8000`

### Testing
- Run `npm test`

## API Endpoints

### Users
- LIST User

[GET] `http://localhost:8000/users`

- ADD User

[PUT] `http://localhost:8000/users`

```
{
    "firstName": "Dummy",
    "lastName": "Dummy",
    "email": "test@digitalenvision.com.au",
    "birthday": "2020-01-12",
    "location": "37.868989,139.991098"
}

```

Note:
  => Birtday Format: `YYYYY-MM-DD`
  => Location Format: `Latitude,Longitude`

- EDIT User

[POST] `http://localhost:8000/users/<User ID>`

```
{
    "firstName": "Dummy",
    "lastName": "Dummy",
    "email": "test@digitalenvision.com.au",
    "birthday": "2020-01-12",
    "location": "37.868989,139.991098"
}

```

- DELETE User

[DELETE] `http://localhost:8000/users/<User ID>`