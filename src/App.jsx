import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import routes from './routes/routes';


export default function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <div className="p-6">
          <Routes>
            {routes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
        </div>
      </Router>
    </div>
  )
}