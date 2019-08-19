import React from "react";
import {Renderable} from "../types";
import firebase from "firebase";
import {UserContext} from "../App";
import Box from "./Box";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import PersonalPanel from "../PersonalPanel";

class Sidebar extends React.Component {
  // TODO: так как это движок форума, сделать настраиваемым
  render(): Renderable {
    return(
      // TODO: так как это движок форума, сделать настраиваемым
      <aside>
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
            } else return <PersonalPanel/>
          }}
        </UserContext.Consumer>

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

export default Sidebar;