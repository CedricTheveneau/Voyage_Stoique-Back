require("dotenv").config();
const app = require("./app.js");
const port = process.env.PORT;
const projectName = process.env.PROJECT_NAME;
const apiSuccessRes = {
  API: "Connected",
  RESPONSE: `Success ! You're now live on ${projectName}`,
};

app.get("/api", (req, res) => {
  res.send(apiSuccessRes);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
