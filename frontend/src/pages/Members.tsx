import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Members: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    nationality: '',
    cniNumber: '',
    address: '',
    profession: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/members', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleSearch = async (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/members/search/${value}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMembers(response.data);
      } catch (error) {
        console.error('Error searching members:', error);
      }
    } else {
      fetchMembers();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.post('/members', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        placeOfBirth: '',
        nationality: '',
        cniNumber: '',
        address: '',
        profession: '',
        phone: '',
        email: ''
      });
      setShowForm(false);
      fetchMembers();
      alert('Adhérent ajouté avec succès!');
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Erreur lors de l\'ajout de l\'adhérent');
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Adhérents</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Déconnexion
          </button>
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
            className="py-4 px-2 hover:bg-blue-700 border-b-4 border-white"
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
        {/* Search and Add Button */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Rechercher un adhérent..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            {showForm ? 'Annuler' : '➕ Ajouter'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ajouter un adhérent</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Prénom"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Nom"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="date"
                placeholder="Date de naissance"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Lieu de naissance"
                value={formData.placeOfBirth}
                onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Nationalité"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="N° CNI"
                value={formData.cniNumber}
                onChange={(e) => setFormData({ ...formData, cniNumber: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Adresse"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 md:col-span-2"
              />
              <input
                type="text"
                placeholder="Profession"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="tel"
                placeholder="Téléphone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="md:col-span-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                Ajouter l'adhérent
              </button>
            </form>
          </div>
        )}

        {/* Members List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">Nom</th>
                <th className="px-6 py-3 text-left">Prénom</th>
                <th className="px-6 py-3 text-left">CNI</th>
                <th className="px-6 py-3 text-left">Téléphone</th>
                <th className="px-6 py-3 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3">{member.last_name}</td>
                  <td className="px-6 py-3">{member.first_name}</td>
                  <td className="px-6 py-3">{member.cni_number}</td>
                  <td className="px-6 py-3">{member.phone}</td>
                  <td className="px-6 py-3">{member.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {members.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              Aucun adhérent trouvé
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Members;
