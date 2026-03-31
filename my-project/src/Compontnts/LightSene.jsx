// import React, { useEffect, useRef } from "react";
// import * as THREE from "three";
// import img1 from "../assets/images/roman.jpeg";
// import img2 from "../assets/images/rock.jpeg";
// import img3 from "../assets/images/john-cena.jpeg";
// import img4 from "../assets/images/gldburg.jpeg";

// const LightScene = () => {
// //   const mountRef = useRef(null);

// //   useEffect(() => {
// //     let camera, scene, renderer, animationId;
// //     let orbitItems = [];

// //     // Scene
// //     scene = new THREE.Scene();
// //     scene.background = new THREE.Color("#FED7AA");

// //     // Camera
// //     camera = new THREE.PerspectiveCamera(
// //       50,
// //       window.innerWidth / window.innerHeight,
// //       0.1,
// //       1000
// //     );
// //     camera.position.z = 15;

// //     // Renderer
// //     renderer = new THREE.WebGLRenderer({ antialias: true });
// //     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// //     renderer.setSize(window.innerWidth, window.innerHeight);
// //     renderer.outputColorSpace = THREE.SRGBColorSpace;
// //     mountRef.current.appendChild(renderer.domElement);

// //     // Texture loader
// //     const loader = new THREE.TextureLoader();
// //     const textures = [img1, img2, img3, img4].map(src => {
// //       const tex = loader.load(src);
// //       tex.colorSpace = THREE.SRGBColorSpace;
// //       tex.minFilter = THREE.LinearFilter;
// //       tex.magFilter = THREE.LinearFilter;
// //       return tex;
// //     });

// //     // Main center sphere (KEEP)
// //     const mainGeometry = new THREE.IcosahedronGeometry(4, 0);

// // const mainMaterial = new THREE.MeshStandardMaterial({
// //   color: "#00ffcc",
// //   metalness: 0.6,
// //   roughness: 0.2,
// // });

// // const mainMesh = new THREE.Mesh(mainGeometry, mainMaterial);
// // scene.add(mainMesh);

// //     // Image planes (REPLACE small spheres)
// //     const planeGeometry = new THREE.PlaneGeometry(2.2, 2.8);

// //     textures.forEach((texture, i) => {
// //       const material = new THREE.MeshBasicMaterial({
// //         map: texture,
// //         transparent: true,
// //       });

// //       const plane = new THREE.Mesh(planeGeometry, material);
// //       scene.add(plane);
// //       orbitItems.push(plane);
// //     });

// //     // Lights (only for main sphere)
// //     const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
// //     keyLight.position.set(5, 5, 5);
// //     scene.add(keyLight);

// //     const ambient = new THREE.AmbientLight(0xffffff, 0.4);
// //     scene.add(ambient);

// //     // Resize
// //     const handleResize = () => {
// //       camera.aspect = window.innerWidth / window.innerHeight;
// //       camera.updateProjectionMatrix();
// //       renderer.setSize(window.innerWidth, window.innerHeight);
// //     };
// //     window.addEventListener("resize", handleResize);

// //     // Animation
// //     const animate = () => {
// //       animationId = requestAnimationFrame(animate);
// //       const time = Date.now() * 0.001;

// //       mainMesh.rotation.y += 0.005;

// //       orbitItems.forEach((item, i) => {
// //         const angle = time + i * (Math.PI * 2 / orbitItems.length);
// //         item.position.x = Math.cos(angle) * 6;
// //         item.position.z = Math.sin(angle) * 6;

// //         // 👀 always face camera (billboard effect)
// //         item.lookAt(camera.position);
// //       });

// //       renderer.render(scene, camera);
// //     };

// //     animate();

// //     return () => {
// //       cancelAnimationFrame(animationId);
// //       window.removeEventListener("resize", handleResize);
// //       mountRef.current.removeChild(renderer.domElement);
// //     };
// //   }, []);

//   return 
//   // <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />

// };

// export default LightScene;
