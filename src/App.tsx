import React from 'react';
// TODO: так как это движок форума, сделать настраиваемым
import './default-style.css';
import HomePage from './HomePage';
import ThreadViewPage from './ThreadViewPage';
import logo from './logo.png';
import { RegisterPage, LoginPage } from './LoginPage';

interface NavbarLink {
  displayName: string;
  path: string;
  // TODO
  visibleGroups: string[];
}

interface AvatarProps { userId: string }
interface RouteContentProps { url: string }
interface RouteLinkProps {
  href: string,
  displayName: string,
  isButton: boolean
}

interface MarkdownFormWithToolsProps { onSubmit: Function }

let loadAvatar = function (userId: string) {
  try {
    return require("./storage/avatars/" + userId + ".png")
  } catch(e) {
    console.log("can't find avatar of " + userId + "catching the exception")
  }
};

class Avatar extends React.Component<AvatarProps> {
  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
      return(
        <div className={"avatar"}>
          <img src={require("./storage/avatars/default.png")} alt={"Аватар пользователя"}/>
          <img src={loadAvatar(this.props.userId)} alt={""}/>
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

// TODO: переход на модуль react-router
let RouteContent: React.FC<RouteContentProps> = function(props) {
  if (props.url === '/') {
    return <HomePage/>
  } else if (/^\/thread$/.test(props.url)) {
    return <div className="content 404"><p>В адресной строке не указан Thread ID. Если адрес страницы, на которой вы находитесь, писали не вы, обратитесь к администратору.</p></div>
  } else if (/^\/thread/.test(props.url)) {
    return <ThreadViewPage threadId={JSON.parse(props.url.replace(/^\/thread\//, ""))} />
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
    return <LoginPage/>
  } else if (/^\/register/.test(props.url)) {
    return <RegisterPage/>
  } else {
    // TODO
    return <PageNotFound/>
  }
};

let RouteLink: React.FC<RouteLinkProps> = function(props) {
  function linkClickedEvent(e: string) {
    window.history.pushState({}, '', e);
    const tsForumEvent: CustomEvent = new CustomEvent('tsf-route-change', {detail: e});
    window.document.dispatchEvent(tsForumEvent);
  }

  if(props.isButton) {
    return <button onClick={() => linkClickedEvent(props.href)} className="button">{props.displayName}</button>
  } else {
    return <span onClick={() => linkClickedEvent(props.href)} className="link">{props.displayName}</span>
  }
};

let PageNotFound: React.FC = function() {
  return(
    <div className="content 404">
      <p>{window.location.href} - адрес не найден, 404</p>
    </div>
  )
};

let App: React.FC = function() {
  const [url, setUrl] = React.useState(window.location.pathname);

  React.useMemo(() => {
    //@ts-ignore
    window.document.addEventListener('tsf-route-change', (e: CustomEvent) => {
      setUrl(e.detail);
    });
  }, []);
  return (
    <div className="body">
      <Header/>
      <div className="bodyWrapper">
        <RouteContent url={url}/>
        <Sidebar/>
      </div>
    </div>
  );
};

let Header: React.FC = function() {
  return(
    // TODO: так как это движок форума, сделать настраиваемым
    <header>
      <img className="logo" src={logo} alt="Логотип"/>
      <Navbar/>
    </header>
  )
};

let Navbar: React.FC = function() {
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
        <LoginButton/>
      </ul>
  )
};

let Sidebar: React.FC = function() {
  // TODO: так как это движок форума, сделать настраиваемым
  return(
    // TODO: так как это движок форума, сделать настраиваемым
    <aside>
      <div className="statuses">
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
      <RouteLink href="/login" displayName="Войти" isButton={false}/>
    </li>
  )
};

export { RouteLink, Avatar };
export default App;