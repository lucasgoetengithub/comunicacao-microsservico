import Order from '../model/Order.js';
import { sendProductStockUpdateQueue } from '../model/product/rabbitmq/productStockUpdate.js';
import { ACCEPTED, REJECTED, PENDING } from '../status/OrderStatus.js';
import OrderException from '../exception/OrderException.js'; 
import { BAD_REQUEST, SUCCESS, INTERNAL_SERVER_ERROR } from '../../../config/constants/httpStatus.js' 
import OrderRepository from '../repository/OrderRepository.js';
import ProductClient from '../model/product/client/ProductClient.js';

class OrderService {

    async createOrder(req){
        try {
            let orderData = req.body;
            this.validateOrderData(orderData);
            const { authUser } = req;
            const { authorization } = req.headers;
            let order = this.createInitialOrderData(orderData, authUser);
            await this.validateProductStock(order, authorization);

            let createdOrder = await OrderRepository.save(order);
            this.sendMessage(createdOrder);
            return {
                status: SUCCESS,
                createdOrder,
            }
        } catch (err) {
            return {
                status: err.status ? err.status : BAD_REQUEST,
                message: err.message,
            };
        }
    }

    createInitialOrderData(orderData, authUser){
        return {
            status: PENDING,
            user: authUser,
            createdAt: new Date(),
            updatedAt: new Date(),
            products: orderData.products,
            
        };
    }

    async updateOrder(orderMessage){
        try {
            const order = JSON.parse(orderMessage);
            console.log(order);
            if (order.salesId && order.status) {
                let existingOrder = await OrderRepository.findById(order.salesId);
                if (existingOrder && order.status !== existingOrder.status) {
                    existingOrder.status = order.status;
                    existingOrder.updatedAt = new Date();
                    await OrderRepository.save(existingOrder);
                }
            } else {
                console.log('The order message was not complete.');
            }
        } catch (err) {
            console.error('Could not parse order message from queue.');
            console.error(err.message);
        }
    }

    validateOrderData(data){
        if (!data || !data.products) {
            throw new OrderException(BAD_REQUEST, 'The products must be informed.')
        }

    }

    async validateProductStock(order, token){
        let stockIsOk = await ProductClient.checkProductStock(
            order, token
            );
        if (!stockIsOk) {
            throw new OrderException(
                BAD_REQUEST,
                'The stock is out for the products.'
            ); 
        }
    }

    sendMessage(createdOrder){
        const message = {
            salesId: createdOrder.id,
            products: createdOrder.products
        }
        sendProductStockUpdateQueue(message);
    }

    async findById(req){
        const {id} = req.params;
        try {
            this.validateInformedId(id);
            const existingOrder = await OrderRepository.findById(id);
            if (!existingOrder) {
                throw new OrderException(BAD_REQUEST, "The Order was not found.");
            }
            return {
                status: SUCCESS,
                existingOrder,
            }
        } catch (err) {
            return {
                status: err.status ? err.status : INTERNAL_SERVER_ERROR,
                message: err.message,
            };
        }
    }

    async findAll(){
        try {
            const orders = await OrderRepository.findAll();
            if (!orders) {
                throw new OrderException(BAD_REQUEST, "No Orders were found.");
            }
            return {
                status: SUCCESS,
                orders,
            }
        } catch (err) {
            return {
                status: err.status ? err.status : INTERNAL_SERVER_ERROR,
                message: err.message,
            };
        }
    }

    async findByProductId(req){
        const { productId } = req.params;
        try {
            this.validateInformedProductId(productId);
            const existingOrder = await OrderRepository.findByProductId(productId);
            if (!existingOrder) {
                throw new OrderException(BAD_REQUEST, "No Orders were found.");
            }
            return {
                status: SUCCESS,
                salesIds: existingOrder.map((order) => {
                    return order.id;
                }),
            }
        } catch (err) {
            return {
                status: err.status ? err.status : INTERNAL_SERVER_ERROR,
                message: err.message,
            };
        }
    }
    
    validateInformedId(id) {
        if(!id){
            throw new OrderException(BAD_REQUEST, "The Order id must be informed.");
        }
    }

    validateInformedProductId(productId) {
        if(!productId){
            throw new OrderException(BAD_REQUEST, "The product id must be informed.");
        }
    }
}

export default new OrderService();