import bcrypt from "bcrypt";
import Jwt  from "jsonwebtoken";

import UserRepository from "../repository/UserRepository.js";
import * as httpStatus from "../../../config/constants/httpStatus.js";
import UserException from "../exception/UserException.js";
import * as secrets from "../../../config/constants/secrets.js";

class UserService {
    async findByEmail(req){
        try {
            const { email } = req.params;
            const { authUser } = req;
            this.validateRequestData(email);
            let user = await UserRepository.findByEmail(email);
            this.validateUserNotFound(user);
            this.validateAuthenticatedUser(user, authUser);
            
            return {
                status: httpStatus.SUCCESS,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            }
            
        } catch (err) {
            return {
                status: err.status ? err.status : httpStatus.INTERNAL_SERVER_ERROR,
                message: err.message,
            };
        }   
    };

    validateRequestData(email) {
        if (!email) {
            throw new UserException(httpStatus.BAD_REQUEST, 
                "User email was not informed.");
        }
    }

    validateUserNotFound(user) {
        if (!user) {
            throw new Error(httpStatus.BAD_REQUEST, 
                "User was not found.");
        }
    }

    validateAuthenticatedUser(user, authUser){
        if (!authUser || user.id !== authUser.id) {
            throw new UserException(httpStatus.FORBIDDEN, 
                "You cannot see this user data");
        }
    }

    async getAccessToken(req){
        try {
            const {transactionid, serviceid} = req.headers;
            console.info(
                `Request to POST login with data ${JSON.stringify(req.body)} | transactionID: ${transactionid} | serviceID ${serviceid}`
            );
            const { email, password } = req.body;
            this.validateAccessTokenData(email, password);    
            console.log(email)
            let user = await UserRepository.findByEmail(email);
            console.log(user)
            this.validateUserNotFound(user);
            await this.validatePassword(password, user.password)
            console.log('validou')
            const authUser = { id: user.id, name: user.name, email: user.email };
            const accessToken = Jwt.sign({authUser}, secrets.API_SECRET, {expiresIn: '1d'});
            
            let response = {
                status: httpStatus.SUCCESS,
                accessToken,
            };

            console.info(
                `Response to POST login with data ${JSON.stringify(
                    response
                )} | transactionID: ${transactionid} | serviceID ${serviceid}`
            );

            return response;
        } catch (err) {
            return {
                status: err.status ? err.status : httpStatus.INTERNAL_SERVER_ERROR,
                message: err.message,
            };
        }
        

    }

    validateAccessTokenData(email, password){
        if (!email || !password) {
            throw new UserException(httpStatus.UNAUTHORIZED, 
                "Email and Password must be informed.");
        }
    }
    
    async validatePassword(password, hasPassword){
        if (!await bcrypt.compare(password, hasPassword)){
            throw new UserException(httpStatus.UNAUTHORIZED, 
                "Password doesn't match.");
        }
    }
}

export default new UserService();