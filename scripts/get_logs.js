document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#logs-table tbody');

  // 1) Pega logs toda vez que a página carrega
  fetch('http://localhost:4000/logs')
    .then(res => res.json())
    .then(logs => {
      tableBody.innerHTML = '';  // limpa
      console.log(logs)

      Object.entries(logs).forEach(([epc, events]) => {
        events.forEach((evt, idx) => {
          const tr = document.createElement('tr');

          // Última antena: evt.antenna
          const tdEPC = document.createElement('td')
          const tdStat = document.createElement('td');
          const tdTime = document.createElement('td');

          tdEPC.textContent = epc
          tdStat.textContent = evt.status;
          tdTime.textContent = new Date(evt.timestamp * 1000)
                                .toLocaleString();

          tr.append(tdEPC, tdStat, tdTime);
          tableBody.appendChild(tr);
        });
      });
    })
    .catch(err => {
      console.error('Erro ao buscar logs:', err);
    });
});