import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
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

  const token = localStorage.getItem('authToken');

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
    scene.background = new THREE.Color(0xdfefff);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(5, 5, 15); 
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0xdfefff);
    mount.appendChild(renderer.domElement);

    // Lighting
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Hemisphere Light
    const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x444444, 0.7);
    hemisphereLight.position.set(0, 1, 0);
    scene.add(hemisphereLight);

    // Directional Light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    scene.add(directionalLight);

    // Point Light
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Spot Light
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(15, 20, 10);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.1;
    spotLight.decay = 2;
    spotLight.distance = 200;
    spotLight.castShadow = true;
    scene.add(spotLight);

    // Debug: log the room dimensions
    console.log("Room dimensions:", roomLength, roomWidth, roomHeight);

    // Room Dimensions
    const roomW = roomWidth || 12; // Default to 12 if roomWidth is not provided
    const roomH = roomHeight || 5; // Default to 5 if roomHeight is not provided
    const roomD = roomLength || 12; // Default to 12 if roomLength is not provided

    // Materials
    const floorTexture = new THREE.TextureLoader().load('/textures/hardwood.png');
    const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture });
    const wallTexture = new THREE.TextureLoader().load('/textures/abstractwhite.jpg');
    const wallMaterial = new THREE.MeshBasicMaterial({ map: wallTexture });

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

        // Ensure that materials are not transparent and have full opacity
        for (let materialName in materials.materials) {
          const material = materials.materials[materialName];
          material.transparent = false;
          material.opacity = 1.0;
        }

        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('/3Dmodels/');
        objLoader.load(modelPath, (object) => {
          // Calculate the bounding box of the loaded object
      const boundingBox = new THREE.Box3().setFromObject(object);
      const size = boundingBox.getSize(new THREE.Vector3());
      
      // Calculate the scaling factor to fit the object within the room
      const maxDimension = Math.max(size.x, size.y, size.z);
      const scale = Math.min(roomW / maxDimension, roomH / maxDimension, roomD / maxDimension) * 0.5;
      object.scale.set(scale, scale, scale);

      // Recalculate the bounding box after scaling
      const scaledBoundingBox = new THREE.Box3().setFromObject(object);
      const scaledSize = scaledBoundingBox.getSize(new THREE.Vector3());

      // Adjust the position of the object to fit within the room bounds
      const adjustedPosition = {
        x: Math.max(-roomW / 2 + scaledSize.x / 2, Math.min(roomW / 2 - scaledSize.x / 2, position.x)),
        y: Math.max(0, position.y),
        z: Math.max(-roomD / 2 + scaledSize.z / 2, Math.min(roomD / 2 - scaledSize.z / 2, position.z))
      };
      object.position.set(adjustedPosition.x, adjustedPosition.y, adjustedPosition.z);
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

  async function convertToGLB(objectsData) {
    const exporter = new GLTFExporter();
  
    // Create a Three.js scene to hold the objects
    const scene = new THREE.Scene();
  
    // Function to load each OBJ model and add to the scene
    function loadOBJModel(obj) {
      return new Promise((resolve, reject) => {
        const loader = new OBJLoader();
        loader.load(obj.modelPath, (object) => {
          object.position.set(obj.position.x, obj.position.y, obj.position.z);
          scene.add(object);
          resolve();
        }, undefined, reject);
      });
    }
  
    // Load all OBJ models sequentially
    try {
      for (const obj of objectsData) {
        await loadOBJModel(obj);
      }
  
      // Export scene to GLB format
      return new Promise((resolve, reject) => {
        exporter.parse(scene, (glb) => {
          resolve(glb);
        }, { binary: true }, reject);
      });
    } catch (error) {
      console.error('Error converting to GLB:', error);
      throw error;
    }
  }

  const handlePublishTemplate = async (e) => {
    e.preventDefault();

      try {
        const glbData = await convertToGLB(objects);

        const glbFileName = `${templateName}.glb`;

        const response = await fetch('https://api.sensespacesplanningtool.com/template/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'sense-token': token
          },
          body: JSON.stringify({
            "name": templateName,
            "dimension": {
                "width": roomWidth,
                "height": roomHeight,
                "length": roomLength
            },
            "room_type_id": roomType
          }),
        });

        const TemplateURL = `https://sense-wholly-locally-top-blowfish.s3.ap-southeast-1.amazonaws.com/room/${templateName}/${glbFileName}`;

        await axios.put(
          TemplateURL,
          glbData,
          {
              headers: {
                  'Content-Type': 'model/gltf-binary',
              },
          }
      );
  
        if (response.ok) {
          setShowAlert(true);
          console.log('Template successfully published!');
        } else {
          const errorData = await response.json();
          console.error('Template publishing failed:', errorData);
        }
      } catch (error) {
        console.error('Error converting to GLB or uploading:', error);
        setShowConfirmSave(false);
      }

      setShowConfirmSave(false);
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-screen" />
      <div className="absolute top-4 left-4 flex flex-col space-y-4">
        <button 
          onClick={handleSaveAsTemplate} 
          className="bg-purple-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-purple-600 transition duration-100"
        >
          Save as Template
        </button>
        <button 
          onClick={handleImportRoom} 
          className="bg-blue-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-100"
        >
          Import Room
        </button>
        <button 
          onClick={handleExportRoom} 
          className="bg-red-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-red-600 transition duration-100"
        >
          Export Room
        </button>
        {showConfirmExport && 
          <ConfirmDialog title={"Export this room?"} onConfirm={() => ''} onClose={()=> setShowConfirmExport(false)} />
        }
        <button 
          onClick={() => navigate('/BusinessUserHomepage')} 
          className="bg-white text-black py-2 px-4 rounded-full shadow-lg hover:bg-gray-100 transition duration-100"
        >
          Exit
        </button>
      </div>
      <div className="absolute top-4 right-4 flex flex-col space-y-4">
        <button 
          onClick={toggleDropdown} 
          className="bg-yellow-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-yellow-600 transition duration-100"
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
            className="bg-white text-black py-2 px-4 rounded-full shadow-lg hover:bg-gray-100 transition duration-100"
          >
            {isEditMode ? 'Exit Edit Mode' : 'Edit Objects'}
          </button>
        )}
        {isEditMode && objects.length > 0 && (
          <div className="flex flex-col space-y-2 mt-1">
            <button 
              onClick={handlePreviousObject} 
              className="bg-white text-black py-2 px-4 rounded-full shadow-lg mt-1 hover:bg-gray-100 transition duration-100"
            >
              Previous Object
            </button>
            <button 
              onClick={handleNextObject} 
              className="bg-white text-black py-2 px-4 rounded-full shadow-lg mt-2 hover:bg-gray-100 transition duration-100"
            >
              Next Object
            </button>
          </div>
        )}
        {showTransformControls && (
          <>
          <button 
            onClick={() => setMode('translate')} 
            className="bg-blue-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-100"
          >
            Move
          </button>
          <button 
            onClick={() => setMode('rotate')} 
            className="bg-orange-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-orange-700 transition duration-100"
          >
            Rotate
          </button>
          <button 
            onClick={() => setMode('scale')} 
            className="bg-purple-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-purple-600 transition duration-100"
          >
            Scale
          </button>
          <button 
            onClick={handleRemove} 
            className="bg-red-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-red-600 transition duration-100"
          >
            Remove
          </button>
          </>
        )}
        {showDoneButton && (
          <button 
              onClick={handleDone} 
              className="bg-indigo-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-indigo-700 transition duration-100"
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