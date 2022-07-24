import Sequelize from "sequelize";

const sequelize = new Sequelize("auth-db", "admin", "123456", {
    host: "localhost",
    dialect: "postgres",
    port: "5434",
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