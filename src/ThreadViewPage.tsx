import React from "react";
import Markdown from "react-markdown";
import {
  ThreadGenerationProps,
  ThreadMessageGenerationProps
} from './types';

/** @deprecated */
class MessageAuthorPane extends React.Component<ThreadGenerationProps> {
  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return(
      <div className="message-author-pane">
        {/*<Avatar userId={JSON.stringify(-1)}/>*/}
      </div>
    )
  }
}

/** @deprecated */
class ThreadMessage extends React.Component<ThreadGenerationProps> {
  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return(
      <div className="thread-message">
        <MessageAuthorPane threadId={this.props.threadId}/>
        <Markdown source={"## TODO\nСкачивание контента треда из файербазы"}/>
      </div>
    )
  }
}

/** @deprecated */
class ThreadTitle extends React.Component<ThreadGenerationProps> {
  render() {
    return (
        <p className="thread-title">TODO: import title from database {JSON.stringify(this.props.threadId)}</p>
    );
  }
}

/** @deprecated */
class ThreadMessagesGenerator extends React.Component<ThreadGenerationProps> {
  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    let allMessages = <ThreadMessage threadId={this.props.threadId}/>;
    //TODO
    return allMessages
  }
}

/** @deprecated */
class ThreadMessageForm extends React.Component<ThreadGenerationProps> {
  render() {
    return (
      <div className="thread-message-form">
        <p>Оставить свое сообщение</p>
      </div>
    );
  }
}

/** @deprecated */
class ThreadViewPage extends React.Component<ThreadGenerationProps> {
  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return(
      <div className="content thread">
        <ThreadTitle threadId={this.props.threadId}/>
        <ThreadMessagesGenerator threadId={this.props.threadId}/>
        <ThreadMessageForm threadId={this.props.threadId}/>
      </div>
    )
  }
}

export default ThreadViewPage;