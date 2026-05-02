import dotenv from "dotenv";
import { connectToDB } from "./config/database";
import http from "node:http";
import app from "./app";

dotenv.config();

import {env} from "./config/env"

async function startServer() {
  await connectToDB();

  const server = http.createServer(app);

  server.listen(process.env.PORT, () => {
    console.log(`Server is running to port ${env.PORT}`);
    
  })
}

startServer().catch(err => {
  console.error("Error occurs while starting the server" + err);
  process.exit(1);
})