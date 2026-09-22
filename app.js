document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. LÓGICA DE LA API DE GITHUB (download.html)
    // ==========================================
    if(document.getElementById('version-number')) {
        fetchLatestRelease();
    }

    async function fetchLatestRelease() {
        const cachedData = sessionStorage.getItem('saldoReleaseData');

        if (cachedData) {
            applyReleaseData(JSON.parse(cachedData));
            return;
        }

        try {
            const response = await fetch('https://api.github.com/repos/CriissH/s-gestion/releases/latest');
            if (!response.ok) throw new Error('Error en la red o límite de API alcanzado');
            
            const data = await response.json();

            if (data.tag_name) {
                sessionStorage.setItem('saldoReleaseData', JSON.stringify(data));
                applyReleaseData(data);
            }
        } catch (error) {
            document.getElementById('version-number').textContent = 'Versión Estable';
            document.getElementById('release-date').textContent = '';
            document.getElementById('changelog-text').textContent = 'No se pudo cargar el registro de cambios en este momento. Por favor, revisa el repositorio en GitHub.';
        }
    }

    function applyReleaseData(data) {
        document.getElementById('version-number').textContent = 'Versión ' + data.tag_name;
        
        const dateObj = new Date(data.published_at);
        const formattedDate = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
        document.getElementById('release-date').textContent = 'Publicado el ' + formattedDate;

        document.getElementById('changelog-text').textContent = data.body || 'Lanzamiento de la versión ' + data.tag_name + ' sin notas de actualización detalladas.';

        const winInstaller = data.assets.find(asset => asset.name.endsWith('.msi') || asset.name.endsWith('.exe'));
        if (winInstaller) {
            const btnWin = document.getElementById('download-win-btn');
            btnWin.href = winInstaller.browser_download_url;
            btnWin.target = "_self";
        }
    }

    // ==========================================
    // 2. EFECTO DEL BOTÓN DE DESCARGA A CAFECITO
    // ==========================================
    const downloadBtn = document.getElementById('download-win-btn');
    
    if(downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            setTimeout(() => {
                this.innerHTML = '¡Descargando! ☕ Apoyar en Cafecito';
                this.style.background = '#fff';
                this.style.color = 'var(--ink)';
                this.style.border = '1px solid var(--green)';
                this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                this.href = 'https://cafecito.app/saldoapp';
                this.target = '_blank';
            }, 500);
        });
    }

    // ==========================================
    // 3. LÓGICA DEL CARRUSEL DE IMÁGENES (index.html)
    // ==========================================
    const track = document.querySelector('.carousel-track');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const dots = Array.from(document.querySelectorAll('.dot'));

    if(track && nextBtn && prevBtn) {
        track.addEventListener('scroll', () => {
            const slideWidth = track.clientWidth;
            const currentIndex = Math.round(track.scrollLeft / slideWidth);
            
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[currentIndex]) {
                dots[currentIndex].classList.add('active');
            }
        });

        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                track.scrollTo({ left: track.clientWidth * index, behavior: 'smooth' });
            });
        });

        let isDown = false;
        let startX;
        let scrollLeft;

        track.addEventListener('mousedown', (e) => {
            isDown = true;
            track.style.cursor = 'grabbing';
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });
        
        track.addEventListener('mouseleave', () => {
            isDown = false;
            track.style.cursor = 'grab';
        });
        
        track.addEventListener('mouseup', () => {
            isDown = false;
            track.style.cursor = 'grab';
        });
        
        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 1.5; 
            track.scrollLeft = scrollLeft - walk;
        });
    }

    // ==========================================
    // 4. EFECTO 3D PARA LA TARJETA DE BALANCE
    // ==========================================
    const card = document.querySelector('.balance-card');
    if (card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -15; 
            const rotateY = ((x - centerX) / centerX) * 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `rotate(2deg)`; 
            card.style.transition = 'transform 0.5s ease';
        });
    }

    // ==========================================
    // 5. ANIMACIÓN DE APARICIÓN AL HACER SCROLL
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');

    if(revealElements.length > 0) {
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        };

        const revealOptions = {
            threshold: 0.15
        };

        const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
        revealElements.forEach(el => revealObserver.observe(el));
    }

});