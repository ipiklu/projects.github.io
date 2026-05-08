        import * as THREE from 'three';

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);

        const mouse = new THREE.Vector2(-9999, -9999);
        const tempVec = new THREE.Vector3();

		const cursorTag = document.getElementById('custom-cursor');
		
        window.addEventListener('mousemove', (e) => { 
			cursorTag.style.display = 'block'; // Ensures it's visible when moving
			mouse.x = e.clientX; 
			mouse.y = e.clientY; 
			cursorTag.style.left = e.clientX + 'px'; 
			cursorTag.style.top = e.clientY + 'px'; 
		});
		
		// Hide when mouse leaves
		window.addEventListener('mouseout', () => { 
			cursorTag.style.display = 'none'; 
		});
		
		// Mobile Touch
		window.addEventListener('touchstart', () => { 
			cursorTag.style.display = 'block'; 
		});
		
		window.addEventListener('touchmove', (e) => { 
			const touchX = e.touches[0].clientX;
			const touchY = e.touches[0].clientY;
			mouse.x = touchX; 
			mouse.y = touchY; 
			cursorTag.style.left = touchX + 'px'; 
			cursorTag.style.top = touchY + 'px'; 
		});
		
		window.addEventListener('touchend', () => { 
			cursorTag.style.display = 'none'; 
		});

        // --- 1. THE PARTICLE SINGULARITY (The Core that splits) ---
        const holeCount = 6000;
        const holePos = new Float32Array(holeCount * 3);
        const holeBase = new Float32Array(holeCount * 3); // Local relative positions

        for (let i = 0; i < holeCount; i++) {
            const phi = Math.acos(-1 + (2 * i) / holeCount);
            const theta = Math.sqrt(holeCount * Math.PI) * phi;
            const r = 1.4 * Math.pow(Math.random(), 0.5);

            holeBase[i * 3] = r * Math.cos(theta) * Math.sin(phi);
            holeBase[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
            holeBase[i * 3 + 2] = r * Math.cos(phi);
        }

        const holeGeo = new THREE.BufferGeometry();
        holeGeo.setAttribute('position', new THREE.BufferAttribute(holePos, 3));
        const holeMat = new THREE.PointsMaterial({ color: 0x000000, size: 0.05, transparent: true, opacity: 1.0 });
        const singularity = new THREE.Points(holeGeo, holeMat);
        scene.add(singularity);

        // --- 2. THE PARTICLE ACCRETION DISK (The Light that splits) ---
        const diskCount = 35000;
        const diskPos = new Float32Array(diskCount * 3);
        const diskBase = new Float32Array(diskCount * 3);
        const diskCol = new Float32Array(diskCount * 3);

        for (let i = 0; i < diskCount; i++) {
            const radius = 2.5 + Math.random() * 3.5;
            const angle = Math.random() * Math.PI * 2;
            let x = Math.cos(angle) * radius;
            let y = (Math.random() - 0.5) * 0.15;
            let z = Math.sin(angle) * radius;
            if (z < 0) y += Math.sin(radius) * (Math.abs(z) * 0.8);

            diskBase[i * 3] = x; diskBase[i * 3 + 1] = y; diskBase[i * 3 + 2] = z;

            const c = new THREE.Color().setHSL(0.08, 0.9, 0.4 + Math.random() * 0.4);
            diskCol[i * 3] = c.r; diskCol[i * 3 + 1] = c.g; diskCol[i * 3 + 2] = c.b;
        }

        const diskGeo = new THREE.BufferGeometry();
        diskGeo.setAttribute('position', new THREE.BufferAttribute(diskPos, 3));
        diskGeo.setAttribute('color', new THREE.BufferAttribute(diskCol, 3));
        const diskMat = new THREE.PointsMaterial({ size: 0.02, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false });
        const accretionDisk = new THREE.Points(diskGeo, diskMat);
        scene.add(accretionDisk);

        // --- 3. THE FLYING STARS ---
        const starCount = 8000;
        const starPos = new Float32Array(starCount * 3);
        const starSpeeds = new Float32Array(starCount);

        for (let i = 0; i < starCount; i++) {
            starPos[i * 3] = (Math.random() - 0.5) * 120;
            starPos[i * 3 + 1] = (Math.random() - 0.5) * 120;
            starPos[i * 3 + 2] = (Math.random() - 0.5) * 300;
            starSpeeds[i] = 0.8 + Math.random() * 2.5;
        }

        const starGeo = new THREE.BufferGeometry();
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.7 });
        const starsSystem = new THREE.Points(starGeo, starMat);
        scene.add(starsSystem);

        camera.position.z = 15;

        // Interaction Function (The "Splitter")
        function updateParticles(geo, baseArray, bhX, bhY, radius, strength, isDisk) {
            const positions = geo.attributes.position.array;
            const halfW = window.innerWidth / 2;
            const halfH = window.innerHeight / 2;
            const time = performance.now() * 0.001;

            for (let i = 0; i < baseArray.length / 3; i++) {
                let ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;

                // 1. Position particle relative to the drifting Black Hole
                let x = baseArray[ix] + bhX;
                let y = baseArray[iy] + bhY;
                let z = baseArray[iz];

                // 2. Project to Screen Space to check mouse interaction
                tempVec.set(x, y, z).project(camera);
                const sX = (tempVec.x * halfW) + halfW;
                const sY = -(tempVec.y * halfH) + halfH;

                const dx = sX - mouse.x;
                const dy = sY - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // 3. Apply the Split (Repulsion)
                if (dist < radius) {
                    const force = (radius - dist) / radius;
                    x += (dx / dist) * force * strength;
                    y -= (dy / dist) * force * strength;
                }

                positions[ix] = x;
                positions[iy] = y;
                positions[iz] = z;
            }
            geo.attributes.position.needsUpdate = true;
        }

        function animate() {
            const t = performance.now() * 0.001;
            requestAnimationFrame(animate);

            // Cinematic Figure-Eight Movement
            const bhX = Math.sin(t * 0.4) * 4;
            const bhY = Math.cos(t * 0.2) * 2;

            // Update Hole Particles (Split effect)
            updateParticles(holeGeo, holeBase, bhX, bhY, 150, 2.5, false);

            // Update Disk Particles (Split effect)
            updateParticles(diskGeo, diskBase, bhX, bhY, 180, 4.0, true);

            // Update Star Movement (Flying toward camera)
            const stars = starGeo.attributes.position.array;
            const halfW = window.innerWidth / 2;
            const halfH = window.innerHeight / 2;

            for (let i = 0; i < starCount; i++) {
                stars[i*3+2] += starSpeeds[i];
                if (stars[i*3+2] > 20) {
                    stars[i*3+2] = -250;
                    stars[i*3] = (Math.random() - 0.5) * 120;
                    stars[i*3+1] = (Math.random() - 0.5) * 120;
                }

                // Stars also split when mouse is near
                tempVec.set(stars[i*3], stars[i*3+1], stars[i*3+2]).project(camera);
                const sX = (tempVec.x * halfW) + halfW;
                const sY = -(tempVec.y * halfH) + halfH;
                const dx = sX - mouse.x;
                const dy = sY - mouse.y;
                const d = Math.sqrt(dx*dx + dy*dy);
                if (d < 100) {
                    const f = (100 - d) / 100;
                    stars[i*3] += (dx/d) * f * 0.5;
                    stars[i*3+1] -= (dy/d) * f * 0.5;
                }
            }
            starGeo.attributes.position.needsUpdate = true;

            camera.lookAt(bhX, bhY, 0);
            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });