function displayOrders() {
  const bestellungen = JSON.parse(localStorage.getItem('meineBestellungen')) || [];
  const container = document.getElementById('order-history');
  container.innerHTML = "";

  if (bestellungen.length === 0) {
    container.innerHTML = "<p>Du hast noch keine Bestellungen aufgegeben.</p>";
    return;
  }

  bestellungen.forEach(bestellung => {
    const div = document.createElement('div');
    div.className = 'order-card';

    let summe = 0;
    let artikelHTML = "";

    bestellung.artikel.forEach(item => {
      artikelHTML += `<p>${item.name} - ${item.price} €</p>`;
      summe += parseFloat(item.price);
    });

    div.innerHTML = `
      <h3>Bestellung vom ${bestellung.datum}</h3>
      ${artikelHTML}
      <p class="order-total">Gesamt: ${summe.toFixed(2)} €</p>
    `;

    container.appendChild(div);
  });
}

displayOrders();
