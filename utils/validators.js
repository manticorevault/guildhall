module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword
) => {
    const errors = {};

    if (username.trim() === "") {
        errors.username = "Please provide a valid username"
    } 
    if (email.trim() === "") {
        errors.email = "Please provide a valid e-mail"
    } else {
        // Regular expression to check valid e-mails
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
            errors.email = "E-mail must be a valid e-mail address"
        }
    }

    if (password === "") {
        errors.password = "Please provide a password"
    } else if (password !== confirmPassword) {
        errors.confirmPassword = "Your password must be the same as the one provided"
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
}

module.exports.validateLoginInput = (username, password) => {
    const errors = {};

    if (username.trim() === "") {
        errors.username = "Please provide a valid username"
    } 
    if (password.trim() === "") {
        errors.password = "Please provide a valid password"
    } 

    return {
        errors,
        valid: Object.keys(errors).length < 1
    };

}