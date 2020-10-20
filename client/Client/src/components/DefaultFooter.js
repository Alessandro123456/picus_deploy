/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container } from "reactstrap";

// core components

function DefaultFooter() {
  return (
    <>
      <footer className="footer footer-default" style={{ background: "#ede9e9"}}>
        <Container>
          <nav>
            <ul>
              <li>
                <a target="_blank" >
                  In memoria del Professore Antonio Picariello
                </a>
              </li>           
            </ul>
          </nav>
        </Container>
      </footer>
    </>
  );
}

export default DefaultFooter;
