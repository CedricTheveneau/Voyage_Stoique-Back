require("dotenv").config();
const app = require("./app.js");
const port = process.env.PORT;
const projectName = process.env.PROJECT_NAME;

app.get("/", (req, res) => {
  res.send(`You're now live on ${projectName}`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
