require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DATABASE_USER || 'nestjs-boilerplate',
    password: process.env.DATABASE_PASSWORD || 'nestjs-boilerplate',
    database: process.env.DATABASE_NAME || 'nestjs-boilerplate',
    host: process.env.DATABASE_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DATABASE_PORT || 5432,
  },
  test: {
    username: process.env.DATABASE_USER || 'nestjs-boilerplate',
    password: process.env.DATABASE_PASSWORD || 'nestjs-boilerplate',
    database: process.env.DATABASE_NAME || 'nestjs-boilerplate',
    host: process.env.DATABASE_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DATABASE_PORT || 5432,
  },
  production: {
    username: process.env.DATABASE_USER || 'nestjs-boilerplate',
    password: process.env.DATABASE_PASSWORD || 'nestjs-boilerplate',
    database: process.env.DATABASE_NAME || 'nestjs-boilerplate',
    host: process.env.DATABASE_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DATABASE_PORT || 5432,
  },
};
