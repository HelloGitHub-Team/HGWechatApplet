const { resolve } = require("path");
const { config } = require("dotenv");
const dotenvExpand = require("dotenv-expand");

function loadEnv(mode) {
  const context = process.cwd();
  const basePath = resolve(context, `.env${mode ? `.${mode}` : ""}`);
  const localPath = `${basePath}.local`;

  const load = filePath => {
    try {
      const option = { path: filePath };
      if (process.env.BEBUG) {
        option.debug = true;
      }
      const env = config(option);
      dotenvExpand(env);
    } catch (error) {
      // only ignore error if file is not found
      if (error.toString().indexOf("ENOENT") < 0) {
        console.log(error);
      }
    }
  };

  load(localPath);
  load(basePath);
}

module.exports = loadEnv;
