import React from 'react';
// TODO: так как это движок форума, сделать настраиваемым
import './default-style.css';
import HomePage from './HomePage';
import ThreadViewPage from './ThreadViewPage';
import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';
import 'firebase/storage'
import autobind from 'autobind-decorator';
import {
  AvatarProps,
  BoxProps,
  ErrorTextProps,
  MarkdownFormWithToolsProps,
  NavbarLink,
  RouteContentProps,
  RouteLinkProps,
  Renderable,
  EventRowProps,
  RegisterPageProps,
  LoginPageProps
} from './types'

const firebaseConfig = {
  apiKey: "AIzaSyDXfBSMI1Hh3xOXBeEA-E0BjYeFm3xo_IM",
  authDomain: "forum-ts.firebaseapp.com",
  databaseURL: "https://forum-ts.firebaseio.com",
  projectId: "forum-ts",
  storageBucket: "forum-ts.appspot.com",
  messagingSenderId: "149363423360",
  appId: "1:149363423360:web:db465a8af13e0eef"
};

firebase.initializeApp(firebaseConfig);

export function routeTo(href: string) {
  window.history.pushState({}, '', href);
  const tsForumEvent: CustomEvent = new CustomEvent('tsf-route-change', {detail: href});
  window.document.dispatchEvent(tsForumEvent);
}

// @ts-ignore
window.firebase = firebase;

// TODO
class MarkdownFormWithTools extends React.Component<MarkdownFormWithToolsProps> {
  constructor(props: MarkdownFormWithToolsProps) {
    super(props);
    this.state = {}
  }

  render(): Renderable {
    return(
      <form onSubmit={() => this.props.onSubmit()}>

      </form>
    )
  }
}

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

class RouteContent extends React.Component<RouteContentProps> {
  render(): Renderable {
    if (this.props.url === '/') {
      return <HomePage/>
    } else if (/^\/thread$/.test(this.props.url)) {
      return <ErrorText errorCode={errorsTSF[1]}/>
    } else if (/^\/thread\//.test(this.props.url)) {
      const threadId = parseInt(this.props.url.replace(/^\/thread\//, ""));
      if (isFinite(threadId)) {
        return <ThreadViewPage threadId={threadId}/>
      } else {
        return <ErrorText errorCode={errorsTSF[2]}/>
      }
    } else if (/^\/personal/.test(this.props.url)) {
      // TODO
      return null
    } else if (/^\/admin/.test(this.props.url)) {
      // TODO
      return null
    } else if (/^\/groups/.test(this.props.url)) {
      // TODO
      return null
    } else if (/^\/login/.test(this.props.url)) {
      return <LoginForm signIn={signIn}/>
    } else if (/^\/register/.test(this.props.url)) {
      return <RegisterForm createUser={createUser}/>
    } else {
      return <ErrorText errorCode={errorsTSF[0]}/>
    }
  }
};

class ThreadRow extends React.Component{
  render(): Renderable {
    return (
      <div className="thread-row">
        {this.props.children}
      </div>
    )
  }
}

class EventRow extends React.Component<EventRowProps> {
  render(): Renderable {
    return (
      <ThreadRow>
        <p className={"event-row-title"}>
          <b>{this.props.subject}</b>
          <i> {this.props.predicate} </i>
          <b>{this.props.object}</b>
        </p>

        <p className={"event-row-event-sample"}>
          { this.props.children }
        </p>
      </ThreadRow>
    );
  }
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

class RouteLink extends React.Component<RouteLinkProps> {
  linkClickedEvent(e: React.MouseEvent): void {
    e.persist();
    if (!e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      routeTo(this.props.href);
    }
  }

  render(): Renderable {
    if (this.props.isButton) {
      return <button onClick={this.linkClickedEvent} className="button">{this.props.children}</button>
    } else {
      return <a href={this.props.href} onClick={this.linkClickedEvent} className={"link " + this.props.className}>{this.props.children}</a>
    }
  }
}

const errorsHTTP = [
  {HTTP404: "Страница не найдена. Если адрес страницы, на которой вы находитесь, писали не вы, обратитесь к администратору."}
];

const errorsTSF = [
  errorsHTTP[0].HTTP404,
  "В адресной строке не указан Thread ID. Если адрес страницы, на которой вы находитесь, писали не вы, обратитесь к администратору.",
  "В адресной строке Thread ID указан с участием букв, а не цифр. Если адрес страницы, на которой вы находитесь, писали не вы, обратитесь к администратору."
];

class ErrorText extends React.Component<ErrorTextProps> {
  render(): Renderable {
    return(
      <div className="content error">
        <p>Ошибка!</p>
        <p>Номер ошибки: {errorsTSF.indexOf(this.props.errorCode) + 1}</p>
        <p>{this.props.errorCode}</p>
      </div>
    )
  }
}

const UserContext = React.createContext<firebase.User | null>(null);
let App: React.FC = function() {
  const [loading, setLoading] = React.useState(true);
  const [url, setUrl] = React.useState(window.location.pathname);
  const [user, setUser] = React.useState<firebase.User | null>(firebase.auth().currentUser);

  React.useMemo(() => {
    //@ts-ignore
    window.document.addEventListener('tsf-route-change', (e: CustomEvent) => {
      setUrl(e.detail);
    });
  }, []);

  React.useMemo(() => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (loading) { setLoading(false); }
      setUser(user);
    });
  }, [loading]);

  return (
      <div className="body">
        {loading && 'Loading...'}
        {!loading &&
          <UserContext.Provider value={user}>
            <Header/>
            <div className="body-wrapper">
              <div className={"main-boxes-column"}>
              <RouteContent url={url}/>
              </div>
              <Sidebar/>
            </div>
          </UserContext.Provider>
        }
      </div>
  );
};

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
                    <RouteLink href={element.path} className={"navbar-link"}>{element.displayName}</RouteLink>
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
        routeTo('/');
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

        <RouteLink href={"/forgot"} className={"forgot-password-link"}>Забыли пароль?</RouteLink>
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
                  <RouteLink href={"/user/" + context.displayName} className={"personal-panel-username"}>{context.displayName}</RouteLink>
                </div>
                <RouteLink href={"/settings"}>Настройки аккаунта</RouteLink>
                <RouteLink href={"/user/" + context.displayName + "/followers" }>Подписчики</RouteLink>
                <RouteLink href={"/messages" }>Сообщения</RouteLink>
                <p onClick={() => firebase.auth().signOut()} className={"link"}>Выйти</p>
              </Box>
            )
          }
        }}
      </UserContext.Consumer>
    )
  }
}

export { RouteLink, Box, EventRow };
export default App;