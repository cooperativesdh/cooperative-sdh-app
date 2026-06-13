// Demo data
const DEMO_DATA = {
    admin: {
        email: 'demo@cooperative-sdh.com',
        password: '123456',
        name: 'Démo Utilisateur',
        cooperative: 'Cité Notre-Dame - Démo'
    },
    members: [
        { id: 1, firstName: 'Jean', lastName: 'Dupont', cni: '1.95.12345678.00001.0', phone: '771234567', email: 'jean@example.com', address: 'Thiès, Sénégal', profession: 'Entrepreneur' },
        { id: 2, firstName: 'Marie', lastName: 'Ndiaye', cni: '1.98.87654321.00002.0', phone: '772345678', email: 'marie@example.com', address: 'Thiès, Sénégal', profession: 'Commerçante' },
        { id: 3, firstName: 'Aminata', lastName: 'Ba', cni: '1.92.11111111.00003.0', phone: '773456789', email: 'aminata@example.com', address: 'Thiès, Sénégal', profession: 'Infirmière' },
        { id: 4, firstName: 'Moussa', lastName: 'Sow', cni: '1.85.22222222.00004.0', phone: '774567890', email: 'moussa@example.com', address: 'Thiès, Sénégal', profession: 'Ingénieur' },
        { id: 5, firstName: 'Fatou', lastName: 'Diallo', cni: '1.90.33333333.00005.0', phone: '775678901', email: 'fatou@example.com', address: 'Thiès, Sénégal', profession: 'Éducatrice' }
    ],
    payments: [
        { id: 1, memberId: 1, amount: 50000, date: '2024-10-15', motif: 'Versement adhésion', member: { firstName: 'Jean', lastName: 'Dupont' } },
        { id: 2, memberId: 2, amount: 75000, date: '2024-10-16', motif: 'Versement acompte', member: { firstName: 'Marie', lastName: 'Ndiaye' } },
        { id: 3, memberId: 3, amount: 60000, date: '2024-10-17', motif: 'Versement mois 1', member: { firstName: 'Aminata', lastName: 'Ba' } },
        { id: 4, memberId: 4, amount: 80000, date: '2024-10-18', motif: 'Versement mois 1', member: { firstName: 'Moussa', lastName: 'Sow' } },
        { id: 5, memberId: 5, amount: 55000, date: '2024-10-19', motif: 'Versement adhésion', member: { firstName: 'Fatou', lastName: 'Diallo' } },
        { id: 6, memberId: 1, amount: 65000, date: '2024-11-05', motif: 'Versement mois 1', member: { firstName: 'Jean', lastName: 'Dupont' } }
    ]
};

// State
let state = {
    isLoggedIn: false,
    currentUser: null,
    members: [],
    payments: [],
    selectedPayment: null
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    setupEventListeners();
    setTodayDate();
    if (state.isLoggedIn) {
        showLoggedInUI();
    } else {
        showPage('login');
    }
});

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = e.target.dataset.page;
            showPage(page);
        });
    });

    // Login
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        handleLogin(email, password);
    });

    // Demo Login
    document.getElementById('demoBtnLogin').addEventListener('click', () => {
        handleLogin(DEMO_DATA.admin.email, DEMO_DATA.admin.password);
    });

    // Register
    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        handleRegister();
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Search members
    document.getElementById('searchMembers').addEventListener('keyup', searchMembers);

    // Add member
    document.getElementById('addMemberForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addMember();
    });

    // Add payment
    document.getElementById('addPaymentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addPayment();
    });

    // Member select change for decharge
    document.getElementById('memberSelect').addEventListener('change', (e) => {
        const memberId = e.target.value;
        if (memberId) {
            state.selectedPayment = { memberId: parseInt(memberId) };
        }
    });
}

// Login
function handleLogin(email, password) {
    if (email === DEMO_DATA.admin.email && password === DEMO_DATA.admin.password) {
        state.isLoggedIn = true;
        state.currentUser = DEMO_DATA.admin;
        state.members = JSON.parse(JSON.stringify(DEMO_DATA.members));
        state.payments = JSON.parse(JSON.stringify(DEMO_DATA.payments));
        saveState();
        showLoggedInUI();
        showPage('dashboard');
        updateDashboard();
        alert('✅ Connexion réussie!');
    } else {
        alert('❌ Email ou mot de passe incorrect');
    }
}

// Register
function handleRegister() {
    const fullName = document.getElementById('fullName').value;
    const cooperativeName = document.getElementById('cooperativeName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    state.isLoggedIn = true;
    state.currentUser = { email, password, name: fullName, cooperative: cooperativeName };
    state.members = [];
    state.payments = [];
    saveState();
    showLoggedInUI();
    showPage('dashboard');
    alert('✅ Inscription réussie! Bienvenue ' + fullName);
}

// Logout
function handleLogout() {
    state.isLoggedIn = false;
    state.currentUser = null;
    localStorage.clear();
    showLoggedInUI();
    showPage('login');
    alert('Vous avez été déconnecté');
}

// UI Updates
function showLoggedInUI() {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        if (btn.dataset.page === 'login') {
            btn.style.display = 'none';
        } else if (state.isLoggedIn) {
            btn.style.display = 'block';
        } else {
            btn.style.display = 'none';
        }
    });

    if (state.isLoggedIn) {
        document.getElementById('logoutBtn').style.display = 'block';
        updateMemberSelect();
        updateDashboard();
        updateMembersTable();
        updatePaymentsTable();
    } else {
        document.getElementById('logoutBtn').style.display = 'none';
    }
}

function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageName).classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-page="${pageName}"]`)?.classList.add('active');

    if (pageName === 'members') {
        updateMembersTable();
    } else if (pageName === 'payments') {
        updatePaymentsTable();
        updateMemberSelect();
    } else if (pageName === 'decharge') {
        updateDechargeMemberSelect();
        document.getElementById('dechargeDate').valueAsDate = new Date();
    }
}

function toggleForm(formId) {
    const form = document.getElementById(formId);
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    if (form.style.display === 'block') {
        form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Members
function addMember() {
    const form = document.getElementById('addMemberForm');
    const firstName = form.querySelector('.input-firstname').value;
    const lastName = form.querySelector('.input-lastname').value;
    const cni = form.querySelector('.input-cni').value;
    const dob = form.querySelector('.input-dob').value;
    const pob = form.querySelector('.input-pob').value;
    const nationality = form.querySelector('.input-nationality').value;
    const address = form.querySelector('.input-address').value;
    const profession = form.querySelector('.input-profession').value;
    const phone = form.querySelector('.input-phone').value;
    const email = form.querySelector('.input-email').value;

    const newMember = {
        id: state.members.length + 1,
        firstName, lastName, cni, dob, pob, nationality, address, profession, phone, email
    };

    state.members.push(newMember);
    saveState();
    updateMembersTable();
    form.reset();
    toggleForm('memberForm');
    alert('✅ Adhérent ajouté avec succès!');
}

function deleteMember(memberId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet adhérent?')) {
        state.members = state.members.filter(m => m.id !== memberId);
        state.payments = state.payments.filter(p => p.memberId !== memberId);
        saveState();
        updateMembersTable();
        alert('Adhérent supprimé');
    }
}

function updateMembersTable() {
    const tbody = document.getElementById('membersBody');
    if (state.members.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Aucun adhérent</td></tr>';
        return;
    }

    tbody.innerHTML = state.members.map(member => `
        <tr>
            <td>${member.lastName}</td>
            <td>${member.firstName}</td>
            <td>${member.cni}</td>
            <td>${member.phone || '-'}</td>
            <td>
                <button class="btn btn-danger" style="padding:5px 10px; font-size:0.9em;" onclick="deleteMember(${member.id})">✕ Supprimer</button>
            </td>
        </tr>
    `).join('');
}

function searchMembers(e) {
    const query = e.target.value.toLowerCase();
    const filtered = state.members.filter(m =>
        m.firstName.toLowerCase().includes(query) ||
        m.lastName.toLowerCase().includes(query) ||
        m.cni.includes(query)
    );

    const tbody = document.getElementById('membersBody');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Aucun adhérent trouvé</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(member => `
        <tr>
            <td>${member.lastName}</td>
            <td>${member.firstName}</td>
            <td>${member.cni}</td>
            <td>${member.phone || '-'}</td>
            <td>
                <button class="btn btn-danger" style="padding:5px 10px; font-size:0.9em;" onclick="deleteMember(${member.id})">✕ Supprimer</button>
            </td>
        </tr>
    `).join('');
}

function updateMemberSelect() {
    const select = document.getElementById('memberSelect');
    select.innerHTML = '<option value="">-- Choisir un adhérent --</option>';
    state.members.forEach(member => {
        select.innerHTML += `<option value="${member.id}">${member.firstName} ${member.lastName}</option>`;
    });
}

// Payments
function addPayment() {
    const memberId = parseInt(document.getElementById('memberSelect').value);
    const amount = parseInt(document.getElementById('paymentAmount').value);
    const date = document.getElementById('paymentDate').value;
    const motif = document.getElementById('paymentMotif').value;

    if (!memberId || !amount || !date) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    const member = state.members.find(m => m.id === memberId);
    const newPayment = {
        id: state.payments.length + 1,
        memberId,
        amount,
        date,
        motif,
        member: { firstName: member.firstName, lastName: member.lastName }
    };

    state.payments.push(newPayment);
    saveState();
    updatePaymentsTable();
    document.getElementById('addPaymentForm').reset();
    alert('✅ Versement enregistré avec succès!');
}

function updatePaymentsTable() {
    const tbody = document.getElementById('paymentsBody');
    if (state.payments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Aucun versement</td></tr>';
        return;
    }

    tbody.innerHTML = state.payments.map(payment => `
        <tr>
            <td>${payment.member.firstName} ${payment.member.lastName}</td>
            <td>${payment.amount.toLocaleString()} F</td>
            <td>${new Date(payment.date).toLocaleDateString('fr-FR')}</td>
            <td>${payment.motif}</td>
            <td>
                <button class="btn btn-primary" style="padding:5px 10px; font-size:0.9em;" onclick="selectPaymentForDecharge(${payment.memberId}, ${payment.amount}, '${payment.date}', '${payment.motif}')">📄 Décharge</button>
            </td>
        </tr>
    `).join('');
}

function selectPaymentForDecharge(memberId, amount, date, motif) {
    showPage('decharge');
    document.getElementById('dechargeMemeber').value = memberId;
    document.getElementById('dechargeAmount').value = amount;
    document.getElementById('dechargeDate').value = date;
    document.getElementById('dechargeMotif').value = motif;
    state.selectedPayment = { memberId, amount, date, motif };
}

function updateDechargeMemberSelect() {
    const select = document.getElementById('dechargeMemeber');
    select.innerHTML = '<option value="">-- Choisir un adhérent --</option>';
    state.members.forEach(member => {
        select.innerHTML += `<option value="${member.id}">${member.firstName} ${member.lastName}</option>`;
    });
}

// Dashboard
function updateDashboard() {
    const totalMembers = state.members.length;
    const totalAmount = state.payments.reduce((sum, p) => sum + p.amount, 0);

    document.getElementById('statMembers').textContent = totalMembers;
    document.getElementById('statTotal').textContent = totalAmount.toLocaleString() + ' F';
}

// Decharge
function previewDecharge() {
    const memberId = parseInt(document.getElementById('dechargeMemeber').value);
    const amount = parseInt(document.getElementById('dechargeAmount').value);
    const date = document.getElementById('dechargeDate').value;
    const motif = document.getElementById('dechargeMotif').value;
    const signataire = document.getElementById('dechargeSignataire').value;

    if (!memberId || !amount || !date) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    const member = state.members.find(m => m.id === memberId);
    const dechargeHTML = generateDechargeHTML(member, amount, date, motif, signataire);

    document.getElementById('dechargeContent').innerHTML = dechargeHTML;
    document.getElementById('dechargePreview').style.display = 'block';
}

function generateDechargeHTML(member, amount, date, motif, signataire) {
    const dateObj = new Date(date);
    const dateStr = dateObj.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const amountWords = numberToWords(Math.floor(amount));

    return `
        <h1>DÉCHARGE</h1>
        <p style="margin-top: 30px;">JE SOUSSIGNE <strong>${signataire.toUpperCase()}</strong></p>
        <p>FONCTION: Responsable de la coopérative Cité Notre-Dame</p>
        <p>PIÈCE D'IDENTITÉ/PASSEPORT/PERMIS DE CONDUIRE N°: ........................</p>
        <p style="margin-top: 20px;">A REÇU DE <strong>${member.firstName} ${member.lastName}</strong></p>
        <p style="margin-top: 20px;"><strong>MONTANT</strong></p>
        <p>EN CHIFFRE: <strong>${amount} F CFA</strong></p>
        <p>EN LETTRE: <strong>${amountWords} francs CFA</strong></p>
        <p style="margin-top: 20px;">MOTIF: <strong>${motif}</strong></p>
        <p style="margin-top: 30px;">EN FOI DE QUOI CE PRÉSENT DÉCHARGE EST SIGNÉ POUR SERVIR ET VALOIR CE QUE DE DROIT.</p>
        <p style="margin-top: 40px;">Thiès le ${dateStr.split(' ').slice(1).join(' ')}</p>
        <div style="margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr;">
            <div class="signature-line">LE BÉNÉFICIAIRE</div>
            <div class="signature-line">LE CHEF DE PROJET</div>
        </div>
    `;
}

function numberToWords(num) {
    const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
    const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
    const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];

    if (num === 0) return 'zéro';
    if (num < 10) return units[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? '-' + units[num % 10] : '');
    if (num < 1000) return units[Math.floor(num / 100)] + ' cent' + (num % 100 ? ' ' + numberToWords(num % 100) : '');
    return num.toString();
}

function printDecharge() {
    window.print();
}

function generatePDF() {
    const memberId = parseInt(document.getElementById('dechargeMemeber').value);
    if (!memberId) {
        alert('Veuillez sélectionner un adhérent');
        return;
    }

    const member = state.members.find(m => m.id === memberId);
    const dechargeContent = document.getElementById('dechargeContent').innerHTML;

    // Create a new window and print
    const printWindow = window.open('', '', 'height=700,width=900');
    printWindow.document.write('<html><head><title>Décharge PDF</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
        body { font-family: 'Times New Roman', serif; padding: 40px; line-height: 1.8; }
        h1 { text-align: center; text-decoration: underline; margin-bottom: 30px; }
        p { margin-bottom: 10px; }
        .signature-line { border-top: 1px solid black; width: 200px; text-align: center; padding-top: 5px; display: inline-block; }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(dechargeContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();

    // Trigger print dialog
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

// Utilities
function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) input.value = today;
    });
}

function saveState() {
    localStorage.setItem('cooperativeState', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('cooperativeState');
    if (saved) {
        state = JSON.parse(saved);
    }
}