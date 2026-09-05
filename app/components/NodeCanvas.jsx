'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * A drifting field of nodes that link up when they come close, and lean
 * toward the pointer. Deliberately a different idea from the hero's block
 * grid: this one is about things being connected rather than stacked.
 *
 * Points + one LineSegments buffer, so it stays cheap. Degrades to nothing
 * if WebGL is unavailable; renders a single still frame under reduced motion.
 */
export default function NodeCanvas({ count = 88, className = 'scene__canvas' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    if (!renderer.getContext()) return;

    const w = () => mount.clientWidth;
    const h = () => mount.clientHeight;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w(), h());
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, w() / h(), 0.1, 100);
    camera.position.z = 15;

    const N = window.innerWidth < 900 ? Math.round(count * 0.55) : count;
    const SPREAD_X = 20;
    const SPREAD_Y = 11;
    const SPREAD_Z = 5;
    const LINK = 3.5;      // distance at which two nodes connect
    const REACH = 5.5;     // pointer influence radius

    const pos = new Float32Array(N * 3);
    const vel = new Float32Array(N * 3);
    const home = new Float32Array(N * 3);
    const colors = new Float32Array(N * 3);

    const SAGE = new THREE.Color('#6f9a73');
    const OCHRE = new THREE.Color('#d9a94a');
    const TERRA = new THREE.Color('#cf7350');
    const PALE = new THREE.Color('#5a544c');
    const c = new THREE.Color();

    for (let i = 0; i < N; i++) {
      const x = (Math.random() - 0.5) * SPREAD_X;
      const y = (Math.random() - 0.5) * SPREAD_Y;
      const z = (Math.random() - 0.5) * SPREAD_Z;
      pos.set([x, y, z], i * 3);
      home.set([x, y, z], i * 3);
      vel.set(
        [(Math.random() - 0.5) * 0.004, (Math.random() - 0.5) * 0.004, 0],
        i * 3
      );
      const r = Math.random();
      c.copy(r > 0.93 ? TERRA : r > 0.84 ? OCHRE : r > 0.7 ? SAGE : PALE);
      colors.set([c.r, c.g, c.b], i * 3);
    }

    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pointGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const points = new THREE.Points(
      pointGeo,
      new THREE.PointsMaterial({
        size: 0.17,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        sizeAttenuation: true,
      })
    );
    scene.add(points);

    // links: worst case is every pair, but in practice far fewer
    const MAX = N * 7;
    const linePos = new Float32Array(MAX * 6);
    const lineCol = new Float32Array(MAX * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineCol, 3));
    const lines = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.5 })
    );
    scene.add(lines);

    // ---- pointer ----
    const ptr = new THREE.Vector3(999, 999, 0);
    const ndc = new THREE.Vector2();
    const ray = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    let has = false;

    const onMove = (e) => {
      const r = mount.getBoundingClientRect();
      if (e.clientY < r.top - 200 || e.clientY > r.bottom + 200) {
        has = false;
        return;
      }
      ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(plane, ptr)) has = true;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const onResize = () => {
      if (!w() || !h()) return;
      camera.aspect = w() / h();
      camera.updateProjectionMatrix();
      renderer.setSize(w(), h());
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    let raf = 0;
    let running = true;

    const step = () => {
      for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        pos[i3] += vel[i3];
        pos[i3 + 1] += vel[i3 + 1];

        // gentle spring back home so the field never drifts apart
        pos[i3] += (home[i3] - pos[i3]) * 0.0016;
        pos[i3 + 1] += (home[i3 + 1] - pos[i3 + 1]) * 0.0016;

        if (has) {
          const dx = ptr.x - pos[i3];
          const dy = ptr.y - pos[i3 + 1];
          const d = Math.hypot(dx, dy);
          if (d < REACH && d > 0.001) {
            const pull = (1 - d / REACH) * 0.012;
            pos[i3] += dx * pull;
            pos[i3 + 1] += dy * pull;
          }
        }
      }
      pointGeo.attributes.position.needsUpdate = true;

      // rebuild links
      let n = 0;
      for (let i = 0; i < N && n < MAX; i++) {
        const i3 = i * 3;
        for (let j = i + 1; j < N && n < MAX; j++) {
          const j3 = j * 3;
          const dx = pos[i3] - pos[j3];
          const dy = pos[i3 + 1] - pos[j3 + 1];
          const d = Math.hypot(dx, dy);
          if (d > LINK) continue;

          const near = has
            ? Math.max(
                0,
                1 - Math.hypot(ptr.x - pos[i3], ptr.y - pos[i3 + 1]) / (REACH * 1.5)
              )
            : 0;
          const f = (1 - d / LINK) * (0.3 + near * 1.5);

          const o = n * 6;
          linePos[o] = pos[i3];
          linePos[o + 1] = pos[i3 + 1];
          linePos[o + 2] = pos[i3 + 2];
          linePos[o + 3] = pos[j3];
          linePos[o + 4] = pos[j3 + 1];
          linePos[o + 5] = pos[j3 + 2];

          const g = Math.min(1, f);
          lineCol[o] = 0.42 * g + near * 0.5;
          lineCol[o + 1] = 0.44 * g + near * 0.36;
          lineCol[o + 2] = 0.4 * g + near * 0.12;
          lineCol[o + 3] = lineCol[o];
          lineCol[o + 4] = lineCol[o + 1];
          lineCol[o + 5] = lineCol[o + 2];
          n++;
        }
      }
      lineGeo.setDrawRange(0, n * 2);
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (running) step();
    };

    if (reduced) step();
    else raf = requestAnimationFrame(frame);

    const onVis = () => {
      running = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
      pointGeo.dispose();
      lineGeo.dispose();
      points.material.dispose();
      lines.material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [count]);

  return <div className={className} ref={mountRef} aria-hidden="true" />;
}
