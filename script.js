console.log('hier ist nichts außer die ewige leere, gefüllt mit all meinen fehlgeschlagenen träumen und wünschen');
/*kein var für javascript verwenden, gilt fürs komplette skript, kann zu fehlern führen*/


const button = document.getElementById ('Produkt1');
console.log(button);
button.addEventListener('click', sayNo)

const Warenkorb = [{Blumenname:"Rose",Preis:3},{Straußname:"StraußWeiß",Preis:33},{Saisonname:"OsterRot",Preis:3 }]

/*ki*/
function sayNo() {
    const name = button.getAttribute('data-name') || "Unbekannter Strauß";
    const price = button.getAttribute('data-price') || "0.00";

    let warenkorb = JSON.parse(localStorage.getItem('meinWarenkorb')) || [];
    warenkorb.push({ name: name, price: price });
    sendJsonWithPOST('http://localhost:3000/Warenkorb',JSON.stringify({ name: name, price: price }))
    localStorage.setItem('meinWarenkorb', JSON.stringify(warenkorb));

    /*button.innerHTML = `
        <div style="padding: 40px; text-align: center;">
            <h2 style="color: green;">Hinzugefügt! ✅</h2>
            <p>${name} ist im Korb.</p>
            <a href="basket.html" style="color: blue; text-decoration: underline;">Zum Warenkorb</a>
        </div>
    `;*/

    console.log("Gespeichert:", name);
}

console.log(window.location.href)


async function sendJsonWithPOST(url, jsonData) {
  const response = await fetch(url, {
    method: 'post',
    body: jsonData}
  )
  // Auf Response kann wie bei GET reagiert werden
}


