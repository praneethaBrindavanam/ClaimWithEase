// contactUs.js
document.getElementById('navbar-placeholder').innerHTML = renderNavbar('contact');
document.getElementById('footer-placeholder').innerHTML = renderFooter();

function submitContact() {
  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const msg   = document.getElementById('contactMsg').value.trim();
  if (!name || !email || !msg) { toast('Please fill in all fields.', 'error'); return; }
  if (!/\S+@\S+\.\S+/.test(email)) { toast('Enter a valid email address.', 'error'); return; }
  toast("Message sent! We'll get back to you within 24 hours.", 'success');
  ['contactName', 'contactEmail', 'contactMsg'].forEach(id => document.getElementById(id).value = '');
}
