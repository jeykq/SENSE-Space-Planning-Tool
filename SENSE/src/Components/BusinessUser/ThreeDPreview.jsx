import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeDPreview = ({ objUrl, mtlUrl, onRenderComplete }) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        if (objUrl && mtlUrl) {
            console.log('Loading OBJ URL:', objUrl);
            console.log('Loading MTL URL:', mtlUrl);

            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0xdfefff);
            sceneRef.current = scene;

            const aspectRatio = containerRef.current.clientWidth / containerRef.current.clientHeight;
            const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
            camera.position.set(0, 5, 10);
            camera.lookAt(new THREE.Vector3(0, 0, 0));
            cameraRef.current = camera;

            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
            renderer.setClearColor(0xdfefff);
            containerRef.current.appendChild(renderer.domElement);
            rendererRef.current = renderer;

            const controls = new OrbitControls(camera, renderer.domElement);
            controlsRef.current = controls;

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
            scene.add(ambientLight);

            const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x444444, 0.7);
            hemisphereLight.position.set(0, 1, 0);
            scene.add(hemisphereLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(0, 10, 10);
            directionalLight.castShadow = true;
            scene.add(directionalLight);

            const mtlLoader = new MTLLoader();
            mtlLoader.load(
                mtlUrl,
                (materials) => {
                    console.log('MTL loaded:', materials);
                    materials.preload();
                    const objLoader = new OBJLoader();
                    objLoader.setMaterials(materials);
                    objLoader.load(
                        objUrl,
                        (object) => {
                            console.log('OBJ loaded:', object);
                            scene.add(object);

                            const box = new THREE.Box3().setFromObject(object);
                            const center = box.getCenter(new THREE.Vector3());
                            const size = box.getSize(new THREE.Vector3());
                            const maxDim = Math.max(size.x, size.y, size.z);

                            object.position.sub(center);
                            const distance = maxDim / (2 * Math.atan(Math.PI / 360 * camera.fov));
                            camera.position.set(0, distance / 2, distance * 1.2);
                            camera.lookAt(new THREE.Vector3(0, 0, 0));

                            animate();
                            if (onRenderComplete) {
                                onRenderComplete();
                            }
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
                controls.update();
                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            };

            animate();

            return () => {
                if (rendererRef.current) {
                    rendererRef.current.dispose();
                }
                while (containerRef.current.firstChild) {
                    containerRef.current.removeChild(containerRef.current.firstChild);
                }
            };
        }
    }, [objUrl, mtlUrl, onRenderComplete]);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    );
};

export default ThreeDPreview;