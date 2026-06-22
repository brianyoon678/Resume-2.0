feather.replace();

document.addEventListener('DOMContentLoaded', function () {

    // ── Side navigation ──
    const sections = [
        { id: 'hero', label: 'Home' },
        { id: 'skills', label: 'Education' },
        { id: 'experience', label: 'Experience' },
        { id: 'projects', label: 'Projects' },
        { id: 'contact', label: 'Contact' }
    ];

    const sideNav = document.getElementById('side-nav');
    const dots = [];

    sections.forEach(s => {
        const a = document.createElement('a');
        a.href = '#' + s.id;
        a.className = 'side-dot';

        const label = document.createElement('span');
        label.className = 'label';
        label.textContent = s.label;

        const dot = document.createElement('span');
        dot.className = 'dot';

        a.appendChild(label);
        a.appendChild(dot);
        sideNav.appendChild(a);

        a.addEventListener('click', function (e) {
            e.preventDefault();
            const el = document.getElementById(s.id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        });

        dots.push({ el: a, dot, label, id: s.id });
    });

    // ── Continuous scroll-based fade ──
    const reveals = document.querySelectorAll('.reveal');
    const screenshots = document.querySelector('.screenshot-carousel');
    const boldEls = document.querySelectorAll('.reveal strong');
    const topFade = 180;
    const bottomFade = 150;
    const darkR = 31, darkG = 41, darkB = 55;
    const blueR = 69, blueG = 205, blueB = 255;
    let ticking = false;
    let colorSettling = false;

    function updateReveals() {
        const vh = window.innerHeight;

        // Text elements: opacity + scale
        for (let i = 0; i < reveals.length; i++) {
            const el = reveals[i];
            const rect = el.getBoundingClientRect();
            const center = rect.top + rect.height * 0.5;

            let t;
            if (center < 0 || center > vh) {
                t = 0;
            } else if (center < topFade) {
                t = center / topFade;
            } else if (center > vh - bottomFade) {
                t = (vh - center) / bottomFade;
            } else {
                t = 1;
            }

            t = Math.max(0, Math.min(1, t));
            const scale = 0.97 + t * 0.03;
            el.style.opacity = t;
            el.style.transform = 'scale(' + scale + ')';
        }

        // Bold words: blue glimpse at center
        const mid = vh / 2;
        const peakWidth = 250;
        for (let i = 0; i < boldEls.length; i++) {
            const el = boldEls[i];
            const rect = el.getBoundingClientRect();
            const center = rect.top + rect.height * 0.5;
            const dist = Math.abs(center - mid);

            const target = Math.max(0, 1 - dist / peakWidth);
            const prev = el._colorT || 0;
            const t = prev + (target - prev) * 0.15;
            el._colorT = t;

            const r = Math.round(darkR + (blueR - darkR) * t);
            const g = Math.round(darkG + (blueG - darkG) * t);
            const b = Math.round(darkB + (blueB - darkB) * t);
            el.style.color = 'rgb(' + r + ',' + g + ',' + b + ')';
            if (Math.abs(target - t) > 0.01) colorSettling = true;
        }

        if (colorSettling) {
            colorSettling = false;
            requestAnimationFrame(updateReveals);
        }

        // UT Austin overlay
        const utOverlay = document.getElementById('ut-overlay');
        const utSection = document.getElementById('skills');
        if (utOverlay && utSection) {
            const sRect = utSection.getBoundingClientRect();
            const sCenter = sRect.top + sRect.height * 0.5;
            const dist = Math.abs(sCenter - vh / 2);
            const maxDist = vh / 2 + sRect.height / 2;
            const t = Math.min(1, dist / maxDist);
            utOverlay.style.opacity = 0.65 + t * 0.25;
        }

        // Screenshots: gradient mask
        if (screenshots) {
            const rect = screenshots.getBoundingClientRect();
            const h = rect.height || 1;

            if (rect.bottom <= 0 || rect.top >= vh) {
                screenshots.style.opacity = '0';
                screenshots.style.maskImage = '';
                screenshots.style.webkitMaskImage = '';
            } else {
                screenshots.style.opacity = '1';

                const topAlpha = rect.top >= topFade ? 1 : Math.max(0, rect.top / topFade);
                const bottomAlpha = rect.bottom <= vh - bottomFade ? 1 : Math.max(0, (vh - rect.bottom) / bottomFade);

                if (topAlpha >= 0.99 && bottomAlpha >= 0.99) {
                    screenshots.style.maskImage = '';
                    screenshots.style.webkitMaskImage = '';
                } else {
                    const topEnd = topAlpha < 1 ? Math.min(100, (topFade - rect.top) / h * 100) : 0;
                    const bottomStart = bottomAlpha < 1 ? Math.max(0, (vh - bottomFade - rect.top) / h * 100) : 100;

                    let mask;
                    if (topEnd >= bottomStart) {
                        mask = 'linear-gradient(to bottom,rgba(0,0,0,' + topAlpha + '),rgba(0,0,0,' + bottomAlpha + '))';
                    } else {
                        mask = 'linear-gradient(to bottom,rgba(0,0,0,' + topAlpha + ') 0%,rgba(0,0,0,1) ' + topEnd + '%,rgba(0,0,0,1) ' + bottomStart + '%,rgba(0,0,0,' + bottomAlpha + ') 100%)';
                    }
                    screenshots.style.maskImage = mask;
                    screenshots.style.webkitMaskImage = mask;
                }
            }
        }

        // ── Side nav: active section stays highlighted while you're in it ──
        // Find which section the user is currently inside
        let activeIdx = 0;
        for (let i = dots.length - 1; i >= 0; i--) {
            const sec = document.getElementById(dots[i].id);
            if (!sec) continue;
            if (sec.getBoundingClientRect().top <= vh * 0.4) {
                activeIdx = i;
                break;
            }
        }

        for (let i = 0; i < dots.length; i++) {
            const target = i === activeIdx ? 1 : 0;

            const prev = dots[i]._t || 0;
            const smooth = prev + (target - prev) * 0.1;
            dots[i]._t = smooth;

            // Dot: 5px → 12px
            const size = 5 + smooth * 7;
            dots[i].dot.style.width = size + 'px';
            dots[i].dot.style.height = size + 'px';

            // Dot color: gray → theme blue
            const dr = Math.round(209 + (69 - 209) * smooth);
            const dg = Math.round(213 + (205 - 213) * smooth);
            const db = Math.round(219 + (255 - 219) * smooth);
            dots[i].dot.style.background = 'rgb(' + dr + ',' + dg + ',' + db + ')';

            // Label: 0.55rem → 0.85rem, light → bold dark
            const fs = 0.55 + smooth * 0.3;
            const fw = Math.round(400 + smooth * 300);
            const labelAlpha = 0.3 + smooth * 0.7;
            dots[i].label.style.fontSize = fs + 'rem';
            dots[i].label.style.fontWeight = fw;
            dots[i].label.style.color = 'rgba(17,17,17,' + labelAlpha + ')';

            if (Math.abs(target - smooth) > 0.01) colorSettling = true;
        }

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateReveals);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateReveals, { passive: true });
    updateReveals();

    // ── Contact form ──
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            emailjs.sendForm('service_gs9hiab', 'template_zl0apgj', form)
                .then(() => {
                    alert('Message sent successfully!');
                    form.reset();
                }, (err) => {
                    alert('Failed to send message: ' + JSON.stringify(err));
                });
        });
    }
});
