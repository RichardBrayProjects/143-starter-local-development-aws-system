import { migrate } from "./database/migrate.js";
import { createApp } from "./app.js";

await migrate();

const app = createApp();
app.listen(3001, () => console.log("API: http://localhost:3001"));
