import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import axios from 'axios';
import { Authencation, Admin, User } from './components';


axios.defaults.baseURL = "http://localhost:9080";

export default function App() {
  let history = useHistory();
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact>
            <Authencation history={history}/>
          </Route>
          <Route path="/login" exact>
            <Authencation history={history}/>
          </Route>
          <Route path="/admin" exact>
            <Admin history={history}/>
          </Route>
          <Route path="/user/:id" exact>
            <User history={history}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}