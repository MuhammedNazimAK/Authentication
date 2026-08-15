import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { UserData } from './context/UserContext';
import { Account } from './pages/Account';
import { NavigationBar } from './components/NavigationBar';
import { NotFound } from './components/NotFound';
import { Reels } from './pages/Reels';
import { Search } from './pages/Search';
import { UserProfile } from './components/UserProfile';
import { Settings } from './pages/Settings';
import { Chat } from './pages/Chat';

const App = () => {
  const { user, loading } = UserData();

  if (loading) return null;

  return (
      <BrowserRouter>
        {user && <NavigationBar />}
        <div className={user ? "md:pl-56" : ""}>
          <Routes>
            <Route path='/' element={!user ? <Navigate to="/login" replace /> : <Home user={user} />} />
            <Route path='/reels' element={<Reels />} />
            <Route path='/search' element={<Search />} />
            <Route path='/chat' element={user ? <Chat /> : <Navigate to="/login" replace /> } />
            <Route path='/login' element={user ? <Navigate to="/" replace /> : <Login />} />
            <Route path='/register' element={user ? <Navigate to="/" replace /> : <Register />} />
            <Route path='/account' element={user ? <Account user={user} /> : <Navigate to="/login" replace />} />
            <Route path='/settings' element={user ? <Settings user={user} /> : <Navigate to="/login" replace /> } />
            <Route path='/profile/:id' element={user ? <UserProfile /> : <Navigate to="/login" replace />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
  )
}

export default App;