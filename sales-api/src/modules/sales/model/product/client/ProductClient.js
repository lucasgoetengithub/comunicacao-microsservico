import axios from "axios";

import { PRODUCT_API_URL } from '../../../../../config/constants/secrets.js';

class ProductCliente {
    async checkProductStock(productsData, token){
        try {
            const headers =     {
                Authorization: token,
            }

            console.info(`Sending request to Product API with data: ${JSON.stringify(productsData)}`)
            let response = false;
            await axios
            .post(
                `${PRODUCT_API_URL}/check-stock`, 
                { products: productsData.products }, 
                { headers }
            )
            .then(res => {
                console.log(res);
                response = true;
            })
            .catch(err => {
                console.error(err.response.message);
                response =  false;
            });
            return response;
        } catch (err) {
            return false;
        }
    }
}

export default new ProductCliente();