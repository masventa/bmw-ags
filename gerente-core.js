/**
 * masventa CONTROL - Motor de Auditoría y Semáforo de Maduración
 * Cliente: BMW Aguascalientes
 */

const CLAVE_GERENCIAL_ACCESO = "BMW2026"; 
const ASESORES_BMW = ["Asesor 1", "Asesor 2", "Asesor 3", "Asesor 4", "Asesor 5", "Asesor 6"];

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
    document.getElementById('login-screen').style.display = 'flex';
}

function cargarYProcesarAuditoria() {
    const registros = JSON.parse(localStorage.getItem('AUDITORIA_GERENCIAL_CARD')) || [];
    const tbody = document.getElementById('tabla-prospectos-body');
    tbody.innerHTML = ''; 
    
    let total = registros.length;
    let verdes = 0; let amarillos = 0; let rojos = 0;
    
    if (total === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#555; padding: 20px;">No hay registros de prospectos todavía.</td></tr>`;
        actualizarIndicadoresKPI(0, 0, 0, 0);
        return;
    }
    
    registros.forEach((prospecto) => {
        // Lógica de Semáforo basada en el dato 'prioridad' guardado desde el Paso 5
        let prioridad = prospecto.prioridad || "rojo"; // Por defecto rojo si no se encuentra
        let claseBadge = ""; let textoSemaforo = "";

        if (prioridad === 'verde') { 
            claseBadge = "badge-verde"; textoSemaforo = "Luz Verde (Avanzar Ya)"; verdes++; 
        } else if (prioridad === 'amarillo') { 
            claseBadge = "badge-amarillo"; textoSemaforo = "Luz Amarilla (Acompañar)"; amarillos++; 
        } else { 
            claseBadge = "badge-rojo"; textoSemaforo = "Luz Roja (Esperar Cond.)"; rojos++; 
        }
        
        let fecha = prospecto.fecha_registro || "No registrada";
        let nombre = prospecto.nombre || "Sin nombre";
        let whatsapp = prospecto.whatsapp || "No reg.";
        let modelo = prospecto.modelo || "No definido";
        let uso = prospecto.uso || "No especificado";
        let asesor = prospecto.asesor || "No asignado";
        
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td><span class="badge-semaforo ${claseBadge}">${textoSemaforo}</span></td>
            <td>${fecha}</td>
            <td style="font-weight:bold; color:#fff;">${nombre}</td>
            <td>
                <a href="https://wa.me/${whatsapp.replace(/\D/g, '')}" target="_blank" style="color:#00c851; text-decoration:none;">
                    <i class="fab fa-whatsapp"></i> ${whatsapp}
                </a>
            </td>
            <td><span style="color:#f80101; font-weight:bold;">${modelo}</span></td>
            <td>${uso}</td>
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
    csvContent += "Fecha,Prospecto,WhatsApp,Modelo Interes,Uso Destinado,Prioridad,Asesor Asignado\n";
    
    registros.forEach((p) => {
        csvContent += `"${p.fecha_registro || ''}","${p.nombre || ''}","${p.whatsapp || ''}","${p.modelo || ''}","${p.uso || ''}","${p.prioridad || ''}","${p.asesor || ''}"\n`;
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
        alert("Panel vaciado correctamente.");
        location.reload();
    }
}