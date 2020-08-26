import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// const pool = new pg.Pool({})
const isProduction = process.env.NODE_ENV === "production";

export const pool = new pg.Pool({
    user: process.env['DB_USER'],
    host: process.env['DB_HOST'],
    database: process.env['DB_DATABASE'],
    port: process.env['DB_PORT']
})