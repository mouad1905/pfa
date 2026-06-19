import { Routes, Route, Outlet } from "react-router-dom";
import Home from "../features/home/Home";
import Login from "../features/auth/Login";
import Navbar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import Colocations from "../features/housing/Colocations";
import Revisions from "../features/revisions/Revisions";
import Profile from "../features/profile/Profile";
import Settings from "../features/profile/Settings";
import Support from "../features/support/Support";
import InfoHome from "../features/housing/InfoHome";
import ChooseRole from "../features/auth/ChooseRole";
import StudentRegister from "../features/auth/StudentRegister";
import ProfRegister from "../features/auth/ProfessorRegister";
import LocateurRegister from "../features/auth/LocateurRegister";
import Addpartenaire from "../features/auth/AddPartenaire";
import AdminRoute from "./AdminRoute";
import AdminLayout from "../components/layout/AdminLayout";
import AdminDashboard from "../features/admin/AdminDashboard";
import ManageHomes from "../features/admin/ManageHomes";
import AdminHomeDetail from "../features/admin/AdminHomeDetail";
import ManageRevisions from "../features/admin/ManageRevisions";
import ManageUsers from "../features/admin/ManageUsers";
import ManageSignales from "../features/admin/ManageSignales";
import AddHouse from "../features/housing/AddHouse";
import EditHouse from "../features/housing/EditHouse";
import Dashboard from "../features/dashboard/Dashboard";
import Security from "../features/profile/Security";
import ScrollToTop from "../components/layout/ScrollToTop";

function PublicLayout() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="manage-homes" element={<ManageHomes />} />
          <Route path="manage-homes/:id" element={<AdminHomeDetail />} />
          <Route path="manage-revisions" element={<ManageRevisions />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="manage-signales" element={<ManageSignales />} />
        </Route>
      </Route>

      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/colocations" element={<Colocations />} />
        <Route path="/revisions" element={<Revisions />} />
        <Route path="/profile/:id?" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/support" element={<Support />} />
        <Route path="/home/:id" element={<InfoHome />} />
        <Route path="/register" element={<ChooseRole />} />
        <Route path="/addPartenaire" element={<Addpartenaire />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/register/professor" element={<ProfRegister />} />
        <Route path="/register/locateur" element={<LocateurRegister />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/security" element={<Security />} />
        <Route path="/addHouse" element={<AddHouse />} />
        <Route path="/editHouse/:id" element={<EditHouse />} />
      </Route>
    </Routes>
    </>
  );
}
