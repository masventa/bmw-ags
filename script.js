// --- CONFIGURACIÓN DE PAGO DE LA PYME ---
const USA_STRIPE = false;
const STRIPE_PUBLIC_KEY = ""; 
const DATOS_BANCARIOS = {
    banco: "",
    clabe: "",
    titular: "Nombre del Titular"
};
// ----------------------------------------

const CONFIG = {
    whatsapp: "5214491472336", 
    whatsappAdicional: "5214491472336",
    sitioWeb: "https://www.bmw.com.mx/es/distribuidores/bmw-aguascalientes.html",
    facebook: "https://www.facebook.com/BMWMexico",
    instagram: "https://www.instagram.com/bmwdemexico/",
    maps: "https://maps.app.goo.gl/avD93uqR5V6j7Ryx8", 
    youtubeUrl: "https://www.youtube.com/watch?v=2_I3nRyYehM",
    textos: {
        cat1: { t: "QUIÉNES SOMOS", c: "BMW Euromotors de Aguascalientes redefine la movilidad premium en la región, ofreciendo vehículos de alta ingeniería, deportividad pura, seguridad de vanguardia y un diseño sofisticado que eleva la experiencia de conducción diaria al verdadero placer de conducir." },
        cat2: { t: "EXCELENCIA", c: "Explora nuestra gama de servicios automotrices premium: Venta de vehículos nuevos de la línea BMW, planes de financiamiento corporativos y a tu medida, pruebas de manejo personalizadas, taller mecánico de alta especialización y venta de refacciones originales." },
        cat3: { t: "CLIENTES FELICES", c: "Nuestra prioridad es la excelencia en el servicio. Conductores y familias de Aguascalientes respaldan la calidad, el confort and el desempeño excepcional que solo la ingeniería avanzada y la deportividad de BMW pueden ofrecer." }
    },
    sucursales: {
        suc1: { nombre: "Asesor 1", wa: "5214491472336", maps: "https://maps.app.goo.gl/RCnMaFC6yBCkqHjv9", esp: "Especialista en SUVs", img: "assets/brand/ASESOR1.jpg" },
        suc2: { nombre: "Asesor 2", wa: "5214491472336", maps: "https://maps.app.goo.gl/RCnMaFC6yBCkqHjv9", esp: "Especialista en Sedanes", img: "assets/brand/ASESOR2.jpg" },
        suc3: { nombre: "Asesor 3", wa: "5214491472336", maps: "https://maps.app.goo.gl/RCnMaFC6yBCkqHjv9", esp: "Especialista en Vehículos Eléctricos", img: "assets/brand/ASESOR3.jpg" },
        suc4: { nombre: "Asesor 4", wa: "5214491472336", maps: "https://maps.app.goo.gl/RCnMaFC6yBCkqHjv9", esp: "Especialista en Financiamiento", img: "assets/brand/ASESOR4.jpg" },
        suc5: { nombre: "Asesor 5", wa: "5214491472336", maps: "https://maps.app.goo.gl/RCnMaFC6yBCkqHjv9", esp: "Especialista en Vehículos Deportivos", img: "assets/brand/ASESOR5.jpg" },
        suc6: { nombre: "Asesor 6", wa: "5214491472336", maps: "https://maps.app.goo.gl/RCnMaFC6yBCkqHjv9", esp: "Especialista en Seminuevos Certificados", img: "assets/brand/ASESOR6.jpg" }
    }
};

let currentGallery = [];
let currentIndex = 0;
let isMuted = false;

function openYouTubeVideo() { 
    playClick(); 
    const overlay = document.getElementById('video-lightbox-overlay');
    const iframe = document.getElementById('video-lightbox-frame');
    let videoId = "4LLMlYBo54I"; 
    
    if(CONFIG.youtubeUrl.includes("shorts/")) { 
        videoId = CONFIG.youtubeUrl.split("shorts/")[1].split("?")[0]; 
    } else if(CONFIG.youtubeUrl.includes("v=")) { 
        videoId = CONFIG.youtubeUrl.split("v=")[1].split("&")[0]; 
    } else if(CONFIG.youtubeUrl.includes("youtu.be/")) {
        videoId = CONFIG.youtubeUrl.split("youtu.be/")[1].split("?")[0];
    }
    
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    overlay.style.display = 'flex';
}

function closeVideoLightbox() {
    playClick();
    const overlay = document.getElementById('video-lightbox-overlay');
    const iframe = document.getElementById('video-lightbox-frame');
    iframe.src = ""; 
    overlay.style.display = 'none';
}

function openProfileZoom() {
    playClick();
    const imgElement = document.getElementById('profile-pic-img');
    if(imgElement) { const src = imgElement.src; openLightbox(src, [src], true); }
}

function showAppContent(cat) {
    playClick();
    document.getElementById('dynamic-content-layer').style.display = 'flex';
    document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
    const pane = document.getElementById(`${cat}-pane`);
    if(pane) pane.style.display = 'flex';
    if(cat !== 'cat4') {
        renderGallery(cat);
    } else {
        injectExtraContactInfo();
    }
}

// INYECCIÓN DE TELÉFONO Y CORREO SIN PERDER LA ESTRUCTURA NI EL ESTILO VISUAL DE LA GALERÍA
function injectExtraContactInfo() {
    let contenedorExtra = document.getElementById('bloque-contacto-pyme');
    if (!contenedorExtra) {
        const socialStack = document.querySelector('.social-vertical-stack');
        if (socialStack) {
            contenedorExtra = document.createElement('div');
            contenedorExtra.id = 'bloque-contacto-pyme';
            contenedorExtra.className = 'bloque-adicional-contacto';
            contenedorExtra.innerHTML = `
                <span class="lbl-contacto-sub">Teléfono de atención</span>
                <a href="tel:4499960451" class="linea-contacto-directa" onclick="playClickSound()">
                    <i class="fas fa-phone-alt"></i> <span>449 996 0451</span>
                </a>
                <span class="lbl-contacto-sub" style="margin-top: 6px;">Correo electrónico</span>
                <a href="mailto:rpc@bmwaguascalientes.mx" class="linea-contacto-directa" onclick="playClickSound()">
                    <i class="fas fa-envelope"></i> <span>rpc@bmwaguascalientes.mx</span>
                </a>
            `;
            socialStack.parentNode.insertBefore(contenedorExtra, socialStack);
        }
    }
}

function renderGallery(cat) {
    const grid = document.getElementById(`grid-${cat}`);
    if(!grid) return; 
    grid.innerHTML = '';
    
    const titleHeader = document.createElement('h2');
    titleHeader.className = 'gallery-title-white';
    titleHeader.innerText = CONFIG.textos[cat].t;
    grid.appendChild(titleHeader);
    
    const imgCount = (cat === 'cat3') ? 3 : (cat === 'cat1' || cat === 'cat2') ? 6 : 4;
    const imgs = [];
    for(let i = 1; i <= imgCount; i++) { imgs.push(`assets/gallery/${cat}/${i}.jpg`); }
    
    const rowGrid = document.createElement('div');
    rowGrid.className = 'quad-row-grid';
    imgs.forEach((src, index) => {
        const posClass = (index % 2 === 0) ? 'pos-left' : 'pos-right';
        rowGrid.appendChild(createPol(src, posClass, imgs));
    });
    grid.appendChild(rowGrid);
    
    if (cat === 'cat3') {
        const videoContainer = document.createElement('div');
        videoContainer.style.cssText = "display: flex; gap: 10px; margin-top: 15px; justify-content: center; width: 100%; flex-wrap: wrap;";
        videoContainer.innerHTML = `
            <a href="https://www.youtube.com/shorts/fbXYME6nDsg" target="_blank" style="background: #000; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 0.7rem; border: 1px solid var(--brand-accent);">Opinión de nuestros clientes</a>
            <a href="https://www.youtube.com/shorts/y2T0Rh9H68I" target="_blank" style="background: #000; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 0.7rem; border: 1px solid var(--brand-accent);">Viviendo un BMW</a>
        `;
        grid.appendChild(videoContainer);
    }
    
    const btn = document.createElement('button');
    btn.className = 'btn-details-gold'; 
    btn.innerHTML = `<i class="fas fa-plus-circle"></i> VER DETALLES`;
    btn.onclick = (e) => { e.stopPropagation(); openTextZoom(cat); };
    grid.appendChild(btn);
}

function createPol(src, pos, arr) {
    const div = document.createElement('div');
    div.className = `polaroid-item ${pos}`;
    div.innerHTML = `<img src="${src}">`;
    div.onclick = (e) => { e.stopPropagation(); openLightbox(src, arr, false); };
    return div;
}

function openLightbox(src, arr, hideControls) {
    playClick();
    currentGallery = arr;
    currentIndex = arr.indexOf(src);
    const lightboxEl = document.getElementById('lightbox');
    const imgEl = document.getElementById('lightbox-image');
    if(hideControls) { lightboxEl.classList.add('hide-nav-arrows'); } else { lightboxEl.classList.remove('hide-nav-arrows'); }
    imgEl.src = src;
    lightboxEl.style.display = 'flex';
}

function changeLightboxImage(dir) {
    if(currentGallery.length <= 1) return;
    playClick();
    currentIndex = (currentIndex + dir + currentGallery.length) % currentGallery.length;
    document.getElementById('lightbox-image').src = currentGallery[currentIndex];
}

function openTextZoom(cat) {
    playClick();
    document.getElementById('text-zoom-title').innerText = CONFIG.textos[cat].t;
    document.getElementById('text-zoom-content').innerText = CONFIG.textos[cat].c;
    document.getElementById('text-zoom-modal').style.display = 'flex';
}

function closeLightbox() { 
    playClick(); 
    document.getElementById('lightbox').style.display = 'none'; 
}
function closeAppContent() { document.getElementById('dynamic-content-layer').style.display = 'none'; }
function closeTextZoom() { document.getElementById('text-zoom-modal').style.display = 'none'; }
function openBrandModal(modalId) { playClick(); const modal = document.getElementById(modalId); if (modal) modal.style.display = 'flex'; }
function closeBrandModal(modalId) { const modal = document.getElementById(modalId); if (modal) modal.style.display = 'none'; }
function playClickSound() { playClick(); }

function toggleAudioGlobal() {
    isMuted = !isMuted;
    const spot = document.getElementById('spot-intro');
    const icon = document.getElementById('audio-icon');
    spot.muted = isMuted;
    icon.className = isMuted ? "fas fa-volume-mute" : "fas fa-volume-up";
}

function playClick() { const snd = document.getElementById('sndFxClick'); if(snd && !isMuted) { snd.currentTime = 0; snd.play().catch(()=>{}); } }
function openNetworkCard(url) { playClick(); window.open(url, '_blank'); }

function abrirMenu() {
    playClick();
    document.getElementById('miMenuContacto').style.display = 'flex';
}

function cerrarMenu() {
    document.getElementById('miMenuContacto').style.display = 'none';
    document.querySelectorAll('.sucursal-panel-content').forEach(panel => panel.style.display = 'none');
}

function toggleSucursalAcordeon(sucKey) {
    playClick();
    const panel = document.getElementById(`${sucKey}-panel`);
    const estaVisible = panel.style.display === 'flex';
    document.querySelectorAll('.sucursal-panel-content').forEach(p => p.style.display = 'none');
    if (!estaVisible) {
        panel.style.display = 'flex';
    }
}

// INYECCIÓN DINÁMICA MEJORADA CON MINIATURAS, ZOOM TIPO LIGHTBOX INDEPENDIENTE Y ESPECIALIDADES
function inicializarAcordeon() {
    const contenedor = document.getElementById('contenedor-sucursales');
    if(!contenedor) return;
    contenedor.innerHTML = '';

    Object.keys(CONFIG.sucursales).forEach((key, index) => {
        const suc = CONFIG.sucursales[key];
        
        // Contenedor del botón estructurado
        const btn = document.createElement('button');
        btn.className = 'sucursal-accordion-btn';
        
        // Wrapper miniatura para aislar el evento click y permitir el Zoom Lightbox solicitado
        const wrapImg = document.createElement('div');
        wrapImg.className = 'wrapper-miniatura-asesor';
        wrapImg.innerHTML = `<img src="${suc.img}" alt="${suc.nombre}" class="img-miniatura-asesor">`;
        wrapImg.onclick = (e) => {
            e.stopPropagation(); // Detiene la apertura del acordeón
            playClick();
            openLightbox(suc.img, [suc.img], true); // Lanza visualizador Lightbox con flechas ocultas
        };
        
        // Contenedor de Texto del nombre del asesor
        const txtLabel = document.createElement('div');
        txtLabel.className = 'texto-accordion-asesor';
        txtLabel.innerText = `${index + 1}. ${suc.nombre.toUpperCase()}`;
        
        // Icono indicador de despliegue
        const arrowIcon = document.createElement('i');
        arrowIcon.className = 'fas fa-chevron-down icono-accordion-flecha';
        
        btn.appendChild(wrapImg);
        btn.appendChild(txtLabel);
        btn.appendChild(arrowIcon);
        
        btn.onclick = () => toggleSucursalAcordeon(key);
        
        // Crear Panel Oculto con Especialidades robustecidas y marca elegante
        const panel = document.createElement('div');
        panel.id = `${key}-panel`;
        panel.className = 'sucursal-panel-content';
        panel.innerHTML = `
            <div class="sucursal-info-block">
                <p class="suc-domicilio" style="font-weight: 700; color: #fff;"><i class="fas fa-certificate" style="color: var(--brand-secondary); margin-right: 4px;"></i> ${suc.esp}</p>
                <p class="suc-horario" style="margin-top: 3px;"><i class="far fa-clock"></i> 9:00 AM a 8:00 PM</p>
                <div class="marca-elegante-asesor">BMW AGUASCALIENTES</div>
            </div>
            <a href="https://wa.me/${suc.wa}?text=Hola!%20Me%20interesa%20cotizar%20un%20veh%C3%ADculo%20BMW%20y%20agendar%20una%20prueba%20de%20manejo." target="_blank" class="btn-menu whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</a>
            <a href="${suc.maps}" target="_blank" class="btn-menu maps-btn"><i class="fas fa-location-arrow"></i> Cómo Llegar</a>
        `;
        
        contenedor.appendChild(btn);
        contenedor.appendChild(panel);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarAcordeon();
    window.addEventListener('click', () => {
        const spot = document.getElementById('spot-intro');
        if(spot && !isMuted) spot.play().catch(()=>{});
    }, {once: true});
});

async function shareExperienceRobust() {
    try { await navigator.share({ title: 'BMW Euromotors de Aguascalientes', url: window.location.href }); }
    catch { playClick(); navigator.clipboard.writeText(window.location.href).then(() => { alert("¡Enlace de tarjeta copiado!"); }); }
}