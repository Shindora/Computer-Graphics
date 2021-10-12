var mouse = {
  x: 0,
  y: 0
};

function onMouseMove(event) {

    // Update the mouse variable
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
    // Make the sphere follow the mouse
    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(camera);
    var dir = vector.sub(camera.position).normalize();
    var distance = -camera.position.z / dir.z;
    var pos = camera.position.clone().add(dir.multiplyScalar(distance));
    //mouseMesh.position.copy(pos);
    //light.position.copy(new THREE.Vector3(event.clientX, event.clientY, pos.z+2));

    light.position.copy(new THREE.Vector3(pos.x, pos.y, pos.z+10));
   // light.position.copy(new THREE.Vector3(mouse.x, mouse.y, pos.z));
  };