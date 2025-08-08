import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext.jsx';
import { publicRoutes, adminRoutes, userRoutes } from './RouteList/routes.js';
import Loader from './components/Loader.jsx';

function App() {
  const { loading, user } = useAuthContext();

  if (loading) {
    return (
      <Loader/>
    );
  }

  // Helper to check authentication
  const isAuthenticated = !!user;
  const isAdmin = user?.role;

  console.log(isAuthenticated, isAdmin, user);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Always show login as the first route */}
          {publicRoutes.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={<Component />}
            />
          ))}

          {/* Admin protected routes */}
          {adminRoutes.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={
                isAuthenticated
                  ? <Component />
                  : <Navigate to="/login" replace />
              }
            />
          ))}

          {/* User protected routes */}
          {userRoutes.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={
                isAuthenticated
                  ? <Component />
                  : <Navigate to="/login" replace />
              }
            />
          ))}

          {/* Fallback route for 404 */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center text-2xl gap-4">
              <img src="/page-404.gif" alt="404 Not Found" className="w-64 h-64 object-contain" />
              <div>404 - Page Not Found</div>
              <a href="/home" className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Go to Home</a>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;