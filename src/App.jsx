import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./auth/login.jsx";

/* proepr navigations route added */

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
