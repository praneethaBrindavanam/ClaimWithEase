// claims-renews.js
document.getElementById('navbar-placeholder').innerHTML = renderNavbar('claims');
document.getElementById('footer-placeholder').innerHTML = renderFooter();

// ===== SECTION TOGGLE =====
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

// ===== SUBMIT CLAIM =====
function submitClaim() {
  const get = id => document.getElementById(id).value.trim();
  const policy = get('claimPolicy'), patient = get('claimPatient'),
        type   = get('claimType'),   amount  = get('claimAmount'),
        hospital = get('claimHospital'), email = get('claimEmail'),
        phone  = get('claimPhone'),  priority = get('claimPriority'),
        desc   = get('claimDesc');
  const date = get('claimDate') || new Date().toISOString().split('T')[0];

  if (!policy || !patient || !type || !amount || !hospital || !email || !phone) {
    toast('Please fill in all required fields.', 'error'); return;
  }
  if (!/^\d{10}$/.test(phone)) { toast('Enter a valid 10-digit phone number.', 'error'); return; }
  if (!/\S+@\S+\.\S+/.test(email)) { toast('Enter a valid email address.', 'error'); return; }

  const claims = DB.get('ce_claims');
  const newId  = 'CLM-' + String(claims.length + 1).padStart(3, '0');
  const status = priority === 'High' ? 'Processing' : 'Pending';

  claims.unshift({ id:newId, patient, type, amount:parseInt(amount), hospital, priority, status, date, policy, email, phone, desc });
  DB.set('ce_claims', claims);

  ['claimPolicy','claimPatient','claimAmount','claimHospital','claimEmail','claimPhone','claimDesc','claimDate']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('claimType').value = '';
  document.getElementById('claimPriority').value = 'Medium';

  hideSec('initiate-form');
  renderClaimsTable();
  toast(`Claim ${newId} submitted! Status: ${status}`, 'success');
}

// ===== RENDER CLAIMS TABLE =====
function renderClaimsTable() {
  const claims = DB.get('ce_claims');
  const sf = document.getElementById('filterStatus').value;
  const pf = document.getElementById('filterPriority').value;
  const po = { High:0, Medium:1, Low:2 };

  const list = claims
    .filter(c => (!sf || c.status === sf) && (!pf || c.priority === pf))
    .sort((a,b) => (po[a.priority] - po[b.priority]) || new Date(b.date) - new Date(a.date));

  const tbody = document.getElementById('claimsBody');
  const noMsg = document.getElementById('noClaimsMsg');

  if (!list.length) { tbody.innerHTML = ''; noMsg.classList.remove('d-none'); return; }
  noMsg.classList.add('d-none');

  tbody.innerHTML = list.map(c => `
    <tr>
      <td><span style="font-size:13px;font-weight:700;color:#2563eb;">${c.id}</span></td>
      <td><span style="font-size:14px;font-weight:600;">${c.patient}</span></td>
      <td><span style="font-size:13px;color:#475569;">${c.type}</span></td>
      <td><span style="font-size:13px;font-weight:700;">₹${parseInt(c.amount).toLocaleString('en-IN')}</span></td>
      <td><span class="priority-${c.priority.toLowerCase()}" style="font-size:12px;">${c.priority==='High'?'🔴':c.priority==='Medium'?'🟡':'🟢'} ${c.priority}</span></td>
      <td>${statusBadge(c.status)}</td>
      <td><span style="font-size:12px;color:#64748b;">${c.date}</span></td>
      <td><button class="btn btn-sm btn-outline-primary" style="border-radius:8px;font-size:12px;" onclick="viewClaim('${c.id}')"><i class="bi bi-eye me-1"></i>View</button></td>
    </tr>`).join('');
}

// ===== TRACK CLAIM =====
function trackClaim() {
  const id  = document.getElementById('trackId').value.trim().toUpperCase();
  const pol = document.getElementById('trackPolicy').value.trim();
  const claims = DB.get('ce_claims');
  let found = null;
  if (id)  found = claims.find(c => c.id === id);
  if (!found && pol) found = claims.find(c => c.policy.toLowerCase() === pol.toLowerCase());

  const res = document.getElementById('trackResult');
  if (!found) {
    res.classList.remove('d-none');
    res.innerHTML = `<div class="alert alert-danger rounded-3"><i class="bi bi-x-circle me-2"></i>No claim found. Try demo IDs: CLM-001 to CLM-005</div>`;
    return;
  }
  res.classList.remove('d-none');
  res.innerHTML = `
    <div class="card border-0 shadow-sm rounded-4 p-4">
      <div class="row g-3">
        <div class="col-md-6">
          <div class="d-flex gap-2 align-items-center mb-2">
            <span style="font-size:18px;font-weight:700;color:#2563eb;">${found.id}</span>${statusBadge(found.status)}
          </div>
          <p class="mb-1 small"><strong>Patient:</strong> ${found.patient}</p>
          <p class="mb-1 small"><strong>Type:</strong> ${found.type}</p>
          <p class="mb-1 small"><strong>Amount:</strong> ₹${parseInt(found.amount).toLocaleString('en-IN')}</p>
          <p class="mb-1 small"><strong>Hospital:</strong> ${found.hospital}</p>
          <p class="mb-0 small"><strong>Date:</strong> ${found.date}</p>
        </div>
        <div class="col-md-6">
          <h6 class="section-title mb-3" style="font-size:14px;">Claim Journey</h6>
          ${buildSteps(found.status)}
        </div>
        ${found.desc ? `<div class="col-12"><div class="p-3 rounded-3" style="background:#f8fafc;font-size:13px;"><strong>Notes:</strong> ${found.desc}</div></div>` : ''}
      </div>
    </div>`;
}

// ===== VIEW CLAIM DETAIL MODAL =====
function viewClaim(id) {
  const c = DB.get('ce_claims').find(cl => cl.id === id);
  if (!c) return;
  document.getElementById('claimDetailTitle').textContent = `${c.id} – ${c.patient}`;
  document.getElementById('claimDetailBody').innerHTML = `
    <div class="row g-3">
      <div class="col-md-6">
        <div class="p-3 rounded-3" style="background:#f8fafc;">
          <div class="table-label mb-2">Claim Info</div>
          <p class="mb-1">${statusBadge(c.status)}</p>
          <p class="mb-1 small"><strong>Type:</strong> ${c.type}</p>
          <p class="mb-1 small"><strong>Amount:</strong> ₹${parseInt(c.amount).toLocaleString('en-IN')}</p>
          <p class="mb-1 small"><strong>Hospital:</strong> ${c.hospital}</p>
          <p class="mb-1 small"><strong>Date:</strong> ${c.date}</p>
          <p class="mb-0 small"><strong>Priority:</strong> <span class="priority-${c.priority.toLowerCase()}">${c.priority}</span></p>
        </div>
      </div>
      <div class="col-md-6">
        <div class="p-3 rounded-3" style="background:#f8fafc;">
          <div class="table-label mb-2">Patient / Policy</div>
          <p class="mb-1 small"><strong>Name:</strong> ${c.patient}</p>
          <p class="mb-1 small"><strong>Policy:</strong> ${c.policy}</p>
          <p class="mb-1 small"><strong>Email:</strong> ${c.email}</p>
          <p class="mb-0 small"><strong>Phone:</strong> ${c.phone}</p>
        </div>
      </div>
      ${c.desc ? `<div class="col-12"><div class="p-3 rounded-3" style="background:#eff6ff;font-size:13px;"><strong>Description:</strong> ${c.desc}</div></div>` : ''}
      <div class="col-12">
        <div class="p-3 rounded-3" style="background:#f8fafc;">
          <h6 class="section-title mb-3" style="font-size:14px;">Claim Progress</h6>
          ${buildSteps(c.status)}
        </div>
      </div>
    </div>`;
  new bootstrap.Modal(document.getElementById('claimDetailModal')).show();
}

// ===== SUBMIT RENEWAL =====
function submitRenewal() {
  const policy = document.getElementById('renewPolicy').value.trim();
  const email  = document.getElementById('renewEmail').value.trim();
  const phone  = document.getElementById('renewPhone').value.trim();
  const dob    = document.getElementById('renewDob').value;
  if (!policy || !email || !phone || !dob) { toast('Please fill in all required fields.', 'error'); return; }
  toast(`Policy ${policy} renewed! Confirmation sent to ${email}.`, 'success');
  hideSec('renew-form');
  ['renewPolicy','renewEmail','renewPhone','renewDob'].forEach(id => document.getElementById(id).value = '');
}

// ===== INIT =====
renderClaimsTable();
