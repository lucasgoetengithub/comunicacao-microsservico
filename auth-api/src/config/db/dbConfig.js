import Sequelize from "sequelize";

const sequelize = new Sequelize("auth-db", "postgres", "1y5h8j", {
    host: "localhost",
    dialect: "postgres",
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