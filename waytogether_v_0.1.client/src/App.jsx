import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import Menu from './components/Menu';
import ItineraryCreate from './pages/Itineraries/ItineraryCreate';
import { ItineraryProvider } from './context/ItineraryContext';

const App = () => {
    return (
        <ItineraryProvider>
            <Router>
                <Menu />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/itineraryCreate" element={<ItineraryCreate />} />
                </Routes>
                </Router>
        </ItineraryProvider>
    );
};

export default App;
