import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './hooks/useAuth';

//my pagesss
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dasboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Cashback from './pages/Cashback';
import AIChat from './pages/AIChat';

const ProtectedRoute = ({children}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className='text-center'>
          <div className='w-16 h-16 boarder-4 boarder-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4'></div>
              <p className='text-gray-500 font-medium'> Loading Rize Up.... </p>
        </div>
      </div>
    );
  }
  return user ? children: <Navigate to ='/login'/>
};

const AppRoutes = () => {
  const {user} = useAuth();

  return (
    <Routes>
      {/*my public routes*/}
      <Route path="/login" element={!user ? <Login/> : <Navigate to="/dashboard"/> }/>
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard"/> }/>

      {/*my privaaaate routes*/}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><Transactions/></ProtectedRoute>} />
      <Route path="/budgets" element={<ProtectedRoute><Budget/></ProtectedRoute>} />
      <Route path="/cashback" element={<ProtectedRoute><Cashback/></ProtectedRoute>} />
      <Route path="/ai-chat" element={<ProtectedRoute><AIChat/></ProtectedRoute>} />

      {/*default route*/}
      <Route path="/" element={<Navigate to="/dashboard"/>} />
      <Route path="*" element={<Navigate to="/dashboard"/>} />
    </Routes>
  );
}


function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </AuthProvider>
    </Router>
   
  );
}

export default App;
