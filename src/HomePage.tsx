import React from "react";
import {Box, EventRow} from "./App";
import {
  Renderable
} from "./types";

class HomePage extends React.Component {
  render(): Renderable {
    return(
      <div className="content home">
        <Box title={"Последние сообщения"} isAsideBox={false}>
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
      </div>
    )
  }
}

export default HomePage;