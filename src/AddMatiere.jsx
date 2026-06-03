import React, { useState } from 'react';

function AddMatiere() {
  const [formData, setFormData] = useState({
    nom: '',
    type: '',
    dimensions: '',
    quantite: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost/gestion-des-stocks/api_stock.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add',
          ...formData,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ Matière ajoutée avec succès !');
        setFormData({ nom: '', type: '', dimensions: '', quantite: '' });
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Erreur : ' + (data.message || 'Impossible d\'ajouter la matière'));
      }
    } catch (error) {
      setMessage('❌ Erreur réseau : ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="dashboard-main">
      <div className="dashboard-header">
        <div>
          <h2 className="main-title">Ajouter une matière</h2>
          <p className="main-subtitle">Enregistrer un nouveau matériau dans l'inventaire</p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="add-form">
          <div className="form-group">
            <label htmlFor="nom">Nom de la matière *</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Ex: Aluminium 6060"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Type *</label>
            <input
              type="text"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Ex: Cylindrique, Prisme, etc."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dimensions">Dimensions restantes *</label>
            <input
              type="text"
              id="dimensions"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleChange}
              placeholder="Ex: Longueur : 6200mm"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantite">Quantité *</label>
            <input
              type="number"
              id="quantite"
              name="quantite"
              value={formData.quantite}
              onChange={handleChange}
              placeholder="Ex: 5"
              min="1"
              required
            />
          </div>

          <button type="submit" disabled={isLoading} className="btn-submit">
            {isLoading ? 'Ajout en cours...' : 'Ajouter la matière'}
          </button>

          {message && <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</div>}
        </form>
      </div>
    </main>
  );
}

export default AddMatiere;
