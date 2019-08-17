import React from "react";
import {LoginPageProps, RegisterPageProps, Renderable} from "../types";
import {Link} from "../router";
import firebase from "firebase";
import {Box, UserContext} from "../App";

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

class RegisterForm extends React.Component<RegisterPageProps> {
  state = {
    username: '',
    email: '',
    password: '',
    passwordRepeat: '',
    error: {
      username: '',
      email: '',
      password: '',
      passwordRepeat: ''
    }
  };

  clearErrors = (): void => { this.setState({error: {password: '', email: '', passwordRepeat: '', username: ''}}); };
  handleUsernameChange = (e: React.FormEvent<HTMLInputElement>) => { this.setState({username: e.currentTarget.value}) };
  handleEmailChange = (e: React.FormEvent<HTMLInputElement>) => { this.setState({email: e.currentTarget.value}) };
  handlePasswordChange = (e: React.FormEvent<HTMLInputElement>) => { this.setState({password: e.currentTarget.value}) };
  handlePasswordRepeatChange = (e: React.FormEvent<HTMLInputElement>) => { this.setState({passwordRepeat: e.currentTarget.value}) };

  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if(this.state.username.length > 14) {
        this.clearErrors();
        this.setState({error: {username: 'Максимальная длинна имени - 14 символов'}});
      } else if(this.state.password !== this.state.passwordRepeat) {
        this.clearErrors();
        this.setState({error: {passwordRepeat: 'Пароли не совпадают.'}});
      } else {
        let newRegisteredUser = await this.props.createUser(this.state.email, this.state.password);
        // некий "конструктор" пользователя после регистрации
        if(newRegisteredUser.user) await newRegisteredUser.user.updateProfile({
          displayName: this.state.username,
          photoURL: "" // TODO: на бэкэнде возвращать аватарки
        });
      }
    } catch(error) {
      this.clearErrors();
      if(error.code === 'auth/wrong-password') {
        this.setState({error: {password: 'Пароль недостаточно надежный.'}});
      } else if(error.code === 'auth/invalid-email') {
        this.setState({error: {email: 'Адрес электронной почты введен или обработан не правильно.'}});
      } else if(error.code === 'auth/email-already-in-use') {
        this.setState({error: {email: 'Адрес электронной почты уже зарегестрирован.'}});
      } else {
        console.log(error.code, error.message);
      }
    }
  };

  render(): Renderable {
    return (
      <form onSubmit={this.handleSubmit}>
        <p>Имя пользователя</p>
        <input name="username" autoComplete="off" required value={this.state.username} onChange={this.handleUsernameChange}/>
        <p className={"auth-error"}>{this.state.error.username}</p>
        <p>Адрес электронной почты</p>
        <input name="email" type="email" autoComplete="off" required value={this.state.email} onChange={this.handleEmailChange}/>
        <p className={"auth-error"}>{this.state.error.email}</p>
        <p>Пароль</p>
        <input name="password" type="password" autoComplete="off" required value={this.state.password} onChange={this.handlePasswordChange}/>
        <p className={"auth-error"}>{this.state.error.password}</p>
        <p>Повторите пароль</p>
        <input name="passwordRepeat" type="password" autoComplete="off" required value={this.state.passwordRepeat} onChange={this.handlePasswordRepeatChange}/>
        <p className={"auth-error"}>{this.state.error.passwordRepeat}</p>
        <input type="submit" className="button" value="Зарегистрироваться"/>
      </form>
    );
  }
}

function signIn(email: string, password: string) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
}

class LoginForm extends React.Component<LoginPageProps> {
  state = {
    email: '',
    password: '',
    error: {
      email: '',
      password: '',
    }
  };

  clearErrors = (): void => { this.setState({error: {password: '', email: ''}}); };
  handleEmailChange = (e: React.FormEvent<HTMLInputElement>) => { this.setState({email: e.currentTarget.value}) };
  handlePasswordChange = (e: React.FormEvent<HTMLInputElement>) => { this.setState({password: e.currentTarget.value}) };
  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await this.props.signIn(this.state.email, this.state.password);
    } catch(error) {
      this.clearErrors();
      if(error.code === 'auth/wrong-password') {
        this.setState({error: 'Введен неверный пароль.'})
      } else if(error.code === 'auth/network-request-failed') {
        this.setState({error: 'Не удается подключиться к серверу авторизации. Возможно, вы потеряли соединение.'})
      } else if(error.code === 'auth/user-disabled') {
        this.setState({error: 'Данный пользователь заморожен.'})
      } else if(error.code === 'auth/invalid-creation-time') {
        this.setState({error: 'Проблемы со временем. Попробуйте использовать другой браузер или проверить настройку часовых поясов.'})
      } else if(error.code === 'auth/invalid-email') {
        this.setState({error: 'Адрес электронной почты введен или обработан не правильно.'})
      } else if(error.code === 'auth/user-not-found') {
        this.setState({error: 'Пользователь не зарегистрирован.'})
      } else {
        console.log(error.code, error.message);
      }
    }
  };

  render(): Renderable {
    return (
      <form onSubmit={this.handleSubmit}>
        <p>Адрес электронной почты</p>
        <input name="email" type="email" autoComplete="on" required value={this.state.email} onChange={this.handleEmailChange}/>
        <p className={"auth-error"}>{this.state.error.email}</p>
        <p>Пароль</p>
        <input name="password" type="password" autoComplete="on" required value={this.state.password} onChange={this.handlePasswordChange}/>
        <p className={"auth-error"}>{this.state.error.password}</p>
        <input type="submit" className="button" value="Войти"/>

        <Link href={"/forgot"} className={"forgot-password-link"}>Забыли пароль?</Link>
      </form>
    );
  }
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