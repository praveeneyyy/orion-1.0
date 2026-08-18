'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Trophy3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x38BDF8, 3, 20);
    cyanLight.position.set(4, 4, 4);
    scene.add(cyanLight);

    const blueLight = new THREE.PointLight(0x1D4ED8, 3, 20);
    blueLight.position.set(-4, -4, 4);
    scene.add(blueLight);

    const whiteLight = new THREE.PointLight(0xFFFFFF, 2, 20);
    whiteLight.position.set(0, 4, -2);
    scene.add(whiteLight);

    const trophyGroup = new THREE.Group();
    scene.add(trophyGroup);

    // Base Pedestal - Octagonal Cylinder
    const baseGeo = new THREE.CylinderGeometry(1.6, 1.9, 0.5, 8);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x07193D,
      metalness: 0.9,
      roughness: 0.2,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -2.2;
    trophyGroup.add(base);

    // Glowing Ring around base
    const baseRingGeo = new THREE.TorusGeometry(1.75, 0.05, 16, 32);
    const baseRingMat = new THREE.MeshBasicMaterial({ color: 0x38BDF8 });
    const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = -2.0;
    trophyGroup.add(baseRing);

    // Crystal Pillar Stem
    const stemGeo = new THREE.CylinderGeometry(0.3, 0.5, 2.2, 6);
    const stemMat = new THREE.MeshPhysicalMaterial({
      color: 0xBAE6FD,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.85,
      ior: 1.5,
      transparent: true,
      opacity: 0.9
    });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = -0.9;
    trophyGroup.add(stem);

    // Central Floating Polyhedral Gem (Grand Champion Core)
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x38BDF8,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: false,
      emissive: 0x07193D,
      emissiveIntensity: 0.5
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 0.8;
    trophyGroup.add(core);

    // Wireframe Outer Cage
    const cageGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x60A5FA,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const cage = new THREE.Mesh(cageGeo, cageMat);
    cage.position.y = 0.8;
    trophyGroup.add(cage);

    // Dual Orbital Energy Rings
    const ring1Geo = new THREE.TorusGeometry(1.8, 0.03, 16, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x38BDF8 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.position.y = 0.8;
    trophyGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.0, 0.02, 16, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xBAE6FD });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.position.y = 0.8;
    ring2.rotation.x = Math.PI / 3;
    trophyGroup.add(ring2);

    // Crown Wings
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(0.4, 1.2);
    wingShape.lineTo(0.8, 2.2);
    wingShape.lineTo(0.2, 1.8);
    wingShape.lineTo(0, 0);

    const extrudeSettings = { depth: 0.08, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
    const wingGeo = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0x07193D
    });

    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.set(-1.1, 0.4, 0);
    leftWing.rotation.z = Math.PI * 0.15;
    leftWing.rotation.y = Math.PI * 0.1;
    trophyGroup.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.set(1.1, 0.4, 0);
    rightWing.rotation.z = -Math.PI * 0.15;
    rightWing.rotation.y = -Math.PI * 0.1;
    rightWing.scale.x = -1;
    trophyGroup.add(rightWing);

    // Particle Aura
    const particleCount = 40;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 3;
      particlePos[i + 1] = (Math.random() - 0.5) * 3 + 0.8;
      particlePos[i + 2] = (Math.random() - 0.5) * 3;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x38BDF8,
      size: 0.08,
      transparent: true,
      opacity: 0.7
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    trophyGroup.add(particles);

    // Cross-Device Drag & Touch Interaction
    let isDragging = false;
    let previousPosition = { x: 0, y: 0 };

    const onStart = (x: number, y: number) => {
      isDragging = true;
      previousPosition = { x, y };
    };

    const onMove = (x: number, y: number) => {
      if (!isDragging) return;
      const deltaX = x - previousPosition.x;
      const deltaY = y - previousPosition.y;

      trophyGroup.rotation.y += deltaX * 0.01;
      trophyGroup.rotation.x += deltaY * 0.01;

      previousPosition = { x, y };
    };

    const onEnd = () => {
      isDragging = false;
    };

    const onMouseDown = (e: MouseEvent) => onStart(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onMouseUp = () => onEnd();

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) onStart(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => onEnd();

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!isDragging) {
        trophyGroup.rotation.y = elapsed * 0.6;
        trophyGroup.position.y = Math.sin(elapsed * 1.5) * 0.15;
      }

      core.rotation.x = elapsed * 0.8;
      core.rotation.z = elapsed * 0.5;

      cage.rotation.y = -elapsed * 0.7;
      cage.rotation.x = elapsed * 0.3;

      ring1.rotation.x = elapsed * 1.2;
      ring1.rotation.y = elapsed * 0.9;

      ring2.rotation.y = -elapsed * 1.0;
      ring2.rotation.z = elapsed * 0.7;

      particles.rotation.y = elapsed * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[260px] sm:h-[320px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing touch-none">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute bottom-1 inset-x-0 text-center text-[8px] sm:text-[9px] font-mono-hud text-[#38BDF8] pointer-events-none">
        [ 3D AEROSPACE GRAND TROPHY • DRAG / TOUCH TO ROTATE ]
      </div>
    </div>
  );
};
