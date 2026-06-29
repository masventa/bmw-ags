/**
 * masventa CONTROL - Motor de Auditoría y Semáforo de Maduración
 * Cliente: BMW Aguascalientes
 */

// CONFIGURACIÓN DE SEGURIDAD INTERNA
const CLAVE_GERENCIAL_ACCESO = "BMW2026"; // Esta es la contraseña que usará el gerente

/**
 * Control de Acceso de Alta Dirección
 */
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

/**
 * Motor Analítico: Procesa los Leads y calcula el Semáforo de Maduración Estratégico
 */
function cargarYProcesarAuditoria() {
    // Extraer la cartera blindada desde el LocalStorage
    const registros = JSON.parse(localStorage.getItem('AUDITORIA_GERENCIAL_CARD')) || [];
    
    const tbody = document.getElementById('tabla-prospectos-body');
    tbody.innerHTML = ''; // Limpiar tabla antes de renderizar
    
    // Contadores para los KPIs del gerente
    let total = registros.length;
    let verdes = 0;
    let amarillos = 0;
    let rojos = 0;
    
    // Si no hay datos aún, mostrar renglón informativo
    if (total === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#555;">No hay registros de prospectos en el cuestionario todavía.</td></tr>`;
        actualizarIndicadoresKPI(total, verdes, amarillos, rojos);
        return;
    }
    
    // Procesar cada prospecto de la base de datos
    registros.forEach(prospecto => {
        let score = 0;
        
        // 1. Puntos por TIEMPO DE COMPRA (Disparador principal)
        if (prospecto.tiempo_compra === "Esta semana") score += 50;
        else if (prospecto.tiempo_compra === "Este mes") score += 30;
        else if (prospecto.tiempo_compra === "De 3 a 6 meses") score += 10;
        
        // 2. Puntos por MÉTODO DE PAGO (Condición financiera)
        if (prospecto.metodo_pago && prospecto.metodo_pago !== "Aún no lo sé") score += 25;
        
        // 3. Puntos por MODELO / PERFIL (Claridad de intención)
        if (prospecto.perfil_compra && prospecto.perfil_compra !== "Solo estoy investigando") score += 25;
        
        // ALGORITMO DEL SEMÁFORO ESTRATÉGICO (Tu Modelo de Maduración)
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
        
        // Formatear los datos para proteger el render
        let fecha = prospecto.fecha_registro || "N/A";
        let nombre = prospecto.nombre || "No registrado";
        let whatsapp = prospecto.whatsapp || "No registrado";
        let modelo = prospecto.modelo_interes || "No definido";
        let uso = prospecto.perfil_compra || "No definido";
        
        // Inyectar la fila con el diseño limpio y el color del semáforo correspondiente
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
    
    // Actualizar los números de las tarjetas superiores
    actualizarIndicadoresKPI(total, verdes, amarillos, rojos);
}

function actualizarIndicadoresKPI(t, v, a, r) {
    document.getElementById('kpi-total').innerText = t;
    document.getElementById('kpi-verde').innerText = v;
    document.getElementById('kpi-amarillo').innerText = a;
    document.getElementById('kpi-rojo').innerText = r;
}