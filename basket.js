
/*was technisch gesehen hier reinkommen sollte:

function displayBasket() {
  const korb = JSON.parse(localStorage.getItem('meinWarenkorb')) || [];
  const liste = document.getElementById('cart-content');
  liste.innerHTML = "";

  if (korb.length === 0) {
    liste.innerHTML = "<p>Der Warenkorb ist leer.</p>";
    document.getElementById('cart-total').textContent = ""; 
  } else {
    let summe = 0;
    korb.forEach(item => {
      const div = document.createElement('div');
      div.innerHTML = `<strong>${item.name}</strong> - ${item.price} €`;
      liste.appendChild(div);
      summe += parseFloat(item.price);
    });
    document.getElementById('cart-total').textContent = "Gesamt: " + summe.toFixed(2) + " €";
  }
}

function confirmPurchase() {
  const korb = JSON.parse(localStorage.getItem('meinWarenkorb')) || [];

  if (korb.length === 0) {
    alert("Dein Warenkorb ist leer.");
    return;
  }

  let bestellungen = JSON.parse(localStorage.getItem('meineBestellungen')) || [];
  bestellungen.push({
    datum: new Date().toLocaleDateString('de-DE'),
    artikel: korb
  });
  localStorage.setItem('meineBestellungen', JSON.stringify(bestellungen));

  localStorage.removeItem('meinWarenkorb');

  window.location.href = "account.html";
}

function clearCart() {
  if (confirm("Möchtest du wirklich alle Artikel aus dem Warenkorb löschen?")) {
    localStorage.removeItem('meinWarenkorb');
    displayBasket();
  }
}

displayBasket();
