import express from "express";
import * as db from "./src/config/db/initialData.js";
import userRoutes from "./src/modules/user/routes/userRoutes.js";
import tracing from "./src/config/tracing.js";

const app = express();
const env = process.env;
const PORT = env.PORT || 8080;
const CONTAINER_ENV = "container";

app.get('/api/status', (req, res) => {
    return res.status(200).json({
        service: "Auth-API",
        status: "up",
        httpStatus: 200,
    })
})

app.use(express.json());

startApplication();

function startApplication() {
    if (env.NODE_ENV !== CONTAINER_ENV) {
        db.createInitialData();
    }
}

app.get("/api/initial-data", (req, res) => {
    db.createInitialData();
    return res.json({ message: "Data created." });
})

app.use(tracing);
app.use(userRoutes);


app.listen(PORT, () => {
    console.info('Server started sucessfully at port ${PORT}')
} )