"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./src/app"));
const db_1 = require("./src/config/db");
const PORT = process.env.PORT;
async function startServer() {
    await (0, db_1.connectDB)();
    app_1.default.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}`);
    });
}
startServer();
