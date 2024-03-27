import { useState, useEffect } from "react"
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";

import ProtectedRoute from "./route/ProtectedRoute";
import AuthContext from "./context/AuthContext"
import useIdle from "./hook/useIdleTimeout";
import YesNoModal from "./component/YesNoModal";

import Login from "./feature/auth/Login"
import Register from "./feature/auth/Register"
import FriendList from "./feature/friend/FriendList"
import EventList from "./feature/event/EventList"
import AddEvent from "./feature/event/AddEvent"
import EditEvent from "./feature/event/EditEvent"
import AddExpense from "./feature/expense/AddExpense"
import EditExpense from "./feature/expense/EditExpense"
import ExpenseHistory from "./feature/expense/ExpenseHistory"
import AddCalculation from "./feature/calculation/AddCalculation"
import ViewCalculation from "./feature/calculation/ViewCalculation"
import ShareCalculationResult from "./feature/calculation/ShareCalculationResult"
import EditProfile from "./feature/user/EditProfile"
import ChangePassword from "./feature/user/ChangePassword"

import {isSessionAlive, logoutApi} from "./api/AuthApi"

function App() {
  const initUserProfile = {uid:"", name:"", email:"", accessToken:"", loginAt:"", isAuthenticated:false};
  const [userProfile, setUserProfile] = useState(initUserProfile);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [modalConfig, setModalConfig] = useState({show:false, heading:"", body:""});
 
  const onPrompt = () => {
    setModalConfig({show:true, heading:"Idle too long...", body:"Do you still want to continue?"});
  }

  const onIdle = () => {
    setModalConfig({show:false, heading:"", body:""});
    logoutApi();
    resetAccess();
  }

  const onActive = () => {
    setModalConfig({show:false, heading:"", body:""});
  }

  const idleTimer = useIdle({ onIdle: onIdle, 
                              onPrompt: onPrompt, 
                              onActive: onActive, 
                              idleTime: process.env.REACT_APP_TIMEOUT_MINUTES });


  const initializeAccess = (authData) => {
    setUserProfile({...authData, isAuthenticated: true}); 
    idleTimer.start();
    navigate("/main/event/list");
  }

  const resetAccess = () => {
    setUserProfile(initUserProfile);
    idleTimer.pause();
    navigate(location);
  }

  useEffect(() => {
    const skipSessionCheck = location.pathname.startsWith("/result/") || 
                            location.pathname.startsWith("/login") || 
                            location.pathname.startsWith("/register")

    if (!skipSessionCheck) {
      isSessionAlive().then((result) => {
        if (result.isAlive) {
          initializeAccess(result.data.auth);
        } else {
          resetAccess();
        }
      })
    }

    setIsLoading(false);
  }, []);   // eslint-disable-line react-hooks/exhaustive-deps 

  const value = { userProfile, setUserProfile, initializeAccess, resetAccess };

  const NotFound = () => {
    return (
      <div style={{margin:"20px 20px 20px 20px"}}>
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for could not be found.</p>
      </div>
    );
  };

  return (
    <AuthContext.Provider value={value}>
    <> 
    <YesNoModal modalConfig={modalConfig} handleYes={idleTimer.activate} handleNo={onIdle} /> 
    { isLoading === true ?
        <div className="text-bg-secondary fs-1 text-center vh-100 ">
          <p>Initializing ...</p>
        </div>
      : 
          <Routes>
            <Route index element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/result/:eventId/:calculationId/:shareCode" element={<ShareCalculationResult />} />
            <Route element={<ProtectedRoute isAuthenticated={userProfile.isAuthenticated} />}>
              <Route path="/main/user/edit-profile" element={<EditProfile />} />
            </Route>
            <Route element={<ProtectedRoute isAuthenticated={userProfile.isAuthenticated} />}>
              <Route path="/main/user/change-password" element={<ChangePassword />} />
            </Route>            
            <Route element={<ProtectedRoute isAuthenticated={userProfile.isAuthenticated} />}>
              <Route path="/main/friend/list" element={<FriendList />} />
            </Route>
            <Route element={<ProtectedRoute isAuthenticated={userProfile.isAuthenticated} />}>
              <Route path="/main/event/list" element={<EventList />} />
            </Route>
            <Route element={<ProtectedRoute isAuthenticated={userProfile.isAuthenticated} />}>
              <Route path="/main/event/add" element={<AddEvent />} />
            </Route>
            <Route element={<ProtectedRoute isAuthenticated={userProfile.isAuthenticated} />}>
              <Route path="/main/event/edit" element={<EditEvent />} />
            </Route>      
            <Route element={<ProtectedRoute isAuthenticated={userProfile.isAuthenticated} />}>
              <Route path="/main/expense/add" element={<AddExpense />} />
            </Route>       
            <Route element={<ProtectedRoute isAuthenticated={userProfile.isAuthenticated} />}>
              <Route path="/main/expense/edit" element={<EditExpense />} />
            </Route>                  
            <Route element={<ProtectedRoute isAuthenticated={userProfile.isAuthenticated} />}>
              <Route path="/main/expense/history" element={<ExpenseHistory />} />
            </Route> 
            <Route element={<ProtectedRoute isAuthenticated={userProfile.isAuthenticated} />}>
              <Route path="/main/calculation/add" element={<AddCalculation />} />
            </Route> 
            <Route element={<ProtectedRoute isAuthenticated={userProfile.isAuthenticated} />}>
              <Route path="/main/calculation/view" element={<ViewCalculation />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
    }
    </>
    </AuthContext.Provider>   
  );
}

export default App;
