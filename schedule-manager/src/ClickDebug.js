import React from "react";

export default function ClickDebug({ func, buttonText }) {
  return(
      <button onClick={() => func()}>
        { buttonText }
      </button>
  )
}