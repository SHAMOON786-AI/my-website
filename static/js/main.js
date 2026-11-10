// Main Interactive JavaScript for Shamoon's Portfolio

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Interactive Starfield / Constellation Canvas
    // ==========================================
    const canvas = document.getElementById('bgCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = Math.min(Math.floor((width * height) / 18000), 85);
        let mouse = { x: null, y: null, radius: 140 };

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 0.8;
                this.speedX = (Math.random() - 0.5) * 0.45;
                this.speedY = (Math.random() - 0.5) * 0.45;
                this.opacity = Math.random() * 0.5 + 0.3;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > width) this.x = 0;
                else if (this.x < 0) this.x = width;

                if (this.y > height) this.y = 0;
                else if (this.y < 0) this.y = height;

                // Mouse interaction
                if (mouse.x && mouse.y) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= (dx / dist) * force * 1.5;
                        this.y -= (dy / dist) * force * 1.5;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(56, 189, 248, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            // Connect lines
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 110) {
                        const alpha = (1 - dist / 110) * 0.18;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
                        ctx.lineWidth = 0.75;
                        ctx.stroke();
                    }
                }
                particles[a].update();
                particles[a].draw();
            }

            requestAnimationFrame(animateCanvas);
        }

        animateCanvas();
    }

    // ==========================================
    // 2. Ambient Theme Switcher
    // ==========================================
    const themeBtn = document.getElementById('themeToggleBtn');
    const themeLabel = document.getElementById('themeLabel');
    const themes = [
        { id: 'theme-cyan', name: 'Cyber Cyan', class: '' },
        { id: 'theme-violet', name: 'Deep Violet', class: 'theme-violet' },
        { id: 'theme-emerald', name: 'Matrix Emerald', class: 'theme-emerald' }
    ];
    let currentThemeIdx = 0;

    // Load saved theme
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
        const foundIdx = themes.findIndex(t => t.id === savedTheme);
        if (foundIdx !== -1) {
            currentThemeIdx = foundIdx;
            applyTheme(themes[currentThemeIdx]);
        }
    }

    function applyTheme(theme) {
        document.body.classList.remove('theme-violet', 'theme-emerald');
        if (theme.class) {
            document.body.classList.add(theme.class);
        }
        if (themeLabel) themeLabel.textContent = theme.name;
        localStorage.setItem('portfolio-theme', theme.id);
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            currentThemeIdx = (currentThemeIdx + 1) % themes.length;
            applyTheme(themes[currentThemeIdx]);
            showToast(`Theme switched to ${themes[currentThemeIdx].name}`, 'info');
        });
    }

    // ==========================================
    // 3. Photo Upload, Fullscreen Lightbox & Removal
    // ==========================================
    const avatarContainer = document.getElementById('avatarContainer');
    const avatarFileInput = document.getElementById('avatarFileInput');
    const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
    const uploadBtnText = document.getElementById('uploadBtnText');
    const viewAvatarBtn = document.getElementById('viewAvatarBtn');
    const hoverViewBtn = document.getElementById('hoverViewBtn');
    const hoverUploadBtn = document.getElementById('hoverUploadBtn');
    const hoverUploadText = document.getElementById('hoverUploadText');
    const removeAvatarBtn = document.getElementById('removeAvatarBtn');
    const avatarImage = document.getElementById('avatarImage');
    const avatarPlaceholder = document.getElementById('avatarPlaceholder');

    // Lightbox modal elements
    const avatarLightboxModal = document.getElementById('avatarLightboxModal');
    const fullAvatarImage = document.getElementById('fullAvatarImage');
    const lightboxBackdrop = document.getElementById('lightboxBackdrop');
    const closeLightboxBtn = document.getElementById('closeLightboxBtn');
    const closeLightboxTextBtn = document.getElementById('closeLightboxTextBtn');
    const downloadAvatarBtn = document.getElementById('downloadAvatarBtn');
    const changePhotoFromModalBtn = document.getElementById('changePhotoFromModalBtn');

    function openAvatarLightbox() {
        if (!avatarLightboxModal || !avatarImage) return;
        const currentSrc = avatarImage.src;
        if (!currentSrc || avatarImage.classList.contains('hidden')) {
            // No photo yet, prompt user to upload
            if (avatarFileInput) avatarFileInput.click();
            return;
        }

        fullAvatarImage.src = currentSrc;
        if (downloadAvatarBtn) downloadAvatarBtn.href = currentSrc;

        avatarLightboxModal.classList.remove('hidden');
        avatarLightboxModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }

    function closeAvatarLightbox() {
        if (!avatarLightboxModal) return;
        avatarLightboxModal.classList.add('hidden');
        avatarLightboxModal.classList.remove('flex');
        document.body.style.overflow = '';
    }

    if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeAvatarLightbox);
    if (closeLightboxTextBtn) closeLightboxTextBtn.addEventListener('click', closeAvatarLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeAvatarLightbox);

    if (viewAvatarBtn) {
        viewAvatarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openAvatarLightbox();
        });
    }

    if (hoverViewBtn) {
        hoverViewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openAvatarLightbox();
        });
    }

    if (avatarFileInput) {
        function triggerFileInput(e) {
            if (e) e.stopPropagation();
            avatarFileInput.click();
        }

        if (avatarContainer) {
            avatarContainer.addEventListener('click', (e) => {
                // If user clicks the avatar and photo exists, open fullscreen
                if (avatarImage && !avatarImage.classList.contains('hidden') && avatarImage.getAttribute('src')) {
                    openAvatarLightbox();
                } else {
                    triggerFileInput(e);
                }
            });

            // Drag and drop support
            ['dragenter', 'dragover'].forEach(eventName => {
                avatarContainer.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    avatarContainer.classList.add('ring-cyan-400', 'scale-105');
                }, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                avatarContainer.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    avatarContainer.classList.remove('ring-cyan-400', 'scale-105');
                }, false);
            });

            avatarContainer.addEventListener('drop', (e) => {
                const dt = e.dataTransfer;
                const files = dt.files;
                if (files.length > 0) {
                    handleAvatarUpload(files[0]);
                }
            });
        }

        if (uploadAvatarBtn) uploadAvatarBtn.addEventListener('click', triggerFileInput);
        if (hoverUploadBtn) hoverUploadBtn.addEventListener('click', triggerFileInput);
        if (changePhotoFromModalBtn) {
            changePhotoFromModalBtn.addEventListener('click', (e) => {
                closeAvatarLightbox();
                triggerFileInput(e);
            });
        }

        avatarFileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleAvatarUpload(e.target.files[0]);
            }
        });
    }

    async function handleAvatarUpload(file) {
        if (!file.type.startsWith('image/')) {
            showToast('Please select a valid image file (JPG, PNG, WEBP).', 'error');
            return;
        }

        showToast('Uploading your photo...', 'info');

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await fetch('/api/upload-avatar', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (response.ok && result.success) {
                showToast('Photo updated! Click to view in full screen.', 'success');
                if (avatarImage) {
                    avatarImage.src = result.avatar_url;
                    avatarImage.classList.remove('hidden');
                }
                if (fullAvatarImage) {
                    fullAvatarImage.src = result.avatar_url;
                }
                if (avatarPlaceholder) {
                    avatarPlaceholder.classList.add('hidden');
                }
                if (viewAvatarBtn) viewAvatarBtn.classList.remove('hidden');
                if (hoverViewBtn) hoverViewBtn.classList.remove('hidden');
                if (removeAvatarBtn) removeAvatarBtn.classList.remove('hidden');
                if (uploadBtnText) uploadBtnText.textContent = 'Change Photo';
                if (hoverUploadText) hoverUploadText.textContent = 'Change';
                if (downloadAvatarBtn) downloadAvatarBtn.href = result.avatar_url;
            } else {
                showToast(result.message || 'Failed to upload photo.', 'error');
            }
        } catch (err) {
            console.error('Upload error:', err);
            showToast('Error uploading photo.', 'error');
        }
    }

    if (removeAvatarBtn) {
        removeAvatarBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (!confirm('Are you sure you want to remove your profile photo?')) return;

            try {
                const response = await fetch('/api/remove-avatar', { method: 'POST' });
                const result = await response.json();
                if (response.ok && result.success) {
                    showToast('Profile photo removed.', 'info');
                    if (avatarImage) {
                        avatarImage.src = '';
                        avatarImage.classList.add('hidden');
                    }
                    if (avatarPlaceholder) avatarPlaceholder.classList.remove('hidden');
                    if (viewAvatarBtn) viewAvatarBtn.classList.add('hidden');
                    if (hoverViewBtn) hoverViewBtn.classList.add('hidden');
                    if (removeAvatarBtn) removeAvatarBtn.classList.add('hidden');
                    if (uploadBtnText) uploadBtnText.textContent = 'Upload Photo';
                    if (hoverUploadText) hoverUploadText.textContent = 'Upload';
                }
            } catch (err) {
                console.error(err);
                showToast('Could not remove photo.', 'error');
            }
        });
    }

    // Escape key listener for lightbox
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (avatarLightboxModal && !avatarLightboxModal.classList.contains('hidden')) {
                closeAvatarLightbox();
            }
        }
    });

    // ==========================================
    // 4. Mobile Navigation Menu Toggle
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // ==========================================
    // 5. Typing Animation Effect in Hero
    // ==========================================
    const dynamicTextElement = document.getElementById('dynamicText');
    if (dynamicTextElement) {
        const phrases = [
            "Computer Science Student @ VIT",
            "Full-Stack Python Developer",
            "Automation & DevOps Enthusiast",
            "Problem Solver & Tech Explorer"
        ];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        const typingSpeed = 80;
        const deletingSpeed = 40;
        const pauseTime = 1800;

        function typeLoop() {
            const currentPhrase = phrases[phraseIdx];
            
            if (isDeleting) {
                dynamicTextElement.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
            } else {
                dynamicTextElement.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
            }

            if (!isDeleting && charIdx === currentPhrase.length) {
                isDeleting = true;
                setTimeout(typeLoop, pauseTime);
                return;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                setTimeout(typeLoop, 400);
                return;
            }

            const speed = isDeleting ? deletingSpeed : typingSpeed;
            setTimeout(typeLoop, speed);
        }

        typeLoop();
    }

    // ==========================================
    // 6. Interactive Projects Filtering & Search
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectSearchInput = document.getElementById('projectSearch');
    const noProjectsMessage = document.getElementById('noProjectsMessage');

    let activeFilter = 'all';
    let searchQuery = '';

    function filterProjects() {
        let visibleCount = 0;

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const title = card.getAttribute('data-title').toLowerCase();
            const tags = card.getAttribute('data-tags').toLowerCase();
            const description = card.getAttribute('data-description').toLowerCase();

            const matchesCategory = (activeFilter === 'all' || category === activeFilter);
            const matchesSearch = !searchQuery || 
                title.includes(searchQuery) || 
                tags.includes(searchQuery) || 
                description.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        if (noProjectsMessage) {
            if (visibleCount === 0) {
                noProjectsMessage.classList.remove('hidden');
            } else {
                noProjectsMessage.classList.add('hidden');
            }
        }
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => {
                b.classList.remove('bg-cyan-500/20', 'text-cyan-400', 'border-cyan-500/50');
                b.classList.add('bg-slate-800/40', 'text-gray-400', 'border-slate-700/50');
            });
            btn.classList.remove('bg-slate-800/40', 'text-gray-400', 'border-slate-700/50');
            btn.classList.add('bg-cyan-500/20', 'text-cyan-400', 'border-cyan-500/50');

            activeFilter = btn.getAttribute('data-filter');
            filterProjects();
        });
    });

    if (projectSearchInput) {
        projectSearchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            filterProjects();
        });
    }

    // ==========================================
    // 7. Project Details Modal
    // ==========================================
    const projectModal = document.getElementById('projectModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const modalBadge = document.getElementById('modalBadge');
    const modalDescription = document.getElementById('modalDescription');
    const modalTags = document.getElementById('modalTags');
    const modalGithub = document.getElementById('modalGithub');
    const modalDemo = document.getElementById('modalDemo');

    window.openProjectModal = function(projectData) {
        if (!projectModal) return;
        
        modalTitle.textContent = projectData.title;
        modalCategory.textContent = projectData.category_label || projectData.category;
        modalBadge.textContent = projectData.badge || 'Project';
        modalDescription.textContent = projectData.long_description || projectData.description;
        
        modalTags.innerHTML = '';
        if (projectData.tags && Array.isArray(projectData.tags)) {
            projectData.tags.forEach(tag => {
                const span = document.createElement('span');
                span.className = 'px-2.5 py-1 text-xs font-mono rounded-md bg-cyan-950/60 text-cyan-300 border border-cyan-800/50';
                span.textContent = tag;
                modalTags.appendChild(span);
            });
        }

        modalGithub.href = projectData.github || 'https://github.com/SHAMOON786-AI';
        if (projectData.demo && projectData.demo !== '#') {
            modalDemo.href = projectData.demo;
            modalDemo.classList.remove('hidden');
        } else {
            modalDemo.classList.add('hidden');
        }

        projectModal.classList.remove('hidden');
        projectModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    };

    function closeModal() {
        if (!projectModal) return;
        projectModal.classList.add('hidden');
        projectModal.classList.remove('flex');
        document.body.style.overflow = '';
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal && !projectModal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // ==========================================
    // 8. One-click Email Copy
    // ==========================================
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = copyEmailBtn.getAttribute('data-email') || 'shamoonashraf.md2026@vitstudent.ac.in';
            navigator.clipboard.writeText(email).then(() => {
                showToast("Email address copied to clipboard!", "success");
            }).catch(() => {
                showToast("Copied: " + email, "info");
            });
        });
    }

    // ==========================================
    // 9. Interactive AJAX Contact Form
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitBtnText = document.getElementById('submitBtnText');
    const submitBtnSpinner = document.getElementById('submitBtnSpinner');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const subject = document.getElementById('contactSubject').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            if (!name || !email || !message) {
                showToast("Please fill in all required fields.", "error");
                return;
            }

            if (submitBtn) submitBtn.disabled = true;
            if (submitBtnText) submitBtnText.textContent = "Sending message...";
            if (submitBtnSpinner) submitBtnSpinner.classList.remove('hidden');

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, subject, message })
                });

                const result = await response.json();
                if (response.ok && result.success) {
                    showToast(result.message, "success");
                    contactForm.reset();
                } else {
                    showToast(result.message || "Failed to send message.", "error");
                }
            } catch (err) {
                console.error("Submission error:", err);
                showToast("Connection error. Please reach out directly via email.", "error");
            } finally {
                if (submitBtn) submitBtn.disabled = false;
                if (submitBtnText) submitBtnText.textContent = "Send Message";
                if (submitBtnSpinner) submitBtnSpinner.classList.add('hidden');
            }
        });
    }

    // ==========================================
    // 10. Toast Notification Utility
    // ==========================================
    window.showToast = function(message, type = "info") {
        const toast = document.getElementById('toastNotification');
        const toastMessage = document.getElementById('toastMessage');
        const toastIcon = document.getElementById('toastIcon');

        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;

        if (type === "success") {
            toast.className = "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl glass-panel border border-emerald-500/50 shadow-2xl shadow-emerald-500/20 text-emerald-300 transition-all duration-300 transform translate-y-0 opacity-100";
            if (toastIcon) toastIcon.className = "fa-solid fa-circle-check text-emerald-400 text-lg";
        } else if (type === "error") {
            toast.className = "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl glass-panel border border-rose-500/50 shadow-2xl shadow-rose-500/20 text-rose-300 transition-all duration-300 transform translate-y-0 opacity-100";
            if (toastIcon) toastIcon.className = "fa-solid fa-triangle-exclamation text-rose-400 text-lg";
        } else {
            toast.className = "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl glass-panel border border-cyan-500/50 shadow-2xl shadow-cyan-500/20 text-cyan-300 transition-all duration-300 transform translate-y-0 opacity-100";
            if (toastIcon) toastIcon.className = "fa-solid fa-circle-info text-cyan-400 text-lg";
        }

        setTimeout(() => {
            toast.classList.add('translate-y-12', 'opacity-0');
        }, 4500);
    };

    // ==========================================
    // 11. Back to Top Button
    // ==========================================
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
                backToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
            } else {
                backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
                backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
