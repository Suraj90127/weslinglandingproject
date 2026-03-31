import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap, Power1 } from "gsap";

const conf = {
  color: 0xffffff,
  objectWidth: 12,
  objectThickness: 3,
  ambientColor: 0xffffff,
  perspective: 75,
  cameraZ: 75,
};

const RevealCanvas = () => {
  const canvasRef = useRef(null);

  let renderer, scene, camera;
  let objects = [];

  useEffect(() => {
    init();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const init = () => {
    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    camera = new THREE.PerspectiveCamera(
      conf.perspective,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = conf.cameraZ;

    scene = new THREE.Scene();
    initScene();
    animate();
  };

  const initScene = () => {
    scene.clear();
    initLights();
    initObjects();
  };

  const initLights = () => {
    scene.add(new THREE.AmbientLight(conf.ambientColor));
    const light = new THREE.PointLight(0xffffff);
    light.position.z = 100;
    scene.add(light);
  };

  const initObjects = () => {
    objects = [];

    const geometry = new THREE.BoxGeometry(
      conf.objectWidth,
      conf.objectWidth,
      conf.objectThickness
    );

    const { wWidth, wHeight } = getRendererSize();
    const nx = Math.round(wWidth / conf.objectWidth);
    const ny = Math.round(wHeight / conf.objectWidth);

    for (let i = 0; i < nx; i++) {
      for (let j = 0; j < ny; j++) {
        const material = new THREE.MeshBasicMaterial({
  color: 0xffffff, // PURE WHITE PIXELS
  transparent: true,
});


        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          -wWidth / 2 + i * conf.objectWidth,
          -wHeight / 2 + j * conf.objectWidth,
          0
        );

        objects.push(mesh);
        scene.add(mesh);
      }
    }

    startAnim();
  };

  const startAnim = () => {
    objects.forEach(mesh => {
      const delay = THREE.MathUtils.randFloat(0.5, 1.8);

      gsap.to(mesh.rotation, {
        x: Math.random() * Math.PI * 2,
        y: Math.random() * Math.PI * 2,
        z: Math.random() * Math.PI * 2,
        duration: 2,
        delay,
      });

      gsap.to(mesh.position, {
        z: 80,
        duration: 2,
        delay: delay + 0.4,
        ease: Power1.easeOut,
      });

      gsap.to(mesh.material, {
        opacity: 0,
        duration: 2,
        delay: delay + 0.4,
      });
    });
  };

  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  const getRendererSize = () => {
    const vFOV = (conf.perspective * Math.PI) / 180;
    const height = 2 * Math.tan(vFOV / 2) * Math.abs(conf.cameraZ);
    const width = height * camera.aspect;
    return { wWidth: width, wHeight: height };
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-screen z-50"
    />
  );
};

export default RevealCanvas;
