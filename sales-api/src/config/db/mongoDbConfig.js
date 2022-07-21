import mongoose from "mongoose";

import { MONGO_DB_URL } from "../secrets/secrets.js";

export function connect() {
    mongoose.connect(MONGO_DB_URL, {
        useNewUrlParser: true,
    });
    console.info('passou')

    mongoose.connection.on('connected', function() {
            console.info('The application connected to MongoDB successfully.')
    });

    mongoose.connection.on('error', function() {
        console.error('The application not connected to MongoDB successfully.')
    });
}

