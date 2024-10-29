import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
});

connectDB()
.then(() => {
    port = process.env.PORT || 4000;
    append.listen(port, () => {
        console.log(`Server is running at port ${port}`);
    });
})
.catch((err) => {
    console.log("Server failed to connect: ",err);
});