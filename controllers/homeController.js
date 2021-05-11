/*
	Hunter Culler and Ian Anderson
	University of Colorado Denver CSCI 4800 E01
	Web Application Developement
	Group Assignment 4

	March 31st, 2021

	Status = Functional

*/

"use strict"

module.exports = {
    showSignIn: (req, res) => {
        console.log("homecontroller rendered login page");
        res.render("login");
    },
    showHomepage: (req, res) => {
        res.render("home");
    },
    showSignUp: (req, res) => {
        res.render("signup");
    },
}