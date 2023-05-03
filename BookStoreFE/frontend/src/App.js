import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header.jsx';
import Home from './Home.jsx';
import About from './About.jsx';
import Books from './Books.tsx';
import Authors from './Authors.tsx';


function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route exact path="/" element={<Home />}>
          </Route>
          <Route path="/about" element={<About />}>

          </Route>
          <Route path="/author" element={<Authors />}>
            
          </Route>
          <Route path="/book" element={<Books />}>

          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
