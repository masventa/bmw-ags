/**
 * masventa CONTROL - Motor de Auditoría y Semáforo de Maduración
 * Cliente: BMW Aguascalientes
 */

const CLAVE_GERENCIAL_ACCESO = "BMW2026"; 
// Sincronizado con tus 6 asesores reales del script.js
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
    // Lectura limpia de tu clave exacta de almacenamiento
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
        let score = 0;

        const tiempoCompra = prospecto.tiempo || "";
        const metodoPago = prospecto.metodo || "";
        const usoDestinado = prospecto.uso || "";

        // ALGORITMO DEL SEMÁFORO
        if (tiempoCompra.toLowerCase().includes("semana") || tiempoCompra.toLowerCase().includes("inmediato")) {
            score += 50;
        } else if (tiempoCompra.toLowerCase().includes("mes") && !tiempoCompra.toLowerCase().includes("3")) {
            score += 30;
        } else if (tiempoCompra.toLowerCase().includes("meses") || tiempoCompra.toLowerCase().includes("investigando")) {
            score += 10;
        }

        // Clasificación de colores
        let claseBadge = ""; let textoSemaforo = "";
        if (score >= 70) { 
            claseBadge = "badge-verde"; textoSemaforo = "Luz Verde (Avanzar Ya)"; verdes++; 
        } else if (score >= 40) { 
            claseBadge = "badge-amarillo"; textoSemaforo = "Luz Amarilla (Acompañar)"; amarillos++; 
        } else { 
            claseBadge = "badge-rojo"; textoSemaforo = "Luz Roja (Esperar Cond.)"; rojos++; 
        }

        // Generación de fila
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td><span class="badge-semaforo ${claseBadge}">${textoSemaforo}</span></td>
            <td>${prospecto.fecha_registro || "S/F"}</td>
            <td>${prospecto.nombre || "Sin nombre"}</td>
            <td>${prospecto.whatsapp || "No reg."}</td>
            <td>${prospecto.modelo || "N/A"}</td>
            <td>${prospecto.uso || "N/A"}</td>
            <td>${ASESORES_BMW[index % ASESORES_BMW.length]}</td>
        `;
        tbody.appendChild(fila);
    });

    actualizarIndicadoresKPI(total, verdes, amarillos, rojos);
}
        // Evaluamos método de pago (25 puntos) - Ajustado para detectar cualquier dato real
        if (metodoPago !== "" && !metodoPago.toLowerCase().includes("sé") && !metodoPago.toLowerCase().includes("proporcionado")) {
            score += 25;
        }
        
        // Evaluamos uso destinado (25 puntos) - Ajustado para detectar cualquier dato real
        if (usoDestinado !== "" && !usoDestinado.toLowerCase().includes("investigando") && !usoDestinado.toLowerCase().includes("proporcionado")) {
            score += 25;
        }
        
        // Clasificación de colores por puntuación
        let claseBadge = ""; let textoSemaforo = "";
        if (score >= 70) { // Ajuste fino para asegurar activación
            claseBadge = "badge-verde"; textoSemaforo = "Luz Verde (Avanzar Ya)"; verdes++; 
        } else if (score >= 40) { 
            claseBadge = "badge-amarillo"; textoSemaforo = "Luz Amarilla (Acompañar)"; amarillos++; 
        } else { 
            claseBadge = "badge-rojo"; textoSemaforo = "Luz Roja (Esperar Cond.)"; rojos++; 
        }
        
        // Asignación de datos limpios a la tabla (Usando las variables que detectamos)
        let fecha = prospecto.fecha_registro || "No registrada";
        let nombre = (prospecto.nombre && prospecto.nombre.trim() !== "") ? prospecto.nombre : "Sin nombre";
        let whatsapp = (prospecto.whatsapp && prospecto.whatsapp.trim() !== "") ? prospecto.whatsapp : "No reg.";
        let modelo = prospecto.modelo || "No definido";
        let uso = usoDestinado || "No especificado";
        
        // Distribución equitativa rotativa entre tus 6 asesores reales
        let asesor = ASESORES_BMW[index % ASESORES_BMW.length];
        
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
        
        // Evaluamos método de pago (25 puntos)
        if (metodoPago && !metodoPago.toLowerCase().includes("sé") && !metodoPago.toLowerCase().includes("proporcionado")) {
            score += 25;
        }
        
        // Evaluamos uso destinado (25 puntos)
        if (usoDestinado && !usoDestinado.toLowerCase().includes("investigando") && !usoDestinado.toLowerCase().includes("proporcionado")) {
            score += 25;
        }
        
        // Clasificación de colores por puntuación
        let claseBadge = ""; let textoSemaforo = "";
        if (score >= 75) { 
            claseBadge = "badge-verde"; textoSemaforo = "Luz Verde (Avanzar Ya)"; verdes++; 
        } else if (score >= 40 && score < 75) { 
            claseBadge = "badge-amarillo"; textoSemaforo = "Luz Amarilla (Acompañar)"; amarillos++; 
        } else { 
            claseBadge = "badge-rojo"; textoSemaforo = "Luz Roja (Esperar Cond.)"; rojos++; 
        }
        
        // Asignación de datos limpios a la tabla
        let fecha = prospecto.fecha_registro || "No registrada";
        let nombre = prospecto.nombre || "No registrado";
        let whatsapp = prospecto.whatsapp || "No registrado";
        let modelo = prospecto.modelo || "No definido";
        let uso = usoDestinado || "No especificado";
        
        // Distribución equitativa rotativa entre tus 6 asesores reales (Asesor 1 al 6)
        let asesor = ASESORES_BMW[index % ASESORES_BMW.length];
        
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td><span class="badge-semaforo ${claseBadge}">${textoSemaforo}</span></td>
            <td>${fecha}</td>
            <td style="font-weight:bold; color:#fff;">${nombre}</td>
            <td>
                <a href="https://wa.me/${whatsapp.replace(/\s+/g, '')}" target="_blank" style="color:#00c851; text-decoration:none;">
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
    csvContent += "Fecha,Prospecto,WhatsApp,Modelo Interes,Uso Destinado,Tiempo Compra,Metodo Pago,Asesor Asignado\n";
    
    registros.forEach((p, index) => {
        let asesor = ASESORES_BMW[index % ASESORES_BMW.length];
        csvContent += `"${p.fecha_registro || ''}","${p.nombre || ''}","${p.whatsapp || ''}","${p.modelo || ''}","${p.uso || ''}","${p.tiempo || ''}","${p.metodo || ''}","${asesor}"\n`;
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