// @ts-ignore
import admin from "firebase-admin";
import express from "express";
const app = express();
// Вы должны скачать закрытый ключ по ссылке
// console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk (выбрав там свой проект)
// и переименовать скачанный файл в serviceAccount.json. Затем положите его по соседству с файлом server.ts
const serviceAccount = require('./serviceAccount.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://forum-ts.firebaseio.com"
});
const jsonParser = express.json();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/register', jsonParser, (req: express.Request, res: express.Response) => {
  res.header("Content-Type",'application/json');
  console.log("[forum-ts server] [new user] Someone is trying to create an user...");
  if(req.body.username && req.body.email && req.body.password) {
    admin.auth().getUserByEmail(req.body.email)
      .then((userRecord: admin.auth.UserRecord) => {
        res.json({error: {code: "forum-ts/email-already-in-use", message: "Email is already in use."}});
      }).catch(error => {
      admin.auth().getUser(req.body.username)
        .then((userRecord: admin.auth.UserRecord) => {
          res.json({error: {code: "forum-ts/username-already-in-use", message: "Username is already in use."}});
        })
        .catch(error => {
          console.log(error);
          admin.auth().createUser({
            uid: req.body.username,
            email: req.body.email,
            password: req.body.password,
            emailVerified: false
          })
            .then((userRecord: admin.auth.UserRecord) => {
              res.sendStatus(200);
              console.log("new user added:", userRecord)
            })
            .catch(error => {
              console.log("couldn't create new user:", error);
              res.json(error)
          })
        });
    });
  } else {
    res.json('forum-ts/json-properties-does-not-exist')
  }
});

app.use(express.static('./build'));

app.listen(3002, () => {console.log("ы")});