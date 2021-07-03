import React from 'react';
import { useHelloTestQuery } from './generated/graphql';

const App: React.FC = () => {

  const {data, loading} = useHelloTestQuery();

  if (loading || !data) {
    return <div>loading....</div>
  }

  return <div>{data.hello}</div>

  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <h1>Hello from Client</h1>
  //     </header>
  //   </div>
  // );
}

export default App;
