require("dotenv").config();

const app = require("./src/app");

const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`TrustVault API listening on http://localhost:${port}`);
});
