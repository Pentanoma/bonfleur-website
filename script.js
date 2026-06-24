console.log('hier ist nichts außer die ewige leere, gefüllt mit all meinen fehlgeschlagenen träumen und wünschen');
/*kein var für javascript verwenden, gilt fürs komplette skript, kann zu fehlern führen*/

const buttons = document.querySelectorAll('.add-btn');

buttons.forEach(button => {
  button.addEventListener('click', addToWarenkorb);
});
 
async function addToWarenkorb(event) {
  const card = event.target.closest('.product-card');
  const name = card.getAttribute('data-name') || "Unbekannter Strauß";
  const price = card.getAttribute('data-price') || "0.00";
 
  try {
    const response = await fetch('http://localhost:3000/Warenkorb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price })
    });
 
    if (!response.ok) {
      throw new Error('Server hat den Artikel nicht angenommen');
    }
 
    console.log(`${name} wurde zum Warenkorb hinzugefügt.`);
  } catch (err) {
    console.error('Fehler beim Hinzufügen zum Warenkorb:', err);
    alert('Der Artikel konnte nicht gespeichert werden. Läuft der Server (server.js) und MongoDB?');
  }
}
 
