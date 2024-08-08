import express from "express";
import router from "./routes.js";
import { createClient } from "redis";

 export const client = createClient({ url: "redis://localhost:6379" });
const app = express();
const PORT = 3000;


 export async function main() {
  try {
     await client.connect();
    console.log("Connected to Redis");
    
  } catch (error) {
    console.error(error);
    
  }
}

main();

app.use("/", router);

app.listen(PORT, () => {
  console.log(`server is running ${PORT}`);
});
