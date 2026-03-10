import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { UserData } from './context/UserContext';
import { Account } from './pages/Account';
import { NavigationBar } from './components/NavigationBar';
import { NotFound } from './components/NotFound';
import { Reels } from './pages/Reels';

const App = () => {
  const { user, loading } = UserData();

  if (loading) return null;

  return (
      <BrowserRouter>
        {user && <NavigationBar />}
        <div className={user ? "md:pl-56" : ""}>
          <Routes>
            <Route path='/' element={<Home user={user} />} />
            <Route path='/reels' element={<Reels />} />
            <Route path='/login' element={user ? <Navigate to="/" replace /> : <Login />} />
            <Route path='/register' element={user ? <Navigate to="/" replace /> : <Register />} />
            <Route path='/account' element={user ? <Account user={user} /> : <Navigate to="/login" replace />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
  )
}

export default App;