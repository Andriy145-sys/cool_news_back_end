module.exports = mongoose => {
    const user = mongoose.model(
        "user",
        mongoose.Schema({
            first_name: {
                type: String,
            },
            last_name: {
                type: String,
            },
            username: {
                type: String,
                require: true
            },
            email: {
                type: String,
                require: true
            },
            hash: {
                type: String,
                require: true,
            },
            salt: {
                type: String,
                require: true,
            },
        })
    )
    return user;
}