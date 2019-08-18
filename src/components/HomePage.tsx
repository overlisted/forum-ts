import React from "react";
import Box from "./Box";
import {
  EventRowProps,
  Renderable
} from "../types";

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

class HomePage extends React.Component {
  render(): Renderable {
    return(
      <Box title={"Последние сообщения"}>
        <EventRow subject={"vladikbogatov"} predicate={"ответил под темой"} object={"Тут есть геи?"}>
          Лично я вертолет апач аааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааа
        </EventRow>
        <EventRow subject={"vladikbogatov"} predicate={"ответил под темой"} object={"Тут есть геи?"}>
          Лично я вертолет апач аааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааа
        </EventRow>
        <EventRow subject={"vladikbogatov"} predicate={"ответил под темой"} object={"Тут есть геи?"}>
          Лично я вертолет апач аааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааа
        </EventRow>
        <EventRow subject={"vladikbogatov"} predicate={"ответил под темой"} object={"Тут есть геи?"}>
          Лично я вертолет апач аааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааа
        </EventRow>
        <EventRow subject={"vladikbogatov"} predicate={"ответил под темой"} object={"Тут есть геи?"}>
          Лично я вертолет апач аааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааа
        </EventRow>
      </Box>
    )
  }
}

export default HomePage;
export { EventRow, ThreadRow }