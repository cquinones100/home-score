"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var knex_1 = __importDefault(require("knex"));
var app = express_1.default();
app.get('/', function (req, res) {
    res.send('hello world!');
});
var dbConnection = knex_1.default({
    client: 'pg',
    version: '12.2',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        database: 'home-score'
    }
});
var PORT = 3001;
app.listen(PORT, function () {
    console.log("Listening on " + PORT);
});
