document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#logs-table tbody');

  // 1) Pega logs toda vez que a página carrega
  fetch('http://localhost:4000/logs')
    .then(res => res.json())
    .then(logs => {
      tableBody.innerHTML = '';  // limpa
      console.log(logs)

      logs.forEach(log => {
        const tr = document.createElement('tr');

        // Última antena: evt.antenna
        const tdEPC = document.createElement('td')
        const tdStat = document.createElement('td');
        const tdTime = document.createElement('td');
        const tdDescription = document.createElement('td')

        tdEPC.textContent = log.item_id
        tdStat.textContent = log.status;
        tdTime.textContent = log.timestamp
        tdDescription.textContent = log.description
        // tdTime.textContent = new Date(log.timestamp * 1000)
        //                     .toLocaleString();

        tr.append(tdEPC, tdStat, tdTime, tdDescription);
        tableBody.appendChild(tr);
      })
  

    })
    .catch(err => {
      console.error('Erro ao buscar logs:', err);
    });
});