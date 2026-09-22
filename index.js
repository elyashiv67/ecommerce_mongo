import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import db_connect from './src/services/mongoDB.js';


dotenv.config();

const app = express();
const api = process.env.HOST;
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));








const start = async () => {
    await db_connect();
    app.listen(port, () => {
        console.log(`Server is running on port ${port} ✅ \nhttp://${api}:${port}`);
    });
};

start().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});