import React from "react";
const Emoji = (props) => (
  <span
    className="emoji"
    role="img"
    aria-label={props.label ? props.label : ""}
    aria-hidden={props.label ? "false" : "true"}
  >
    <div className="inline hover:bg-gray-200 p-1 ">{props.symbol}</div>
  </span>
);
export default Emoji;
