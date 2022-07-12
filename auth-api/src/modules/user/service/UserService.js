import UserRepository from "../repository/userRepository";
import * as httpStatus from "../../../config/constants/httpStatus.js"

class UserSerice {
    
    async findByEmail(req){
        try {
            const { email } = req.params;
            this.validateRequestData(email);
            let user = UserRepository.findByEmail(req);    
            if (!user) {
                 
            } 
            
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
                status: error.status ? error.status : httpStatus.INTERNAL_SERVER_ERROR,
                message: err.status,
            };
        }
        
    }

    validateRequestData(email) {
        if (!email) {
            throw new Error("User email was not informed.");
        }
    }
}

export default UserSerice();