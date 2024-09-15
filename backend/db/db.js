import mongoose from "mongoose";

const URI = process.env.DB_CONNECTION_STRING;

export const connectDb = () => {
  return mongoose.connect(URI,)
    .then(() => console.log("Database connected successfully"))
    .catch(err => {
      console.error("Database connection error: ", err);
      process.exit(1);
    });
};

