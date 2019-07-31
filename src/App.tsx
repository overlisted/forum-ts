import React from 'react';
// TODO: так как это движок форума, сделать настраиваемым
import './default-style.css';
import HomePage from './HomePage';
import ThreadViewPage from './ThreadViewPage';
import logo from './logo.png';

interface NavbarLink {
  displayName: string;
  path: string;
  // TODO
  visibleGroups: string[];
}

interface RouteContentProps { url: string }

interface RouteLinkProps {
  href: string,
  displayName: string
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
  function updateContent() {
    if (props.url === "/") {
      return <HomePage/>
    } else if (/^\/thread/.test(props.url)) {
      return <ThreadViewPage/>
    } else if (/^\/personal/.test(props.url)) {
      // TODO
      return null
    } else if (/^\/admin/.test(props.url)) {
      // TODO
      return null
    } else if (/^\/groups/.test(props.url)) {
      // TODO
      return null
    } else {
      // TODO
      return (
        <p>{window.location.href} - адрес не найден, 404</p>
      )
    }
  }

  return updateContent();
};

let RouteLink: React.FC<RouteLinkProps> = function(props) {
  function linkClickedEvent(e: string) {
    window.history.pushState({}, '', e);

    const tsForumEvent: CustomEvent = new CustomEvent('tsf-route-change', {detail: e});
    window.document.dispatchEvent(tsForumEvent);
  }
  return <span onClick={() => linkClickedEvent(props.href)}>{props.displayName}</span>
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
                <RouteLink href={element.path} displayName={element.displayName}/>
              </li>
            );
          })
        }
      </ul>
  )
};

let Sidebar: React.FC = function() {
  // TODO: так как это движок форума, сделать настраиваемым
  return(
    // TODO: так как это движок форума, сделать настраиваемым
    <aside>
      <div className="statuses">
        <p>Последние статусы</p>
        <LatestStatuses/>
      </div>
    </aside>
  );
};

let LatestStatuses: React.FC = function() {
  // TODO
  return null
};

export default App;
