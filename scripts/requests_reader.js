
async function startReader() {
    try {
        let response = await fetch("http://localhost:4000/start-reader");
        let data = await response.json();
        alert(data);
        ws = new WebSocket('ws://localhost:4000/ws');

        ws.onopen = function () {
            console.log('WebSocket Connected');
        };

        ws.onmessage = function (event) {
            const data = JSON.parse(event.data);
            console.log(data)
            const tags = data.tags

            

            const tbody = document.querySelector('#tag-table tbody');
            tbody.innerHTML = '';     // limpa todas as linhas anteriores

            tags.forEach((tag, idx) => {
                const ms = (tag.last_seen / 1e6) * 1000;
                const date = new Date(ms);
                const tr = document.createElement('tr');

                // três colunas: EPC, Last Seen, Antenna
                const tdEpc       = document.createElement('td');
                const tdLastSeen  = document.createElement('td');
                const tdAntenna   = document.createElement('td');
                
                tdEpc.textContent      = tag.epc;
                tdLastSeen.textContent = date.toLocaleTimeString();
                tdAntenna.textContent  = tag.antenna;

                tr.append(tdEpc, tdLastSeen, tdAntenna);
                tbody.appendChild(tr);
            });

            //pegar os 3 atributos do objeto data para cada tag lida e colocar nas linhas da tabela do html nas colunas corretas. Deixe uma a primeira linha em laranja, a segunda em branco
            //e assim por diante alternando entre laranja e branco nos estilos padrao no front-end que vc criou comigo 
        };

        ws.onclose = function () {
            console.log('WebSocket Disconnected');
            // Try to reconnect after 5 seconds
            setTimeout(connectWebSocket, 5000);
        };

        ws.onerror = function (error) {
            console.error('WebSocket Error:', error);
        };
    } catch (error) {
        console.error("Error starting reader:", error);
        alert("Failed to start reader");
    }
}


async function stopReader() {
    try {
        let response = await fetch("http://localhost:4000/stop-reader", {
            method: 'GET'
        });
        let data = await response.json();
        document.getElementById("tagList").innerText = JSON.stringify(data.tags, null, 2);
        alert('Reader stopped');
    } catch (error) {
        console.error("Error stopping reader:", error);
        alert("Failed to stop reader");
    }
}

async function getStatus() {
    try {
        let response = await fetch("http://localhost:4000/status", {
            method: 'GET'
        });
        let data = await response.json();
        alert(data.status);
    } catch (error) {
        console.error("Error fetching reader status:", error);
        alert("Failed to fetch reader status");
    }
}
