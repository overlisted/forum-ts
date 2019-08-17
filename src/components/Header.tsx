import React from "react";
import {NavbarLink, Renderable} from "../types";
import {Link} from "../router";

let navbarElements: NavbarLink[] = [
  {displayName: "Главная", path: "/", visibleGroups: ["any"]},
  {displayName: "Чат", path: "/chat", visibleGroups: ["any"]},
  {displayName: "Пользователи", path: "/users", visibleGroups: ["any"]},
  {displayName: "Поиск", path: "/search", visibleGroups: ["any"]},
  {displayName: "Панель управления", path: "/admin", visibleGroups: ["admin"]}
];

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

export default Header;