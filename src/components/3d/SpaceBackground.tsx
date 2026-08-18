'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const SpaceBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06193E, 0.001);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 200;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Deep Calm Starfield (Frost White & Ice Blue)
    const starCount = 700;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 800;
      starPositions[i + 1] = (Math.random() - 0.5) * 800;
      starPositions[i + 2] = (Math.random() - 0.5) * 600;
      starSizes[i / 3] = Math.random() * 1.6 + 0.6;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

    const starMaterial = new THREE.PointsMaterial({
      color: 0xBAE6FD,
      size: 1.4,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // Frost-Cyan Accents Stars
    const frostCount = 180;
    const frostGeometry = new THREE.BufferGeometry();
    const frostPositions = new Float32Array(frostCount * 3);

    for (let i = 0; i < frostCount * 3; i += 3) {
      frostPositions[i] = (Math.random() - 0.5) * 700;
      frostPositions[i + 1] = (Math.random() - 0.5) * 700;
      frostPositions[i + 2] = (Math.random() - 0.5) * 500;
    }
    frostGeometry.setAttribute('position', new THREE.BufferAttribute(frostPositions, 3));

    const frostMaterial = new THREE.PointsMaterial({
      color: 0x38BDF8,
      size: 1.8,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true
    });
    const frostStars = new THREE.Points(frostGeometry, frostMaterial);
    scene.add(frostStars);

    // Calm Deep Cobalt Lighting
    const ambientLight = new THREE.AmbientLight(0x0A2556, 1.4);
    scene.add(ambientLight);

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

      // Smooth scroll interpolation
      currentScrollY += (targetScrollY - currentScrollY) * 0.05;

      // Gentle, serene rotation
      starField.rotation.y = 0.00012 * Date.now() * 0.05;
      frostStars.rotation.y = 0.00015 * Date.now() * 0.05;

      // Camera drift with scroll
      camera.position.y = -currentScrollY * 0.07;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starGeometry.dispose();
      frostGeometry.dispose();
      starMaterial.dispose();
      frostMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #103374 0%, #0B2556 30%, #07193D 65%, #040E24 100%)'
      }}
    />
  );
};
