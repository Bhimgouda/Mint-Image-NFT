import { Navigate, Route, Routes } from 'react-router-dom';
import './app.css';
import Mint from './pages/Mint';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Mint />}/>
        {/* <Route path="*" element={<Navigate to="/"/>}/> */}
      </Routes>
    </div>
  );
}

export default App;
