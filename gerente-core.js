/**
 * masventa CONTROL - Motor de Auditoría y Semáforo de Maduración
 * Cliente: BMW Aguascalientes
 */

// CONFIGURACIÓN DE SEGURIDAD INTERNA
const CLAVE_GERENCIAL_ACCESO = "BMW2026"; 

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
    let whites = 0; // Para registros de prueba vacíos
    let verdes = 0;
    let amarillos = 0;
    let rojos = 0;
    
    if (total === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#555;">No hay registros de prospectos en el cuestionario todavía.</td></tr>`;
        actualizarIndicadoresKPI(total, verdes, amarillos, rojos);
        return;
    }
    
    registros.forEach(prospecto => {
        // Si el registro no tiene nombre ni whatsapp, es una prueba vacía vieja
        if (!prospecto.nombre && !prospecto.whatsapp) {
            return; 
        }

        let score = 0;
        
        // 1. Puntos por TIEMPO DE COMPRA
        if (prospecto.tiempo === "Esta semana") score += 50;
        else if (prospecto.tiempo === "Este mes") score += 30;
        else if (prospecto.tiempo === "De 3 a 6 meses") score += 10;
        
        // 2. Puntos por MÉTODO DE PAGO
        if (prospecto.metodo && prospecto.metodo !== "Aún no lo sé") score += 25;
        
        // 3. Puntos por USO / PERFIL
        if (prospecto.uso && prospecto.uso !== "Solo estoy investigando") score += 25;
        
        let claseBadge = "";
        let textoSemaforo = "";
        
        if (score >= 75) {
            claseBadge = "badge-verde";
            textoSemaforo = "Luz Verde (Avanzar Ya)";
            verdes++;
        } else if (score >= 40 && score < 75) {
            claseBadge = "badge-amarillo";
            textoSemaforo = "Luz Amarilla (Acompañar)";
            amarillos++;
        } else {
            claseBadge = "badge-rojo";
            textoSemaforo = "Luz Roja (Esperar Cond.)";
            rojos++;
        }
        
        let fecha = prospecto.fecha_registro || "N/A";
        let nombre = prospecto.nombre || "No registrado";
        let whatsapp = prospecto.whatsapp || "No registrado";
        let modelo = prospecto.modelo || "No definido";
        let uso = prospecto.uso || "No definido";
        
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
            <td><span style="color:var(--brand-accent, #f80101); font-weight:bold;">${modelo}</span></td>
            <td>${uso}</td>
        `;
        tbody.appendChild(fila);
    });
    
    actualizarIndicadoresKPI(verdes + amarillos + rojos, verdes, amarillos, rojos);
}

function actualizarIndicadoresKPI(t, v, a, r) {
    document.getElementById('kpi-total').innerText = t;
    document.getElementById('kpi-verde').innerText = v;
    document.getElementById('kpi-amarillo').innerText = a;
    document.getElementById('kpi-rojo').innerText = r;
}