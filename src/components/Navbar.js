import React, {useEffect,useState} from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  let location = useLocation();

  // useEffect(() => {
  //  console.log(location.pathname);
  // }, [location]);

  const resetNav = () => {
    setTimeout(() => {
      let nav = document.getElementById('navbarSupportedContent')
      nav.setAttribute('class','collapse navbar-collapse')
    }, 100);
  }

  return (
    <div>
      <nav className="navbar fixed-top navbar-dark navbar-expand-lg bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            News Murphy
          </Link>
          <button
            id="nav-toggle-button"
            className="navbar-toggler"
            type="button"
            style={{border: 'none'}}
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item nav-item-link" style={{border: 'none'}}
                onClick={resetNav()}
              >
                <Link className={`nav-item nav-link ${location.pathname === "/"? "active border-bottom border-2": ""}`} style={{border: 'none'}} aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item nav-item-link"
                onClick={resetNav()}
              >
                <Link className={`nav-link ${location.pathname === "/business"? "active border-bottom border-2": ""}`} to="/business">
                  Business
                </Link>
              </li>
              <li className="nav-item nav-item-link"
                onClick={resetNav()}
              >
                <Link className={`nav-link ${location.pathname === "/health"? "active border-bottom border-2": ""}`} to="/health">
                  Health
                </Link>
              </li>
              <li className="nav-item nav-item-link"
                onClick={resetNav()}
              >
                <Link className={`nav-link ${location.pathname === "/entertainment"? "active border-bottom border-2": ""}`} to="/entertainment">
                  Entertainment
                </Link>
              </li>
              <li className="nav-item nav-item-link"
                onClick={resetNav()}
              >
                <Link className={`nav-link ${location.pathname === "/sports"? "active border-bottom border-2": ""}`} to="/sports">
                  Sports
                </Link>
              </li>
              <li className="nav-item nav-item-link"
                onClick={resetNav()}
              >
                <Link className={`nav-link ${location.pathname === "/science"? "active border-bottom border-2": ""}`} to="/science">
                  Science
                </Link>
              </li>
              <li className="nav-item nav-item-link"
                onClick={resetNav()}
              >
                <Link className={`nav-link ${location.pathname === "/technology"? "active border-bottom border-2": ""}`} to="/technology">
                  Technology
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
      </nav>
    </div>
  );
}
