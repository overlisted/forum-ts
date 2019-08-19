import React from 'react';
// TODO: так как это движок форума, сделать настраиваемым
import './default-style.css';
import ThreadViewPage from './components/ThreadViewPage';
import firebase from "firebase/app";
import "firebase/auth";
import {Renderable} from './types'
import ContentRouter from "./router";
import Error from './components/Error';
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

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
      this.setState({user: user, loading: false});
    });
  }

  componentWillUnmount(): void { window.document.removeEventListener('tsf-route-change', this.routeChangeListener) }

  render(): Renderable {
    return (
      <React.StrictMode>
      <div className="body">
        {this.state.loading && <div className={"loading-line"}/>}
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
      </React.StrictMode>
    );
  }
}

export { UserContext };
export default App;