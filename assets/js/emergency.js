// emergency.js
document.getElementById('navbar-placeholder').innerHTML = renderNavbar('emergency');
document.getElementById('footer-placeholder').innerHTML = renderFooter();

const INS_DB = {
  '123456789012': { number: 'CE-INS-88201', validity: 'Dec 2026', name: 'Priya Sharma' },
  '987654321098': { number: 'CE-INS-44302', validity: 'Mar 2027', name: 'Rajesh Verma' },
  '112233445566': { number: 'CE-INS-77503', validity: 'Jun 2025', name: 'Ananya Reddy' },
};

const HOSPITALS = [
  { name: 'KIMS Hospital',    area: 'Secunderabad', beds: '800+', distance: '2.1 km' },
  { name: 'Apollo Hospitals', area: 'Jubilee Hills', beds: '500+', distance: '3.5 km' },
  { name: 'Yashoda Hospital', area: 'Somajiguda',   beds: '600+', distance: '4.2 km' },
  { name: 'Care Hospital',    area: 'Banjara Hills', beds: '350+', distance: '5.0 km' },
];

function fetchInsuranceDetails() {
  const aadhar = document.getElementById('aadharInput').value.trim();
  if (!/^\d{12}$/.test(aadhar)) {
    toast('Please enter a valid 12-digit Aadhar number.', 'error'); return;
  }

  const data = INS_DB[aadhar] || {
    number: 'CE-INS-' + Math.floor(10000 + Math.random() * 90000),
    validity: 'Dec 2026', name: 'Policy Holder'
  };

  document.getElementById('insNumber').textContent  = data.number;
  document.getElementById('insValidity').textContent = data.validity;
  document.getElementById('insStatus').textContent   = '✓ Active';
  document.getElementById('insuranceCard').classList.remove('d-none');

  document.getElementById('hospitalList').innerHTML = HOSPITALS.map(h => `
    <div class="col-md-3">
      <div class="hospital-card text-center">
        <i class="bi bi-hospital mb-2" style="font-size:2rem;color:#2563eb;"></i>
        <div style="font-size:14px;font-weight:700;">${h.name}</div>
        <div style="font-size:12px;color:#64748b;">${h.area}</div>
        <div class="d-flex justify-content-center gap-2 mt-2 flex-wrap">
          <span class="badge bg-light text-dark" style="font-size:11px;">
            <i class="bi bi-geo-alt me-1"></i>${h.distance}
          </span>
          <span class="badge" style="background:#dcfce7;color:#166534;font-size:11px;">✓ Network</span>
        </div>
        <div style="font-size:11px;color:#64748b;margin-top:4px;">${h.beds} beds</div>
        <a href="tel:108" class="btn btn-danger btn-sm mt-2 w-100 action-btn">Call Ambulance</a>
      </div>
    </div>`).join('');

  document.getElementById('hospitalSection').classList.remove('d-none');
  toast(`Insurance details found for ${data.name}!`, 'success');
}
