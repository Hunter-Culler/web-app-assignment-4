/*
	Hunter Culler and Ian Anderson
	University of Colorado Denver CSCI 4800 E01
	Web Application Developement
	Group Assignment 4

	May 12th, 2021

	Status = Functional

*/

"use strict";
/*
exports.logErrors = (error, req, res, next) => {
    console.error(error.stack);
    next(error);
  };
*/

const httpStatus = require("http-status-codes")

exports.respondNoResourceFound = (req, res) => {
    let errorCode = httpStatus.StatusCodes.NOT_FOUND;
    res.status(errorCode);
    res.send(`${errorCode} | The page does not exist!`);
    res.render("error");
  };

exports.respondInternalError = (error, req, res, next) => {
    let errorCode = httpStatus.StatusCodes.INTERNAL_SERVER_ERROR;
    console.log(`ERROR occurred: ${error.stack}`);
    res.status(errorCode);
    res.send(`${errorCode} | Sorry, our application is experiencing a problem!`);
  };
