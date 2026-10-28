// Name: Elyashiv
// ID:   Swisa

import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import db_connect from './services/mongoDB.js';
import main_R from "./routes/Main_R.js";


dotenv.config();

const app = express();
const api = process.env.HOST;
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));



app.use(main_R);

// no route matched
app.use((req, res) => {
    return res.status(404).json({message: `Route ${req.method} ${req.originalUrl} not found.`});
});

// errors thrown before reaching a controller (like a body that is not valid JSON)
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed')
        return res.status(400).json({message: 'Invalid JSON in request body.'});

    return res.status(err.status || 500).json({message: `Server error: ${err.message}`});
});


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
