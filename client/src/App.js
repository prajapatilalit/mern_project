import React, { Fragment } from "react";
import "./App.css";
import Landing from "./components/layout/landing/Landing";
import Navbar from "./components/layout/navbar/Navbar";

const App = () => {
  return (
    <Fragment>
      <Navbar />
      <Landing />
    </Fragment>
  );
};

export default App;
