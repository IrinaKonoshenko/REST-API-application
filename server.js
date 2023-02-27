require("dotenv").config();

const getConnection = require("./db/mongoose");
const app = require("./app");

app.listen(3000, async () => {
  try {
    await getConnection();
    console.log("Database connection successful");
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
});
