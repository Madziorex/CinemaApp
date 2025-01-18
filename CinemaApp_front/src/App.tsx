import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Halls from "./components/CRUDHall";
import CRUDMovies from "./components/CRUDMovie";
import Movies from "./components/Movies";
import MovieDetails from "./components/MovieDetails";
import Coupons from "./components/CRUDCoupon";
import Screenings from "./components/CRUDScreening";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./services/AuthContext";
import Schedule from "./components/Schedule";
import Screening from "./components/Screening";
import Reservations from "./components/Reservations";
import { ProtectedRouteAdmin } from "./components/ProtectedRouteAdmin";
import AdminUsers from "./components/AdminUsers";

function App() {

  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/screening/:id" element={<Screening />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route
            path="/admin/halls"
            element={
              <ProtectedRoute>
                <Halls />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/movies"
            element={
              <ProtectedRoute>
                <CRUDMovies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/coupons"
            element={
              <ProtectedRoute>
                <Coupons />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/screenings"
            element={
              <ProtectedRoute>
                <Screenings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reservations"
            element={
              <ProtectedRoute>
                <Reservations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRouteAdmin>
                <AdminUsers />
              </ProtectedRouteAdmin>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
