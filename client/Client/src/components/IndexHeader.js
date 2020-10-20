
import React from "react";
import { Container } from "reactstrap";

function IndexHeader() {
  let pageHeader = React.createRef();

  React.useEffect(() => {
    /*
    if (window.innerWidth > 991) {
      const updateScroll = () => {
        let windowScrollTop = window.pageYOffset / 3;
        pageHeader.current.style.transform =
          "translate3d(0," + windowScrollTop + "px,0)";
      };
      window.addEventListener("scroll", updateScroll);
      return function cleanup() {
        window.removeEventListener("scroll", updateScroll);
      };
    }
    */
  });

  return (
    <>
      <div>
        <div
          ref={pageHeader}
        ></div>
       
      </div>
    </>
  );
}

export default IndexHeader;
