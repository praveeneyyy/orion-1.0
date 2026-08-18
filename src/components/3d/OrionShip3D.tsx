'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const OrionShip3D: React.FC = () => {
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

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    const cyanLight = new THREE.PointLight(0x38BDF8, 3, 20);
    cyanLight.position.set(5, 5, 5);
    scene.add(cyanLight);

    const blueLight = new THREE.PointLight(0x0B2556, 3, 20);
    blueLight.position.set(-5, -5, -2);
    scene.add(blueLight);

    const shipGroup = new THREE.Group();
    scene.add(shipGroup);

    // Fuselage / Hull (Fuselage Diamond Needle)
    const hullGeo = new THREE.ConeGeometry(0.8, 3.6, 6);
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x07193D,
      metalness: 0.85,
      roughness: 0.2,
      flatShading: true
    });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.rotation.x = Math.PI / 2;
    shipGroup.add(hull);

    // Hull Wireframe Overlay (Azure Glow)
    const hullWireMat = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const hullWire = new THREE.Mesh(hullGeo, hullWireMat);
    hullWire.rotation.x = Math.PI / 2;
    hullWire.scale.set(1.02, 1.02, 1.02);
    shipGroup.add(hullWire);

    // Cockpit Cockpit Visor
    const cockpitGeo = new THREE.ConeGeometry(0.35, 1.2, 4);
    const cockpitMat = new THREE.MeshBasicMaterial({
      color: 0xBAE6FD,
      wireframe: true
    });
    const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
    cockpit.rotation.x = Math.PI / 2;
    cockpit.position.set(0, 0.35, 0.5);
    shipGroup.add(cockpit);

    // Swept Delta Wings (Left & Right)
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(2.2, -1.2);
    wingShape.lineTo(1.8, -1.8);
    wingShape.lineTo(0, -1.0);
    wingShape.lineTo(0, 0);

    const extrudeSettings = { depth: 0.06, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
    const wingGeo = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x0B2556,
      metalness: 0.9,
      roughness: 0.3,
    });

    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.set(0, 0, 0.2);
    leftWing.rotation.x = Math.PI / 2;
    leftWing.rotation.z = -Math.PI / 2;
    shipGroup.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.set(0, 0, 0.2);
    rightWing.rotation.x = Math.PI / 2;
    rightWing.rotation.z = Math.PI / 2;
    rightWing.scale.y = -1;
    shipGroup.add(rightWing);

    // Ion Thruster Plumes
    const plumeGeo = new THREE.ConeGeometry(0.22, 1.2, 8);
    const plumeMat = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      transparent: true,
      opacity: 0.85
    });

    const leftPlume = new THREE.Mesh(plumeGeo, plumeMat);
    leftPlume.position.set(0.4, 0, -2.1);
    leftPlume.rotation.x = -Math.PI / 2;
    shipGroup.add(leftPlume);

    const rightPlume = new THREE.Mesh(plumeGeo, plumeMat);
    rightPlume.position.set(-0.4, 0, -2.1);
    rightPlume.rotation.x = -Math.PI / 2;
    shipGroup.add(rightPlume);

    // Orbiting Sensor Ring
    const sensorGeo = new THREE.TorusGeometry(1.6, 0.015, 16, 64);
    const sensorMat = new THREE.MeshBasicMaterial({
      color: 0x60A5FA,
      transparent: true,
      opacity: 0.5
    });
    const sensorRing = new THREE.Mesh(sensorGeo, sensorMat);
    sensorRing.position.set(0, 0, 0);
    shipGroup.add(sensorRing);

    // Cross-Device Interaction (Mouse + Touch)
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

      shipGroup.rotation.y += deltaX * 0.01;
      shipGroup.rotation.x += deltaY * 0.01;

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
        shipGroup.rotation.y = Math.sin(elapsed * 0.6) * 0.35 + 0.2;
        shipGroup.rotation.x = Math.cos(elapsed * 0.4) * 0.15 - 0.1;
        shipGroup.position.y = Math.sin(elapsed * 1.8) * 0.12;
      }

      // Ion plume flicker animation
      const plumeScale = 0.8 + Math.random() * 0.4;
      leftPlume.scale.set(plumeScale, plumeScale * 1.2, plumeScale);
      rightPlume.scale.set(plumeScale, plumeScale * 1.2, plumeScale);

      sensorRing.rotation.z = elapsed * 1.5;

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
    <div className="relative w-full h-[280px] sm:h-[340px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing touch-none">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-2 right-2 text-[9px] font-mono-hud text-[#38BDF8] bg-[#040E24] px-2 py-0.5 rounded-none border border-[#38BDF8]/40 pointer-events-none">
        VESSEL: ORION-1 EXPLORER PROBE
      </div>
      <div className="absolute bottom-2 inset-x-0 text-center text-[8px] sm:text-[9px] font-mono-hud text-[#7DD3FC] pointer-events-none">
        [ 3D SPACECRAFT INTERACTION • DRAG / TOUCH TO ROTATE ]
      </div>
    </div>
  );
};
