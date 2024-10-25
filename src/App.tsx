import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import "./App.css";
import { SidebarProvider } from "./components/SidebarContext/SidebarContext";
import Header from "./components/Header/Header";
import { LayoutProvider } from "./components/Context/LayoutContext";
import LoginPage from "./pages/Login/LoginPage";
import ProjectTablePage from "./pages/ProjectTablePage/ProjectTablePage";
import TaskPage from "./pages/TasksPage/TasksPage";

const App: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutProvider>
        <Router>
          <MainLayout />
        </Router>
      </LayoutProvider>
    </SidebarProvider>
  ); 
};

const MainLayout: React.FC = () => {
  const location = useLocation();
  const hideSidebar = location.pathname === "/" || location.pathname === "/main-admin-panel";

  return (
    <>
      <Header />
      {!hideSidebar && <Sidebar />}
      <div className={hideSidebar ? "full-content" : "main-content"}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/projects" element={<ProjectTablePage />} />
          <Route path="/tasks" element={<TaskPage />} />
          
        </Routes>
      </div>
    </>
  );
};

export default App;
