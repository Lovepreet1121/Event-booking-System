// scheduling-frontend/src/App.jsx

import './App.css'; // Keep your empty App.css for now
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>My Scheduling App</h1>
          <nav>
            <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', gap: '20px' }}>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/create">Create Event</Link>
              </li>
              {/* You can add a link to an example event details page for testing if you have an ID */}
              {/* <li><Link to="/events/some_example_id">Example Event</Link></li> */}
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateEvent />} />
            <Route path="/events/:id" element={<EventDetails />} />
            {/* Add a catch-all for 404s if needed later */}
            {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;