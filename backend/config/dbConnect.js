const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: 'backend/config/config.env' })
exports.db = () => {
    let DB = "";
    if (process.env.NODE_ENV === "DEVELOPMENT") {
        DB = process.env.DATABASE.replace(
            "<PASSWORD>",
            process.env.DATABASE_PASSWORD
        );
    }
    if (process.env.NODE_ENV === "PRODUCTION") {
        DB = process.env.DATABASE.replace(
            "<PASSWORD>",
            process.env.DATABASE_PASSWORD
        );
    }
    mongoose
        .connect(DB
            //     , {
            //     useNewUrlParser: true,
            //     useUnifiedTopology: true,
            // }
        )
        .then((con) =>
            console.log(`DB Connection successfully ${con.connection.host}`)
        )
}