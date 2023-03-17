import { Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/auth-ctx";
import { useDispatch } from "react-redux";
import { fetchAllTours } from "./store/tour-actions";
import Layout from "./components/layout/Layout";
import Home from "./pages/home/Home";
import TourOverview from "./pages/tourOverview/TourOverview";
import Login from "./pages/authentication/Login";
import Signup from "./pages/authentication/Signup";
import UserProfile from "./pages/userProfile/UserProfile";
import NotFound from "./pages/notFound/NotFound";
import ForgetPassword from "./pages/authentication/ForgetPassword";
import ResetPassword from "./pages/authentication/ResetPassword";
import ManageTours from "./pages/userProfile/managment/ManageTours";
import ProfileSettingsPage from "./pages/userProfile/selfManagment/ProfileSettingsPage";

function App() {
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch()
  console.log(authCtx)

  useEffect(()=>{
    dispatch(fetchAllTours())
  },[dispatch])

  return (
    <Layout>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/tour/:slug" element={<TourOverview />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/password-reset/:resetToken" element={<ResetPassword />} />
        {authCtx.isLoggedIn && (
          <Route path="/my-profile" element={<UserProfile />}>
            <Route path="" element={<ProfileSettingsPage/>}/>
            <Route path="manage-tours" element={<ManageTours/>}/>
          </Route>
        )}
        <Route path="/" element={<Navigate replace to="/home" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
