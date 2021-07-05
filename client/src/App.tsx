import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useHelloTestQuery } from './generated/graphql';

import {Login} from './pages/Login';
import {Register} from './pages/Register'

export const App: React.FC = () => {
  const {data, loading} = useHelloTestQuery();

  if (loading) {
    return <div>loading...</div>
  }


  return <BrowserRouter>
    <Switch>
      <Route exact path="/" render={() => <div>{data?.hello}</div>} />
      <Route exact path="/login" render={Login} />
      <Route exact path="/register" render={Register} />
    </Switch>
  </BrowserRouter>
}

