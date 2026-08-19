'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const SpaceBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.0012);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 180;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Microsoft Azure & Cosmic Palette Starfield
    const starCount = window.innerWidth < 768 ? 250 : 500;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 500;
      starPositions[i + 1] = (Math.random() - 0.5) * 500;
      starPositions[i + 2] = (Math.random() - 0.5) * 300;
      starVelocities.push({
        x: (Math.random() - 0.5) * 0.04,
        y: (Math.random() - 0.5) * 0.04,
        z: (Math.random() - 0.5) * 0.02
      });
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    const starMaterial = new THREE.PointsMaterial({
      color: 0x00BCF2,
      size: 1.6,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // Deep Calm Ambient Light
    const ambientLight = new THREE.AmbientLight(0x0078D4, 1.2);
    scene.add(ambientLight);

    // Interactive Constellation Connecting Lines
    const maxLineConnections = window.innerWidth < 768 ? 60 : 160;
    const linePositions = new Float32Array(maxLineConnections * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x0078D4,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending
    });

    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);

    // Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 30;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 30;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Smooth Scroll Integration
    let targetScrollY = 0;
    let currentScrollY = 0;

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Window Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (prefersReducedMotion) {
        renderer.render(scene, camera);
        return;
      }

      // Smooth scroll & mouse interpolation
      currentScrollY += (targetScrollY - currentScrollY) * 0.05;
      mouseX += (targetMouseX - mouseX) * 0.03;
      mouseY += (targetMouseY - mouseY) * 0.03;

      camera.position.x = mouseX * 0.4;
      camera.position.y = -mouseY * 0.4 - currentScrollY * 0.05;

      // Particle Drift
      const positions = starGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < starCount; i++) {
        positions[i * 3] += starVelocities[i].x;
        positions[i * 3 + 1] += starVelocities[i].y;
        positions[i * 3 + 2] += starVelocities[i].z;

        // Wrap around boundary bounds
        if (Math.abs(positions[i * 3]) > 260) positions[i * 3] = -positions[i * 3] * 0.95;
        if (Math.abs(positions[i * 3 + 1]) > 260) positions[i * 3 + 1] = -positions[i * 3 + 1] * 0.95;
        if (Math.abs(positions[i * 3 + 2]) > 160) positions[i * 3 + 2] = -positions[i * 3 + 2] * 0.95;
      }
      starGeometry.attributes.position.needsUpdate = true;

      // Connect Near Neighbors
      let lineIndex = 0;
      const connectionDistance = 45;

      for (let i = 0; i < starCount && lineIndex < maxLineConnections * 6; i++) {
        for (let j = i + 1; j < starCount && lineIndex < maxLineConnections * 6; j++) {
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < connectionDistance) {
            linePositions[lineIndex++] = positions[i * 3];
            linePositions[lineIndex++] = positions[i * 3 + 1];
            linePositions[lineIndex++] = positions[i * 3 + 2];

            linePositions[lineIndex++] = positions[j * 3];
            linePositions[lineIndex++] = positions[j * 3 + 1];
            linePositions[lineIndex++] = positions[j * 3 + 2];
          }
        }
      }

      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.setDrawRange(0, lineIndex / 3);

      starField.rotation.y = 0.00008 * Date.now() * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starGeometry.dispose();
      lineGeometry.dispose();
      starMaterial.dispose();
      lineMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 15%, #071426 0%, #020617 55%, #000000 100%)'
      }}
    />
  );
};
