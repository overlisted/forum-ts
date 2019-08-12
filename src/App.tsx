import React from 'react';
// TODO: так как это движок форума, сделать настраиваемым
import './default-style.css';
import HomePage from './HomePage';
import ThreadViewPage from './ThreadViewPage';
import logo from './logo.png';
import { RegisterPage, LoginPage } from './LoginPage';
import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';
import {
  AvatarProps,
  MarkdownFormWithToolsProps,
  HeaderProps,
  ErrorTextProps,
  RouteContentProps,
  RouteLinkProps,
  NavbarLink
} from './interfaces'

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

let loadAvatar: any = function(userId: string) {
  try {
    return require("./storage/avatars/" + userId + ".png")
  } catch(e) {}
};

class Avatar extends React.Component<AvatarProps> {
  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
      return(
        <div className={"avatar"}>
          <img src={require("./storage/avatars/default.png")} alt={"Аватар пользователя"}/>
          <img src={loadAvatar(this.props.userId)} alt={""} style={{marginLeft: "-200px"}}/>
        </div>
      )
  }
}

// TODO
class MarkdownFormWithTools extends React.Component<MarkdownFormWithToolsProps> {
  constructor(props: MarkdownFormWithToolsProps) {
    super(props);
    this.state = {}
  }

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return(
      <form onSubmit={() => this.props.onSubmit()}>

      </form>
    )
  }
}

// TODO: так как это движок форума, сделать настраиваемым
let navbarElements: NavbarLink[] = [
  {displayName: "Главная", path: "/", visibleGroups: ["any"]},
  {displayName: "Группы", path: "/groups", visibleGroups: ["any"]},
  {displayName: "Личный кабинет", path: "/personal", visibleGroups: ["any"]},
  {displayName: "Панель управления", path: "/admin", visibleGroups: ["admin"]}
];

function signIn(email: string, password: string) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
}

// TODO: переход на модуль react-router
let RouteContent: React.FC<RouteContentProps> = function(props) {
  if (props.url === '/') {
    return <HomePage/>
  } else if (/^\/thread$/.test(props.url)) {
    return <ErrorText errorCode={errorsTSF[1]}/>
  } else if (/^\/thread\//.test(props.url)) {
    const threadId = parseInt(props.url.replace(/^\/thread\//, ""));
    if(isFinite(threadId)) {
      return <ThreadViewPage threadId={threadId}/>
    } else {
      return <ErrorText errorCode={errorsTSF[2]}/>
    }
  } else if (/^\/personal/.test(props.url)) {
    // TODO
    return null
  } else if (/^\/admin/.test(props.url)) {
    // TODO
    return null
  } else if (/^\/groups/.test(props.url)) {
    // TODO
    return null
  } else if (/^\/login/.test(props.url)) {
    return <LoginPage signIn={signIn}/>
  } else if (/^\/register/.test(props.url)) {
    return <RegisterPage/>
  } else {
    return <ErrorText errorCode={errorsTSF[0]}/>
  }
};

let RouteLink: React.FC<RouteLinkProps> = function(props) {
  function linkClickedEvent(e: React.MouseEvent) {
    e.persist();
    if (!e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      routeTo(props.href);
    }
  }

  if(props.isButton) {
    return <button onClick={linkClickedEvent} className="button">{props.displayName}</button>
  } else {
    return <a href={props.href} onClick={linkClickedEvent} className="link">{props.displayName}</a>
  }
};

let errorsHTTP = [
  {HTTP404: "Страница не найдена. Если адрес страницы, на которой вы находитесь, писали не вы, обратитесь к администратору."}
];

let errorsTSF = [
  errorsHTTP[0].HTTP404,
  "В адресной строке не указан Thread ID. Если адрес страницы, на которой вы находитесь, писали не вы, обратитесь к администратору.",
  "В адресной строке Thread ID указан с участием букв, а не цифр. Если адрес страницы, на которой вы находитесь, писали не вы, обратитесь к администратору."
];

class ErrorText extends React.Component<ErrorTextProps> {
  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return(
      <div className="content error">
        <p>Ошибка!</p>
        <p>Номер ошибки: {errorsTSF.indexOf(this.props.errorCode) + 1}</p>
        <p>{this.props.errorCode}</p>
      </div>
    )
  }
}

let App: React.FC = function() {
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
      if (user) {
        console.log('user is signed in');
      } else {
        console.log('user is signed out');
      }
      setUser(user);
    });
  }, []);


  return (
    <div className="body">
      <Header user={user}/>
      <div className="body-wrapper">
        <RouteContent url={url}/>
        <Sidebar/>
      </div>
    </div>
  );
};

let Header: React.FC<HeaderProps> = function(props) {
  return(
    // TODO: так как это движок форума, сделать настраиваемым
    <header>
      <img className="logo" src={logo} alt="Логотип"/>
      <Navbar user={props.user}/>
    </header>
  )
};

let Navbar: React.FC<HeaderProps> = function(props) {
  let navbarElementKey: number = 0;
  return(
    // TODO: так как это движок форума, сделать настраиваемым
    <ul>
      {
        navbarElements.map(element => {
          navbarElementKey++;
          return (
            <li key={navbarElementKey}>
              <RouteLink href={element.path} displayName={element.displayName} isButton={false}/>
            </li>
          );
        })
      }
      {!props.user && <LoginButton/>}
      {props.user && <div>{props.user.email}</div>}
    </ul>
  )
};

let Sidebar: React.FC = function() {
  // TODO: так как это движок форума, сделать настраиваемым
  return(
    // TODO: так как это движок форума, сделать настраиваемым
    <aside>
      <div className="latest-statuses">
        <LatestStatuses/>
      </div>
    </aside>
  );
};

let LatestStatuses: React.FC = function() {
  // TODO
  return(
    <p>Последние статусы</p>
  )
};

let LoginButton: React.FC = function () {
  // TODO: сделать по куки или как-то так проверку на логин
  return(
    <li>
      <RouteLink href="/login" displayName={"Войти"} isButton={false}/>
    </li>
  )
};

export { RouteLink, Avatar };
export default App;