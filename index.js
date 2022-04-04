const express = require("express")
const cors = require("cors")

const app = express()

app.get('/', (req, res) => {
    res.end(`<h1>Home page</h1>`)
})

app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({
    limit: '15mb',
    extended: true,
}));

app.use(express.json({
    limit: '15mb',
}));

var allowedOrigins = ['http://localhost:8080', 'http://localhost:8081'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

//routes
app.use('/posts', require('./routes/api/posts'))
app.use('/auth', require('./routes/api/auth'))
app.use('/user', require('./routes/api/user'))

//DB
function start() {
    const db = require("./models");
    db.mongoose.connect("mongodb+srv://andriy:testPass1!@coolnews.mdpiq.mongodb.net/coolnews?retryWrites=true&w=majority", {
        useNewUrlParser: true,
    }).then(() => {
        console.log("Connected to the database!");
    }).catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

    //Port
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Express is working on port`);
    });
}

start()