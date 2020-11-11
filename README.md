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

Middleware use in our REST API example

```
app.get(‘/v1/someResource’, middleware.checkToken, handlers.someHandler);
app.post(‘/v1/anotherResource’, middleware.checkToken, handlers.anotherHandler);
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

## How to get key and secret by the client

The modules dir will be used as is by the mobile and web app

The mobile app and web app will use function `getrandomkey` to get a random key and secret from the keys.bin.

For example:

```
const { data } = require('./modules/getrandomkey');
console.log("key = " + data.key + " secret = " + data.secret);
```

Run the following code snippet.

```
$ node
Welcome to Node.js v14.13.0.
Type ".help" for more information.
> const { data } = require('./modules/getrandomkey');
undefined
> console.log("key = " + data.key + " secret = " + data.secret);
key = 658dc0b8-d710-439c-ad29-15585029515d secret = 6e76cfb0-c972-403d-bb6c-2646e7fb52c0
undefined
> 
```

The API server will use the same modules to check the key and secret.

For example:

```
const { checkKey } = require('./modules/checkkey');

var key = "658dc0b8-d710-439c-ad29-15585029515d", secret = "6e76cfb0-c972-403d-bb6c-2646e7fb52c0";

if (checkKey(key,secret)) {
  console.log("Found");
} else {
  console.log("Not found");
}
```

The apps will post key and request params in the request body.

## Test with login

We are using UUID = 89578159-d0f4-4a4c-a267-3595c01aa459 as a camaflouge for login.

It is easy to guess the login route and hence we are using a complex hard to guess path.

The app (both mobile and web) will call the API /89578159-d0f4-4a4c-a267-3595c01aa459 to get the JWT token based upon a randomly used key and secret which is shared between API server and the apps. This will help to use a random key and secret to get a JWT which will change every time. This is better than using a fixed JWT which is risky if someone is able to get the JWT and call API server directly.

The app will call function ./modules/getrandomkey to get a random key and secret - which will be sent to the API server to get a JWT.

```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"key":"658dc0b8-d710-439c-ad29-15585029515d", "secret":"6e76cfb0-c972-403d-bb6c-2646e7fb52c0"}' \
  http://localhost:8000/89578159-d0f4-4a4c-a267-3595c01aa459


{"success":true,"message":"Authentication successful!","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIyM0MwOTMyLTIyQzAtMTFFQi1CNDk1LUFDREU0ODAwMTEyMiIsImlhdCI6MTYwNDk1MTIwNiwiZXhwIjoxNjA1MDM3NjA2fQ.pevSlFnvIohCxBoS4WlSPKjsu2qDmaVhg_t3yzgaglI"}  
```

## Test with token

We can remake our last home page request by adding a bearer token.

```
curl -X GET \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIyM0MwOTMyLTIyQzAtMTFFQi1CNDk1LUFDREU0ODAwMTEyMiIsImlhdCI6MTYwNDk1MTIwNiwiZXhwIjoxNjA1MDM3NjA2fQ.pevSlFnvIohCxBoS4WlSPKjsu2qDmaVhg_t3yzgaglI' \
  http://localhost:8000

{"success":true,"message":"Index page"}  
```

