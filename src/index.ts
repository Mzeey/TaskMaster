import express from "express";
import App from './services/ExpressApp';
import DbConnection from './services/Database';
import { PORT } from './config';

const startServer =async () => {
    const app = express();

    await DbConnection();

    await App(app);

    app.listen(PORT, ()=>{
        console.log(`App is running on port: ${PORT}`);
    })
}

startServer();