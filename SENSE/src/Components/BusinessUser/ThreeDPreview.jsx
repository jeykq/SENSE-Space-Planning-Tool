import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

const ThreeDPreview = ({ objUrl, mtlUrl }) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);

    useEffect(() => {
        if (objUrl && mtlUrl) {
            // Scene setup
            const scene = new THREE.Scene();
            sceneRef.current = scene;

            // Camera setup
            const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
            camera.position.set(5, 5, 15); // Adjust camera position
            camera.lookAt(new THREE.Vector3(0, 0, 0)); // Point camera at origin (0, 0, 0)

            // Renderer setup
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(300, 400); // Set fixed size
            renderer.setClearColor(0xffffff); // Set background color (white)
            containerRef.current.appendChild(renderer.domElement);
            rendererRef.current = renderer;

            // Lighting setup
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);

            const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x444444, 0.6);
            hemisphereLight.position.set(0, 1, 0);
            scene.add(hemisphereLight);

            const directionalLight = new THREE.DirectionalLight(0xffeedd, 0.6);
            directionalLight.position.set(0, 1, 0).normalize();
            scene.add(directionalLight);

            const pointLight = new THREE.PointLight(0xffffff, 1);
            pointLight.position.set(5, 5, 5);
            scene.add(pointLight);

            // Load .mtl and .obj files
            const mtlLoader = new MTLLoader();
            mtlLoader.load(
                mtlUrl,
                (materials) => {
                    materials.preload();
                    const objLoader = new OBJLoader();
                    objLoader.setMaterials(materials);
                    objLoader.load(
                        objUrl,
                        (object) => {
                            scene.add(object);
                            object.position.y = -5; // Adjust object position if necessary
                            animate();
                        },
                        undefined,
                        (error) => {
                            console.error('Error loading OBJ:', error);
                        }
                    );
                },
                undefined,
                (error) => {
                    console.error('Error loading MTL:', error);
                }
            );

            const animate = () => {
                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            };

            animate();

            return () => {
                // Clean up scene and renderer
                if (rendererRef.current) {
                    rendererRef.current.dispose();
                }
                while (containerRef.current.firstChild) {
                    containerRef.current.removeChild(containerRef.current.firstChild);
                }
            };
        }
    }, [objUrl, mtlUrl]);

    return (
        <div ref={containerRef} style={{ width: '300px', height: '400px' }} />
    );
};

export default ThreeDPreview;
