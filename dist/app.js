"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./db/config"));
const routes_1 = __importDefault(require("./routes"));
require("express-async-errors");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(routes_1.default);
config_1.default.sync();
app.listen(3000, () => {
    console.log("Server started on port 3000");
});
