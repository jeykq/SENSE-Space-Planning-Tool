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
            scene.background = new THREE.Color(0xdfefff); // Match background color
            sceneRef.current = scene;

            // Camera setup
            const aspectRatio = containerRef.current.clientWidth / containerRef.current.clientHeight;
            const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
            camera.position.set(0, 5, 10); // Adjust camera position to be higher and further back
            camera.lookAt(new THREE.Vector3(0, 0, 0)); // Point camera at origin (0, 0, 0)

            // Renderer setup
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
            renderer.setClearColor(0xdfefff); // Set background color
            containerRef.current.appendChild(renderer.domElement);
            rendererRef.current = renderer;

            // Lighting setup
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
            scene.add(ambientLight);

            const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x444444, 0.7);
            hemisphereLight.position.set(0, 1, 0);
            scene.add(hemisphereLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(0, 10, 10);
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = 1024;
            directionalLight.shadow.mapSize.height = 1024;
            directionalLight.shadow.camera.near = 0.5;
            directionalLight.shadow.camera.far = 500;
            scene.add(directionalLight);

            const pointLight = new THREE.PointLight(0xffffff, 1);
            pointLight.position.set(5, 5, 5);
            scene.add(pointLight);

            const spotLight = new THREE.SpotLight(0xffffff, 1);
            spotLight.position.set(15, 20, 10);
            spotLight.angle = Math.PI / 6;
            spotLight.penumbra = 0.1;
            spotLight.decay = 2;
            spotLight.distance = 200;
            spotLight.castShadow = true;
            scene.add(spotLight);

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

                            // Center the object
                            const box = new THREE.Box3().setFromObject(object);
                            const center = box.getCenter(new THREE.Vector3());
                            const size = box.getSize(new THREE.Vector3());
                            const maxDim = Math.max(size.x, size.y, size.z);

                            // Adjust object position and camera
                            object.position.sub(center);
                            const distance = maxDim / (2 * Math.atan(Math.PI / 360 * camera.fov));
                            camera.position.set(0, distance / 2, distance * 1.2);
                            camera.lookAt(new THREE.Vector3(0, 0, 0));

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
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    );
};

export default ThreeDPreview;
