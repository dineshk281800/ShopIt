import "./App.css";

import { Route, Routes } from "react-router-dom";

import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"
import { Toaster } from 'react-hot-toast';
import useUserRoutes from "./components/routes/userRoutes";
import useAdminRoutes from "./components/routes/adminRoutes";
// import userRoutes from "./components/routes/userRoutes";
// import adminRoutes from "./components/routes/adminRoutes";
import NotFound from "./components/layout/NotFound";

function App() {
  const userRoutes = useUserRoutes();
  const adminRoutes = useAdminRoutes()
  return (
    <div className="App">
      <Toaster position="top-center" />
      <Header />
      <div className="container">
        <Routes>
          {userRoutes}
          {adminRoutes}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
