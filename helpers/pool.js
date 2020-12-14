var pg = require('pg')

const Port = 5432
const env_config = require('../config')
var config = {
    connectionString: env_config.connection,
    ssl: { rejectUnauthorized: false },
    // min: env_config.pool.min,
    max: env_config.pool.max, // max number of clients in the pool
    idleTimeoutMillis: env_config.idleTime
}

var pool = new pg.Pool(config);

module.exports = pool;