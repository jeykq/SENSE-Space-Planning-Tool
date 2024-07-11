import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import AddObjDropdown from './AddObjDropdown';
import ConfirmDialog from '../UI/ConfirmDialog';
import SaveDialogPopup from '../UI/SaveDialogPopup';
import AlertPopup from '../UI/AlertPopup';
import axios from 'axios';

const Room3D = () => {
  const mountRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { templateName, roomType, roomLength, roomWidth, roomHeight, roomLayoutUrl } = location.state || {};

  const [showDropdown, setShowDropdown] = useState(false);
  const [objects, setObjects] = useState([]);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [isObjectSelected, setIsObjectSelected] = useState(false);
  const [currentMode, setCurrentMode] = useState(null); // State to keep track of current mode of the object (rotate/scale)
  const selectedObjectRef = useRef(null);
  const controlsRef = useRef(null);
  const sceneRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const dragOffsetRef = useRef(new THREE.Vector3());
  const planeRef = useRef(new THREE.Plane());
  const intersectedRef = useRef(null);
  const transformControlsRef = useRef(null);
  const isTransformingRef = useRef(false); // Reference state to track if TransformControl is active

  const [categoryData, setCategoryData] = useState(null);
  const [objectListData, setObjectListData] = useState(null);
  const [objListError, setObjListError] = useState(null);
  const [catError, setCatError] = useState(null);
  const [catLoading, setCatLoading] = useState(false);
  const [objListLoading, setObjListLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');

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
    let scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdfefff);
    sceneRef.current = scene;

    // Camera
    let camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(5, 5, 15);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Renderer
    let renderer = new THREE.WebGLRenderer({ antialias: true });
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

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;
    controlsRef.current = controls;

    // Transform Controls
    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControlsRef.current = transformControls;
    transformControls.addEventListener('change', () => renderer.render(scene, camera));
    transformControls.addEventListener('dragging-changed', (event) => {
      controls.enabled = !event.value;
    });
    transformControls.addEventListener('mouseDown', () => {
      isTransformingRef.current = true; // Set transforming flag
    });
    transformControls.addEventListener('mouseUp', () => {
      isTransformingRef.current = false; // Reset transforming flag
    });
    scene.add(transformControls);

    // View Template from roomLayoutUrl
    if (roomLayoutUrl != null) {
      fetch(roomLayoutUrl)
        .then(response => response.arrayBuffer())
        .then(data => {
          const loader = new GLTFLoader();
          loader.parse(data, '', (glb) => {
            scene.add(glb.scene);
            console.log("Model loaded:", glb.scene);
          });
        })
        .catch(error => {
          console.error('Error loading GLB:', error);
        });
    }

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
            y: Math.max(0, position.y),  // Keep objects above the floor
            z: Math.max(-roomD / 2 + scaledSize.z / 2, Math.min(roomD / 2 - scaledSize.z / 2, position.z))
          };
          object.position.set(adjustedPosition.x, adjustedPosition.y, adjustedPosition.z);
          object.userData.selectable = true; // Set selectable on the parent group
          scene.add(object);

          // Add object to the list
          setObjects((prevObjects) => [...prevObjects, object]);

          console.log('Model loaded and added to scene:', object);
        }, undefined, (error) => {
          console.error('Error loading model:', error);
        });
      }, undefined, (error) => {
        console.error('Error loading materials:', error);
      });
    };

    const onMouseDown = (event) => {
      if (isTransformingRef.current) return; // Ignore if interacting with transform controls

      event.preventDefault();
      const rect = mount.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      console.log('Mouse down at:', mouseRef.current);

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let firstIntersected = intersects[0].object;

        // Traverse up to the selectable parent
        while (firstIntersected && !firstIntersected.userData.selectable && firstIntersected.parent) {
          firstIntersected = firstIntersected.parent;
        }

        if (firstIntersected && firstIntersected.userData.selectable) {
          controls.enabled = false; // Disable controls
          selectObject(firstIntersected);
          planeRef.current.setFromNormalAndCoplanarPoint(
            camera.getWorldDirection(planeRef.current.normal),
            firstIntersected.position
          );
          const intersectPoint = new THREE.Vector3();
          raycasterRef.current.ray.intersectPlane(planeRef.current, intersectPoint);
          dragOffsetRef.current.copy(intersectPoint).sub(firstIntersected.position);
          intersectedRef.current = firstIntersected;
          setIsObjectSelected(true);
          console.log('Object selected:', firstIntersected);
        } else {
          deselectObject();
          console.log('Object not selectable:', firstIntersected);
        }
      } else {
        deselectObject();
        console.log('No intersecting objects found');
      }
    };

    const onMouseMove = (event) => {
      if (intersectedRef.current) {
        const rect = mount.getBoundingClientRect();
        mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycasterRef.current.setFromCamera(mouseRef.current, camera);
        const intersectPoint = new THREE.Vector3();
        raycasterRef.current.ray.intersectPlane(planeRef.current, intersectPoint);
        const newPosition = intersectPoint.sub(dragOffsetRef.current);

        // Clamp the new position within the room bounds and fix the y position
        newPosition.x = Math.max(-roomW / 2, Math.min(roomW / 2, newPosition.x));
        newPosition.y = intersectedRef.current.position.y; // Keep y position fixed
        newPosition.z = Math.max(-roomD / 2, Math.min(roomD / 2, newPosition.z));

        intersectedRef.current.position.copy(newPosition);
      } else {
        const rect = mount.getBoundingClientRect();
        mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycasterRef.current.setFromCamera(mouseRef.current, camera);
        const intersects = raycasterRef.current.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
          let firstIntersected = intersects[0].object;

          // Traverse up to the selectable parent
          while (firstIntersected && !firstIntersected.userData.selectable && firstIntersected.parent) {
            firstIntersected = firstIntersected.parent;
          }

          if (firstIntersected && firstIntersected.userData.selectable) {
            mount.style.cursor = 'pointer';
          } else {
            mount.style.cursor = 'default';
          }
        } else {
          mount.style.cursor = 'default';
        }
      }
    };

    const onMouseUp = () => {
      if (intersectedRef.current) {
        console.log('Object released:', intersectedRef.current);
        intersectedRef.current = null;
        controls.enabled = true; // Re-enable controls
      }
    };

    mount.addEventListener('mousedown', onMouseDown);
    mount.addEventListener('mousemove', onMouseMove);
    mount.addEventListener('mouseup', onMouseUp);

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
      mount.removeEventListener('mousedown', onMouseDown);
      mount.removeEventListener('mousemove', onMouseMove);
      mount.removeEventListener('mouseup', onMouseUp);
    };
  }, [roomLength, roomWidth, roomHeight, roomLayoutUrl]);

  const handleDragStart = (event, modelPath, materialPath) => {
    event.dataTransfer.setData('modelPath', modelPath);
    event.dataTransfer.setData('materialPath', materialPath);
    console.log(`Dragging model: ${modelPath} with materials: ${materialPath}`);
  };

  const handleSaveAsTemplate = () => {
    setShowConfirmSave(true);
  };

  const handleImportRoom = () => {
    // Logic to import a room
    navigate("/ImportRoom");
  };

  const [showConfirmExport, setShowConfirmExport] = useState(false);
  const handleExportRoom = () => {
    // Logic to export the current room
    setShowConfirmExport(true)
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleRemove = () => {
    if (selectedObjectRef.current) {
      sceneRef.current.remove(selectedObjectRef.current);
      setObjects(objects.filter(obj => obj !== selectedObjectRef.current));
      selectedObjectRef.current = null;
      setIsObjectSelected(false);
      transformControlsRef.current.detach();
      setCurrentMode(null); // Reset current mode
    }
  };

  const handleModeChange = (mode) => {
    if (selectedObjectRef.current) {
      setCurrentMode(mode);
      transformControlsRef.current.setMode(mode);
      transformControlsRef.current.attach(selectedObjectRef.current);
    }
  };

  const selectObject = (object) => {
    selectedObjectRef.current = object;
    setIsObjectSelected(true);
    console.log('Object selected:', object);

    // If a mode is currently selected, attach the transform controls
    if (currentMode) {
      transformControlsRef.current.setMode(currentMode);
      transformControlsRef.current.attach(object);
    }
  };

  const deselectObject = () => {
    setIsObjectSelected(false);
    selectedObjectRef.current = null;
    transformControlsRef.current.detach(); // Detach transform controls
    setCurrentMode(null); // Reset current mode
  };

  const handleSaveAsDraft = () => {
    // Logic to save as draft
    setShowConfirmSave(false);
  };

  // Publish Template Functions
  async function convertToGLB(scene) {
    const exporter = new GLTFExporter();

    // Export scene to GLB format
    return new Promise((resolve, reject) => {
      exporter.parse(scene, (glb) => {
        resolve(glb);
      }, { binary: true }, reject);
    });
  }

  const handlePublishTemplate = async (e) => {
    e.preventDefault();

    try {
      if (!sceneRef.current) {
        throw new Error("Scene not available");
      }

      const glbData = await convertToGLB(sceneRef.current);

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

      if (response.ok) {
        const responseData = await response.json();
        const TemplateURL = responseData && responseData.body ? responseData.body.room_layout.room_layout : null;

        if (TemplateURL) {
          await axios.put(
            TemplateURL,
            glbData,
            {
              headers: {
                'Content-Type': 'model/gltf-binary',
                'Content-Disposition': 'attachment',
              },
            }
          );

          if (response.status >= 200 && response.status < 300) {
            setAlertType('save');
            setShowAlert(true);
            console.log('Template successfully published!');
          } else {
            console.error('Template uploading failed:', response);
          }
        } else {
          console.error('Template URL is not available in the response:', responseData);
        }
      } else {
        const errorData = await response.json();
        console.error('Template publishing failed:', errorData);
      }
    } catch (error) {
      console.error('Error converting to GLB or uploading:', error);
    }

    setShowConfirmSave(false);
  };

  // Update Template Function
  const handleUpdateTemplate = async (e) => {
    e.preventDefault();

    try {
      if (!sceneRef.current) {
        throw new Error("Scene not available");
      }

      const glbData = await convertToGLB(sceneRef.current);

      await axios.put(
        roomLayoutUrl,
        glbData,
        {
          headers: {
            'Content-Type': 'model/gltf-binary',
            'Content-Disposition': 'attachment',
          },
        }
      );

      setAlertType('update');
      setShowAlert(true);
    } catch (error) {
      console.error('Error converting to GLB or updating:', error);
    }

    setShowConfirmSave(false);
  }

  const handleClose = () => {
    setShowAlert(false);
  };

  const handleOk = () => {
    setShowAlert(false);
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-screen cursor-default" />
      <div className="absolute top-4 left-4 flex flex-col space-y-4">
        {roomLayoutUrl ? (
          <button
            onClick={handleUpdateTemplate}
            className="bg-purple-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-purple-600 transition duration-100"
          >
            Update Template
          </button>
        ) : (
          <button
            onClick={handleSaveAsTemplate}
            className="bg-purple-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-purple-600 transition duration-100"
          >
            Save as Template
          </button>
        )}
        {showAlert && (
          <AlertPopup
            title={templateName}
            text={alertType === 'update' ? 'Template updated successfully!' : 'Template published successfully!'}
            onClose={handleClose}
            onOk={handleOk}
          />
        )}
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
          <ConfirmDialog title={"Export this room?"} onConfirm={() => ''} onClose={() => setShowConfirmExport(false)} />
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
        {isObjectSelected && (
          <>
            <button
              onClick={() => handleModeChange('rotate')}
              className="bg-blue-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-100"
            >
              Rotate
            </button>
            <button
              onClick={() => handleModeChange('scale')}
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