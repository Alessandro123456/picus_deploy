import React from "react";

// reactstrap components
import { Container } from "reactstrap";

function Home () {
    return (
        <div id="home" className="page-header clear-filter" filter-color="blue" style={{ background: "linear-gradient(0deg, rgba(44, 44, 44, 0.2), #021c389c)", minHeight: "none", maxHeight: "none" }}>
        <div
          className="page-header-image"
          style={{
            backgroundImage: "url(" + require("assets/img/header_dieti.jpg") + ")",
          }}
          ref={React.createRef()}
        ></div>
        <Container>
          <div className="content-center brand">
            <h1 className="h1-seo"><img style={{ width: "299px", maxWidth: "none" }}
              alt="..."
              className="n-logo"
              src={require("assets/img/picus.png")}
            ></img>
            </h1>
            <h3>Prenotazione Intelligente Corsi Universitari in Sicurezza</h3>
          </div>
        </Container>
      </div>
    )
}

export default Home;