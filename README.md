# Learn JWT

Reference: https://medium.com/dev-bits/a-guide-for-adding-jwt-token-based-authentication-to-your-single-page-nodejs-applications-c403f7cf04f4

# Code

```
npm init -y
npm install express
npm install jsonwebtoken
npm install dotenv
touch server.js middleware.js config.js
```

Generate UUID

```
python -c "import uuid ; print(str(uuid.uuid1()).upper())"
```

## Generate keys

```
cd modules
node genkeys.js
cd ..
```

## Start server

```
node server.js // starts server on 8000 port
```

## Test without login

```
curl -X GET http://localhost:8000
{"success":false,"message":"Auth token is not supplied"}

```

## How to get primary and secondary by the client

The modules dir will be used as is by the mobile and web app

The mobile app and web app will use function `getrandomkey` to get a random key and secret from the keys.bin.

For example:

```
node
> const { data } = require('./modules/getrandomkey');
> console.log(data)
{
  primary: 'ed2d9212-46a9-41d1-bd97-1a5f2fb2056c',
  secondary: 'ccf86474-b44c-42b3-8b7a-16beafbe06dc'
}
```

The API server will use the same modules to check the key and secret.

For example:

```
node
> const { checkKey } = require('./modules/checkkey');
> var primary = "ed2d9212-46a9-41d1-bd97-1a5f2fb2056c", secondary = "ccf86474-b44c-42b3-8b7a-16beafbe06dc";

if (checkKey(primary,secondary)) {
  console.log("Found");
} else {
  console.log("Not found");
}
```
The apps will post key and request params in the request body.

## Test with login

We are using UUID = 89578159-d0f4-4a4c-a267-3595c01aa459 as a camaflouge for login.

Change the above UUID to a different UUID in the main app and make a change in server.js

It is easy to guess the login route and hence we are using a complex hard to guess path.

The app (both mobile and web) will call the API /89578159-d0f4-4a4c-a267-3595c01aa459 to get the JWT token based upon a randomly used key and secret which is shared between API server and the apps. This will help to use a random key and secret to get a JWT which will change every time. This is better than using a fixed JWT which is risky if someone is able to get the JWT and call API server directly.

The app will call function ./modules/getrandomkey to get a random key and secret - which will be sent to the API server to get a JWT.

```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"primary":"ed2d9212-46a9-41d1-bd97-1a5f2fb2056c", "secondary":"ccf86474-b44c-42b3-8b7a-16beafbe06dc"}' \
  http://localhost:8000/89578159-d0f4-4a4c-a267-3595c01aa459


{"success":true,"message":"Authentication successful!","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcmltYXJ5IjoiZWQyZDkyMTItNDZhOS00MWQxLWJkOTctMWE1ZjJmYjIwNTZjIiwiaWF0IjoxNjA2NDkzMDg3LCJleHAiOjE2MDY1Nzk0ODd9.8CaiBwTw5NAwtJxmuCig-GfykUIYDZAPAzQtbZdzeuA"}
```

## Test with token

We can remake our last home page request by adding a bearer token.

```
curl -X GET \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcmltYXJ5IjoiZWQyZDkyMTItNDZhOS00MWQxLWJkOTctMWE1ZjJmYjIwNTZjIiwiaWF0IjoxNjA2NDkzMDg3LCJleHAiOjE2MDY1Nzk0ODd9.8CaiBwTw5NAwtJxmuCig-GfykUIYDZAPAzQtbZdzeuA' \
  http://localhost:8000

{"success":true,"message":"Index page"}  
```

## Middleware use in REST API example

```
app.get(‘/v1/someResource’, middleware.checkToken, handlers.someHandler);
app.post(‘/v1/anotherResource’, middleware.checkToken, handlers.anotherHandler);
```