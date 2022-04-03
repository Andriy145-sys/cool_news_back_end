module.exports = mongoose => {
    const { Schema } = mongoose;
    const posts = mongoose.model(
        "posts",
        mongoose.Schema({
            title: {
                type: String,
                required: true
            },
            text: {
                type: String,
                required: true
            },
            img: {
                type: String
            },
            author_id: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            author_username: {
                type: String,
                required: true
            },
            date_of_create: {
                type: String,
                default: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
            }
        })
    )
    return posts;
}