import express from "express";
import cors from 'cors';
import db from './db';
import routes from './routes';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());  // init middleware
db.connect();  // connect to the database

app.use(express.json());
app.use('/', routes);


if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "../frontend", "build")))
    app.get("/*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"))
    })
}


app.listen(port, ()=>{
    console.log(`Example app listening on port ${port}!`);
});