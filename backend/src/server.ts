import { app } from './app.js'; import { connectDatabase } from './config/db.js'; import { env } from './config/env.js';
connectDatabase().then(()=>app.listen(env.PORT,()=>console.log(`API listening on ${env.PORT}`))).catch((err)=>{console.error(err);process.exit(1)});
