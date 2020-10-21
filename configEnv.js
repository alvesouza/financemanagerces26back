// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://xzdyuyszpnfeob:564008abf9cd23b0f0f47757ca4bfcd262e0bbeb972' +
        '2803f759651acb00ca874@ec2-34-202-65-210.compute-1.amazonaws.com:5432/dd9p8pp2k0skrh',
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory:'./migrations'
    },
    email:{
      email: "managerfinance.ces26@gmail.com",
      password: "byt6%&*uig9HKhuf6DDCctfj9"
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory:'./migrations'
    },
    email:{
      email: process.env.EMAIL_LOGIN,
      password: process.env.EMAIL_PASSWORD
    }
  }

};
