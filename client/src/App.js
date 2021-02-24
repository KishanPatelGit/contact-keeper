import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "../src/components/layout/Navbar";
import Home from "../src/components/pages/Home";
import About from "../src/components/pages/About";
import ContactState from "../src/context/contact/ContactState";
import AuthState from "../src/context/auth/AuthState";
import AlertState from "../src/context/alert/AlertState";
import "./App.css";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alerts from "./components/layout/Alerts";

const App = () => {
  return (
    <AuthState>
      <ContactState>
        <AlertState>
          <Router>
            <Fragment>
              <Navbar />
              <div className="container">
                <Alerts />
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/about" component={About} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/login" component={Login} />
                </Switch>
              </div>
            </Fragment>
          </Router>
        </AlertState>
      </ContactState>
    </AuthState>
  );
};

export default App;
