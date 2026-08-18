'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const EarthRadar3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Inner Core Sphere (Deep Cobalt)
    const innerGeo = new THREE.SphereGeometry(2.1, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x07193D,
      transparent: true,
      opacity: 0.95
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    globeGroup.add(inner);

    // Outer Wireframe Grid (Sky Azure)
    const wireGeo = new THREE.SphereGeometry(2.2, 24, 18);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wire);

    // Coordinate Point calculation: lat 12.8731° N, lon 80.2210° E (Chennai)
    const lat = 12.8731 * (Math.PI / 180);
    const lon = 80.2210 * (Math.PI / 180);
    const radius = 2.22;

    const x = radius * Math.cos(lat) * Math.sin(lon);
    const y = radius * Math.sin(lat);
    const z = radius * Math.cos(lat) * Math.cos(lon);

    // Beacon Pin Mesh
    const beaconGroup = new THREE.Group();
    beaconGroup.position.set(x, y, z);
    globeGroup.add(beaconGroup);

    const pinGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0x38BDF8 });
    const pin = new THREE.Mesh(pinGeo, pinMat);
    beaconGroup.add(pin);

    // Radiating Radar Rings from Chennai
    const radarRingGeo = new THREE.RingGeometry(0.08, 0.12, 32);
    const radarRingMat = new THREE.MeshBasicMaterial({
      color: 0xBAE6FD,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const radarRing = new THREE.Mesh(radarRingGeo, radarRingMat);
    radarRing.lookAt(x * 2, y * 2, z * 2);
    beaconGroup.add(radarRing);

    // Laser Beam pointing upward from Chennai
    const laserPoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1.2)];
    const laserGeo = new THREE.BufferGeometry().setFromPoints(laserPoints);
    const laserMat = new THREE.LineBasicMaterial({ color: 0x38BDF8, transparent: true, opacity: 0.9 });
    const laser = new THREE.Line(laserGeo, laserMat);
    laser.lookAt(x * 2, y * 2, z * 2);
    beaconGroup.add(laser);

    // Satellite Orbit Ring
    const orbitGeo = new THREE.RingGeometry(2.9, 2.93, 64);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0x60A5FA,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const orbit = new THREE.Mesh(orbitGeo, orbitMat);
    orbit.rotation.x = Math.PI * 0.4;
    orbit.rotation.y = Math.PI * 0.15;
    scene.add(orbit);

    // Satellite Mesh
    const satGroup = new THREE.Group();
    const satBody = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.08), new THREE.MeshBasicMaterial({ color: 0xFFFFFF }));
    const satPanel1 = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.06), new THREE.MeshBasicMaterial({ color: 0x38BDF8, side: THREE.DoubleSide }));
    satPanel1.position.x = 0.14;
    const satPanel2 = satPanel1.clone();
    satPanel2.position.x = -0.14;
    satGroup.add(satBody, satPanel1, satPanel2);
    scene.add(satGroup);

    // Cross-Device Drag & Touch Interaction
    let isDragging = false;
    let previousPosition = { x: 0, y: 0 };

    const onStart = (posX: number, posY: number) => {
      isDragging = true;
      previousPosition = { x: posX, y: posY };
    };

    const onMove = (posX: number, posY: number) => {
      if (!isDragging) return;
      const deltaX = posX - previousPosition.x;
      const deltaY = posY - previousPosition.y;

      globeGroup.rotation.y += deltaX * 0.01;
      globeGroup.rotation.x += deltaY * 0.01;

      previousPosition = { x: posX, y: posY };
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
        globeGroup.rotation.y = elapsed * 0.25;
      }

      // Radar pulse scaling
      const scale = 1 + (elapsed % 1.5) * 3;
      radarRing.scale.set(scale, scale, scale);
      radarRingMat.opacity = Math.max(0, 1 - (elapsed % 1.5) / 1.5);

      // Orbiting Satellite
      const satAngle = elapsed * 0.8;
      const satR = 2.915;
      const sx = satR * Math.cos(satAngle);
      const sz = satR * Math.sin(satAngle);
      const sy = Math.sin(satAngle) * 0.5;

      satGroup.position.set(sx, sy, sz);
      satGroup.rotation.y = -satAngle;

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
    <div className="relative w-full aspect-square max-w-[340px] mx-auto flex items-center justify-center select-none cursor-grab active:cursor-grabbing touch-none">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-2 left-2 text-[9px] font-mono-hud text-[#38BDF8] bg-[#040E24] px-2 py-0.5 rounded-none border border-[#38BDF8]/40 pointer-events-none">
        TARGET: CHENNAI 12.8731° N, 80.2210° E
      </div>
      <div className="absolute bottom-2 inset-x-0 text-center text-[8px] font-mono-hud text-[#7DD3FC] pointer-events-none">
        [ 3D ORBITAL RADAR • DRAG / TOUCH TO ROTATE ]
      </div>
    </div>
  );
};
