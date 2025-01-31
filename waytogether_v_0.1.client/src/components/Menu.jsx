
import { NavLink } from 'react-router-dom';
import '../css/menu.css';

const Menu = () => {
    return (
        <nav>
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/itineraryCreate">ItineraryCreate</NavLink>
        </nav>
    );
};

export default Menu;
