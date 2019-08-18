import React from "react";
import {BoxProps, Renderable} from "../types";

class Box extends React.Component<BoxProps> {
  render(): Renderable {
    if(this.props.title) {
      return(
        <div className={"box"}>
          <div className={"box-title-wrapper"}>
            <p className="box-title">{this.props.title}</p>
          </div>

          <div
            className={
              "box-contents "
              + (this.props.className ? this.props.className : "")
              + " aside-box-" + !!this.props.asideBox
            }
          >
            {this.props.children}
          </div>
        </div>
      )
    } else {
      return(
        <div className={"box titleless-box"}>
          <div
            className={
              "box-contents titleless-box-contents "
              + (this.props.className ? this.props.className : "")
              + " aside-box-" + !!this.props.asideBox
            }
          >
            {this.props.children}
          </div>
        </div>
      )
    }
  }
}

export default Box;