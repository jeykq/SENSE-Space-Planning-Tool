import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const ThreeDPreview = ({ objFile }) => {
    const mountRef = useRef(null);
    const camera = useRef(null);
    const renderer = useRef(null);

    useEffect(() => {
        if (!objFile) return;

        const scene = new THREE.Scene();
        camera.current = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.current.position.set(200, 150, 200); // Adjusted position for side view
        camera.current.lookAt(0, 0, 0);

        renderer.current = new THREE.WebGLRenderer({ antialias: true });
        renderer.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        mountRef.current.appendChild(renderer.current.domElement);

        const light = new THREE.AmbientLight(0xffffff);
        scene.add(light);

        const loader = new OBJLoader();
        loader.load(
            objFile,
            (object) => {
                scene.add(object);
                animate();
            },
            undefined,
            (error) => {
                console.error('An error happened', error);
            }
        );

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.current.render(scene, camera.current);
        };

        const handleResize = () => {
            const width = mountRef.current.clientWidth;
            const height = mountRef.current.clientHeight;
            renderer.current.setSize(width, height);
            camera.current.aspect = width / height;
            camera.current.updateProjectionMatrix();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            mountRef.current.removeChild(renderer.current.domElement);
            renderer.current.dispose();
        };
    }, [objFile]);

    return <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'relative' }} />;
};

export default ThreeDPreview;
