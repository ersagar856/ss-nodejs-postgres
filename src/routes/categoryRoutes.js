// import { Router } from "express";
const express = require('express');
const Router = express.Router();
// const timeout = require('connect-timeout');
const categoryController = require('../controllers/api/v1/categoryController.js');

Router.post('/add-category', categoryController.addCategoryWithTags);
Router.get('/get-category', categoryController.getCategoryList);
module.exports = Router;