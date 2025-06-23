document.addEventListener('DOMContentLoaded', () => {
  const container   = document.getElementById('event-form-container');
  const prevBtn     = document.getElementById('prev-btn');
  const nextBtn     = document.getElementById('next-btn');
  const counter     = document.getElementById('form-counter');

  let events = [];       // array de todos os logs saída/reentrada ainda não registrados
  let index  = 0;        // índice do formulário atual

  // 1) Busca todos os logs e filtra
  fetch('http://localhost:4000/logs')
    .then(res => res.json())
    .then(logs => {
      // transforme { epc: [evt...] } em lista de { epc, ...evt }
      Object.entries(logs).forEach(([epc, evts]) => {
        evts.forEach(evt => {
          if ((evt.status === 'saida' || evt.status === 'reentrada') && !evt.registered) {
            events.push({ epc, ...evt });
          }
        });
      });
      if (events.length === 0) {
        container.innerHTML = '<p>No pending events to register.</p>';
        prevBtn.disabled = nextBtn.disabled = true;
      } else {
        renderForm();
      }
    })
    .catch(err => {
      container.innerHTML = `<p class="error">Error loading events: ${err}</p>`;
    });

  // 2) Renderiza o formulário atual
  function renderForm() {
    const e = events[index];
    counter.textContent = `Event ${index+1} of ${events.length}`;

    container.innerHTML = `
      <form id="event-form">
        <p><strong>EPC:</strong> ${e.epc}</p>
        <p><strong>Status:</strong> ${e.status}</p>
        <p><strong>When:</strong> ${new Date(e.timestamp*1000).toLocaleString()}</p>
        <label for="reason">Explain why this happened:</label>
        <textarea id="reason" name="reason" rows="4" required></textarea>
        <button type="submit">Submit</button>
      </form>
    `;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === events.length-1;

    document.getElementById('event-form')
      .addEventListener('submit', onSubmit);
  }

  // 3) Ao submeter, registra e remove esse evento da lista
  function onSubmit(ev) {
    ev.preventDefault();
    const reason = ev.target.reason.value.trim();
    if (!reason) return alert('Please explain the reason.');

    const current = events[index];
    // envia ao back-end (supondo POST /register-event)
    fetch('http://localhost:4000/register-event', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        epc: current.epc,
        timestamp: current.timestamp,
        status: current.status,
        reason
      })
    })
    .then(res => {
      if (!res.ok) throw new Error(res.statusText);
      // marca localmente como registrado e remove da lista
      events.splice(index, 1);
      if (index >= events.length) index = events.length - 1;
      if (events.length === 0) {
        container.innerHTML = '<p>All events have been registered 🎉</p>';
        prevBtn.disabled = nextBtn.disabled = true;
      } else {
        renderForm();
      }
    })
    .catch(err => alert('Failed to register: ' + err));
  }

  // 4) Navegação
  prevBtn.addEventListener('click', () => {
    if (index > 0) {
      index--;
      renderForm();
    }
  });
  nextBtn.addEventListener('click', () => {
    if (index < events.length-1) {
      index++;
      renderForm();
    }
  });
});
