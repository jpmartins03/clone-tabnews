import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: POSTGRES_HOST,
    port: POSTGRES_PORT
    user: POSTGRES_USER,
    database: POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
  });
  await client.connect();
  const result = await client.query(queryObject);
  await client.end();
  return result;
}

export default {
  query: query,
};