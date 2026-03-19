/* =====================================================
   shared.js – Common utilities for all ClaimEase pages
   ===================================================== */

// ===== LOCAL STORAGE DB =====
const DB = {
  get: k => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
};

// ===== SEED DEMO CLAIMS =====
function seedDemoData() {
  if (DB.get('ce_claims').length > 0) return;
  DB.set('ce_claims', [
    { id:'CLM-001', patient:'Ramesh Kumar',  type:'Hospitalisation',  amount:85000,  hospital:'KIMS Hospital',    priority:'High',   status:'Approved',   date:'2025-01-10', policy:'CE-2024-10011', email:'ramesh@mail.com', phone:'9876543210', desc:'Appendix surgery' },
    { id:'CLM-002', patient:'Sunita Devi',   type:'Surgery',          amount:120000, hospital:'Apollo Hospitals', priority:'High',   status:'Processing', date:'2025-02-14', policy:'CE-2024-20022', email:'sunita@mail.com', phone:'9123456789', desc:'Knee replacement surgery' },
    { id:'CLM-003', patient:'Arjun Singh',   type:'Accident',         amount:45000,  hospital:'Care Hospital',    priority:'Medium', status:'Pending',    date:'2025-03-01', policy:'CE-2024-30033', email:'arjun@mail.com',  phone:'8765432109', desc:'Road accident injuries' },
    { id:'CLM-004', patient:'Meena Patel',   type:'Maternity',        amount:30000,  hospital:'Rainbow Hospital', priority:'Low',    status:'Approved',   date:'2025-01-25', policy:'CE-2024-40044', email:'meena@mail.com',  phone:'7654321098', desc:'Normal delivery' },
    { id:'CLM-005', patient:'Vikram Reddy',  type:'Critical Illness', amount:250000, hospital:'Yashoda Hospital', priority:'High',   status:'Rejected',   date:'2025-02-28', policy:'CE-2024-50055', email:'vikram@mail.com', phone:'6543210987', desc:'Cancer treatment – pre-existing condition exclusion applied' },
  ]);
}

// ===== TOAST =====
function toast(msg, type = 'success') {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const div = document.createElement('div');
  div.className = `ce-toast ${type}`;
  div.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  container.appendChild(div);
  setTimeout(() => div.remove(), 4000);
}

// ===== STATUS BADGE =====
function statusBadge(s) {
  const m = { Pending:'badge-pending', Approved:'badge-approved', Rejected:'badge-rejected', Processing:'badge-processing' };
  return `<span class="status-badge ${m[s] || 'badge-pending'}">${s}</span>`;
}

// ===== CLAIM JOURNEY STEPS =====
function buildSteps(status) {
  const steps = [
    { label: 'Claim Submitted', icon: 'bi-check2' },
    { label: 'Under Review',    icon: 'bi-search' },
    { label: 'Processing',      icon: 'bi-gear' },
    { label: 'Decision Made',   icon: 'bi-clipboard2-check' },
  ];
  const doneMap = { Pending:1, Processing:3, Approved:4, Rejected:4 };
  const doneCount = doneMap[status] || 1;
  return steps.map((s, i) => {
    const done = i < doneCount - 1, active = i === doneCount - 1;
    const dc = done ? 'done' : active ? 'active' : 'pending';
    return `
      <div class="track-step ${done ? 'done' : ''}">
        <div class="step-dot ${dc}"><i class="bi ${done ? 'bi-check-lg' : s.icon}"></i></div>
        <div>
          <div style="font-size:14px;font-weight:600;">${s.label}</div>
          <div style="font-size:12px;color:#94a3b8;">${done ? 'Completed' : active ? 'In Progress' : 'Pending'}</div>
        </div>
      </div>`;
  }).join('');
}

// ===== NAVBAR SHARED HTML =====
function renderNavbar(activePage) {
  const pages = {
    home: 'home.html', claims: 'claims-renews.html',
    insurance: 'insurance.html', contact: 'contactUs.html', emergency: 'emergency.html'
  };
  return `
  <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm custom-navbar">
    <div class="container">
      <a class="logo-brand d-flex flex-row gap-3 align-items-center" href="home.html">
        <div class="logo-icon"><i class="bi bi-shield-check" style="color:#fff;font-size:20px;"></i></div>
        <h4>Claim Ease</h4>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navMenu">
        <ul class="navbar-nav align-items-center gap-1">
          <li class="nav-item"><a class="nav-link ${activePage==='home'?'active-link':''}" href="home.html">Home</a></li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle ${activePage==='insurance'?'active-link':''}" href="#" data-bs-toggle="dropdown">Insurance Products</a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="insurance.html">Health Insurance</a></li>
            </ul>
          </li>
          <li class="nav-item"><a class="nav-link ${activePage==='claims'?'active-link':''}" href="claims-renews.html">Claims &amp; Renews</a></li>
          <li class="nav-item"><a class="nav-link btn ms-2 custom-nav-btn ${activePage==='contact'?'active-link':''}" href="contactUs.html">Contact Us</a></li>
          <li class="nav-item ms-2 sos-btn">
            <a class="nav-link py-1" href="emergency.html">
              <i class="bi bi-activity" style="font-size:22px;color:#dc2626;"></i>
              <span class="sos-text"> SOS</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>`;
}

// ===== FOOTER SHARED HTML =====
function renderFooter() {
  return `
  <footer class="bg-dark text-white pt-5 pb-4">
    <div class="container">
      <div class="row gy-4">
        <div class="col-md-3">
          <h6 class="text-uppercase fw-bold mb-3" style="letter-spacing:1px;">SecureLife Insurance</h6>
          <p style="font-size:13px;color:#94a3b8;">Reliable and affordable insurance plans to protect your life, health, home, and business.</p>
        </div>
        <div class="col-md-2">
          <h6 class="text-uppercase fw-bold mb-3" style="letter-spacing:1px;">Services</h6>
          <p class="mb-1" style="font-size:13px;"><a href="#" class="text-white text-decoration-none">Life Insurance</a></p>
          <p style="font-size:13px;"><a href="insurance.html" class="text-white text-decoration-none">Health Insurance</a></p>
        </div>
        <div class="col-md-3">
          <h6 class="text-uppercase fw-bold mb-3" style="letter-spacing:1px;">Useful Links</h6>
          <p class="mb-1" style="font-size:13px;"><a href="#" class="text-white text-decoration-none">About Us</a></p>
          <p class="mb-1" style="font-size:13px;"><a href="#" class="text-white text-decoration-none">FAQs</a></p>
          <p class="mb-1" style="font-size:13px;"><a href="claims-renews.html" class="text-white text-decoration-none">Claims</a></p>
          <p style="font-size:13px;"><a href="#" class="text-white text-decoration-none">Privacy Policy</a></p>
        </div>
        <div class="col-md-4">
          <h6 class="text-uppercase fw-bold mb-3" style="letter-spacing:1px;">Contact</h6>
          <p style="font-size:13px;color:#94a3b8;" class="mb-1"><i class="bi bi-envelope me-2"></i>customersupport@ce.com</p>
          <p style="font-size:13px;color:#94a3b8;" class="mb-1"><i class="bi bi-telephone me-2"></i>+91 1234567890</p>
          <p style="font-size:13px;color:#94a3b8;"><i class="bi bi-telephone me-2"></i>+91 0987654123</p>
          <div class="d-flex gap-3 mt-3">
            <a href="#" style="color:#94a3b8;font-size:20px;"><i class="bi bi-facebook"></i></a>
            <a href="#" style="color:#94a3b8;font-size:20px;"><i class="bi bi-twitter-x"></i></a>
            <a href="#" style="color:#94a3b8;font-size:20px;"><i class="bi bi-instagram"></i></a>
            <a href="#" style="color:#94a3b8;font-size:20px;"><i class="bi bi-linkedin"></i></a>
          </div>
        </div>
      </div>
      <hr class="border-secondary mt-4"/>
      <div class="text-center" style="font-size:13px;color:#64748b;">© 2025 SecureLife Insurance / ClaimEase. All rights reserved.</div>
    </div>
  </footer>`;
}

// Run on every page
seedDemoData();
