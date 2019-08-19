// @ts-ignore
import admin from "firebase-admin";
import express from "express";
const server = express();
// Вы должны скачать закрытый ключ по ссылке
// console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk (выбрав там свой проект)
// и переименовать скачанный файл в serviceAccount.json. Затем положите его по соседству с файлом server.ts.ts
const serviceAccount = require('./serviceAccount.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://forum-ts.firebaseio.com"
});
const jsonParser = express.json();

server.post('/register', jsonParser, (req: express.Request, res: express.Response) => {
  if(req.body.username && req.body.email && req.body.password) {
    admin.auth().getUserByEmail(req.body.email)
      .then((userRecord: admin.auth.UserRecord) => {
        res.send("Email is already in use.");
      }).catch(error => {
      admin.auth().getUser(req.body.username)
        .then((userRecord: admin.auth.UserRecord) => {
          res.send("Username is already in use.");
        })
        .catch(error => {
          console.log();
          admin.auth().createUser({
            uid: req.body.username,
            email: req.body.email,
            password: req.body.password,
            emailVerified: false
          })
            .then((userRecord: admin.auth.UserRecord) => {
              res.sendStatus(200)
            }).catch(error => {
              console.log("couln't create new user: " + error);
              res.sendStatus(500);
          })
        });
    });
  } else {
    res.send('JSON Fields "username", "email" and "password" not found.')
  }
});

server.use(express.static('./build'));

server.listen(3002, () => {console.log("ы")});

