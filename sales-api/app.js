import express from 'express';

import { connectMongoDB } from './src/config/db/mongoDbConfig.js';
import { createInitialData } from './src/config/db/initialData.js';
import checkToken from './src/config/auth/checkToken.js';
import { connectRabbitMq } from './src/config/rabbitmq/rabbitConfig.js';
import orderRoutes from './src/modules/sales/routes/OrderRoutes.js';
import tracing from './src/config/tracing.js';

import { sendProductStockUpdateQueue } from './src/modules/sales/model/product/rabbitmq/productStockUpdate.js'; 

const app = express();
const env = process.env;
const PORT = env.PORT || 8082;
const THREE_MINUTRES = 180000;

startApplication();

async function startApplication() {
    if (CONTAINER_ENV === env.NODE_ENV) {
        console.info("Waiting for RabbitMQ and MongoDB containers to start...");
        setInterval(() => {
            connectMongoDB();
            connectRabbitMq();
        }, THREE_MINUTRES);
    } else {
        connectMongoDB();
        createInitialData();
        connectRabbitMq();
    }
}

app.use(express.json());

app.get("/api/initial-data", (req, res) => {
    await createInitialData();
    return res.json({ message: "Data created." });
})

app.use(tracing);
app.use(checkToken);
app.use(orderRoutes);
app.get('/teste', (req, res) => {
    try {
        sendProductStockUpdateQueue([
            {
                productId: 1001,
                quantity: 3,
            },
            {
                productId: 1002,
                quantity: 2,
            },
            {
                productId: 1003,
                quantity: 1,
            }
        ])
        return res.status(200).json({status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:true});
    }
})

app.get('/api/status', (req, res) => {
    
    return res.status(200).json({
        service: 'Sales-API',
        status: 'up',
        httpStatus: 200
    });
})

app.listen(PORT, () => {
    console.info(`Server started sucessfully at port ${PORT}`)
})