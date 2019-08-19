"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
// @ts-ignore
var firebase_admin_1 = __importDefault(require("firebase-admin"));
var express_1 = __importDefault(require("express"));
var server = express_1["default"]();
// Вы должны скачать закрытый ключ по ссылке
// console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk (выбрав там свой проект)
// и переименовать скачанный файл в serviceAccount.json. Затем положите его по соседству с файлом server.ts.ts
var serviceAccount = require('./serviceAccount.json');
firebase_admin_1["default"].initializeApp({
    credential: firebase_admin_1["default"].credential.cert(serviceAccount),
    databaseURL: "https://forum-ts.firebaseio.com"
});
var jsonParser = express_1["default"].json();
server.post('/register', jsonParser, function (req, res) {
    if (req.body.username && req.body.email && req.body.password) {
        firebase_admin_1["default"].auth().getUserByEmail(req.body.email)
            .then(function (userRecord) {
            res.send("Email is already in use.");
        })["catch"](function (error) {
            firebase_admin_1["default"].auth().getUser(req.body.username)
                .then(function (userRecord) {
                res.send("Username is already in use.");
            })["catch"](function (error) {
                console.log();
                firebase_admin_1["default"].auth().createUser({
                    uid: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    emailVerified: false
                })
                    .then(function (userRecord) {
                    res.sendStatus(200);
                })["catch"](function (error) {
                    console.log("couln't create new user: " + error);
                    res.sendStatus(500);
                });
            });
        });
    }
    else {
        res.send('JSON Fields "username", "email" and "password" not found.');
    }
});
server.use(express_1["default"].static('./build'));
server.listen(3002, function () { console.log("ы"); });
