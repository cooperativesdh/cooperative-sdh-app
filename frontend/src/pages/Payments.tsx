import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  cni_number: string;
}

const Payments: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    motif: 'Versement adhésion',
    monthNumber: ''
  });
  const [responsibleName, setResponsibleName] = useState('Serge Olivier DIATTA');

  const motifs = ['Versement adhésion', 'Versement acompte', 'Versement mois 1', 'Versement mois 2', 'Versement mois 3', 'Fin de versement'];

  useEffect(() => {
    fetchMembers();
    fetchPayments();
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

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/payments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handleMemberSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleSelectMember = (member: Member) => {
    setSelectedMemberId(member.id);
    setSelectedMember(member);
    setSearchTerm('');
  };

  const handleGeneratePDF = async () => {
    if (!selectedMemberId || !formData.amount || !formData.paymentDate) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        '/documents/discharge-pdf',
        {
          memberId: selectedMemberId,
          amount: formData.amount,
          paymentDate: formData.paymentDate,
          motif: formData.motif,
          responsibleName
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      // Download PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `decharge_${selectedMember?.last_name}_${formData.paymentDate}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      alert('Décharge générée avec succès!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erreur lors de la génération du PDF');
    }
  };

  const handleSubmitPayment = async () => {
    if (!selectedMemberId || !formData.amount || !formData.paymentDate) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await api.post(
        '/payments',
        {
          memberId: selectedMemberId,
          amount: formData.amount,
          paymentDate: formData.paymentDate,
          motif: formData.motif,
          monthNumber: formData.monthNumber || null
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setFormData({
        amount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        motif: 'Versement adhésion',
        monthNumber: ''
      });
      setSelectedMemberId('');
      setSelectedMember(null);
      fetchPayments();
      alert('Versement enregistré avec succès!');
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Erreur lors de l\'enregistrement du versement');
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
          <h1 className="text-3xl font-bold text-gray-900">Versements</h1>
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
            className="py-4 px-2 hover:bg-blue-700"
          >
            👥 Adhérents
          </button>
          <button
            onClick={() => navigate('/payments')}
            className="py-4 px-2 hover:bg-blue-700 border-b-4 border-white"
          >
            💰 Versements
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Enregistrer un versement</h2>

          {/* Member Search */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Chercher un adhérent</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Tapez le nom ou prénom..."
                value={searchTerm}
                onChange={(e) => handleMemberSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              {searchTerm && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto z-10">
                  {members
                    .filter(m =>
                      m.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      m.last_name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(member => (
                      <div
                        key={member.id}
                        onClick={() => handleSelectMember(member)}
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                      >
                        {member.last_name} {member.first_name}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Member */}
          {selectedMember && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-gray-800">
                <strong>Adhérent sélectionné :</strong> {selectedMember.last_name} {selectedMember.first_name}
              </p>
              <p className="text-gray-600">CNI: {selectedMember.cni_number}</p>
              <button
                onClick={() => {
                  setSelectedMemberId('');
                  setSelectedMember(null);
                }}
                className="text-blue-600 hover:text-blue-800 underline mt-2"
              >
                Changer de sélection
              </button>
            </div>
          )}

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Montant (F CFA)</label>
              <input
                type="number"
                placeholder="Ex: 50000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Date du versement</label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Motif</label>
              <select
                value={formData.motif}
                onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                {motifs.map(motif => (
                  <option key={motif} value={motif}>{motif}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Signataire</label>
              <select
                value={responsibleName}
                onChange={(e) => setResponsibleName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="Serge Olivier DIATTA">Serge Olivier DIATTA</option>
                <option value="Benoît Célestin DIATTA">Benoît Célestin DIATTA</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSubmitPayment}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              💾 Enregistrer le versement
            </button>
            <button
              onClick={handleGeneratePDF}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              📄 Générer la décharge (PDF)
            </button>
          </div>
        </div>

        {/* Payments History */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="text-xl font-bold text-gray-800 p-6 border-b">Historique des versements</h2>
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">Nom</th>
                <th className="px-6 py-3 text-left">Montant</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Motif</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3">{payment.last_name} {payment.first_name}</td>
                  <td className="px-6 py-3">{payment.amount} F</td>
                  <td className="px-6 py-3">{new Date(payment.payment_date).toLocaleDateString()}</td>
                  <td className="px-6 py-3">{payment.motif}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {payments.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              Aucun versement enregistré
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Payments;
