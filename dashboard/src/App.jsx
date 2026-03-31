import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Layout from './components/Layout/Layout';
import Modal from './components/Common/Modal';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BannerList from './pages/Banners/BannerList';
import AddBanner from './pages/Banners/AddBanner';
import BannerPage from './pages/Banners/BannerPage';
import EventList from './pages/Events/EventList';
import AddEvent from './pages/Events/AddEvent';
import EventDetails from './pages/Events/EventDetails';
import PlayerList from './pages/Players/PlayerList';
import AddPlayer from './pages/Players/AddPlayer';
import PlayerDetails from './pages/Players/PlayerDetails';
import ContentManager from './pages/Content/ContentManager';
import Contacts from './pages/Contacts/Contacts';

function App() {
  const { modal } = useSelector((state) => state.ui);

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {modal.isOpen && <Modal />}

      <Routes>
        {/* Public Routes - No Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/registeraweprowrestling" element={<Register />} />

        {/* Private Routes - All protected by PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />

            {/* Banner Routes */}
            <Route path="banners">
              <Route index element={<BannerList />} />
              <Route path="add" element={<AddBanner />} />
              <Route path="edit/:id" element={<AddBanner />} />
              <Route path="page/:name" element={<BannerPage />} />
            </Route>

            {/* Event Routes */}
            <Route path="events">
              <Route index element={<EventList />} />
              <Route path="add" element={<AddEvent />} />
              <Route path="edit/:id" element={<AddEvent />} />
              <Route path=":id" element={<EventDetails />} />
            </Route>

            {/* Player Routes */}
            <Route path="players">
              <Route index element={<PlayerList />} />
              <Route path="add" element={<AddPlayer />} />
              <Route path="edit/:id" element={<AddPlayer />} />
              <Route path=":id" element={<PlayerDetails />} />
            </Route>

            {/* Content Routes */}
            <Route path="content">
              <Route index element={<ContentManager />} />
            </Route>

            {/* Contacts Routes */}
            <Route path="contacts">
              <Route index element={<Contacts />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;