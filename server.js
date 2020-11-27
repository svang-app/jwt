const express = require('express');
const bodyParser = require('body-parser');
const { checkKey } = require('./modules/checkkey');
let jwt = require('jsonwebtoken');
let config = require('./config');
let middleware = require('./middleware');

class HandlerGenerator {
  login (req, res) {
    let primary = req.body.primary;
    let secondary = req.body.secondary;

    if (primary && secondary) {
      if (checkKey(primary, secondary)) {
        let token = jwt.sign({primary: primary},
          config.secret,
          { 
             expiresIn: '24h' // expires in 24 hours
          }
        );
        // return the JWT token for the future API calls
        res.json({
          success: true,
          message: 'Authentication successful!',
          token: token
        });
      } else {
        return res.status(403).json({
          success: false,
          message: 'Incorrect primary or secondary'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Authentication failed! Please check the request for primary and secondary keys'
      });
    }
  }
  index (req, res) {
    res.json({
      success: true,
      message: 'Index page'
    });
  }
}

// Starting point of the server
function main () {
  let app = express(); // Export app for other routes to use
  let handlers = new HandlerGenerator();
  const port = process.env.PORT || 8000;
  app.use(bodyParser.urlencoded({ // Middleware
    extended: true
  }));
  app.use(bodyParser.json());
  // Routes & Handlers
  app.post('/89578159-d0f4-4a4c-a267-3595c01aa459', handlers.login);
  app.get('/', middleware.checkToken, handlers.index);
  app.listen(port, () => console.log(`Server is listening on port: ${port}`));
}

main();
