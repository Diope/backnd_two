import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Nav } from './components/Nav';
import { useHelloTestQuery } from './generated/graphql';

import { Home } from './pages/Home';
import {Login} from './pages/Login';
import {Register} from './pages/Register'


export const App: React.FC = () => {
  const {loading} = useHelloTestQuery();

  if (loading) {
    return <div>loading...</div>
  }


  return <BrowserRouter>
    <div>

      <Nav />
      <Switch>
        <Route exact path="/" render={Home} />
        <Route exact path="/login" render={Login} />
        <Route exact path="/register" component={Register} />
      </Switch>
    </div>
  </BrowserRouter>
}

