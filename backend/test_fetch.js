const formData = new FormData();
formData.append('nom', 'Test');
formData.append('prenom', 'Test');
formData.append('email', 'test@test.com');
formData.append('password', 'password');
formData.append('role', 'etudiant');

fetch('http://127.0.0.1:8000/api/register', {
  method: 'POST',
  headers: {
    'Accept': 'application/json'
  },
  body: formData
})
.then(r => {
  console.log('Status:', r.status);
  console.log('Redirected:', r.redirected);
  console.log('URL:', r.url);
  return r.text();
})
.then(text => console.log('Response:', text.substring(0, 200)))
.catch(e => console.error(e));
