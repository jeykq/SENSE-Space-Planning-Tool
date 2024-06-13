import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import AddObjDropdown from './AddObjDropdown';
import ConfirmDialog from '../UI/ConfirmDialog';
import SaveDialogPopup from '../UI/SaveDialogPopup';
import axios from 'axios';

const Room3D = () => {
  const mountRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { templateName, roomType, roomLength, roomWidth, roomHeight } = location.state || {};

  // Debug: log the received state
  console.log("Received state from CreateTemplate:", location.state);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showTransformControls, setShowTransformControls] = useState(false);
  const [showDoneButton, setShowDoneButton] = useState(false);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [objects, setObjects] = useState([]);
  const [selectedObjectIndex, setSelectedObjectIndex] = useState(0);
  const [showEditButton, setShowEditButton] = useState(false);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const transformControlsRef = useRef(null);
  const selectedObjectRef = useRef(null);
  const controlsRef = useRef(null);
  const sceneRef = useRef(null);

  const [categoryData, setCategoryData] = useState(null);
  const [objectListData, setObjectListData] = useState(null);
  const [objListError, setObjListError] = useState(null);
  const [catError, setCatError] = useState(null);
  const [catLoading, setCatLoading] = useState(false);
  const [objListLoading, setObjListLoading] = useState(false);

  // get list of all categories
  useEffect(() => {
      const token = localStorage.getItem('authToken');

      if (!token) {
          navigate('/login');
          return;
      }

      const headers = {
          'Content-Type': 'application/json',
          'sense-token': token
      };
      setCatLoading(true);

      axios.post(
          'https://api.sensespacesplanningtool.com/category/list',
          {},
          { headers: headers }
      )
          .then(response => {
              setCategoryData(response.data);
              setCatError(null); // Reset error state if the request is successful
          })
          .catch(err => {
              setCatError(err.message || 'Something went wrong');
              setCategoryData(err.message); // Reset response state if the request fails
          })
          .finally(() => {
              setCatLoading(false);
          });
  }, [navigate]);

  // get list of all objects
  useEffect(() => {
    const fetchObjData = async () => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            navigate('/login');
            return;
        }

        const headers = { 
            'Content-Type': 'application/json',
            'sense-token': token
        };
        setObjListLoading(true);

        try {
            const response = await axios.post(
                'https://api.sensespacesplanningtool.com/object/list', 
                {},
                { headers: headers }
            );
            setObjectListData(response.data);
            setObjListError(null);
        } catch (err) {
            setObjListError(err.message || 'Something went wrong');
            setObjectListData(null); // Clear object list data if the request fails
            console.error('API Error for ' + name, err); // Log the error for debugging
        } finally {
          setObjListLoading(false);
        }
    };

    fetchObjData();
  }, [navigate]);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      console.error("Mount ref not found");
      return;
    }

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

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

    // Debug: log the room dimensions
    console.log("Room dimensions:", roomLength, roomWidth, roomHeight);

    // Room Dimensions
    const roomW = roomWidth || 12; // Default to 12 if roomWidth is not provided
    const roomH = roomHeight || 5; // Default to 5 if roomHeight is not provided
    const roomD = roomLength || 12; // Default to 12 if roomLength is not provided

    // Materials
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xCCCCCC });
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xAAAAAA });

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(roomW, roomD);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Walls
    const wallGeometry = new THREE.PlaneGeometry(roomW, roomH);

    const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
    backWall.position.z = -roomD / 2;
    backWall.position.y = roomH / 2;
    scene.add(backWall);

    const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
    frontWall.position.z = roomD / 2;
    frontWall.position.y = roomH / 2;
    frontWall.rotation.y = Math.PI;
    scene.add(frontWall);

    const sideWallGeometry = new THREE.PlaneGeometry(roomD, roomH);

    const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    leftWall.position.x = -roomW / 2;
    leftWall.position.y = roomH / 2;
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    rightWall.position.x = roomW / 2;
    rightWall.position.y = roomH / 2;
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    // Axes Helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Grid Helper
    const gridHelper = new THREE.GridHelper(roomW, 10);
    scene.add(gridHelper);

    // TransformControls
    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControlsRef.current = transformControls;
    scene.add(transformControls);

    transformControls.addEventListener('change', () => {
      renderer.render(scene, camera);
    });

    transformControls.addEventListener('dragging-changed', (event) => {
      controlsRef.current.enabled = !event.value;
    });

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;
    controlsRef.current = controls;

    // Load 3D Model
    const loadModel = (modelPath, materialPath, position = { x: 0, y: 0, z: 0 }) => {
      const mtlLoader = new MTLLoader();
      mtlLoader.setPath('/3Dmodels/');
      mtlLoader.load(materialPath, (materials) => {
        materials.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('/3Dmodels/');
        objLoader.load(modelPath, (object) => {
          // Clamp the object's position within the room bounds
          object.position.set(
            Math.max(-roomW / 2, Math.min(roomW / 2, position.x)),
            0,
            Math.max(-roomD / 2, Math.min(roomD / 2, position.z))
          );
          object.scale.set(1, 1, 1);
          object.userData.selectable = true;
          scene.add(object);

          // Add object to the list
          setObjects((prevObjects) => [...prevObjects, object]);

          // Attach transform controls to the object
          transformControls.attach(object);
          selectedObjectRef.current = object;
          setShowTransformControls(true);
          setShowDoneButton(true);
          setShowRemoveButton(true);
          setShowEditButton(false);
          console.log('Model loaded and added to scene:', object);
        }, undefined, (error) => {
          console.error('Error loading model:', error);
        });
      }, undefined, (error) => {
        console.error('Error loading materials:', error);
      });
    };

    // Raycaster for object selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event) => {
      event.preventDefault();
      const rect = mount.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const firstIntersected = intersects[0].object;
        if (firstIntersected.userData.selectable) {
          selectObject(firstIntersected);
        }
      }
    };

    mount.addEventListener('click', onMouseClick);

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
      let pos = camera.position.clone().add(dir.multiplyScalar(distance));

      // Clamp the initial drop position within the room bounds
      pos = new THREE.Vector3(
        Math.max(-roomW / 2, Math.min(roomW / 2, pos.x)),
        0,
        Math.max(-roomD / 2, Math.min(roomD / 2, pos.z))
      );

      loadModel(modelPath, materialPath, pos);
      setShowDropdown(false);
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
      mount.removeEventListener('click', onMouseClick);
    };
  }, [roomLength, roomWidth, roomHeight]);

  const handleDragStart = (event, modelPath, materialPath) => {
    event.dataTransfer.setData('modelPath', modelPath);
    event.dataTransfer.setData('materialPath', materialPath);
    console.log(`Dragging model: ${modelPath} with materials: ${materialPath}`);
  };

  const handleSaveAsTemplate = () => {
    setShowConfirmSave(true);
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

  const setMode = (mode) => {
    if (transformControlsRef.current) {
      transformControlsRef.current.setMode(mode);
    }
  };

  const handleDone = () => {
    if (selectedObjectRef.current) {
      transformControlsRef.current.detach(selectedObjectRef.current);
      selectedObjectRef.current = null;
      setSelectedObjectIndex(0);
      setShowTransformControls(false);
      setShowDoneButton(false);
      setShowRemoveButton(false);
      setShowEditButton(true);
    }
  };

  const handleRemove = () => {
    if (selectedObjectRef.current) {
      sceneRef.current.remove(selectedObjectRef.current);
      transformControlsRef.current.detach(selectedObjectRef.current);
      setObjects(objects.filter(obj => obj !== selectedObjectRef.current));
      selectedObjectRef.current = null;
      setSelectedObjectIndex(0);
      setShowTransformControls(false);
      setShowDoneButton(false);
      setShowRemoveButton(false);
      setShowEditButton(objects.length > 1);
    }
  };

  const selectObject = (object) => {
    if (selectedObjectRef.current) {
      transformControlsRef.current.detach(selectedObjectRef.current);
    }
    transformControlsRef.current.attach(object);
    selectedObjectRef.current = object;
    setShowTransformControls(true);
    setShowDoneButton(true);
    setShowRemoveButton(true);
  };

  const handleNextObject = () => {
    if (objects.length > 0) {
      const newIndex = (selectedObjectIndex + 1) % objects.length;
      setSelectedObjectIndex(newIndex);
      selectObject(objects[newIndex]);
    }
  };

  const handlePreviousObject = () => {
    if (objects.length > 0) {
      const newIndex = (selectedObjectIndex - 1 + objects.length) % objects.length;
      setSelectedObjectIndex(newIndex);
      selectObject(objects[newIndex]);
    }
  };

  const handleSaveAsDraft = () => {
    // Logic to save as draft
    setShowConfirmSave(false);
  };

  const handlePublishTemplate = () => {
    // Logic to publish template
    setShowConfirmSave(false);
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
      <div className="absolute top-4 right-4 flex flex-col space-y-4">
        <button 
          onClick={toggleDropdown} 
          className="bg-yellow-500 text-white py-2 px-4 rounded-full shadow-lg"
        >
          Add Objects
        </button>
        {showDropdown && (
          <div className="w-[300px]">
            <AddObjDropdown handleDragStart={handleDragStart} categoryData={categoryData} objectListData={objectListData} />
          </div>
        )}
        {showEditButton && (
          <button 
            onClick={() => setIsEditMode(!isEditMode)} 
            className="bg-gray-100 text-black py-2 px-4 rounded-full shadow-lg"
          >
            {isEditMode ? 'Exit Edit Mode' : 'Edit Objects'}
          </button>
        )}
        {isEditMode && objects.length > 0 && (
          <div className="flex flex-col space-y-2 mt-1">
            <button 
              onClick={handlePreviousObject} 
              className="bg-gray-100 text-black py-2 px-4 rounded-full shadow-lg mt-1"
            >
              Previous Object
            </button>
            <button 
              onClick={handleNextObject} 
              className="bg-gray-100 text-black py-2 px-4 rounded-full shadow-lg mt-2"
            >
              Next Object
            </button>
          </div>
        )}
        {showTransformControls && (
          <>
          <button 
            onClick={() => setMode('translate')} 
            className="bg-blue-500 text-white py-2 px-4 rounded-full shadow-lg"
          >
            Move
          </button>
          <button 
            onClick={() => setMode('rotate')} 
            className="bg-orange-500 text-white py-2 px-4 rounded-full shadow-lg"
          >
            Rotate
          </button>
          <button 
            onClick={() => setMode('scale')} 
            className="bg-purple-500 text-white py-2 px-4 rounded-full shadow-lg"
          >
            Scale
          </button>
          <button 
            onClick={handleRemove} 
            className="bg-red-500 text-white py-2 px-4 rounded-full shadow-lg"
          >
            Remove
          </button>
          </>
        )}
        {showDoneButton && (
          <button 
              onClick={handleDone} 
              className="bg-indigo-500 text-white py-2 px-4 rounded-full shadow-lg"
            >
              Done
          </button>
        )}
      </div>
      {showConfirmSave && (
        <SaveDialogPopup
          onClose={() => setShowConfirmSave(false)}
          onSaveAsDraft={handleSaveAsDraft}
          onPublishTemplate={handlePublishTemplate}
        />
      )}
    </div>
  );
};

export default Room3D;