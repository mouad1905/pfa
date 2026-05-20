import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Colocations from "./pages/Colocations";
import Revisions from "./pages/Revisions";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import InfoHome from "./pages/InfoHome";
import ChooseRole from "./pages/register/ChooseRole";
import StudentRegister from "./pages/register/StudentRegister";
import ProfRegister from "./pages/register/ProfessorRegister";
import LocateurRegister from "./pages/register/LocateurRegister";
import Addpartenaire from "./pages/partner/AddPartenaire";
import AdminRoute from "./routes/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageHomes from "./pages/admin/ManageHomes";
import ManageRevisions from "./pages/admin/ManageRevisions";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageSignales from "./pages/admin/ManageSignales";
import AddHouse from "./pages/partner/addHouse";
import Dashboard from "./pages/Dashboard";
import Security from "./pages/Security";

// Layout wrapper for public pages (Navbar + Footer)
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* GROUP 1: ADMIN PAGES */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="manage-homes" element={<ManageHomes />} />
            <Route path="manage-revisions" element={<ManageRevisions />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="manage-signales" element={<ManageSignales />} />
          </Route>
        </Route>

        {/* GROUP 2: PUBLIC PAGES */}
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
