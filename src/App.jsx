import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "./Dashboard";
import AddMatiere from "./AddMatiere";
import ModifMatiere from "./ModifMatiere";
import DeleteMatiere from "./DeleteMatiere";
import FluxManagement from "./FluxManagement";
import CollaboratorsMenu from "./CollaboratorsMenu";
import HistoryMenu from "./HistoryMenu";
import "./App.css";
import { API_URL } from "./config";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedMatiere, setSelectedMatiere] = useState(null);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleNavigate = (page, data = null) => {
    setCurrentPage(page);
    if (data) {
      setSelectedMatiere(data);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Dashboard onNavigate={handleNavigate} />;
      case "add":
        return <AddMatiere />;
      case "modify":
        return <ModifMatiere matiere={selectedMatiere} />;
      case "delete":
        return <DeleteMatiere />;
      case "flux":
        return <FluxManagement />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app-container">
      {/* 1. Bloc vertical Gauche */}
      <Sidebar onNavigate={handleNavigate} currentPage={currentPage} />

      {/* 2. Bloc de Droite (Header en haut + Contenu en dessous) */}
      <div className="main-wrapper">
        <Header
          onOpenCollaborators={() => setShowCollaborators(true)}
          onOpenHistory={() => setShowHistory(true)}
        />
        {renderPage()}
      </div>

      {/* Menus modaux */}
      <CollaboratorsMenu
        isOpen={showCollaborators}
        onClose={() => setShowCollaborators(false)}
      />
      <HistoryMenu
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onViewAll={() => {
          setShowHistory(false);
          handleNavigate("flux");
        }}
      />
    </div>
  );
}

export default App;
