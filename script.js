/*
	Hunter Culler and Ian Anderson
	University of Colorado Denver CSCI 4800 E01
	Web Application Developement
	Group Assignment 3

	March 31st, 2021

	Status = Functional
*/

function updateSecurityView() {
    var dlSecurity = document.getElementById("dlSecurity");
    var divSecurityAnswer = document.getElementById("divSecurityAnswer");

    if (dlSecurity.value != "starter") {
        divSecurityAnswer.classList.remove("invisible");
    }
    else {
        divSecurityAnswer.classList.add("invisible");
    }
}

function checkPassword() {
    var pass = document.getElementById("txtPassword");
    var confirm = document.getElementById("txtConfirmPassword");
    var passRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/
    var valid = true;

    if (pass == ''){
        pass.classList.add("hasError");
        valid = false;
    }
    else if (confirm == '') {
        confirm.classList.add("hasError");
        valid = false;
    }
    else if (pass != confirm) {
        pass.classList.add("hasError");
        confirm.classList.add("hasError");
        valid = false;
    }
    else if (!pass.value.match(passRegEx)) {
        pass.classList.add("hasError");
        valid = false;
    }

    return valid;
}

function validateForm() {
    var DoB = document.querySelector("#txtDOB");
    var divDoBError = document.querySelector("#divDoBError");
    var formIsValid = true;
    if (DoB.value == "") {
        divDoBError.classList.remove("invisible");
        divDoBError.innerHTML = "The Date of birth cannot be empty."
        DoB.classList.add("hasError");
        formIsValid = false;
    }
    else {
        var DoBDate = new Date(DoB.value);
        var todayDate = new Date();
        if (DoBDate >= todayDate) {
            divDoBError.classList.remove("invisible");
            divDoBError.innerHTML = "The Date of birth must be before today's date."
            DoB.classList.add("hasError");
            formIsValid = false;
        }
        else {
            divDoBError.classList.add("invisible");
            divDoBError.innerHTML = ""
            DoB.classList.remove("hasError");
        }
    }

    var elements = document.getElementsByTagName("input");
    var invalidChars = ['<', '>', '#', '-', '{', '}', '(', ')', '\'', '\"', '`'];
    for (let i = 0; i < elements.length; i++) {
        for (let j = 0; j < invalidChars.length; j++) {
            if (elements[i].value.indexOf(invalidChars[j]) != -1) {
                elements[i].classList.add("hasError");
                formIsValid = false;
            }
            else {
                elements[i].classList.remove("hasError");
            }
        }
    }

    formIsValid = checkPassword();

    return formIsValid;
}

