import Sequelize from "sequelize";
import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } from '../constants/secrets.js';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: "postgres",
    port: DB_PORT,
    quoteIdentifiers: false,
    define: {
        syncOnAssiociation: true,
        timestamps: false,
        underscored: true,
        freezeTableName: true
    },
});

sequelize
.authenticate()
.then(() => {
    console.info("Connection has been stablished!")
})
.catch((err) => {
    console.error("Unable to connect to the database.");
    console.error(err.messeage);
})

export default sequelize;