var scene = new THREE.Scene();

var camera=new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 1, 8000 );;
var renderer = new THREE.WebGLRenderer({alpha: true,premultipliedAlpha: false});
var meshObj,planeObj,mesh,plane,wireplane;
var control, orbit,dragCtrl;
var envObj;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var texture;
var flag_translate=false,flag_rotate=false,flag_scale=false;
var light, lightHelper;
var lightObj,clock;
var GUIvisible=false;
var Lightvisible=false;
var spherelight;
var Light1=false;

var animate1=false;
var animate2=false;
var animate3=false;
var animate4=false;
var animate5=false;
var carObj;

var speed = 0.01;
var gui= new dat.GUI();
var pivotPoint;


texture = new THREE.TextureLoader().load( "plane.png");
light = new THREE.PointLight(0xffffff, 10, 10000);



class MinMaxGUIHelper {
    constructor(obj, minProp, maxProp, minDif) {
      this.obj = obj;
      this.minProp = minProp;
      this.maxProp = maxProp;
      this.minDif = minDif;
    }
    get min() {
      return this.obj[this.minProp];
    }
    set min(v) {
      this.obj[this.minProp] = v;
      this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
    }
    get max() {
      return this.obj[this.maxProp];
    }
    set max(v) {
      this.obj[this.maxProp] = v;
      this.min = this.min;  // this will call the min setter
    }
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function rotateAboutPoint(obj, point, axis, theta, pointIsWorld){
      pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;
      if(pointIsWorld){
      obj.parent.localToWorld(obj.position); // compensate for world coordinate
      }
      obj.position.sub(point); // remove the offset
      obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
      obj.position.add(point); // re-add the offset

      if(pointIsWorld){
      obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
      }

      obj.rotateOnWorldAxis(axis, theta); // rotate the OBJECT
      }
function updateCamera() {
camera.updateProjectionMatrix();
}
function addGUI(){
  if (GUIvisible==true)
  return;
  /*
  var guiControls = new function() {this.color = mesh.material.color.getStyle();};
		

  gui.addColor(guiControls, "color").listen().onChange(function(e) {
  mesh.material.color.setStyle(e);})*/
  var guiControls = new function() {this.color = meshObj.color  ;};
		

  gui.addColor(guiControls, "color").name("Color object").listen().onChange(function(e) {
    meshObj.color =e;
    mesh.material.color.set(e);
    bodyMaterial.color.set(e);
    //meshObj.update();
  })
  var guilight = new function() {this.color = lightObj.color  ;};
  gui.addColor(guilight, "color").name("Color light").listen().onChange(function(e) {
    lightObj.color =e;
    if (Lightvisible==true)
    {//dragCtrl.detach(light);
    //lightObj.updateLight(light);
    light.children[0].material.color.set(e);
    light.color=new THREE.Color(e);

    //dragCtrl.attach(light); 
  }
  })
  const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);

  myCamera = 
{
  Camera : "Camera frustum"

}
  gui.add(myCamera, "Camera");

//var f2 = gui.addFolder('Camera');
  gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
  gui.add(minMaxGUIHelper, 'min', 0.1, 600, 1).name('near').onChange(updateCamera);
  gui.add(minMaxGUIHelper, 'max', 10, 8000, 1).name('far').onChange(updateCamera);
      GUIvisible=true;
 }
