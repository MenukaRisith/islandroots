const { app } = require("./app");
const { ENV } = require("./config/env");

const port = ENV.PORT;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`IslandRoots API listening on http://localhost:${port}`);
});
