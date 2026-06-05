import React from 'react';

function Sidebar({ onNavigate, currentPage }) {
  return (
    <aside className="sidebar">

        <a 
        href="#"
        onClick={(e) => {e.preventDefault(); onNavigate("home");}}
        >
          <div className="header-logo">
              <img 
                  src="/logo/FullWhiteOnBlack.svg" 
                  alt="MECA-CN Logo" 
                  className="logo-img"
              />
          </div>
        </a>

        
      {/* Liens de navigation vers les pages d'ajout, de suppression, et de listing de toutes les matières */}
      <nav className="sidebar-menu">
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onNavigate('home'); }} 
          className={`menu-item ${currentPage === 'home' ? 'active' : ''}`}
        >
          <span className="icon"><img src="/icons/listing.png" alt="Acès listing des matières" className="list-icon"/></span> Liste des matières
        </a>
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onNavigate('add'); }} 
          className={`menu-item ${currentPage === 'add' ? 'active' : ''}`}
        >
          <span className="icon"><img src="/icons/add.png" alt="Accès ajout de matière" className="add-icon"/></span> Ajouter une matière
        </a>
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onNavigate('delete'); }} 
          className={`menu-item ${currentPage === 'delete' ? 'active' : ''}`}
        >
          <span className="icon"><img src="/icons/delete.png" alt="Accès suppression de matière" className="delete-icon"/></span> Supprimer une matière
        </a>
      </nav>

      {/* Profil Utilisateur en bas */}
      <div className="user-profile">
        <div className="user-avatar">SC</div>
        <div className="user-info">
          <p className="user-name admin-name">Sébastien C.</p>
          <p className="user-role">Administrateur</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;