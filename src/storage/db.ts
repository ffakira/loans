import mongoose, { Connection } from "mongoose";

export default class Database {
  private static instance: Connection;

  private constructor() {}

  public static async getInstance(): Promise<Connection | null> {
    if (!Database.instance) {
      try {
        await mongoose.connect(process.env.MONGO_URI as string);
        Database.instance = mongoose.connection;

        Database.instance.on("error", (error) => {
          console.error("Error connecting to Mongodb", error);
        });

        Database.instance.once("open", () => {
          console.log("Connected to Mongodb");
        });
      } catch (err) {
        console.error("Error connecting to Mongodb", err);
        return null;
      }
    }
    return Database.instance;
  }
}
