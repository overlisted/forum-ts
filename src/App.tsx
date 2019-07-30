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

// TODO: так как это движок форума, сделать настраиваемым
let navbarElements: NavbarLink[] = [
  {displayName: "Главная", path: "/", visibleGroups: ["any"]},
  {displayName: "Группы", path: "/groups", visibleGroups: ["any"]},
  {displayName: "Личный кабинет", path: "/personal", visibleGroups: ["any"]},
  {displayName: "Панель управления", path: "/admin", visibleGroups: ["admin"]}
];

// TODO: переход на модуль react-router
let RouteContent: React.FC = function() {
  if(window.location.pathname === "/") {
    return <HomePage/>
  } else if(/^\/thread/.test(window.location.pathname)) {
    return <ThreadViewPage/>
  } else if(/^\/personal/.test(window.location.pathname)) {
    // TODO
    return null
  } else if(/^\/admin/.test(window.location.pathname)) {
    // TODO
    return null
  } else if(/^\/groups/.test(window.location.pathname)) {
    // TODO
    return null
  } else {
    // TODO
    return(
      <p>{window.location.href} - адрес не найден, 404</p>
    )
  }
};

let App: React.FC = function() {
  return (
    <div className="body">
      <Header/>
      <div className="bodyWrapper">
        <RouteContent/>
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
                <a href={element.path}>{element.displayName}</a>
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
