        const canvas = document.getElementById('cosmos');
        const ctx = canvas.getContext('2d');

        let width, height, elements = [];
        const SPEED = 2.8; 
        const MOUSE_RADIUS = 180;
        let mouse = { x: -1000, y: -1000 };

        function init() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            
            elements = [];
            // Increased Star Count for a denser field
            for (let i = 0; i < 600; i++) elements.push(spawn('star'));
            for (let i = 0; i < 4; i++) elements.push(spawn('galaxy'));
            for (let i = 0; i < 3; i++) elements.push(spawn('planet'));
        }

        function spawn(type) {
            let obj = {
                type: type,
                x: (Math.random() - 0.5) * width * 4,
                y: (Math.random() - 0.5) * height * 4,
                z: Math.random() * width,
                offX: 0, offY: 0
            };

            if (type === 'star') {
                // Stars now have a varied base size and a "twinkle" factor
                obj.size = Math.random() * 1.8 + 0.5;
                obj.brightness = Math.random();
            } else if (type === 'galaxy') {
                const hues = [200, 240, 280, 320]; 
                obj.color = `hsla(${hues[Math.floor(Math.random() * hues.length)]}, 90%, 70%, `;
                obj.particles = [];
                const arms = 3;
                for (let j = 0; j < 120; j++) {
                    const angle = j * 0.15;
                    const dist = j * 0.7;
                    const arm = (j % arms) * (Math.PI * 2 / arms);
                    obj.particles.push({
                        x: Math.cos(angle + arm) * dist,
                        y: Math.sin(angle + arm) * dist
                    });
                }
            } else if (type === 'planet') {
                const colors = [{b:'#4a90e2', s:'#1a3a5a'}, {b:'#e67e22', s:'#8e44ad'}, {b:'#2ecc71', s:'#27ae60'}];
                obj.style = colors[Math.floor(Math.random() * colors.length)];
                obj.size = 40 + Math.random() * 30;
            }
            return obj;
        }

		function updateInput(x, y) {
			mouse.x = x;
			mouse.y = y;
		}
		
		// 1. Desktop: Mouse Move
		window.addEventListener('mousemove', (e) => {
			updateInput(e.clientX, e.clientY);
		});
		
		// 2. Mobile: Touch Move
		window.addEventListener('touchmove', (e) => {
			// Prevents the page from scrolling while you "steer" the stars
			e.preventDefault(); 
			
			// We take the first finger touch [0]
			const touch = e.touches[0];
			updateInput(touch.clientX, touch.clientY);
		}, { passive: false });
		
		// 3. Reset when finger/mouse leaves (Optional)
		const resetInput = () => { mouse.x = -1000; mouse.y = -1000; };
		window.addEventListener('touchend', resetInput);
		window.addEventListener('mouseleave', resetInput);

        function draw() {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, width, height);

            elements.sort((a, b) => b.z - a.z);

            elements.forEach(e => {
                let k = 150 / e.z;
                let px = e.x * k + width / 2;
                let py = e.y * k + height / 2;

                // Mouse Interaction
                let dx = mouse.x - (px + e.offX);
                let dy = mouse.y - (py + e.offY);
                let dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < MOUSE_RADIUS) {
                    let force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                    e.offX -= (dx / dist) * force * 15;
                    e.offY -= (dy / dist) * force * 15;
                }
                e.offX *= 0.95;
                e.offY *= 0.95;

                let fx = px + e.offX;
                let fy = py + e.offY;

                if (e.type === 'star') {
                    // Make stars pop: calculate size + a small fixed minimum
                    let s = k * e.size;
                    // Add a tiny bit of bloom
                    ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.random() * 0.5})`;

                    ctx.beginPath();
                    ctx.arc(fx, fy, Math.max(0.8, s), 0, Math.PI * 2);
                    ctx.fill();
                }

                e.z -= SPEED;
                if (e.z <= 1) {
                    Object.assign(e, spawn(e.type));
                    e.z = width;
                }
            });

            requestAnimationFrame(draw);
        }

        window.addEventListener('resize', init);
        init();
        draw();
		
window.addEventListener('keydown', function(event) {
    // Check if the key pressed is 'Escape'
    if (event.key === 'Escape' || event.keyCode === 27) {
        // Option 1: Go back to the previous page in history
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // Option 2: Fallback (e.g., go to a specific URL if there's no history)
            window.location.href = 'index.html'; 
        }
    }
});		