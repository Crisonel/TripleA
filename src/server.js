import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from './app.js';

dotenv.config({
    path: './env'
});



connectDB()
.then(() => {
    let port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log(`Server is running at port ${port}`);
    });
})
.catch((err) => {
    console.log("Server failed to connect: ",err);
});