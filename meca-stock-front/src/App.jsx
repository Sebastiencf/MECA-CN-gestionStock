import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "./Dashboard";
import AddMatiere from "./AddMatiere";
import DeleteMatiere from "./DeleteMatiere";
import FluxManagement from "./FluxManagement";
import CollaboratorsMenu from "./CollaboratorsMenu";
import HistoryMenu from "./HistoryMenu";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Dashboard />;
      case "add":
        return <AddMatiere />;
      case "delete":
        return <DeleteMatiere />;
      case "flux":
        return <FluxManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      {/* 1. Bloc vertical Gauche */}
      <Sidebar onNavigate={setCurrentPage} currentPage={currentPage} />

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
          setCurrentPage("flux");
        }}
      />
    </div>
  );
}

export default App;
