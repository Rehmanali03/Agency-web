// The LiquidEffect class is unchanged and perfect.
class LiquidEffect { constructor() { this.container = document.getElementById('liquid-canvas'); this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); this.scene = new THREE.Scene(); this.renderer = new THREE.WebGLRenderer(); this.uniforms = { u_time: { value: 0.0 }, u_mouse: { value: new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2) }, u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) } }; this.init(); this.animate(); } init() { this.renderer.setSize(window.innerWidth, window.innerHeight); this.container.appendChild(this.renderer.domElement); const geometry = new THREE.PlaneGeometry(2, 2); const material = new THREE.ShaderMaterial({ uniforms: this.uniforms, vertexShader: document.getElementById('vertexShader').textContent, fragmentShader: document.getElementById('fragmentShader').textContent }); const mesh = new THREE.Mesh(geometry, material); this.scene.add(mesh); window.addEventListener('resize', this.onWindowResize.bind(this)); document.addEventListener('mousemove', this.onMouseMove.bind(this)); } onWindowResize() { this.camera.aspect = window.innerWidth / window.innerHeight; this.camera.updateProjectionMatrix(); this.renderer.setSize(window.innerWidth, window.innerHeight); this.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight); } onMouseMove(event) { gsap.to(this.uniforms.u_mouse.value, { duration: 1.0, x: event.clientX, y: window.innerHeight - event.clientY, ease: 'power3.out' }); } animate() { requestAnimationFrame(this.animate.bind(this)); this.uniforms.u_time.value += 0.01; this.renderer.render(this.scene, this.camera); } }

// --- FINALIZED & CORRECTED UI Interaction Logic ---
document.addEventListener('DOMContentLoaded', () => {
    new LiquidEffect();

    const initialView = document.querySelector('.initial-view');
    const activeView = document.querySelector('.active-view');
    const enterCTA = document.getElementById('enter-cta');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentPanels = document.querySelectorAll('.content-panel');
    const closeButton = document.querySelector('.close-button');
    let isTransitioning = false;

    const tlIntro = gsap.timeline({ paused: true });
    tlIntro.from(initialView.querySelectorAll('.logo, .content > *'), { 
        duration: 1.2, y: 30, opacity: 0, stagger: 0.1, ease: 'power3.out' 
    });
    
    tlIntro.play();

    function showActiveView() {
        if (isTransitioning) return;
        isTransitioning = true;
        gsap.killTweensOf([initialView, activeView]);
        const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });
        tl.to(initialView, { duration: 1, opacity: 0, ease: 'power3.inOut' })
          .set(initialView, { visibility: 'hidden' })
          .set(activeView, { autoAlpha: 1 }) 
          .from(activeView.querySelectorAll('.main-nav, .close-button'), {
              duration: 1, y: -30, opacity: 0, stagger: 0.1, ease: 'power3.out'
          }, "-=0.5")
          .call(() => {
              document.querySelector('.nav-link[data-content="about"]').classList.add('active');
              document.getElementById('about-content').classList.add('is-visible');
          })
          .call(() => { isTransitioning = false; });
    }
    
    function showInitialView() {
        if (isTransitioning) return;
        isTransitioning = true;
        gsap.killTweensOf([initialView, activeView]);
        const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });
        tl.to(activeView, { duration: 1, opacity: 0, ease: 'power3.inOut' })
          .set(activeView, { autoAlpha: 0 }) 
          .set(initialView, { visibility: 'visible', opacity: 0 })
          .to(initialView, { duration: 1, opacity: 1, ease: 'power3.inOut'})
          .call(() => { tlIntro.restart(); }) 
          .call(() => { isTransitioning = false; });

        contentPanels.forEach(panel => panel.classList.remove('is-visible'));
        navLinks.forEach(l => l.classList.remove('active'));
    }

    enterCTA.addEventListener('click', (e) => { e.preventDefault(); showActiveView(); });
    closeButton.addEventListener('click', () => { showInitialView(); });
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (isTransitioning) return;
            const targetId = link.dataset.content;
            contentPanels.forEach(panel => { panel.classList.toggle('is-visible', panel.id === `${targetId}-content`); });
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // --- CHATBOT LOGIC ---
    const chatbotIcon = document.getElementById('chatbot-icon');
    const chatbotModal = document.getElementById('chatbot-modal');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatLog = document.querySelector('.chat-log');
    chatbotIcon.addEventListener('click', () => { chatbotIcon.classList.toggle('open'); chatbotModal.classList.toggle('open'); });
    const handleSendMessage = () => {
        const messageText = chatInput.value.trim(); if (messageText === "") return;
        const userMessage = document.createElement('div'); userMessage.className = 'chat-message user'; userMessage.textContent = messageText; chatLog.appendChild(userMessage);
        chatInput.value = ""; chatLog.scrollTop = chatLog.scrollHeight;
        setTimeout(() => {
            const botMessage = document.createElement('div'); botMessage.className = 'chat-message bot';
            botMessage.textContent = "Thank you for your message! A ZaroraX specialist will be in touch with you shortly."; chatLog.appendChild(botMessage);
            chatLog.scrollTop = chatLog.scrollHeight;
        }, 1500);
    };
    chatSend.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSendMessage(); });
});