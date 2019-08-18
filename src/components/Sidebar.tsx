import React from "react";
import {Renderable} from "../types";
import {Link} from "../router";
import firebase from "firebase";
import {UserContext} from "../App";
import Box from "./Box";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

class Sidebar extends React.Component {
  // TODO: так как это движок форума, сделать настраиваемым
  render(): Renderable {
    return(
      // TODO: так как это движок форума, сделать настраиваемым
      <aside>
        <PersonalPanel/>
        <Box title={"Последние статусы"} asideBox={true}>
          <div className={"aside-content latest-statuses"}>

          </div>
        </Box>
      </aside>
    );
  }
}

function createUser(email: string, password: string) {
  return firebase.auth().createUserWithEmailAndPassword(email, password)
}

function signIn(email: string, password: string) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
}

class PersonalPanel extends React.Component {
  render(): Renderable {
    return(
      <UserContext.Consumer>
        {(context: firebase.User | null) => {
          if(!context) {
            return(
              <>
                <Box asideBox={true} title={"Вход"}>
                  <LoginForm signIn={signIn}/>
                </Box>

                <Box asideBox={true} title={"Регистрация"}>
                  <RegisterForm createUser={createUser}/>
                </Box>
              </>
            )
          } else {
            return(
              <Box asideBox={true} title={"Личный кабинет"} className={"personal-panel"}>
                <div className={"personal-panel-title"}>
                  <img src={context.photoURL ? context.photoURL : undefined} className={"personal-panel-img"} alt={""}/>
                  <Link href={"/user/" + context.displayName} className={"personal-panel-username"}>{context.displayName}</Link>
                </div>
                <Link href={"/settings"}>Настройки аккаунта</Link>
                <Link href={"/user/" + context.displayName + "/followers" }>Подписчики</Link>
                <Link href={"/messages" }>Сообщения</Link>
                <p onClick={() => firebase.auth().signOut()} className={"link"}>Выйти</p>
              </Box>
            )
          }
        }}
      </UserContext.Consumer>
    )
  }
}

export default Sidebar;