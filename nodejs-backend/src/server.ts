import dotenv from "dotenv";
dotenv.config()  // this line is important for environement variables processes(ex: database..)
import app from "./app.js";
const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
