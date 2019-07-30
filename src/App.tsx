import React from 'react';
// TODO: так как это движок форума, сделать настраиваемым
import './App.css';
import HomePage from './HomePage'
//import logo from '../logo.png';

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
let GetBody: React.FC = function() {
  if(/^\/thread/.test(window.location.pathname)) {
    //TODO
    return null
  } else {
    return <HomePage/>
  }
};

let App: React.FC = function() {
  return (
    <div className="body">
      <Header/>
      <p>вы дебилы где форум</p>
      <GetBody/>
      <Sidebar/>
    </div>
  );
};

let Header: React.FC = function() {
  return(
    // TODO: так как это движок форума, сделать настраиваемым
    <header>
      {/*<img className="logo" src={logo} alt="Логотип"/>*/}
      <Navbar/>
    </header>
  )
};

let Navbar: React.FC = function() {
  return(
    // TODO: так как это движок форума, сделать настраиваемым
      <ul>
        {
          navbarElements.map(element => {
            return (
              <li>
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
    <div>
      <p>Последние статусы</p>
      <LatestStatuses/>
    </div>
  );
};

let LatestStatuses: React.FC = function() {
  // TODO
  return null
};

export default App;
