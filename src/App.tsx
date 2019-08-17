import React from 'react';
// TODO: так как это движок форума, сделать настраиваемым
import './default-style.css';
import ThreadViewPage from './ThreadViewPage';
import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';
import 'firebase/storage'
import {BoxProps, LoginPageProps, NavbarLink, RegisterPageProps, Renderable} from './types'
import ContentRouter, {Link} from "./router";
import Error from './components/Error';

firebase.initializeApp({
  apiKey: "AIzaSyDXfBSMI1Hh3xOXBeEA-E0BjYeFm3xo_IM",
  authDomain: "forum-ts.firebaseapp.com",
  databaseURL: "https://forum-ts.firebaseio.com",
  projectId: "forum-ts",
  storageBucket: "forum-ts.appspot.com",
  messagingSenderId: "149363423360",
  appId: "1:149363423360:web:db465a8af13e0eef"
});

// @ts-ignore
window.firebase = firebase;

// TODO: так как это движок форума, сделать настраиваемым
let navbarElements: NavbarLink[] = [
  {displayName: "Главная", path: "/", visibleGroups: ["any"]},
  {displayName: "Чат", path: "/chat", visibleGroups: ["any"]},
  {displayName: "Пользователи", path: "/users", visibleGroups: ["any"]},
  {displayName: "Поиск", path: "/search", visibleGroups: ["any"]},
  {displayName: "Панель управления", path: "/admin", visibleGroups: ["admin"]}
];

function signIn(email: string, password: string) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
}

function createUser(email: string, password: string) {
  return firebase.auth().createUserWithEmailAndPassword(email, password)
}

class Box extends React.Component<BoxProps> {
  render(): Renderable {
    return(
      <div className={"box"}>
        <div className={"box-title-wrapper"}>
          <p className="box-title">{this.props.title}</p>
        </div>

        <div className={"box-contents " + this.props.className + " aside-box-" + this.props.isAsideBox}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

const UserContext = React.createContext<firebase.User | null>(null);
class App extends React.Component {
  constructor(props: any) {
    super(props);
    ContentRouter.addRoutes([
      {url: /^\/thread$/, renderComponent: () => <Error errorCode={1}/>},
      {url: /^\/thread\//, renderComponent: () => {
          const threadId = parseInt(this.state.url.replace(/^\/thread\//, ""));
          if (isFinite(threadId)) {
            return <ThreadViewPage threadId={threadId}/>
          } else {
            return <Error errorCode={2}/>
          }
        }},
    ]);
  }

  state = {
    loading: true,
    url: window.location.pathname,
    user: null
  };

  routeChangeListener = (e: any): void => { this.setState({url: e.detail}) };

  componentDidMount(): void {
    window.document.addEventListener('tsf-route-change', this.routeChangeListener);

    firebase.auth().onAuthStateChanged((user) => {
      if (user) this.setState({loading: false});
      this.setState({user: user});
    });
  }

  componentWillUnmount(): void { window.document.removeEventListener('tsf-route-change', this.routeChangeListener) }

  render(): Renderable {
    return (
      <div className="body">
        {this.state.loading && 'Loading...'}
        {!this.state.loading &&
          <UserContext.Provider value={this.state.user}>
            <Header/>
            <div className="body-wrapper">
              <div className={"main-boxes-column"}>
              <ContentRouter url={this.state.url}/>
              </div>
              <Sidebar/>
            </div>
          </UserContext.Provider>
        }
      </div>
    );
  }
}

class Header extends React.Component {
  render(): Renderable {
    return(
      // TODO: так как это движок форума, сделать настраиваемым
      <header>
        <Navbar/>
        <p className="logo-text">forum-ts</p>
      </header>
    )
  }
}

class Navbar extends React.Component {
  state = {
    hide: false
  };

  onScroll = () => {
    if(window.scrollY > 60) {
      if (!this.state.hide) {
        this.setState({hide: true});
      }
    } else {
      if (this.state.hide) {
        this.setState({hide: false});
      }
    }
  };

  componentDidMount(): void {
    window.addEventListener('scroll', this.onScroll)
  }

  componentWillUnmount(): void {
    window.removeEventListener('scroll', this.onScroll)
  }

  render(): Renderable {
    return (
      // TODO: так как это движок форума, сделать настраиваемым
      <nav>
        <div className={"navbar-line"}/>
        <ul>
          {
            navbarElements.map(element => {
              let isHidden: boolean = true;
              if (window.location.pathname === element.path) {
                isHidden = false
              }
              return (
                <li key={navbarElements.indexOf(element)}>
                  <div className={"active-link-line hidden-" + isHidden}/>
                  <div className={"active-link-" + !isHidden + " navbar-hidden-" + this.state.hide}>
                    <Link href={element.path} className={"navbar-link"}>{element.displayName}</Link>
                  </div>
                </li>
              );
            })
          }
        </ul>
      </nav>
    )
  }
}

class Sidebar extends React.Component {
  // TODO: так как это движок форума, сделать настраиваемым
  render(): Renderable {
    return(
    // TODO: так как это движок форума, сделать настраиваемым
      <aside>
        <PersonalPanel/>
        <Box title={"Последние статусы"} isAsideBox={true}>
          <div className={"aside-content latest-statuses"}>

          </div>
        </Box>
      </aside>
    );
  }
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
                <Box isAsideBox={true} title={"Вход"}>
                  <LoginForm signIn={signIn}/>
                </Box>

                <Box isAsideBox={true} title={"Регистрация"}>
                  <RegisterForm createUser={createUser}/>
                </Box>
              </>
            )
          } else {
            return(
              <Box isAsideBox={true} title={"Личный кабинет"} className={"personal-panel"}>
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

export { Box };
export default App;