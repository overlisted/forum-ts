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

let db = admin.firestore();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//
// обработка регистрации
//
app.post('/register', jsonParser, (req: express.Request, res: express.Response) => {
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

//
// раздача статики
//
app.use(express.static('./build'));

//
// обработка прочтения треда
//
app.post("/readThread", jsonParser, (req: express.Request, res: express.Response) => {
  console.log("[forum-ts server] 1 | [read thread] Someone is trying to read a thread...");
  db.collection("threads").doc(req.body.threadId).get()
    .then(snapshot => {
      if(!snapshot.data()) {
        console.log("[forum-ts server] 2 | [ERROR] [read thread] Thread doesn't exist.");
        res.json({error: "Thread doesn't exist."});
      } else {
        console.log('[forum-ts server] 2 | [read thread]', snapshot.id, snapshot.data());
        res.json(snapshot.data())
      }
    })
    .catch(e => {
      console.log('[forum-ts server] 2 | [ERROR] [read thread]', e);
      res.json({error: e});
    });
});


//
// обработка прочтения сообщения под тредом
//
app.post("/readMessage", jsonParser, (req: express.Request, res: express.Response) => {
  console.log("[forum-ts server] 1 | [read message] Someone is trying to read a message...");
  db.collection("threads").doc(req.body.threadId).collection("messages").doc(req.body.messageId).get()
    .then(snapshot => {
      if(!snapshot.data()) {
        console.log("[forum-ts server] 2 | [ERROR] [read message] Message doesn't exist.");
        res.json({error: "Message doesn't exist."});
      } else {
        console.log('[forum-ts server] 2 | [read message]', snapshot.id, snapshot.data());
        res.json(snapshot.data())
      }
    })
    .catch(e => {
      console.log('[forum-ts server] 2 | [ERROR] [read message]', e);
      res.json({error: e});
    });
});

//
// обработка написания треда
//
app.post("/writeThread", jsonParser, (req: express.Request, res: express.Response) => {
  console.log("[forum-ts server] 1 | [write thread] Someone is trying to write a thread...");
  db.collection("threads").add({
    title: req.body.title,
    author: req.body.author
  })
    .then(ref => {
      console.log("[forum-ts server] 2 | [write thread] Wrote a thread, writing a message...");
      ref.collection("messages").add({
        author: req.body.author,
        contents: req.body.contents
      })
        .then(doc => {
          console.log("[forum-ts server] 3 | [write thread] [write message] Wrote a message...\n");
          res.status(200);
        })
        .catch(e => {
          console.log("[forum-ts server] 3 | [ERROR] [write thread] [write message]", e, "\n");
          res.json({error: e});
        })
      })
    .catch(e => {
      console.log("[forum-ts server] 2 | [ERROR] [write thread]", e, "\n");
      res.json({error: e});
    })
});

//
// обработка написания сообщения под тредом
//
app.post("/writeMessage", jsonParser, (req: express.Request, res: express.Response) => {
  console.log("[forum-ts server] 1 | [write message] Someone is trying to write a message...");
  if(db.collection("threads").doc(req.body.thread)) {
    console.log("[forum-ts server] 2 | [ERROR] [write message] Thread doesn't exist");
    res.json({error: "Thread doesn't exist"});
  } else {
    db.collection("threads").doc(req.body.thread).collection("messages").add({
      author: req.body.author,
      contents: req.body.contents
    })
      .then(ref => {
        console.log("[forum-ts server] 2 | [write message] Wrote a message:", ref.get().then(snapshot => snapshot.data()));
      })
      .catch(e => {
        console.log("[forum-ts server] 2 | [ERROR] [write message]", e);
        res.json({error: e});
      })
  }
});

app.listen(port, () => {console.log("[forum-ts server] 1 | [routing] Listening to the", port, "port\n")});