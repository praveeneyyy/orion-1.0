'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Trophy3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00bcf2, 3);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x22d3ee, 2);
    dirLight2.position.set(-5, -5, 2);
    scene.add(dirLight2);

    // Trophy Mesh Group
    const group = new THREE.Group();

    // Metallic material with azure reflections
    const cupMaterial = new THREE.MeshStandardMaterial({
      color: 0x00bcf2,
      metalness: 0.85,
      roughness: 0.15,
      emissive: 0x0078d4,
      emissiveIntensity: 0.35
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xbae6fd,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x00bcf2,
      emissiveIntensity: 0.4
    });

    // Trophy Cup Geometry (Lathe)
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0, -1.2));
    points.push(new THREE.Vector2(0.8, -1.2));
    points.push(new THREE.Vector2(0.3, -0.6));
    points.push(new THREE.Vector2(0.2, 0.0));
    points.push(new THREE.Vector2(0.9, 0.8));
    points.push(new THREE.Vector2(1.1, 1.4));
    points.push(new THREE.Vector2(1.05, 1.5));
    points.push(new THREE.Vector2(0.85, 0.8));
    points.push(new THREE.Vector2(0.1, 0.0));

    const latheGeo = new THREE.LatheGeometry(points, 32);
    const cupMesh = new THREE.Mesh(latheGeo, cupMaterial);
    group.add(cupMesh);

    // Floating Star Crown on top
    const starGeo = new THREE.OctahedronGeometry(0.4, 0);
    const starMesh = new THREE.Mesh(starGeo, goldMaterial);
    starMesh.position.y = 1.9;
    group.add(starMesh);

    // Glowing Halo Rings
    const ringGeo = new THREE.TorusGeometry(1.4, 0.025, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.85 });
    const ringMesh1 = new THREE.Mesh(ringGeo, ringMat);
    ringMesh1.rotation.x = Math.PI / 3;
    group.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(ringGeo, ringMat);
    ringMesh2.rotation.x = -Math.PI / 3;
    group.add(ringMesh2);

    scene.add(group);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      group.rotation.y += 0.012;
      starMesh.rotation.y += 0.03;
      ringMesh1.rotation.z += 0.01;
      ringMesh2.rotation.z -= 0.015;

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
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className={`w-full h-full min-h-[260px] ${className}`} />;
};
