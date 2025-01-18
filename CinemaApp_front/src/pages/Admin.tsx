import CRUDCoupon from "../components/CRUDCoupon";
import CRUDHall from "../components/CRUDHall";
import CRUDMovie from "../components/CRUDMovie";
import CRUDScreening from "../components/CRUDScreening";
import HallGenerator from "../components/HallGenerator";
import CRUDTicket from "../components/CRUDTicket";
import { Route } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import Navbar2 from "../components/Navbar2";
import NavbarAdmin from "../components/NavAdmin";


const Admin = () => {
  const { isAdmin } = useAuth();
  
  return (
    <>
      {isAdmin ? <><Navbar2 /><NavbarAdmin /></> : <Navbar2 />}
    </>
  )
}

export default Admin