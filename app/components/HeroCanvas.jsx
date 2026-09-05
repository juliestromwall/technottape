'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * A grid of instanced blocks on a dark ground. At rest they breathe on a slow
 * wave; the pointer pushes them out of the plane and lights them up; scrolling
 * tilts and recedes the whole field.
 *
 * One InstancedMesh, so the whole thing is a single draw call. Degrades to an
 * empty div if WebGL is unavailable — the hero copy sits above it either way.
 */
export default function HeroCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return; // no WebGL — the hero still reads, just without the field
    }
    if (!renderer.getContext()) return;

    const width = () => mount.clientWidth;
    const height = () => mount.clientHeight;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width(), height());
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08080a, 0.085);

    const camera = new THREE.PerspectiveCamera(46, width() / height(), 0.1, 100);
    camera.position.set(0, 1.6, 11);
    camera.lookAt(0, -0.4, 0);

    // ---- grid -------------------------------------------------------------
    const small = window.innerWidth < 900;
    const COLS = small ? 26 : 46;
    const ROWS = small ? 20 : 28;
    const GAP = 0.44;
    const COUNT = COLS * ROWS;

    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshStandardMaterial({
      roughness: 0.42,
      metalness: 0.18,
    });
    const mesh = new THREE.InstancedMesh(geometry, material, COUNT);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    const SAGE = new THREE.Color('#6f9a73');
    const OCHRE = new THREE.Color('#d9a94a');
    const TERRA = new THREE.Color('#cf7350');
    const BASE = new THREE.Color('#1b1b21');

    const home = new Float32Array(COUNT * 2); // x, y of each block
    const tint = [];
    const tmp = new THREE.Object3D();
    const col = new THREE.Color();

    let n = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = (c - (COLS - 1) / 2) * GAP;
        const y = (r - (ROWS - 1) / 2) * GAP;
        home[n * 2] = x;
        home[n * 2 + 1] = y;

        // a few blocks carry brand colour; the rest stay near-black
        const roll = Math.sin(c * 12.9898 + r * 78.233) * 43758.5453;
        const f = roll - Math.floor(roll);
        const accent = f > 0.955 ? TERRA : f > 0.9 ? OCHRE : f > 0.83 ? SAGE : null;
        tint.push(accent);

        col.copy(accent ? accent : BASE);
        mesh.setColorAt(n, col);
        n++;
      }
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    const group = new THREE.Group();
    group.add(mesh);
    group.rotation.x = -0.42;
    scene.add(group);

    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const key = new THREE.DirectionalLight(0xffe6c2, 2.1);
    key.position.set(4, 6, 8);
    scene.add(key);
    const rim = new THREE.PointLight(0xcf7350, 26, 24);
    rim.position.set(-5, -2, 4);
    scene.add(rim);

    // ---- pointer ----------------------------------------------------------
    const pointer = new THREE.Vector2(0, 0);   // where it is
    const smooth = new THREE.Vector2(0, 0);    // where the field thinks it is
    let hasPointer = false;

    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const hit = new THREE.Vector3();

    const onPointer = (e) => {
      const rect = mount.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      ray.setFromCamera(ndc, camera);
      // trace into the tilted grid's own space
      const local = plane.clone().applyMatrix4(group.matrixWorld);
      if (ray.ray.intersectPlane(local, hit)) {
        const p = group.worldToLocal(hit.clone());
        pointer.set(p.x, p.y);
        hasPointer = true;
      }
    };
    const onLeave = () => { hasPointer = false; };

    window.addEventListener('pointermove', onPointer, { passive: true });
    mount.addEventListener('pointerleave', onLeave);

    // ---- scroll -----------------------------------------------------------
    let scrollN = 0;
    const onScroll = () => {
      scrollN = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // ---- resize -----------------------------------------------------------
    const onResize = () => {
      if (!width() || !height()) return;
      camera.aspect = width() / height();
      camera.updateProjectionMatrix();
      renderer.setSize(width(), height());
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    // ---- loop -------------------------------------------------------------
    const REACH = 2.5;
    const t0 = performance.now();
    let raf = 0;
    let running = true;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!running) return;

      const t = (performance.now() - t0) / 1000;

      // drift toward centre when the pointer is away, so it never sits dead
      const tx = hasPointer ? pointer.x : Math.sin(t * 0.32) * 3.2;
      const ty = hasPointer ? pointer.y : Math.cos(t * 0.24) * 1.6;
      smooth.x += (tx - smooth.x) * 0.07;
      smooth.y += (ty - smooth.y) * 0.07;

      for (let i = 0; i < COUNT; i++) {
        const x = home[i * 2];
        const y = home[i * 2 + 1];

        const wave = Math.sin(x * 0.55 + t * 0.85) * Math.cos(y * 0.5 + t * 0.6) * 0.16;

        const dx = x - smooth.x;
        const dy = y - smooth.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const push = Math.max(0, 1 - dist / REACH);
        const lift = push * push * 2.35;

        tmp.position.set(x, y, wave + lift);
        const s = 1 + push * push * 1.5;
        tmp.scale.setScalar(s);
        tmp.rotation.set(lift * 0.7, lift * 0.5, 0);
        tmp.updateMatrix();
        mesh.setMatrixAt(i, tmp.matrix);

        // brand blocks glow as the pointer nears; plain ones lift toward slate
        const accent = tint[i];
        if (accent) col.copy(accent).multiplyScalar(0.55 + push * 1.5);
        else col.copy(BASE).lerp(SAGE, push * 0.5);
        mesh.setColorAt(i, col);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

      group.rotation.x = -0.42 + scrollN * 0.5;
      group.position.y = scrollN * 2.4;
      group.position.z = -scrollN * 5;

      renderer.render(scene, camera);
    };

    if (reduced) {
      // one static frame, no animation loop
      for (let i = 0; i < COUNT; i++) {
        tmp.position.set(home[i * 2], home[i * 2 + 1], 0);
        tmp.scale.setScalar(1);
        tmp.rotation.set(0, 0, 0);
        tmp.updateMatrix();
        mesh.setMatrixAt(i, tmp.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    } else {
      raf = requestAnimationFrame(frame);
    }

    const onVisibility = () => {
      running = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);

    // ---- teardown ---------------------------------------------------------
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      mount.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="hero__canvas" ref={mountRef} aria-hidden="true" />;
}
