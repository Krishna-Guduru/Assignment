import logo from './logo.svg';
import './App.css';
import { BrowserRouter , Route, Switch,Routes } from 'react-router-dom';
import HomePage from './Home';
import DetailsPage from './Character';

function App() {
  return (
    <div className="App">
 <BrowserRouter>
      <Routes>
        <Route  path="/" element={<HomePage/>} />
        <Route path="/detailsPage/:id" element={<DetailsPage/>} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
