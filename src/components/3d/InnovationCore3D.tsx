'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const InnovationCore3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00bcf2, 3.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0078d4, 2.5);
    dirLight2.position.set(-5, -5, 3);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x22d3ee, 3, 10);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    // Core Group
    const coreGroup = new THREE.Group();

    // 1. Outer Glass Icosahedron Shell
    const outerGeo = new THREE.IcosahedronGeometry(1.8, 1);
    const outerMat = new THREE.MeshPhysicalMaterial({
      color: 0x00bcf2,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.4,
      wireframe: false
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerMesh);

    // Outer Wireframe Overlay
    const wireframeGeo = new THREE.WireframeGeometry(outerGeo);
    const wireframeMat = new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.6 });
    const wireframeMesh = new THREE.LineSegments(wireframeGeo, wireframeMat);
    coreGroup.add(wireframeMesh);

    // 2. Inner Metallic Octahedron Core
    const innerGeo = new THREE.OctahedronGeometry(1.0, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x0078d4,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x00bcf2,
      emissiveIntensity: 0.5
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // 3. Microsoft 4-Color Floating Orbit Spheres
    const msColors = [0xf25022, 0x7fba00, 0x00a4ef, 0xffb900];
    const orbitGroup = new THREE.Group();

    msColors.forEach((colorHex, idx) => {
      const sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.2
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      
      const angle = (idx / 4) * Math.PI * 2;
      sphereMesh.position.set(Math.cos(angle) * 2.3, Math.sin(angle) * 2.3, 0);
      orbitGroup.add(sphereMesh);
    });
    coreGroup.add(orbitGroup);

    // 4. Glowing Azure Torus Ring
    const torusGeo = new THREE.TorusGeometry(2.4, 0.02, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({ color: 0x00bcf2, transparent: true, opacity: 0.7 });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.rotation.x = Math.PI / 3;
    coreGroup.add(torusMesh);

    scene.add(coreGroup);

    // Scroll Integration
    let targetScrollY = 0;
    let currentScrollY = 0;

    const handleScroll = () => {
      targetScrollY = window.scrollY * 0.001;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Animation Loop
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (prefersReducedMotion) {
        renderer.render(scene, camera);
        return;
      }

      currentScrollY += (targetScrollY - currentScrollY) * 0.05;

      coreGroup.rotation.y += 0.01;
      coreGroup.rotation.x += 0.005;

      innerMesh.rotation.y -= 0.018;
      orbitGroup.rotation.z += 0.012;

      coreGroup.position.y = Math.sin(Date.now() * 0.0015) * 0.15 - currentScrollY;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className={`w-full h-full min-h-[360px] ${className}`} />;
};
