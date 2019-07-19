require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { NODE_ENV } = require('./config');
const cardRouter = require('./card/card.router');
const listRouter = require('./List/list.router');
const logger = require('./Logger/logger');

const app = express();

//Bearer Token Authorization
app.use(function validateBearerToken (req, res, next){
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if(!authToken ||  authToken.split(' ')[1] !== apiToken) {
    //log statement for client
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: 'Unauthorized request'});
  }
  next();
});

app.use(cardRouter);
app.use(listRouter);

app.use(function errorHandler(error, req, res, next) { //eslint-disable-line no-unused-vars
  let response;
  if(NODE_ENV === 'production'){
    response = { error: {message: 'server error'} };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
