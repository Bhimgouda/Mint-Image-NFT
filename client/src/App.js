import { Route, Routes } from 'react-router-dom';
import './app.css';
import Mint from './pages/Mint';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/mint" element={<Mint />}/>
      </Routes>
    </div>
  );
}

export default App;
