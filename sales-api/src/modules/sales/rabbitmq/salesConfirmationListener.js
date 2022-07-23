import amqp from 'amqplib/callback_api.js';

import  { 
    PRODUCT_STOCK_UPDATE_QUEUE, 
    PRODUCT_STOCK_UPDATE_ROUTING_KEY, 
    PRODUCT_TOPIC, 
    SALES_CONFIRMATION_QUEUE, 
    SALES_CONFIRMATION_ROUTING_KEY 
} from '../../../config/rabbitmq/queue.js';

import { RABBIT_MQ_URL } from '../../../config/constants/secrets.js';

export function listenToSalesConfirmationQueue(){
    amqp.connect(RABBIT_MQ_URL, (error, connection) =>  {
        if (error) {
            throw error;
        }
        console.info("Listening to Sales Confirmation Queue...");
        connection.createChannel((error, channel) => {
            if (error) {
                throw error;
            }
            channel.consume(SALES_CONFIRMATION_QUEUE, (message) => {
                console.info(`Recieve message from queue: ${message.content.toString()}`);
            }, {
                noAck: true,
            })
        });
    });
}