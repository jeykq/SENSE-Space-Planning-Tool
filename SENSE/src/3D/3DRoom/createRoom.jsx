import React from 'react'

const CreateRoom = () => {
  return (
    <div>
      <h1>Create 3D room page</h1>
      
    </div>
  )
  var scene, camera, renderer;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 2000 );
        camera.position.z = 250;

        // Adjust ambient light intensity
        var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Adjust hemisphere light colors and intensity
        var hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x444444, 0.6);
        hemisphereLight.position.set(0, 1, 0);
        scene.add(hemisphereLight);

        // Adjust directional light intensity and position
        var directionalLight = new THREE.DirectionalLight(0xffeedd, 0.6);
        directionalLight.position.set(0, 1, 0).normalize();
        scene.add(directionalLight);

        var mesh = null;

        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.load('sofa-obj/sofa.mtl', function(materials) {
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('sofa-obj/sofa.obj', function(object) {
                mesh = object;
                scene.add(mesh);
            });
        });

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xccccff);
        document.body.appendChild(renderer.domElement);

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', renderer);

        animate();

        function animate() {
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }

}

export default CreateRoom
