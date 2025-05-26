
import './App.css';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import HomePage from './component/HomePage/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
