/**
 * masventa CONTROL - Motor de Auditoría y Semáforo de Maduración
 * Cliente: BMW Aguascalientes
 */

const CLAVE_GERENCIAL_ACCESO = "BMW2026"; 
const ASESORES_BMW = ["Asesor Juan Pérez", "Asesora María Gómez", "Asesor Carlos Ruiz", "Asesora Ana Martínez"];

function verificarAccesoGerente() {
    const inputClave = document.getElementById('pass-input').value;
    if (inputClave === CLAVE_GERENCIAL_ACCESO) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('panel-gerente').style.display = 'block';
        cargarYProcesarAuditoria();
    } else {
        alert("Clave gerencial incorrecta. Acceso denegado.");
    }
}

function cerrarSesionGerente() {
    document.getElementById('pass-input').value = '';
    document.getElementById('panel-gerente').style.display = 'none';
    document.getElementById('login-screen').style.display = 'block';
}

function cargarYProcesarAuditoria() {
    // Sincronizado exacto con tu script.js
    const registros = JSON.parse(localStorage.getItem('AUDITORIA_GERENCIAL_CARD')) || [];
    const tbody = document.getElementById('tabla-prospectos-body');
    tbody.innerHTML = ''; 
    
    let total = registros.length;
    let verdes = 0; let amarillos = 0; let rojos = 0;
    
    if (total === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#555; padding: 20px;">No hay registros de prospectos todavía. Envía un formulario desde la CARD para ver los resultados.</td></tr>`;
        actualizarIndicadoresKPI(0, 0, 0, 0);
        return;
    }
    
    registros.forEach((prospecto, index) => {
        // Evaluamos las respuestas reales del objeto DATA_PROSPECTO
        let score = 0;
        
        // Mapeo adaptivo de respuestas
        const tiempoCompra = prospecto.tiempo || prospecto.tiempo_compra || "";
        const metodoPago = prospecto.metodo || prospecto.metodo_pago || "";
        const usoDestinado = prospecto.uso || prospecto.uso_destinado || "";

        if (tiempoCompra.includes("semana") || tiempoCompra.includes("Inmediato")) score += 50;
        else if (tiempoCompra.includes("mes")) score += 30;
        else if (tiempoCompra.includes("meses")) score += 10;
        
        if (metodoPago && !metodoPago.includes("sé") && !metodoPago.includes("investigando")) score += 25;
        if (usoDestinado && !usoDestinado.includes("investigando")) score += 25;
        
        let claseBadge = ""; let textoSemaforo = "";
        if (score >= 75) { claseBadge = "badge-verde"; textoSemaforo = "Luz Verde (Avanzar Ya)"; verdes++; }
        else if (score >= 40 && score < 75) { claseBadge = "badge-amarillo"; textoSemaforo = "Luz Amarilla (Acompañar)"; amarillos++; }
        else { claseBadge = "badge-rojo"; textoSemaforo = "Luz Roja (Esperar Cond.)"; rojos++; }
        
        let fecha = prospecto.fecha_registro || new Date().toLocaleDateString();
        let nombre = prospecto.nombre || "No registrado";
        let whatsapp = prospecto.whatsapp || prospecto.telefono || "No registrado";
        let modelo = prospecto.modelo || prospecto.modelo_interes || "No definido";
        
        let asesor = ASESORES_BMW[index % ASESORES_BMW.length];
        
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td><span class="badge-semaforo ${claseBadge}">${textoSemaforo}</span></td>
            <td>${fecha}</td>
            <td style="font-weight:bold; color:#fff;">${nombre}</td>
            <td>
                <a href="https://wa.me/52${whatsapp.replace(/\s+/g, '')}" target="_blank" style="color:#00c851; text-decoration:none;">
                    <i class="fab fa-whatsapp"></i> ${whatsapp}
                </a>
            </td>
            <td><span style="color:#f80101; font-weight:bold;">${modelo}</span></td>
            <td>${usoDestinado || "No especificado"}</td>
            <td style="color:#00f0ff; font-weight:bold;">${asesor}</td>
        `;
        tbody.appendChild(fila);
    });
    
    actualizarIndicadoresKPI(total, verdes, amarillos, rojos);
}

function actualizarIndicadoresKPI(t, v, a, r) {
    document.getElementById('kpi-total').innerText = t;
    document.getElementById('kpi-verde').innerText = v;
    document.getElementById('kpi-amarillo').innerText = a;
    document.getElementById('kpi-rojo').innerText = r;
}

function exportarAExcel() {
    const registros = JSON.parse(localStorage.getItem('AUDITORIA_GERENCIAL_CARD')) || [];
    if (registros.length === 0) { alert("No hay datos para exportar."); return; }
    
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; 
    csvContent += "Fecha,Prospecto,WhatsApp,Modelo Interes,Uso Destinado,Asesor Asignado\n";
    
    registros.forEach((p, index) => {
        let asesor = ASESORES_BMW[index % ASESORES_BMW.length];
        let fila = `"${p.fecha_registro || ''}","${p.nombre || ''}","${p.whatsapp || p.telefono || ''}","${p.modelo || p.modelo_interes || ''}","${p.uso || p.uso_destinado || ''}","${asesor}"\n`;
        csvContent += fila;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Reporte_Leads_BMW_Aguascalientes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function limpiarPanelGerencial() {
    if (confirm("¿Estás seguro de vaciar el panel de auditoría por completo?")) {
        localStorage.removeItem('AUDITORIA_GERENCIAL_CARD');
        alert("Panel vaciado.");
        location.reload();
    }
}