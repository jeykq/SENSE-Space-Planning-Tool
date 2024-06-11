import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const ThreeDPreview = ({ objFileUrl }) => {
    const mountRef = useRef(null);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (!objFileUrl) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.set(205, 155, 205); // Adjusted position for side view
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(500, 500); // Set a fixed size for rendering the 2D image
        mountRef.current.appendChild(renderer.domElement);

        const light = new THREE.AmbientLight(0xffffff);
        scene.add(light);

        const loader = new OBJLoader();
        loader.load(
            objFileUrl,
            (object) => {
                scene.add(object);
                renderer.render(scene, camera);

                // Capture the canvas as a 2D image
                const imgData = renderer.domElement.toDataURL('image/png');
                setImageUrl(imgData);
            },
            undefined,
            (error) => {
                console.error('An error happened', error);
            }
        );

        const handleResize = () => {
            const width = mountRef.current.clientWidth;
            const height = mountRef.current.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            mountRef.current.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, [objFileUrl]);

    return (
        <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
            {imageUrl && <img src={imageUrl} alt="3D Object Preview" style={{ width: '100%', height: 'auto' }} />}
        </div>
    );
};

export default ThreeDPreview;
