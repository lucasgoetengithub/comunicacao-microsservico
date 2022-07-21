import express from 'express';

import { connect } from './src/config/db/mongoDbConfig.js';
import Order from './src/modules/sales/model/Order.js';

const app = express();
const env = process.env;
const PORT = env.PORT || 8082;

connect();

app.get('/api/status', (req, res) => {
    try {
        let teste = Order.find();    
        console.log(teste);
        console.log("passou 123");
    } catch (error) {
       
    }
    
    
    return res.status(200).json({
        service: 'Sales-API',
        status: 'up',
        httpStatus: 200
    });
})

app.listen(PORT, () => {
    console.info(`Server started sucessfully at port ${PORT}`)
})