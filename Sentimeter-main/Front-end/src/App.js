import React, { useEffect } from "react";
import "./App.css";
import { setScreen } from "./features/screenSlice";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";
import Dashboard from "./pages/Dashboard/Dashboard/Dashboard";
import UserPage from "./pages/Dashboard/UserPage/UserPage";
import Game from "./pages/Game/Game";
import AboutUS from "./pages/AboutUS/AboutUS";
import LoginPage from "./pages/LoginAndSignup/LoginPage/LoginPage";
import SignupPage from "./pages/LoginAndSignup/SignupPage/SignupPage";
import ForgotPassword from "./pages/LoginAndSignup/ForgotPassword/ForgotPassword";
import axios from "axios";
import Logout from "./pages/LoginAndSignup/Logout/Logout";
import NotFound404 from "./pages/NotFound404/NotFound404";
import ResetPassword from "./pages/LoginAndSignup/ResetPassword/ResetPassword";
import VerifyEmail from "./pages/LoginAndSignup/VerifyEmail/VerifyEmail";
import DatasetCreator from "./pages/DatasetCreator/DatasetCreator";
import AccountSettings from "./pages/Dashboard/AccountSettings/AccountSettings";
import PredictionPage from "./pages/PredictionPage/PredictionPage";

const App = () => {
  const screenDispatch = useDispatch(setScreen);

  axios.defaults.baseURL = "http://192.168.1.12:5000/api";
  // axios.defaults.baseURL = "https://api.sentimeter.dev/api";

  window.addEventListener("resize", () => {
    if (window.outerWidth < 1000) {
      screenDispatch(setScreen("Mobile"));
    } else if (window.outerWidth < 1367 && window.outerWidth > 1000) {
      screenDispatch(setScreen("HD"));
    } else if (window.outerWidth > 1367) {
      screenDispatch(setScreen("Full HD"));
    }
  });

  useEffect(() => {
    if (window.outerWidth < 1000) {
      screenDispatch(setScreen("Mobile"));
    } else if (window.outerWidth < 1367 && window.outerWidth > 1000) {
      screenDispatch(setScreen("HD"));
    } else if (window.outerWidth > 1367) {
      screenDispatch(setScreen("Full HD"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={Homepage} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/game" exact component={Game} />
          <Route path="/about" exact component={AboutUS} />
          <Route path="/dataset_creator" exact component={DatasetCreator} />
          <Route path="/login" exact component={LoginPage} />
          <Route path="/signup" exact component={SignupPage} />
          <Route path="/verify_email/:id/:token" exact component={VerifyEmail} />
          <Route path="/forgot_password" exact component={ForgotPassword} />
          <Route path="/reset_password/:token" exact component={ResetPassword} />
          <Route path="/logout" exact component={Logout} />
          <Route path="/users/:username" exact component={UserPage} />
          <Route path="/account_settings" exact component={AccountSettings} />
          <Route path="/models/:id/predict" exact component={PredictionPage} />
          <Route component={NotFound404} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
