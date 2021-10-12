var scene,camera,renderer,controls;
var scene=new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth/window.innerHeight,
	1,
	1000
);
camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 5;

camera.lookAt(new THREE.Vector3(0, 0, 0));

function addGUI(){
    var gui=new dat.GUI();

	var obj = { add:function(){ console.log("clicked") }};
	gui.add(obj,'add');
	
    return object;
}



renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('rgb(0, 0, 0)',0);
document.getElementById('webgl').appendChild(renderer.domElement);
