import mongoose from "mongoose";
import { Config } from "./config";

export default (config: Config) => {
  const connect = () => {
    console.log(`Trying to connect to ${config.mongodb.host} on ${config.mongodb.dbname}`);
    mongoose.connect(`mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.dbname}`)
    .then(() => {
      console.log(`Successfully connected to database ${config.mongodb.dbname}`);
    })
    .catch((error) => {
      console.log(`Error connecting to database ${error}`);
      return process.exit(1);
    })
  }
  connect();

  mongoose.connection.on('disconnected', connect);


};