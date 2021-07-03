import { gql, useQuery } from '@apollo/client';
import React from 'react';

const App: React.FC = () => {

  const {data, loading} = useQuery(gql`
    {
      hello
    }
  `);

  if (loading) {
    return <div>loading....</div>
  }

  return <div>{JSON.stringify(data)}</div>

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello from Client</h1>
      </header>
    </div>
  );
}

export default App;
