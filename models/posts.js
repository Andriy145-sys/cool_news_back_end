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
                type:String 
            },
            author :{
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            date_of_create: {
                type: Date,
                default: Date.now()
            }
        })
    )
    return posts;
}