let elector = { dni: "", nombre: "" };
let eleccion = "Municipal Metropolitana de Lima";
let voto = null;
let tipoVoto = "";

const candidatos = [
    { numero: 1, nombre: "Luis Gálvez", organizacion: "Candidatura municipal — Lima Metropolitana", imagen: "candidatos/luis-galvez.png" },
    { numero: 2, nombre: "Paco Bazán", organizacion: "Candidatura municipal — Lima Metropolitana", imagen: "candidatos/paco-bazan.png" },
    { numero: 3, nombre: "Sussel Paredes", organizacion: "Candidatura municipal — Lima Metropolitana", imagen: "candidatos/sussel-paredes.png" },
    { numero: 4, nombre: "Yorry Warthon", organizacion: "Candidatura municipal — Lima Metropolitana", imagen: "candidatos/yorry-warthon.png" },
    { numero: 5, nombre: "Alberto Tejada", organizacion: "Candidatura municipal — Lima Metropolitana", imagen: "candidatos/alberto-tejada.png" },
    { numero: 6, nombre: "Carlos Bruce", organizacion: "Candidatura municipal — Lima Metropolitana", imagen: "candidatos/carlos-bruce.png" },
    { numero: 7, nombre: "Daniel Urresti", organizacion: "Candidatura municipal — Lima Metropolitana", imagen: "candidatos/daniel-urresti.png" },
    { numero: 8, nombre: "Francis Allison", organizacion: "Candidatura municipal — Lima Metropolitana", imagen: "candidatos/francis-allison.png" }
];

document.addEventListener("DOMContentLoaded", function () {
    cargarCandidatos();
    actualizarProgreso(1);
});

function validarElector() {
    const dni = document.getElementById("dni").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const mensaje = document.getElementById("mensajeIdentificacion");

    if (!/^\d{8}$/.test(dni)) {
        mensaje.textContent = "⚠️ El DNI debe contener exactamente 8 dígitos.";
        mensaje.className = "message error";
        return;
    }
    if (nombre.length < 3) {
        mensaje.textContent = "⚠️ Ingrese un nombre válido.";
        mensaje.className = "message error";
        return;
    }

    elector = { dni, nombre };
    mensaje.textContent = "✓ Identificación validada para la simulación.";
    mensaje.className = "message success";
    document.getElementById("eleccion").classList.remove("hidden");
    actualizarProgreso(2);
    document.getElementById("eleccion").scrollIntoView({ behavior: "smooth" });
}

function seleccionarEleccion(elemento, tipo) {
    document.querySelectorAll(".election-card").forEach(card => card.classList.remove("selected"));
    elemento.classList.add("selected");
    eleccion = tipo;
}

function continuarEleccion() {
    const mensaje = document.getElementById("mensajeEleccion");
    if (!eleccion) {
        mensaje.textContent = "⚠️ Seleccione un proceso electoral.";
        mensaje.className = "message error";
        return;
    }
    mensaje.textContent = "✓ Proceso seleccionado.";
    mensaje.className = "message success";
    document.getElementById("electorMostrar").textContent = elector.nombre;
    document.getElementById("eleccionMostrar").textContent = eleccion;
    document.getElementById("votacion").classList.remove("hidden");
    actualizarProgreso(3);
    document.getElementById("votacion").scrollIntoView({ behavior: "smooth" });
}

function cargarCandidatos() {
    const contenedor = document.getElementById("candidatos");
    contenedor.innerHTML = "";
    candidatos.forEach(candidato => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "candidate";
        tarjeta.innerHTML = `
            <div class="candidate-number">${candidato.numero}</div>
            <div class="candidate-photo-wrap"><img class="candidate-photo" src="${candidato.imagen}" alt="${candidato.nombre}"></div>
            <div class="check">✓</div>
            <h3>${candidato.nombre}</h3>
            <p>${candidato.organizacion}</p>`;
        tarjeta.addEventListener("click", () => seleccionarCandidato(candidato, tarjeta));
        contenedor.appendChild(tarjeta);
    });
}

function seleccionarCandidato(candidato, tarjeta) {
    limpiarSeleccion();
    tarjeta.classList.add("selected");
    voto = candidato.numero;
    tipoVoto = "candidato";
    document.getElementById("seleccion").textContent = `✓ Selección actual: ${candidato.numero} - ${candidato.nombre}`;
}

function seleccionarEspecial(tipo) {
    limpiarSeleccion();
    if (tipo === "blanco") {
        document.getElementById("blanco").classList.add("selected");
        voto = "BLANCO";
        tipoVoto = "blanco";
        document.getElementById("seleccion").textContent = "✓ Selección actual: VOTO EN BLANCO";
    } else {
        document.getElementById("nulo").classList.add("selected");
        voto = "NULO";
        tipoVoto = "nulo";
        document.getElementById("seleccion").textContent = "✓ Selección actual: VOTO NULO";
    }
}

function limpiarSeleccion() {
    document.querySelectorAll(".candidate").forEach(el => el.classList.remove("selected"));
    document.getElementById("blanco").classList.remove("selected");
    document.getElementById("nulo").classList.remove("selected");
}

function revisarVoto() {
    const mensaje = document.getElementById("mensajeVotacion");
    if (voto === null) {
        mensaje.textContent = "⚠️ Debe seleccionar una opción.";
        mensaje.className = "message error";
        return;
    }
    let textoVoto = "";
    if (tipoVoto === "candidato") {
        const candidato = candidatos.find(item => item.numero === voto);
        textoVoto = `${candidato.numero} - ${candidato.nombre}`;
    } else if (tipoVoto === "blanco") {
        textoVoto = "VOTO EN BLANCO";
    } else {
        textoVoto = "VOTO NULO";
    }
    document.getElementById("confirmarElector").textContent = elector.nombre;
    document.getElementById("confirmarEleccion").textContent = eleccion;
    document.getElementById("confirmarVoto").textContent = textoVoto;
    document.getElementById("confirmacion").classList.remove("hidden");
    actualizarProgreso(4);
    document.getElementById("confirmacion").scrollIntoView({ behavior: "smooth" });
}

function volverVotacion() {
    document.getElementById("confirmacion").classList.add("hidden");
    actualizarProgreso(3);
    document.getElementById("votacion").scrollIntoView({ behavior: "smooth" });
}

function confirmarVoto() {
    if (voto === null) return;
    const resultados = obtenerResultados();
    if (tipoVoto === "candidato") resultados[voto]++;
    if (tipoVoto === "blanco") resultados.blanco++;
    if (tipoVoto === "nulo") resultados.nulo++;
    guardarResultados(resultados);

    document.getElementById("codigo").textContent = generarCodigo();
    document.getElementById("fecha").textContent = new Date().toLocaleString("es-PE");
    document.getElementById("constanciaNombre").textContent = elector.nombre;
    document.getElementById("constanciaProceso").textContent = eleccion;
    document.getElementById("confirmacion").classList.add("hidden");
    document.getElementById("constancia").classList.remove("hidden");
    document.getElementById("constancia").scrollIntoView({ behavior: "smooth" });
}

function generarCodigo() {
    const caracteres = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let codigo = "SIM-";
    for (let i = 0; i < 6; i++) codigo += caracteres[Math.floor(Math.random() * caracteres.length)];
    return codigo;
}

function obtenerResultados() {
    const guardado = localStorage.getItem("resultadosERM2026");
    if (guardado) return JSON.parse(guardado);
    const resultados = {};
    candidatos.forEach(c => resultados[c.numero] = 0);
    resultados.blanco = 0;
    resultados.nulo = 0;
    return resultados;
}

function guardarResultados(resultados) {
    localStorage.setItem("resultadosERM2026", JSON.stringify(resultados));
}

function mostrarResultados() {
    const contenedor = document.getElementById("resultadosLista");
    const resultados = obtenerResultados();
    contenedor.innerHTML = "";
    let total = 0;
    candidatos.forEach(c => total += resultados[c.numero]);
    total += resultados.blanco + resultados.nulo;
    candidatos.forEach(c => {
        const votos = resultados[c.numero];
        crearResultado(`${c.numero} - ${c.nombre}`, votos, total ? (votos / total) * 100 : 0, contenedor);
    });
    crearResultado("⚪ Votos en blanco", resultados.blanco, total ? (resultados.blanco / total) * 100 : 0, contenedor);
    crearResultado("❌ Votos nulos", resultados.nulo, total ? (resultados.nulo / total) * 100 : 0, contenedor);
    document.getElementById("totalVotos").textContent = total;
    document.getElementById("resultados").classList.remove("hidden");
    document.getElementById("resultados").scrollIntoView({ behavior: "smooth" });
}

function crearResultado(nombre, votos, porcentaje, contenedor) {
    const elemento = document.createElement("div");
    elemento.className = "result";
    elemento.innerHTML = `<div class="result-header"><span class="result-name">${nombre}</span><strong>${votos} voto(s) - ${porcentaje.toFixed(1)}%</strong></div><div class="result-bar"><div class="result-fill" style="width:${porcentaje}%"></div></div>`;
    contenedor.appendChild(elemento);
}

function imprimirConstancia() { window.print(); }

function reiniciar() {
    elector = { dni: "", nombre: "" };
    eleccion = "Municipal Metropolitana de Lima";
    voto = null;
    tipoVoto = "";
    document.getElementById("dni").value = "";
    document.getElementById("nombre").value = "";
    document.querySelectorAll(".card").forEach(card => {
        if (!["identificacion", "cedulaSection", "geolocalizacionSection"].includes(card.id)) card.classList.add("hidden");
    });
    document.querySelectorAll(".election-card").forEach(card => card.classList.remove("selected"));
    const electionCard = document.querySelector(".election-card");
    if (electionCard) electionCard.classList.add("selected");
    limpiarSeleccion();
    document.getElementById("seleccion").textContent = "Ninguna opción seleccionada.";
    actualizarProgreso(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function borrarResultados() {
    if (!confirm("¿Desea borrar todos los resultados de la simulación?")) return;
    localStorage.removeItem("resultadosERM2026");
    mostrarResultados();
}

function actualizarProgreso(paso) {
    for (let i = 1; i <= 4; i++) {
        const elemento = document.getElementById("step" + i);
        elemento.classList.remove("active", "completed");
        if (i < paso) elemento.classList.add("completed");
        if (i === paso) elemento.classList.add("active");
    }
}

function irInicio() {
    document.getElementById("identificacion").scrollIntoView({ behavior: "smooth" });
}

function abrirDondeVotar() {
    document.getElementById("modalDondeVotar").classList.remove("hidden");
}

function mostrarCedula() {
    document.getElementById("modalCedula").classList.remove("hidden");
}

function cerrarModal(id) {
    document.getElementById(id).classList.add("hidden");
}

function abrirGeolocalizacion() {
    document.getElementById("geolocalizacionSection").scrollIntoView({ behavior: "smooth" });
}

function obtenerUbicacion() {
    const status = document.getElementById("geoStatus");
    const placeholder = document.getElementById("mapPlaceholder");
    const frame = document.getElementById("mapFrame");
    const link = document.getElementById("mapLink");
    const coordinates = document.getElementById("coordinates");

    if (!navigator.geolocation) {
        status.textContent = "⚠️ Este navegador no admite geolocalización.";
        status.className = "message error";
        return;
    }

    status.textContent = "📡 Solicitando permiso de ubicación...";
    status.className = "message";

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const delta = 0.01;
            const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;

            coordinates.textContent = `Latitud: ${lat.toFixed(6)} · Longitud: ${lon.toFixed(6)}`;
            status.textContent = "✓ Ubicación obtenida correctamente.";
            status.className = "message success";
            link.href = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`;
            link.classList.remove("hidden");

            frame.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
            frame.classList.remove("hidden");
            placeholder.classList.add("hidden");
        },
        function (error) {
            const mensajes = {
                1: "⚠️ Permiso de ubicación denegado. Actívelo desde el navegador si desea usar esta función.",
                2: "⚠️ No fue posible determinar la ubicación.",
                3: "⚠️ La solicitud de ubicación tardó demasiado."
            };
            status.textContent = mensajes[error.code] || "⚠️ No se pudo obtener la ubicación.";
            status.className = "message error";
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
}

window.addEventListener("click", function (event) {
    document.querySelectorAll(".modal").forEach(modal => {
        if (event.target === modal) modal.classList.add("hidden");
    });
});
