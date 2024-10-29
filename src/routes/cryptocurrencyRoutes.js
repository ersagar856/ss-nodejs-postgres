const express = require('express');
const Router = express.Router();

const cryptocurrencyController = require('../controllers/api/v1/cryptocurrencyController.js');
Router.post('/add-cryptocurrency', cryptocurrencyController.addCryptocurrency);
Router.get('/add-cryptocurrency', cryptocurrencyController.getCryptocurrencyData);
module.exports = Router;