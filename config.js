const dbEngine = process.env.DB_ENVIROMENT || "development";
const config = require("./configEnv")[dbEngine]

// module.exports = require('knex')(config);
module.exports = config;