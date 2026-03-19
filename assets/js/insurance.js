// insurance.js
document.getElementById('navbar-placeholder').innerHTML = renderNavbar('insurance');
document.getElementById('footer-placeholder').innerHTML = renderFooter();

// ===== MEMBER CONFIG =====
// Each entry: { id, maleName, femaleName, icon }
const MEMBER_CONFIG = [
  { id: 'self',         maleName: 'Self',          femaleName: 'Self',           icon: 'bi-person' },
  { id: 'spouse',       maleName: 'Wife',           femaleName: 'Husband',        icon: 'bi-person-heart' },
  { id: 'son',          maleName: 'Son',            femaleName: 'Son',            icon: 'bi-person' },
  { id: 'daughter',     maleName: 'Daughter',       femaleName: 'Daughter',       icon: 'bi-person' },
  { id: 'father',       maleName: 'Father',         femaleName: 'Father',         icon: 'bi-person' },
  { id: 'mother',       maleName: 'Mother',         femaleName: 'Mother',         icon: 'bi-person' },
  { id: 'motherinlaw',  maleName: 'Mother In Law',  femaleName: 'Mother In Law',  icon: 'bi-person' },
  { id: 'fatherinlaw',  maleName: 'Father In Law',  femaleName: 'Father In Law',  icon: 'bi-person' },
];

let selectedMembers = new Set();
let selectedPlan = 'Gold';

// ===== RENDER MEMBER GRID =====
function renderMemberGrid() {
  const isMale = document.getElementById('genderMale').checked;
  const grid = document.getElementById('memberGrid');

  grid.innerHTML = MEMBER_CONFIG.map(m => {
    const label = isMale ? m.maleName : m.femaleName;
    const isSelected = selectedMembers.has(m.id);
    return `
      <div class="col-6 col-md-3">
        <div class="member-card ${isSelected ? 'selected' : ''}" id="card-${m.id}" onclick="toggleMember('${m.id}')">
          <i class="bi ${m.icon} member-icon"></i>
          <div class="member-label" id="label-${m.id}">${label}</div>
        </div>
      </div>`;
  }).join('');
}

// ===== TOGGLE MEMBER =====
function toggleMember(id) {
  const card = document.getElementById('card-' + id);
  if (selectedMembers.has(id)) {
    selectedMembers.delete(id);
    card.classList.remove('selected');
  } else {
    selectedMembers.add(id);
    card.classList.add('selected');
  }
}

// ===== GENDER CHANGE – update labels without clearing selections =====
function updateMemberLabels() {
  const isMale = document.getElementById('genderMale').checked;
  MEMBER_CONFIG.forEach(m => {
    const labelEl = document.getElementById('label-' + m.id);
    if (labelEl) labelEl.textContent = isMale ? m.maleName : m.femaleName;
  });
}

// Listen to gender toggle
document.querySelectorAll('input[name="gender"]').forEach(radio => {
  radio.addEventListener('change', updateMemberLabels);
});

// ===== SET PLAN CHOICE =====
function setPlanChoice(plan) {
  selectedPlan = plan;
}

// ===== SYNC MODAL BEFORE SHOW =====
document.getElementById('planModal').addEventListener('show.bs.modal', () => {
  const isMale = document.getElementById('genderMale').checked;
  document.getElementById('genderField').value = isMale ? 'Male' : 'Female';
  document.getElementById('selectedPlanField').value = selectedPlan;

  // Build member names list
  if (selectedMembers.size === 0) {
    document.getElementById('membersField').value = 'None selected';
  } else {
    const names = [...selectedMembers].map(id => {
      const m = MEMBER_CONFIG.find(x => x.id === id);
      return m ? (isMale ? m.maleName : m.femaleName) : id;
    });
    document.getElementById('membersField').value = names.join(', ');
  }
});

// ===== SUBMIT PLAN REQUEST =====
function submitPlanRequest() {
  const email  = document.getElementById('emailInput').value.trim();
  const mobile = document.getElementById('mobileInput').value.trim();
  const dob    = document.getElementById('planDob').value;
  if (!email || !mobile || !dob) { toast('Please fill all fields.', 'error'); return; }
  if (!/^\d{10}$/.test(mobile))  { toast('Enter a valid 10-digit mobile.', 'error'); return; }

  bootstrap.Modal.getInstance(document.getElementById('planModal')).hide();
  setTimeout(() => new bootstrap.Modal(document.getElementById('confirmationModal')).show(), 400);
}

// ===== QUICK RENEW =====
function showSec(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('d-none');
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function hideSec(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('d-none');
}
function quickRenew() {
  const policy = document.getElementById('insRenewPolicy').value.trim();
  const email  = document.getElementById('insRenewEmail').value.trim();
  if (!policy || !email) { toast('Please enter Policy Number and Email.', 'error'); return; }
  toast(`Renewal request for ${policy} sent to ${email}!`, 'success');
  hideSec('renew-form-ins');
}

// ===== INIT =====
renderMemberGrid();
