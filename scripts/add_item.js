document.addEventListener('DOMContentLoaded', () => {
  const productSelect = document.getElementById('product-select');
  const quantityInput = document.getElementById('quantity-input');
  const btnGenerate   = document.getElementById('btn-generate');
  const epcList       = document.getElementById('epc-list');

  // 1) Carrega lista de produtos do backend
  fetch('http://localhost:4000/products')
    .then(res => res.json())
    .then(products => {
      productSelect.innerHTML = '<option value="" disabled selected>Selecione…</option>';
      products.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.product_id;
        opt.textContent = `${p.product} (ID ${p.product_id})`;
        productSelect.appendChild(opt);
      });
    })
    .catch(console.error);

  btnGenerate.addEventListener('click', async () => {
    const pid = +productSelect.value;
    const qty = +quantityInput.value;
    if (!pid || qty < 1) return alert('Selecione um produto e quantidade válida.');

    // 2) Pega último item_id para esse produto
    let lastId = 0;
    try {
      const res = await fetch(`http://localhost:4000/items/last`);
      const json = await res.json();
      lastId = json.last_item_id ?? 0;
    } catch (e) {
      console.error(e);
      return alert('Não foi possível obter último item_id.');
    }

    // 3) Gera EPCs
    const prefix = '41544C4153';             // "atlas" em hex
    const prodPart = String(pid).padStart(5,'0');
    const epcs = [];
    for (let i = 1; i <= qty; i++) {
      const itemNum = String(lastId + i).padStart(9,'0');
      epcs.push(prefix + prodPart + itemNum);
    }

    // 4) Exibe
    epcList.innerHTML = '';
    epcs.forEach(code => {
      const li = document.createElement('li');
      li.textContent = code;
      epcList.appendChild(li);
    });
  });
});
