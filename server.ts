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

const port = 80;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/register', jsonParser, (req: express.Request, res: express.Response) => {
  res.header("Content-Type",'application/json');
  console.log("[forum-ts server] 1 | [new user] Someone is trying to create an user...");
  if(req.body.username && req.body.email && req.body.password) {
    admin.auth().getUserByEmail(req.body.email)
      .then((userRecord: admin.auth.UserRecord) => {
        res.json({error: {code: "auth/email-already-in-use", message: "Email is already in use."}});
        console.log("[forum-ts server] 2 | [new user] Its email is already in use, throwing a error...\n");
      }).catch(error => {
      admin.auth().getUser(req.body.username)
        .then((userRecord: admin.auth.UserRecord) => {
          res.json({error: {code: "forum-ts/username-already-in-use", message: "Username is already in use."}});
          console.log("[forum-ts server] 2 | [new user] Its username is already in use, throwing a error...\n");
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
              res.json({success: true});
              console.log("[forum-ts server] 2 | [new user] New user created.\n", userRecord.uid);
            })
            .catch(error => {
              console.log("[forum-ts server] [ERROR] 2 | [new user] Couldn't create a user, throwing a error...\n", error);
              res.json(error)
          })
        });
    });
  } else {
    res.json('forum-ts/json-properties-does-not-exist');
    console.log("[forum-ts server] 2 | [ERROR] [new user] Request is missing some properties.\n");
  }
});

app.use(express.static('./build'));

app.listen(port, () => {console.log("[forum-ts server] 1 | [routing] Listening to the", port, "port\n")});