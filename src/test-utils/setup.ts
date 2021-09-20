import { createConnection } from "./dbHandler";

createConnection().then(() => process.exit());
