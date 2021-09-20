import { connect, connection } from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

export const createConnection = async () => {
  const TEST_DB_URL: string | any = process.env.TEST_DB_URL;
  await connect(TEST_DB_URL);
};

export const closeConnection = async () => {
  await connection.db.dropDatabase();
  await connection.close();
};
