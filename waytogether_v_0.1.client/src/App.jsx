import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import Menu from './components/Menu';
import ItineraryCreate from './pages/Itineraries/ItineraryCreate';

const App = () => {
    return (
        <>
            <Router>
                <Menu />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/itineraryCreate" element={<ItineraryCreate />} />
                </Routes>
            </Router>
        </>
    );
};

export default App;