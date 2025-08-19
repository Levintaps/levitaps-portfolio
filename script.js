document.addEventListener('DOMContentLoaded', () => {
    // SpiderWeb class for background effect
    class SpiderWeb {
        constructor() {
            this.canvas = document.getElementById('canvas-container');
            if (!this.canvas) {
                console.error('Canvas container not found');
                return;
            }
            this.ctx = this.canvas.getContext('2d');
            
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            
            this.mouseX = 0;
            this.mouseY = 0;
            
            this.nodes = [];
            this.particles = [];
            
            this.nodesCount = Math.floor(window.innerWidth * window.innerHeight / 20000);
            this.connectionDistance = Math.min(window.innerWidth, window.innerHeight) / 4;
            
            this.colors = {
                blue: '#00f3ff',
                purple: '#9d00ff',
                green: '#00ff9d'
            };
            
            this.createNodes();
            
            window.addEventListener('resize', () => this.handleResize());
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            });
            
            this.lastFrame = 0;
            this.animate(0);
        }
        
        createNodes() {
            this.nodes = [];
            for (let i = 0; i < this.nodesCount; i++) {
                this.nodes.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    radius: Math.random() * 1.5 + 1,
                    vx: Math.random() * 0.5 - 0.25,
                    vy: Math.random() * 0.5 - 0.25,
                    color: this.getRandomColor()
                });
            }
        }
        
        getRandomColor() {
            const colors = [this.colors.blue, this.colors.purple, this.colors.green];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        handleResize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.nodesCount = Math.floor(window.innerWidth * window.innerHeight / 20000);
            this.connectionDistance = Math.min(window.innerWidth, window.innerHeight) / 4;
            this.createNodes();
        }
        
        createParticle(nodeA, nodeB) {
            const dx = nodeB.x - nodeA.x;
            const dy = nodeB.y - nodeA.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            return {
                x: nodeA.x,
                y: nodeA.y,
                targetX: nodeB.x,
                targetY: nodeB.y,
                speed: 1 + Math.random(),
                color: nodeA.color,
                progress: 0,
                distance: distance
            };
        }
        
        animate(timestamp) {
            if (timestamp - this.lastFrame < 16.67) {
                requestAnimationFrame((t) => this.animate(t));
                return;
            }
            this.lastFrame = timestamp;
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.lineWidth = 0.7;
            this.ctx.globalAlpha = 0.9;
            
            for (let i = 0; i < this.nodes.length; i++) {
                const nodeA = this.nodes[i];
                
                for (let j = i + 1; j < this.nodes.length; j++) {
                    const nodeB = this.nodes[j];
                    const dx = nodeA.x - nodeB.x;
                    const dy = nodeA.y - nodeB.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < this.connectionDistance) {
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = nodeA.color;
                        this.ctx.globalAlpha = 0.5 * (1 - distance / this.connectionDistance);
                        this.ctx.moveTo(nodeA.x, nodeA.y);
                        this.ctx.lineTo(nodeB.x, nodeB.y);
                        this.ctx.stroke();
                        
                        const mouseDist = Math.sqrt(
                            Math.pow((nodeA.x + nodeB.x) / 2 - this.mouseX, 2) +
                            Math.pow((nodeA.y + nodeB.y) / 2 - this.mouseY, 2)
                        );
                        
                        if (mouseDist < 100 && Math.random() < 0.02 && this.particles.length < 20) {
                            this.particles.push(this.createParticle(nodeA, nodeB));
                        }
                    }
                }
                
                nodeA.x += nodeA.vx;
                nodeA.y += nodeA.vy;
                
                if (nodeA.x < 0 || nodeA.x > this.canvas.width) nodeA.vx = -nodeA.vx;
                if (nodeA.y < 0 || nodeA.y > this.canvas.height) nodeA.vy = -nodeA.vy;
                
                this.ctx.beginPath();
                this.ctx.fillStyle = nodeA.color;
                this.ctx.globalAlpha = 0.7;
                this.ctx.arc(nodeA.x, nodeA.y, nodeA.radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                const mouseDistance = Math.sqrt(
                    Math.pow(nodeA.x - this.mouseX, 2) +
                    Math.pow(nodeA.y - this.mouseY, 2)
                );
                if (mouseDistance < 80) {
                    const angle = Math.atan2(nodeA.y - this.mouseY, nodeA.x - this.mouseX);
                    const force = (80 - mouseDistance) / 2000;
                    nodeA.vx += Math.cos(angle) * force;
                    nodeA.vy += Math.sin(angle) * force;
                }
                
                const speed = Math.sqrt(nodeA.vx * nodeA.vx + nodeA.vy * nodeA.vy);
                if (speed > 2) {
                    nodeA.vx = (nodeA.vx / speed) * 2;
                    nodeA.vy = (nodeA.vy / speed) * 2;
                }
            }
            
            this.ctx.globalAlpha = 0.8;
            this.particles = this.particles.filter(p => p.progress < 1);
            
            for (let particle of this.particles) {
                particle.progress += particle.speed / particle.distance;
                particle.x = particle.x + (particle.targetX - particle.x) * (particle.speed / particle.distance);
                particle.y = particle.y + (particle.targetY - particle.y) * (particle.speed / particle.distance);
                
                this.ctx.beginPath();
                this.ctx.fillStyle = particle.color;
                this.ctx.arc(particle.x, particle.y, 1.5, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            requestAnimationFrame((t) => this.animate(t));
        }
    }
    
    const spiderWeb = new SpiderWeb();
    console.log('SpiderWeb initialized');

    // Typed.js for infinite typing effect
    if (document.querySelector('.title')) {
        new Typed('.title', {
            strings: ["Full Stack Developer", "UI/UX Designer", "Problem Solver", "Creative Thinker", "Web and Mobile Developer", "Game Developer", "Professional Chess Player", "System Administrator", "API security", "Secured Coding"],
            typeSpeed: 80,
            backSpeed: 30,
            backDelay: 1500,
            startDelay: 500,
            loop: true,
            showCursor: true,
            cursorChar: '|',
            smartBackspace: true
        });
    }

    gsap.registerPlugin(ScrollTrigger);

    function animateHeroSection() {
        const heroTimeline = gsap.timeline();
    
        heroTimeline.from('.profile-image', {
            opacity: 1,
            y: 30,
            duration: 1,
            ease: "power3.out"
        });
    
        heroTimeline.from('.name', {
            opacity: 1,
            y: 30,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.4");
    
        heroTimeline.from('.title', {
            opacity: 1,
            y: 20,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.4");
    
        heroTimeline.from('.hero-text', {
            opacity: 1,
            y: 20,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.4");
    
        heroTimeline.from('.hero-buttons .btn', {
            opacity: 1,
            y: 20,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out"
        }, "-=0.4");
    }

    function animateSkillsSection() {
        const skillsTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '#skills',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        skillsTimeline.from('#skills .skill-category', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.5,
            ease: 'power3.out'
        }, '-=0.4');
    
        skillsTimeline.from('#skills .skill-list li', {
            opacity: 0,
            y: 20,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power3.out'
        }, '-=0.4');
    }
    
    function animateProjectsSection() {
        const projectsTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '#projects',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    
        projectsTimeline.from('#projects .filter-btn', {
            opacity: 0,
            y: 20,
            duration: 1,
            stagger: 0.3,
            ease: 'power3.out'
        }, '-=0.4');
    
        projectsTimeline.from('#projects .project-card', {
            opacity: 0,
            y: 30,
            duration: 2,
            stagger: 0.5,
            ease: 'power3.out'
        }, '-=0.4');
    }
    
    function animateContactSection() {
        const contactTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '#contact',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    
        contactTimeline.from('#contact .contact-info', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.4');

        contactTimeline.from('#contact .contact-item', {
            opacity: 0,
            y: 20,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power3.out'
        }, '-=0.4');

        contactTimeline.from('#contact .contact-form', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.4');

        contactTimeline.from('#contact .form-group', {
            opacity: 0,
            y: 20,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power3.out'
        }, '-=0.4');
    }

    animateHeroSection();
    animateSkillsSection();
    animateProjectsSection();
    animateContactSection();

    // CV Request Modal Handling
    const viewCvBtn = document.getElementById('view-cv-btn');
    const cvRequestModal = document.getElementById('cv-request-modal');
    const closeCvModal = document.getElementById('close-cv-modal');
    const cvRequestForm = document.getElementById('cv-request-form');
    const cvFormMessage = document.getElementById('cv-form-message');

    // Open the modal when "View My CV" is clicked
    viewCvBtn.addEventListener('click', () => {
        cvRequestModal.style.display = 'block';
    });

    // Close the modal when the close button is clicked
    closeCvModal.addEventListener('click', () => {
        cvRequestModal.style.display = 'none';
        cvRequestForm.reset();
        cvFormMessage.textContent = '';
    });

    // Close the modal when clicking outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target === cvRequestModal) {
            cvRequestModal.style.display = 'none';
            cvRequestForm.reset();
            cvFormMessage.textContent = '';
        }
    });

    const seeMoreBtn = document.querySelector('.see-more-btn');
    const modal = document.querySelector('#about-modal');
    const closeBtn = document.querySelector('.close-btn');
    const chessCareerBtn = document.querySelector('.chess-career-btn');
    const chessCareerSection = document.querySelector('.chess-career');
    const ingameProfileBtn = document.querySelector('.ingame-profile-btn');
    const ingameProfilesSection = document.querySelector('.ingame-profiles');
    const modalContent = document.querySelector('.modal-content');

    // Open modal with animation
    seeMoreBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        modalContent.scrollTop = 0;
        gsap.fromTo(modal, 
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
        );
        gsap.from('.modal-content', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.2
        });
    });

    // Close modal with animation
    closeBtn.addEventListener('click', () => {
        gsap.to(modal, {
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            ease: "power3.in",
            onComplete: () => {
                modal.style.display = 'none';
                chessCareerSection.style.display = 'none';
                ingameProfilesSection.style.display = 'none';
            }
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            gsap.to(modal, {
                opacity: 0,
                scale: 0.8,
                duration: 0.5,
                ease: "power3.in",
                onComplete: () => {
                    modal.style.display = 'none';
                    chessCareerSection.style.display = 'none';
                    ingameProfilesSection.style.display = 'none';
                }
            });
        }
    });

    // Toggle chess career section with animation
    chessCareerBtn.addEventListener('click', () => {
        // Hide in-game profiles
        ingameProfilesSection.style.display = 'none';

        if (chessCareerSection.style.display === 'none' || chessCareerSection.style.display === '') {
            chessCareerSection.style.display = 'block';
            gsap.fromTo(chessCareerSection, 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
            );
            gsap.from('.chess-achievements li', {
                opacity: 0,
                x: -20,
                duration: 0.5,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.2
            });
            gsap.from('.chess-id-image', {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: "power3.out",
                delay: 0.4
            });
            gsap.from('.chess-details p', {
                opacity: 0,
                x: -20,
                duration: 0.5,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.6
            });
            chessCareerSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            gsap.to(chessCareerSection, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: "power3.in",
                onComplete: () => {
                    chessCareerSection.style.display = 'none';
                }
            });
        }
    });

    // Toggle in-game profiles section with animation
    ingameProfileBtn.addEventListener('click', () => {
        // Hide chess career
        chessCareerSection.style.display = 'none';

        if (ingameProfilesSection.style.display === 'none' || ingameProfilesSection.style.display === '') {
            ingameProfilesSection.style.display = 'block';
            gsap.fromTo(ingameProfilesSection, 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
            );
            gsap.from('.game-profile', {
                opacity: 0,
                y: 20,
                duration: 0.5,
                stagger: 0.2,
                ease: "power3.out",
                delay: 0.2
            });
            ingameProfilesSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            gsap.to(ingameProfilesSection, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: "power3.in",
                onComplete: () => {
                    ingameProfilesSection.style.display = 'none';
                }
            });
        }
    });

    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    let activeFilters = ['all']; // Track active filters, default to 'all'

    // Function to update the project cards based on active filters
    const updateProjects = () => {
        projectCards.forEach(card => {
            const tech = card.getAttribute('data-tech').split(','); // Split tech into an array

            // If 'all' is active or no filters are selected, show all projects
            if (activeFilters.includes('all') || activeFilters.length === 0) {
                card.classList.remove('hidden');
                gsap.to(card, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
            } else {
                // Check if the project matches any of the active filters
                const matchesFilter = activeFilters.some(filter => tech.includes(filter));
                if (matchesFilter) {
                    card.classList.remove('hidden');
                    gsap.to(card, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
                } else {
                    gsap.to(card, {
                        opacity: 0,
                        y: 20,
                        duration: 0.5,
                        ease: "power2.out",
                        onComplete: () => card.classList.add('hidden')
                    });
                }
            }
        });
    };

    // Add click event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            if (filter === 'all') {
                // If 'All' is clicked, reset all filters and show all projects
                activeFilters = ['all'];
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            } else {
                // Remove 'all' from active filters if another filter is clicked
                activeFilters = activeFilters.filter(f => f !== 'all');
                filterButtons.forEach(btn => {
                    if (btn.getAttribute('data-filter') === 'all') {
                        btn.classList.remove('active');
                    }
                });

                // Toggle the clicked filter
                if (activeFilters.includes(filter)) {
                    // If filter is already active, remove it
                    activeFilters = activeFilters.filter(f => f !== filter);
                    button.classList.remove('active');
                } else {
                    // Add filter to active filters
                    activeFilters.push(filter);
                    button.classList.add('active');
                }

                // If no filters are active, default to 'all'
                if (activeFilters.length === 0) {
                    activeFilters = ['all'];
                    filterButtons.forEach(btn => {
                        if (btn.getAttribute('data-filter') === 'all') {
                            btn.classList.add('active');
                        }
                    });
                }
            }

            // Update the projects based on the new filter state
            updateProjects();
        });
    });
    
        // Contact form submission and Request CV using EmailJS
        (function() {
            emailjs.init('hBDKAmiJZfb8xdSSq');
        })();
        
        // Handle contact form submission
        const contactForm = document.getElementById('contactForm');
        const formMessage = document.getElementById('formMessage');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
        
                // Disable the submit button to prevent multiple submissions
                const submitBtn = contactForm.querySelector('.form-submit');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
        
                // Send the form data using EmailJS
                emailjs.sendForm('service_pkftg5g', 'template_m32bbot', contactForm)
                    .then(() => {
                        // Success
                        formMessage.textContent = 'Message sent successfully! I’ll get back to you soon.';
                        formMessage.className = 'form-message success';
                        contactForm.reset();
                    })
                    .catch(error => {
                        // Error
                        console.error('Error sending message:', error);
                        formMessage.textContent = 'There was an error sending your message. Please try again later.';
                        formMessage.className = 'form-message error';
                    })
                    .finally(() => {
                        // Re-enable the submit button
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Send Message';
                    });
            });
        }

// Handle CV request form submission
cvRequestForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = cvRequestForm.querySelector('.form-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const name = cvRequestForm.querySelector('#cv-name').value;
    const email = cvRequestForm.querySelector('#cv-email').value;
    const message = cvRequestForm.querySelector('#cv-message').value || 'Requested CV access';

    // Generate the current time
    const now = new Date();
    const time = now.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    });

    // EmailJS parameters
    const templateParams = {
        name: name,
        from_email: email,
        time: time,
        message: message,
        to_email: 'levintaps@gmail.com'
    };

    emailjs.send('service_onojbso', 'template_h1p4pz9', templateParams)
        .then(() => {
            cvFormMessage.textContent = 'Request sent successfully! I will review your request and follow up soon.';
            cvFormMessage.classList.add('success');
            cvRequestForm.reset();
        })
        .catch((error) => {
            cvFormMessage.textContent = 'Failed to send request. Please try again later.';
            cvFormMessage.classList.add('error');
            console.error('EmailJS Error:', error);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Request';
        });
});
    
        // Mobile menu
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuLinks = document.querySelectorAll('.mobile-menu .nav-link');
    
        if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            if (mobileMenu.classList.contains('active')) {
            mobileMenuBtn.querySelector('span:first-child').style.transform = 'rotate(45deg) translate(5px, 5px)';
            mobileMenuBtn.querySelector('span:nth-child(2)').style.opacity = '0';
            mobileMenuBtn.querySelector('span:last-child').style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
            mobileMenuBtn.querySelector('span:first-child').style.transform = 'none';
            mobileMenuBtn.querySelector('span:nth-child(2)').style.opacity = '1';
            mobileMenuBtn.querySelector('span:last-child').style.transform = 'none';
            }
        });
        }
    
        if (mobileMenuLinks.length > 0) {
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.querySelector('span:first-child').style.transform = 'none';
            mobileMenuBtn.querySelector('span:nth-child(2)').style.opacity = '1';
            mobileMenuBtn.querySelector('span:last-child').style.transform = 'none';
            });
        });
        }
    
        // Intersection Observer for section animations
        const sections = document.querySelectorAll('section');
    
        const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
            if (entry.target.id === 'skills') {
                animateSkillBars();
            } else if (entry.target.id === 'home') {
                animateHeroSection();
            }
            
            // Add fade-in animation for section title
            const sectionTitle = entry.target.querySelector('.section-title');
            if (sectionTitle) {
                gsap.from(sectionTitle, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: "power3.out"
                });
            }
            }
        });
        }, { threshold: 0.2 });
    
        sections.forEach(section => {
        sectionObserver.observe(section);
        });
    });
