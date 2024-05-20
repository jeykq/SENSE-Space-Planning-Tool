import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { useNavigate } from 'react-router-dom';
import AddObjDropdown from './AddObjDropdown';
import ConfirmDialog from '../UI/ConfirmDialog';

const CreateRoom = () => {
  const mountRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const mount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(5, 5, 15); 
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0xccccff);
    mount.appendChild(renderer.domElement);

    // Lighting
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

    // Room Dimensions
    const roomWidth = 10;
    const roomHeight = 5;
    const roomDepth = 10;

    // Materials
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xCCCCCC });
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xAAAAAA });

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Walls
    const wallGeometry = new THREE.PlaneGeometry(roomWidth, roomHeight);

    const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
    backWall.position.z = -roomDepth / 2;
    backWall.position.y = roomHeight / 2;
    scene.add(backWall);

    const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
    frontWall.position.z = roomDepth / 2;
    frontWall.position.y = roomHeight / 2;
    frontWall.rotation.y = Math.PI;
    scene.add(frontWall);

    const sideWallGeometry = new THREE.PlaneGeometry(roomDepth, roomHeight);

    const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    leftWall.position.x = -roomWidth / 2;
    leftWall.position.y = roomHeight / 2;
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    rightWall.position.x = roomWidth / 2;
    rightWall.position.y = roomHeight / 2;
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    // Axes Helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Grid Helper
    const gridHelper = new THREE.GridHelper(roomWidth, 10);
    scene.add(gridHelper);

    // Load 3D Model
    const loadModel = (modelPath, materialPath, position = { x: 0, y: 0, z: 0 }) => {
      const mtlLoader = new MTLLoader();
      mtlLoader.setPath('/src/3D/3Dmodels/sofa-obj');
      mtlLoader.load(materialPath, (materials) => {
        materials.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('/src/3D/3Dmodels/sofa-obj');
        objLoader.load(modelPath, (object) => {
          object.position.set(position.x, position.y, position.z);
          object.scale.set(0.1, 0.1, 0.1); 
          scene.add(object);
          console.log('Model loaded and added to scene:', object);
        }, undefined, (error) => {
          console.error('Error loading model:', error);
        });
      }, undefined, (error) => {
        console.error('Error loading materials:', error);
      });
    };

    // Initial Load for Testing
    loadModel('sofa.obj', 'sofa.mtl', { x: 0, y: 0, z: 0 });

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    // Render Loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    const handleResize = () => {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Drag and Drop Logic
    const handleDrop = (event) => {
      event.preventDefault();
      const modelPath = event.dataTransfer.getData('modelPath');
      const materialPath = event.dataTransfer.getData('materialPath');
      const rect = mount.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const vector = new THREE.Vector3(x, y, 0.5).unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));
      loadModel(modelPath, materialPath, pos);
    };

    const handleDragOver = (event) => {
      event.preventDefault();
    };

    mount.addEventListener('dragover', handleDragOver);
    mount.addEventListener('drop', handleDrop);

    return () => {
      mount.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
      mount.removeEventListener('dragover', handleDragOver);
      mount.removeEventListener('drop', handleDrop);
    };
  }, []);

  const handleDragStart = (event, modelPath, materialPath) => {
    event.dataTransfer.setData('modelPath', modelPath);
    event.dataTransfer.setData('materialPath', materialPath);
  };

  const handleSaveAsTemplate = () => {
    // Logic to save the current room as a template
  };

  const handleImportRoom = () => {
    navigate("/ImportRoom");
    // Logic to import a room
  };

  const [showConfirmExport, setShowConfirmExport] = useState(false);
  const handleExportRoom = () => {
    // Logic to export the current room
    setShowConfirmExport(true)
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-screen" />
      <div className="absolute top-4 left-4 flex flex-col space-y-4">
        <button 
          onClick={handleSaveAsTemplate} 
          className="bg-purple-500 text-white py-2 px-4 rounded-full shadow-lg"
        >
          Save as Template
        </button>
        <button 
          onClick={handleImportRoom} 
          className="bg-blue-500 text-white py-2 px-4 rounded-full shadow-lg"
        >
          Import Room
        </button>
        <button 
          onClick={handleExportRoom} 
          className="bg-red-500 text-white py-2 px-4 rounded-full shadow-lg"
        >
          Export Room
        </button>
        {showConfirmExport && 
          <ConfirmDialog title={"Export this room?"} onConfirm={() => ''} onClose={()=> setShowConfirmExport(false)} />
        }
      </div>
      <div className="flex flex-col mb-2 absolute top-4 right-4">
        <button 
          onClick={toggleDropdown} 
          className="max-w-min text-nowrap ml-auto bg-yellow-500 text-white py-2 px-4 mb-1 rounded-full shadow-lg"
        >
          Add Objects
        </button>
        {showDropdown && (
          <div className="w-[300px]">
            <AddObjDropdown />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateRoom;