import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";

import Database from "@/storage/db";
import routes from "@/routes/routes";

const PORT = process.env.PORT || 8080;
const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cors());

Database.getInstance();

app.use("/api", routes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

async function grafecefulShutdown() {
  server.close(async () => {
    console.log("Server is closing connections");
    try {
      await mongoose.connection.close();
      console.log("Mongo connection closed");
    } catch (err) {
      console.error("Error closing connections", err);
    }

    process.exit(0);
  });

  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down",
    );
    process.exit(1);
  }, 10_000);
}

process.on("SIGINT", grafecefulShutdown);
process.on("SIGTERM", grafecefulShutdown);
