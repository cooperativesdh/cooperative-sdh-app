import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<any>(null);
  const [stats, setStats] = useState({ members: 0, payments: 0, total: 0 });

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Cooperative SDH</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{admin?.fullName}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 flex gap-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="py-4 px-2 hover:bg-blue-700"
          >
            📊 Tableau de bord
          </button>
          <button
            onClick={() => navigate('/members')}
            className="py-4 px-2 hover:bg-blue-700"
          >
            👥 Adhérents
          </button>
          <button
            onClick={() => navigate('/payments')}
            className="py-4 px-2 hover:bg-blue-700"
          >
            💰 Versements
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card: Adhérents */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Adhérents</h3>
            <p className="text-4xl font-bold text-blue-600">{stats.members}</p>
          </div>

          {/* Card: Versements */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Versements</h3>
            <p className="text-4xl font-bold text-green-600">{stats.payments}</p>
          </div>

          {/* Card: Total */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Collecté</h3>
            <p className="text-4xl font-bold text-purple-600">{stats.total} F</p>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Bienvenue dans Cooperative SDH!
          </h2>
          <p className="text-gray-600 mb-6">
            Système de gestion complète pour les coopératives immobilières
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/members')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              ➕ Ajouter un adhérent
            </button>
            <button
              onClick={() => navigate('/payments')}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              ➕ Enregistrer un versement
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
