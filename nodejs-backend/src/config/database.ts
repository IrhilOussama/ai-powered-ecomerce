import dotenv from "dotenv";
dotenv.config()  // this line is important for environement variables processes(ex: database..)
import pkg from 'pg';
const {Pool} = pkg;
const myDBPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  ssl: process.env.SSL_MODE === 'require' ? { rejectUnauthorized: false } : false, // Use SSL if required
//   port: process.env.DB_PORT,
});
console.log("Postgres Connection Successful")

export default myDBPool;
