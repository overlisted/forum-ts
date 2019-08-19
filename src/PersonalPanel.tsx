import {Renderable} from "./types";
import {Link} from "./router";
import firebase from "firebase";
import Box from "./components/Box";
import React from "react";
import { UserContext } from "./App";

class PersonalPanel extends React.Component {
  render(): Renderable {
    return(
      <UserContext.Consumer>
        {(context: firebase.User | null) => {
          if (context) {
            return(
              <Box asideBox={true} title={"Личный кабинет"} className={"personal-panel"}>
                <div className={"personal-panel-title"}>
                  <img src={context.photoURL ? context.photoURL : undefined} className={"personal-panel-img"} alt={""}/>
                  {/*TODO*/}
                  <div className={"personal-panel-text-wrapper"}>
                    <p className={"personal-panel-role personal-panel-role-user"}>Пользователь</p>
                    <Link href={"/user/" + context.uid} className={"personal-panel-username"}>{context.uid}</Link>
                    <p className={"personal-panel-role-secret-wrapper"}>Пользователь</p>
                  </div>
                </div>
                <div className={"personal-panel-links"}>
                  <Link href={"/settings"}>Настройки аккаунта</Link>
                  <Link href={"/user/" + context.displayName + "/followers"}>Подписчики</Link>
                  <Link href={"/messages"}>Сообщения</Link>
                  <p onClick={() => firebase.auth().signOut()} className={"link"}>Выйти</p>
                </div>
              </Box>
            )
          }
        }}
      </UserContext.Consumer>
    )
  }
}

export default PersonalPanel;