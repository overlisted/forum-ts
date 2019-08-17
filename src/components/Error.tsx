import React from "react";
import {ErrorTextProps, Renderable} from "../types";
import {Box} from "../App";

const errorsHTTP = [
  {HTTP404: "Страница не найдена. Если адрес страницы, на которой вы находитесь, писали не вы, обратитесь к администратору."}
];

const errorsTSF = [
  errorsHTTP[0].HTTP404,
  "В адресной строке не указан Thread ID. Если адрес страницы, на которой вы находитесь, писали не вы, обратитесь к администратору.",
  "В адресной строке Thread ID указан с участием букв, а не цифр. Если адрес страницы, на которой вы находитесь, писали не вы, обратитесь к администратору."
];

class Error extends React.Component<ErrorTextProps> {
  constructor(props: ErrorTextProps) {
    super(props);
    console.error(this.props.errorCode + ": " + errorsTSF[this.props.errorCode])
  }

  render(): Renderable {
    return(
      <Box title={"Ошибка!"} className={"error"}>
        <p>Номер ошибки: {this.props.errorCode + 1}</p>
        <p>{errorsTSF[this.props.errorCode]}</p>
      </Box>
    )
  }
}

export default Error