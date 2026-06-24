const API_URL = 'http://localhost:3000/Warenkorb';

async function loadWarenkorb() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Server hat nicht geantwortet');
  return response.json();
}

async function displayBasket() {
  const liste = document.getElementById('cart-content');

  let korb;
  try {
    korb = await loadWarenkorb();
  } catch (err) {
    liste.innerHTML = "<p>Warenkorb konnte nicht geladen werden. Läuft der Server (server.js) und MongoDB?</p>";
    document.getElementById('cart-total').textContent = "";
    return;
  }

  liste.innerHTML = "";

  if (korb.length === 0) {
    liste.innerHTML = "<p>Der Warenkorb ist leer.</p>";
    document.getElementById('cart-total').textContent = "";
    return;
  }

  let summe = 0;

  // DOM-Manipulation: jedes Element wird hier per JS erzeugt und eingefügt
  korb.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';

    const text = document.createElement('span');
    text.innerHTML = `<strong>${item.name}</strong> - ${item.price} €`;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Entfernen';
    removeBtn.className = 'btn-clear';
    removeBtn.style.marginLeft = '15px';
    removeBtn.addEventListener('click', () => removeItem(item._id));

    div.appendChild(text);
    div.appendChild(removeBtn);
    liste.appendChild(div);

    summe += parseFloat(item.price);
  });

  document.getElementById('cart-total').textContent = "Gesamt: " + summe.toFixed(2) + " €";
}

async function removeItem(id) {
  await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
  displayBasket();
}

async function confirmPurchase() {
  let korb;
  try {
    korb = await loadWarenkorb();
  } catch (err) {
    alert('Warenkorb konnte nicht geladen werden.');
    return;
  }

  if (korb.length === 0) {
    alert("Dein Warenkorb ist leer.");
    return;
  }

  // Bestellhistorie bleibt vorerst im localStorage (Account-Seite),
  // der eigentliche Warenkorb liegt jetzt vollständig im Backend.
  let bestellungen = JSON.parse(localStorage.getItem('meineBestellungen')) || [];
  bestellungen.push({
    datum: new Date().toLocaleDateString('de-DE'),
    artikel: korb
  });
  localStorage.setItem('meineBestellungen', JSON.stringify(bestellungen));

  await fetch('http://localhost:3000/clearAll', { method: 'DELETE' });

  alert("Kauf erfolgreich! Du wirst zu deinem Account weitergeleitet.");
  window.location.href = "account.html";
}

async function clearCart() {
  if (confirm("Möchtest du wirklich alle Artikel aus dem Warenkorb löschen?")) {
    await fetch('http://localhost:3000/clearAll', { method: 'DELETE' });
    displayBasket();
  }
}

displayBasket();

displayBasket();
