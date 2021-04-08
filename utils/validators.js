module.exports.validate.RegisterInput = (
    username,
    email,
    password,
    confirmPassword
) => {
    const errors = {};
    if (username.trim() === "") {
        errors.username = "Please provide a valid username"
    } 
}