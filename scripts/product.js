function extractJsonBlock(raw) {
  console.log(raw)
  const start = raw.indexOf('{');
  if (start === -1) {
    throw new Error('Não achei nenhuma chave "{"');
  }
  let depth = 0;
  for (let i = start; i < raw.length; i++) {
    const ch = raw[i];
    if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) {
        // i é o índice do '}' correspondente ao primeiro '{'
        return JSON.parse(raw.slice(start, i + 1));
      }
    }
  }
  throw new Error('Não achei chave "}" correspondente');
}



document.addEventListener('DOMContentLoaded', () => {
  // --- todas as referências ao DOM ---
  const form            = document.getElementById('dynamic-form');
  const modeSelect      = document.getElementById('mode');
  const fileContainer   = document.getElementById('file-container');
  const textContainer   = document.getElementById('text-container');
  const typeSelect      = document.getElementById('type-select');
  const fieldsContainer = document.getElementById('fields-container');
  const reviewContainer = document.getElementById('review-container');
  const reviewFields    = document.getElementById('review-fields');
  const btnBack         = document.getElementById('btn-back');
  const btnSubmitReview = document.getElementById('btn-submit-review');
  const dataList = document.getElementById('type-list');
  const typeInput = document.getElementById('type-input');
  const btnSubmit = document.getElementById('btn-submit');
  const fileInput = document.getElementById('file-input')


  
  const toggleBtn = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");

  toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
    });

  // --- seu JSON de specs ---
  const specsJson = {
    "HMI": "display type, screen size (inches), resolution, interface",
  "UPS": "input voltage (V), output voltage (V), battery type, backup time (min), supply type (AC or DC), rated capacity (kVA), efficiency (%), topology (online/offline), transfer time (ms), weight (kg)",
  "accessory": "accessory type",
  "actuator": "actuator type", 
  "adapter": "input voltage (V), output voltage (V), connector type, power rating (W)",
  "air dryer": "airflow (CFM), operating pressure (bar), power consumption (W)",
  "analyzer": "measured parameters, input range, accuracy, display type",
  "antenna": "frequency range (MHz), gain (dBi), polarization, beamwidth (°), connector type",
  "antenna accessory": "accessory type, compatible antenna types",
  "auxiliary contact": "contact configuration, rated current (A), rated voltage (V)",
  "battery": "nominal voltage (V), capacity (Ah), chemistry, cycle life (cycles), weight (kg), energy density (Wh/kg), internal resistance (mΩ), maximum discharge rate (C), operating temperature range (°C), self-discharge rate (%/month)",  "battery module": "nominal voltage (V), capacity (Ah), chemistry, weight (kg)",
  "busbar": "cross-sectional area (mm²), material, rated current (A)",
  "bushing": "voltage rating (kV)",
  "cabinet": "material, degree of protection (IP/NEMA), mounting style",
  "cable": "cross-sectional area (mm²), operating voltage (V), conductor material, insulation material, temperature rating (°C), outer diameter (mm)",
  "cable accessory": "accessory type, compatible cable types",
  "cable connector": "compatible conductor cross-sectional area (mm²), connection type, number of contacts, rated current (A), rated voltage (V)",
  "cable insulation": "insulation material, thickness (mm), maximum temperature (°C), dielectric strength (kV/mm)",
  "capacitor": "capacitance (µF), rated voltage (V), tolerance (%), dielectric type, ESR (Ω), ripple current (A), temperature coefficient (ppm/°C), leakage current (µA), operating temperature range (°C), dimensions (mm)",
  "capacitor bank": "total capacitance (µF), rated voltage (V), number of modules",
  "capacitor board": "board type, number of capacitor slots, mounting style",
  "chemical dispenser": "application",
  "chemical product": "type of product",
  "circuit breaker": "rated current (A), rated voltage (V), trip curve, number of poles, breaking capacity (kA)",
  "circuit breaker accessory": "accessory type, compatible circuit breakers",
  "communication module": "supported protocols, input voltage (V), power consumption (W), data rate (Mbps), interface type, inputs, outputs",
  "connector": "compatible conductor cross-sectional area (mm²), connection type, number of contacts, rated current (A), rated voltage (V), contact material, termination style",
  "contact accessory": "compatible contactors",
  "contact block": "number of circuits, contact configuration, rated current (A)",
  "contact relay": "coil voltage (V), contact configuration, rated current (A), rated voltage (V)",
  "contactor": "coil voltage (V), contact configuration, rated current (A), rated voltage (V), number of poles, utilization category (e.g. AC3), mechanical life (operations), electrical life (operations), auxiliary contacts count, operating temperature range (°C)",
  "contactor accessory": "compatible contactors, accessory type",
  "contactor auxiliary contact": "contact configuration, rated current (A), rated voltage (V)",
  "contactor coil": "coil voltage (V), power consumption (W)",
  "contactors": "coil voltage (V), contact configuration, rated current (A)",
  "controller": "type of controller",
  "cooling oil": "viscosity (cSt), dielectric strength (kV), flash point (°C), pour point (°C), density (kg/m³), viscosity index (VI), total acid number (TAN), oxidation stability (hours)",
  "disconnector": "rated voltage (V), rated current (A), number of poles",
  "display": "screen size (inches), resolution, display type, interface",
  "drive": "rated power (kW), supply voltage (V), control type, efficiency (%), current rating (A), frequency range (Hz), overload capacity (e.g. % for x s), cooling method, communication interface",
  "enclosure": "enclousure application",
  "fan": "power consumption (W), voltage (V), type of fan",
  "fan accessory": "accessory type, compatible fan models",
  "fastener": "type of fastener",
  "filter": "type of filter",
  "fuse": "rated current (A), rated voltage (V), fuse type, breaking capacity (kA), time characteristic, I²t (A²s), voltage drop (V), ambient temperature rating (°C), dimensions (mm), material",
  "fuse base": "supported fuse type, mounting style",
  "fuse holder": "supported fuse size, rated current (A), rated voltage (V), number of poles",
  "heater":"heating power (W), supply voltage (V), element type, enclosure rating, temperature range (°C), control type (e.g. thermostat, PID), heating element material, mounting style",
  "indicator light": "voltage (V), application",
  "inductor": "inductance (µH), rated current (A), rated voltage (V), DC resistance (Ω), self-resonant frequency (MHz)",
  "insulating oil": "viscosity (cSt), dielectric strength (kV), flash point (°C), pour point (°C), total acid number (TAN), density (kg/m³)",
  "insulation": "insulation material, thickness (mm), dielectric strength (kV/mm)",
  "insulator": "material, rated voltage (kV), mechanical load (kN)",
  "insulator chain": "link material, link strength (kN), link length (mm)",
  "inverter": "rated power (kW), input voltage (V), output voltage (V), efficiency (%), switching frequency (kHz), total harmonic distortion (THD), protection class (IP), cooling method",
  "inverter accessory": "type of accessory, compatible inverters",
  "limit switch": "actuation type, rated current (A), rated voltage (V)",
  "lock": "lock type, material, mounting style",
  "lubricant": "viscosity (cSt), temperature range (°C), base oil type, viscosity index (VI), pour point (°C), flash point (°C), additive package, density (kg/m³)",
  "measurement device": "measured parameter, range, accuracy, resolution",
  "mechanical component (tracker)": "mechanical motion range (°), load capacity (kg)",
  "module": "module type, input voltage (V), power consumption (W)",
  "monitoring device": "application",
  "motor": "power (kW), voltage (V), frequency (Hz), speed (rpm), number of poles, supply type (AC or DC), efficiency (%), enclosure type (IP rating)",
  "mounting bracket": "application",
  "mounting rail": "rail type",
  "network converter": "number of ports, rated voltage (V)",
  "network switch": "number of ports, supported speeds, power consumption (W), switching capacity (Gbps), port types (RJ45/SFP), PoE support, management interface, VLAN support, manageable (yes/no), supported protocols (e.g. SNMP, STP, LACP), dimensions (mm), operating temperature range (°C)",
  "packing set": "number of items, item type",
  "panel": "material, number of cells, finish, weight (kg)",
  "power module": "rated power (kW), input voltage (V), output voltage (V)",
  "power supply": "output voltage (V), output current (A), input voltage range (V)",
  "reactor": "rated inductance (mH), rated current (A), rated voltage (V)",
  "rectifier": "rated current (A), rated voltage (V), number of phases",
  "regulatory relay": "function type, coil voltage (V), contact configuration",
  "relay": "type, coil voltage (V), contact configuration, contact material, rated current (A), switching voltage (V)",
  "relay socket": "compatible relays, mounting style",
  "relay timer": "timing range, supply voltage (V), timing accuracy, output type",
  "resistor": "resistance (Ω), tolerance (%), power rating (W), material",
  "resistor card": "number of resistors, card type, mounting style",
  "seal kit": "kit contents, material compatibility",
  "sensor": "sensor type, measurement range, output signal, supply voltage (V)",
  "sensor amplifier": "gain, input range, bandwidth",
  "sensor module": "sensor type, interface, supply voltage (V)",
  "signage": "material, type of signage",
  "solar panel": "maximum power (Wp), voltage at max power (Vmp), current at max power (Imp), open-circuit voltage (Voc), short-circuit current (Isc), efficiency (%), temperature coefficient (%/°C), dimensions (mm), weight (kg), frame material",
  "surge arrester": "nominal discharge current (kA), maximum continuous operating voltage (V), number of poles, material",
  "surge protector": "nominal discharge current (kA), maximum continuous operating voltage (V)",
  "switch": "switch type, rated current (A), rated voltage (V), actuator type",
  "test block": "type, number of circuits, material, insulation rating",
  "timer": "timing range, supply voltage (V), timing accuracy",
  "timer switch": "actuation type, timing range, rated voltage (V)",
  "tool set": "number of tools, tool types",
  "tracker": "tracking type, input voltage (V), input current (A), power consumption (W), mechanical motion range (°)",
  "transformer": "rated power (kVA), primary voltage (V), secondary voltage (V), frequency (Hz)",
  "transformer accessory": "compatible transformers, accessory type",
  "transformer monitor": "monitored parameters, interface, supply voltage (V)",
  "unknown item": "application",
  "valve": "valve type, material, pressure rating (bar)",
  "washer": "washer type, material, dimensions (mm)"
  };

  // --- popula select de types ---
 Object.keys(specsJson).forEach(type => {
  const opt = document.createElement('option');
  opt.value = type;
  dataList.appendChild(opt);
});
  // --- alterna entre File/Text ---
  modeSelect.addEventListener('change', () => {
    const mode = modeSelect.value;
    fileContainer.classList.toggle('hidden', mode !== 'file');
    textContainer.classList.toggle('hidden', mode !== 'text');
    if (mode === 'file') {
      fieldsContainer.innerHTML = '';
      typeSelect.selectedIndex = 0;
    }
  });




typeInput.addEventListener('change', () => {
  const selected = typeInput.value;  // string digitada/selecionada
  fieldsContainer.innerHTML = '';

  // 1) Campos fixos: Part Number e Manufacturer
  fieldsContainer.innerHTML += `
    <div class="field-group">
      <label for="field-name"><strong>Name:</strong></label>
      <input type="text" id="field-name" name="name" placeholder="Enter the name of the product" required pattern="^[0-9]{4}\.[0-9]{2}\.[0-9]{2}$"/>
    </div>
    <div class="field-group">
      <label for="field-part-number"><strong>Part Number:</strong></label>
      <input type="text" id="field-part-number" name="part number" placeholder="Enter part number" required/>
    </div>
    <div class="field-group">
      <label for="field-manufacturer"><strong>Manufacturer:</strong></label>
      <input type="text" id="field-manufacturer" name="manufacturer" placeholder="Enter manufacturer" required/>
    </div>
    <div class="field-group">
      <label for="field-ncm"><strong>NCM:</strong></label>
      <input type="text" id="field-ncm" name="ncm" placeholder="Enter NCM" required/>
    </div>
    <div class="field-group">
      <label for="field-price"><strong>Price:</strong></label>
      <input type="text" id="field-price" name="price" placeholder="Enter price" />
    </div>
    <div class="field-group">
      <label for="field-datasheet"><strong>Datasheet URL:</strong></label>
      <input type="text" id="field-datasheet" name="datasheet" placeholder="Enter datasheet URL" />
    </div>
  `;

  // 2) Campos dinâmicos das specs
  const specs = specsJson[selected] || '';
  specs.split(',').forEach(raw => {
    const name = raw.trim();
    const id = 'field-' + name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    fieldsContainer.innerHTML += `
      <div class="field-group">
        <label for="${id}">${name}:</strong></label>
        <input type="text" id="${id}" name="${name}" placeholder="${name}" />
      </div>
    `;
  });
});


  // --- único submit listener ---
  form.addEventListener('submit', async e => {
    e.preventDefault();  // isso impede o redirect

    if (modeSelect.value === 'file') {

      if (!fileInput.files.length) {
        alert('Select a PDF file');
        return
      }

      const fd = new FormData()
      fd.append("file", fileInput.files[0])

    const questionMapping = {
    "product": "what is the name of the product?",
    "part number": "what is the part number of the product?",
    "manufacturer": "who is the manufacturer of the product?",
    "NCM": "what is the Nomenclatura Comum do Mercosul (NCM) of the product? You can answer this even if this information isn't provided in the document. If that's the case, answer it based on your knowledge.  When extracting or generating an NCM code, format it as 1234.56.78 (four digits, a dot, two digits, a dot, two digits).",
    "datasheet": "what is the URL of the product's datasheet? You can answer this even if this information isn't provided in the document. If that's the case, answer it based on your knowledge",
    "type": "what is the type of the product? It can be Keyboard, Conference System, Notebook, Monitor, Smartphone, Speaker, Videobar all-in-one or Unknown item.",
    "if this document is related to a Conference System, return": `{
      "microphone channels": "value",
      "speaker output power (W)": "value",
      "frequency response (Hz)": "value",
      "noise cancellation": "value",
      "connectivity (Ethernet/Wi-Fi/Bluetooth)": "value",
      "control interface": "value",
      "power supply (PoE/adapter)": "value",
      "dimensions (mm)": "value",
      "mounting options": "value"
    }`,
    "if this document is related to a Notebook, return": `{
      "processor model": "value",
      "RAM size (GB)": "value",
      "storage type and capacity (GB)": "value",
      "display size (inches) and resolution": "value",
      "battery capacity (Wh)": "value",
      "graphics (GPU)": "value",
      "weight (kg)": "value",
      "port selection (USB/HDMI/etc.)": "value",
      "operating system": "value"
    }`,
    "if this document is related to a Monitor, return": `{
      "screen size (inches)": "value",
      "resolution": "value",
      "panel type (IPS/VA/TN)": "value",
      "refresh rate (Hz)": "value",
      "brightness (cd/m²)": "value",
      "contrast ratio": "value",
      "response time (ms)": "value",
      "connectivity (HDMI/DP/VGA)": "value",
      "aspect ratio": "value"
    }`,
    "if this document is related to a Smartphone, return": `{
      "display size (inches) and resolution": "value",
      "processor chipset": "value",
      "RAM (GB)": "value",
      "storage (GB)": "value",
      "battery capacity (mAh)": "value",
      "rear/front camera (MP)": "value",
      "operating system": "value",
      "connectivity (5G/Wi-Fi/Bluetooth)": "value",
      "dimensions (mm)": "value",
      "weight (g)": "value"
    }`,
    "if this document is related to a Speaker, return": `{
      "power output (W RMS)": "value",
      "frequency response (Hz)": "value",
      "impedance (Ω)": "value",
      "sensitivity (dB)": "value",
      "driver size (inches)": "value",
      "connectivity (wired/Bluetooth/Wi-Fi)": "value",
      "enclosure type": "value",
      "dimensions (mm)": "value",
      "weight (kg)": "value"
    }`,
    "if this document is related to a Videobar all-in-one, return": `{
      "video resolution (e.g. 4K)": "value",
      "field of view (°)": "value",
      "microphone array (count)": "value",
      "speaker output (W)": "value",
      "beamforming technology": "value",
      "connectivity (USB/PoE)": "value",
      "built-in DSP features": "value",
      "mounting options": "value",
      "dimensions (mm)": "value"
    }`,
    "if this document is related to an Unknown item, return": `{
      "application": "value"
    }`
  };




      fd.append("questions_mapping", JSON.stringify(questionMapping))
      btnSubmit.innerHTML = 'Loading...'
      btnSubmit.disabled = true

      try {

        const res = await fetch(form.action, {
          method: form.method,
          body: new FormData(form)   // garante que o arquivo vai junto
        });

        // const res = await fetch("https://core-staging.atlasren.com/pdf/process-invoice", {
        //   method: "POST",
        //   headers: {
        //     "X-API-Key": "odoostaging_key4gg@wQqLJ8EWsuWA",
        //     "accept": "application/json"
        //   },
        //   body: fd
        // });


        const data = await res.json();
        console.log(data)
        let dataParsed = data.results;

        // troca views
        form.classList.add('hidden');
        reviewContainer.classList.remove('hidden');

        // popula reviewFields
        reviewFields.innerHTML = `
        <div class="field-group">
          <label for="rev-name"><strong>Name:</strong></label>
          <input type="text" id="rev-name" name="name" value="${dataParsed.product || ''}" required/>
        </div>
        <div class="field-group">
          <label for="rev-part_number"><strong>Part Number:</strong></label>
          <input type="text" id="rev-part_number" name="part number" value="${dataParsed['part number'] || ''}" required/>
        </div>
        <div class="field-group">
          <label for="rev-manufacturer"><strong>Manufacturer:</strong></label>
          <input type="text" id="rev-manufacturer" name="manufacturer" value="${dataParsed.manufacturer || ''}" required/>
        </div>
        <div class="field-group">
          <label for="rev-type"><strong>Type:</strong></label>
          <input type="text" id="rev-type" name="type" value="${dataParsed.type}" required/>
        </div>
        <div class="field-group">
          <label for="rev-ncm"><strong>NCM:</strong></label>
          <input type="text" id="rev-ncm" name="ncm" value="${dataParsed['NCM'] || ''}" required pattern="^[0-9]{4}\.[0-9]{2}\.[0-9]{2}$"/>
        </div>
        <div class="field-group">
          <label for="rev-datasheet"><strong>Datasheet:</strong></label>
          <input type="text" id="rev-datasheet" name="datasheet" value="${dataParsed.datasheet || ''}" />
        </div>
        <div class="field-group">
          <label for="rev-price"><strong>Price:</strong></label>
          <input type="text" id="rev-price" name="price" value="" placeholder="Enter price" />
        </div>
      `;

        
      // Object.entries(typeObj).forEach(([key, val]) => {
      //   if (key === 'name') return;
      //   const id = 'rev-' + key.replace(/[^a-z0-9]/gi,'_').toLowerCase();
      //   reviewFields.innerHTML += `
      //     <div class="field-group">
      //       <label for="${id}">${key}:</label>
      //       <input type="text" id="${id}" name="${key}" value="${val || 'Not found'}" />
      //     </div>`;
      // });

      const specsKey = `if this document is related to a ${dataParsed.type}, return`;

      const specs = typeof dataParsed[specsKey] === 'object'
      ? dataParsed[specsKey]
      : {};

      Object.entries(specs).forEach(([specName, specValue]) => {
        const id = 'rev-' + specName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        reviewFields.innerHTML += `
          <div class="field-group">
            <label for="${id}">${specName}:</label>
            <input type="text" id="${id}" name="${specName}" value="${specValue}" />
          </div>`;
      });

      } catch (err) {
        console.log(err)
        alert('Error: ' + err.message);
      } finally {
        btnSubmit.innerHTML = 'Submit'
        btnSubmit.disabled = false
      }

    } else {
      // 1) Campos fixos obrigatórios
      const product          = document.getElementById('field-name').value.trim();
      const partNumber    = document.getElementById('field-part-number').value.trim();
      const manufacturer  = document.getElementById('field-manufacturer').value.trim();
      const productType          = typeInput.value.trim(); // o <input list="type-list">
      const ncm           = document.getElementById('field-ncm').value.trim() || undefined;
      const datasheetURL  = document.getElementById('field-datasheet').value.trim() || undefined;
      const priceRaw      = document.getElementById('field-price').value.trim();
      const price         = priceRaw ? parseFloat(priceRaw) : undefined;

      // 2) valida obrigatórios
      if (!product || !partNumber || !manufacturer || !productType) {
        return alert('Preencha Name, Part Number, Manufacturer e Type.');
      }

      // 3) monta a string de description com os campos dinâmicos
      // pega todos os inputs menos os fixos
      const dynamicInputs = Array.from(fieldsContainer.querySelectorAll('input'))
        .filter(i => ![
          'name','part number','manufacturer','type','ncm','datasheet','price'
        ].includes(i.name));

      const description = dynamicInputs
        .map(i => `${i.name}: ${i.value.trim() || 'Not found'}`)
        .join(', ');

      // 4) monta payload no mesmo formato do RegisterProduct
        const payload = {
          product,                // ex: “PowerGuard 5000”
          product_type: productType,                   // ex: “UPS”
          name: product,          // ou, se preferir, outro campo de “name”
          part_number: partNumber,
          manufacturer,
          price,                  // undefined vira null no JSON
          datasheetURL,
          ncm,
          description,
          confirm: false            // string formatada
        };

      console.log('Manual payload:', payload);

       const endpoint = 'http://localhost:4000/submit-product';

      // 5) envia pro mesmo endpoint
      try {
        const res = await fetch(endpoint,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const err = await res.json();
          console.error('Erro de validação:', err.detail);
          return alert('Falha ao registrar: verifique console.');
        }

        const result = await res.json();
        console.log('Registrado:', result);
        alert('Produto registrado com sucesso!');
        window.location.href = '/pages/product.html';
      } catch (err) {
        console.error(err);
        alert('Erro na requisição: ' + err.message);
      }
    }
  });

  // --- botões de review ---
  btnBack.addEventListener('click', () => {
    reviewContainer.classList.add('hidden');
    form.classList.remove('hidden');
  });


  function showSimilarDialog(candidates) {
    // 1) Cria o overlay
    const overlay = document.createElement('div');
    overlay.classList.add('modal-overlay');


    // 2) Cria o container do dialog
    const dialog = document.createElement('div');
    dialog.classList.add('modal-dialog')

    overlay.appendChild(dialog);

    // 3) Título
    const title = document.createElement('h4');
    title.classList.add('modal-title')
    title.textContent = 'Produtos parecidos encontrados:';
    dialog.appendChild(title);

    // 4) Lista de candidatos
    const ul = document.createElement('ul');
    ul.classList.add('modal-list')

    candidates.forEach(c => {
      const li = document.createElement('li');
      li.classList.add('modal-item')
      // li.style.marginBottom = '12px';
     li.innerHTML = `
      <div class="item-info">
        <strong>${c.product}</strong> (PN: ${c.part_number})<br/>
        ${c.manufacturer}<br/>
        ${c.description || ''}
      </div>
      <div class="item-distance">dist: ${c.distance.toFixed(3)}</div>
    `;
      ul.appendChild(li);
    });
    dialog.appendChild(ul);

    // 5) Botões
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('modal-buttons');



    const cancel = document.createElement('button');
    cancel.textContent = 'Cancelar';
    cancel.classList.add('btn', 'btn-secondary');
    cancel.onclick = () => document.body.removeChild(overlay);

    const confirm = document.createElement('button');
    confirm.textContent = 'Confirmar envio';
    confirm.classList.add('btn', 'btn-primary');
    // confirm.style.background = '#28a745';
    // confirm.style.color = '#fff';
    confirm.onclick = () => {
      document.body.removeChild(overlay);
      actuallySubmit(true);  // dispara o envio com confirm=true
    };

    btnContainer.appendChild(cancel);
    btnContainer.appendChild(confirm);
    dialog.appendChild(btnContainer);

    // 6) Anexa ao body
    document.body.appendChild(overlay);
  }

 
  reviewContainer.addEventListener('submit', async e => {
    e.preventDefault();

    // 1) Campos fixos
    const product      = document.getElementById('rev-name').value.trim();
    const partNumber   = document.getElementById('rev-part_number').value.trim();
    const manufacturer = document.getElementById('rev-manufacturer').value.trim();
    const productType         = document.getElementById('rev-type').value.trim();
    const priceRaw     = document.getElementById('rev-price').value.trim();
    const price        = priceRaw ? parseFloat(priceRaw) : undefined;
    const datasheetURL = document.getElementById('rev-datasheet').value.trim() || undefined;
    const ncm = document.getElementById("rev-ncm").value.trim()

    // validação obrigatórios
    if (!product || !partNumber || !manufacturer || !productType) {
      return alert('Preencha Name, Part Number e Manufacturer.');
    }

    // 2) Monta a string de description com os fields dinâmicos
    // pega todos os inputs exceto os fixos (name, part_number, manufacturer, type, price, datasheet)
    const dynamicInputs = Array.from(reviewFields.querySelectorAll('input'))
      .filter(i => ![
        'name','part number','manufacturer','type','price','datasheet', 'ncm'
      ].includes(i.name));

    const description = dynamicInputs
      .map(i => `${i.name}: ${i.value.trim() || 'Not found'}`)
      .join(', ');

    // 3) Monta o payload conforme o schema RegisterProduct
    const payload = {
      product,                // ex: “PowerGuard 5000”
      product_type: productType,                   // ex: “UPS”
      name: product,          // ou, se preferir, outro campo de “name”
      part_number: partNumber,
      manufacturer,
      price,                  // undefined vira null no JSON
      datasheetURL,
      ncm,
      description,
      confirm: false             // string formatada
    };

    // 4) Envia para o endpoint

    console.log(payload)

    try {
      const res = await fetch(reviewContainer.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const result = await res.json();

      if (result.action == 'check_similarity'){
        candidates = result.candidates

        showSimilarDialog(candidates)

      }
      console.log(result)
      console.log('Registrado:', result);
      // alert('Produto registrado com sucesso!');
      // window.location.href = '/pages/product.html';
      // opcional: resetar tudo ou redirecionar 
    } catch (err) {
      console.error(err);
      alert('Falha ao registrar: ' + err.message);
    }
  });


});


