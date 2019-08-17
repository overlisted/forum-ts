import React from "react";
import {Renderable, ContentRouterProps, RouteLinkProps, RouteRegisterable} from "./types";
import HomePage from "./components/HomePage";
import Error from './components/Error'
import autobind from "autobind-decorator";

function go(href: string) {
  window.history.pushState({}, '', href);
  const tsForumEvent: CustomEvent = new CustomEvent('tsf-route-change', {detail: href});
  window.document.dispatchEvent(tsForumEvent);
}

let RoutesRegistry: RouteRegisterable[] = [
  {url: /^\/$/, renderComponent: () => <HomePage/>}
];

class ContentRouter extends React.Component<ContentRouterProps> {
  static addRoute(route: RouteRegisterable): void { RoutesRegistry.push(route) }
  static removeRoute(route: RouteRegisterable): void { RoutesRegistry.splice(RoutesRegistry.indexOf(route), 1) }
  static addRoutes(routes: RouteRegisterable[]): void {
    routes.forEach((element: RouteRegisterable) => {
      RoutesRegistry.push(element)
    });

    console.log(RoutesRegistry)
  }

  render(): Renderable {
    const route = RoutesRegistry.find((it: RouteRegisterable) => it.url.test(this.props.url));
    return (!route)
      ? <Error errorCode={0}/>
      : route.renderComponent();
  };
}

@autobind
class Link extends React.Component<RouteLinkProps> {
  linkClickedEvent(e: React.MouseEvent): void {
    e.persist();
    if (!e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      go(this.props.href);
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

export default ContentRouter
export { go, Link };
