require("dotenv").config();
const dotenv = require("dotenv");
const pool  = require("./db/index.js");
const app = require("./app.js");
// dotenv.config({
//   path: "./.env",
// });

const host = process.env.HOST || "localhost";
const serverPort = process.env.SERVER_PORT || 3000; // Port for Express server
const basePath = process.env.BASE_URL || "";

pool.connect()
  .then(() => {
    app.listen(serverPort, () => {
      const fullUrl = `http://${host}:${serverPort}${basePath}`;
      console.log(`Server is running at: ${fullUrl}`);
    });
  })
  .catch((err) => {
    console.log("PostgresSQL db connection failed !!! ", err);
  });
