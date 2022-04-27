import './App.css';
import { Login } from './Routes/login';
import { Group } from './Routes/groupchat';
import { useState } from 'react';

function App() {

  const [user,setUser] = useState(null)

const renderApp = () => {
  if(user) {
    return <Group user={user} />
  }
  else {
    return <Login setUser={setUser} />
  }
}

  return (
    <div className="App">
      {renderApp()}
    </div>
  );
}

export default App;
