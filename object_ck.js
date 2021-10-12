const loaderfbx = new THREE.FBXLoader();
var isattach=false;
var isCreate=false;
var isLoaded=false;
var isLoaded_chess=false;
var rabbit_geo;
var chess_geo;
const drcLoader = new THREE.DRACOLoader();
drcLoader.setDecoderPath( '/draco/' );
drcLoader.setDecoderConfig( { type: 'js' } );
const gltfloader = new THREE.GLTFLoader();
function load_chess(){
	gltfloader.load( "ChessPieceKing.glb", function ( gltf ) {
	chess_geo = gltf.scene.children[ 0 ].geometry;
	isLoaded_chess=true;
} );
}
load_chess();
/*
const objloader = new THREE.OBJLoader();
function load_bunny2(){
	objloader.load( 'bunny.obj', function ( obj ) {

		object = obj;
		object.traverse( function ( child ) {

		if ( child.isMesh ) 
		{rabbit_geo=child.geometry;
		isLoaded=true;}

		} );
	} );}*/
const stlloader = new THREE.STLLoader();

function load_bunny(){
	stlloader.load( 'Stanford_Bunny.stl', function ( geometry ) {
		geometry.computeVertexNormals();

		rabbit_geo=geometry;
		isLoaded=true;
		//drcLoader.dispose();
	});
}
/*
function load_bunny1(){
	loaderfbx.load( 'stanford-bunny.fbx', function ( object ) {
		rabbit_geo=object.children[ 0 ].geometry;
		isLoaded=true;
	});

}*/
load_bunny();


function newGeometry(i){
	var geoArray=[new THREE.BoxGeometry(meshObj.cubeW,meshObj.cubeH,meshObj.cubeD,meshObj.cubeW/10,meshObj.cubeH/10,meshObj.cubeD/10),
		new THREE.SphereGeometry( meshObj.sphereR, meshObj.sphereH, meshObj.sphereW ),
		new THREE.CylinderGeometry( meshObj.cylinR, meshObj.cylinR, meshObj.cylinH,parseInt(meshObj.cylinR), meshObj.cylinH/10),
		new THREE.TorusKnotGeometry( 50, 15, 100, 40  ),
		new THREE.TeapotGeometry( 100, 15),
		new THREE.ConeGeometry( 50, 200, 32,20 ),
		new THREE.TorusGeometry( 100, 30, 16, 100 ),
		new THREE.TetrahedronGeometry( 100, 1 ),
		new THREE.OctahedronGeometry( 100, 1 ),
		new THREE.DodecahedronGeometry( 100, 1 ),
		new THREE.IcosahedronGeometry( 100, 1 ),
		rabbit_geo,
		chess_geo	];
	return geoArray[i];
}
function newMaterial(i,color_mat){
	
	// load a resource
	var matArray=[new THREE.MeshBasicMaterial({ color: color_mat }),
		new THREE.PointsMaterial({ color: color_mat, size: 3 }),
		new THREE.MeshBasicMaterial( { wireframe: true,color: color_mat} ),
		new THREE.MeshBasicMaterial( { map: texture,color: color_mat } ),
		new THREE.MeshPhongMaterial({ color: color_mat })
	];
	return matArray[i];
}

function newObject(){

	this.geometry = 0;
	this.material = 0;
	this.cubeW=150;
	this.cubeD=150;
	this.cubeH=150;
	this.sphereR=100;
	this.sphereH=40;
	this.sphereW=40;
	this.cylinR=100;
	this.cylinH=200;
	this.color=0xffffff;

	this.make = function(){
		scene.remove(mesh); 
		if (this.material==1){mesh=new THREE.Points(new newGeometry(this.geometry),new newMaterial(this.material,this.color),100);}
		else if (this.material==4){mesh=new THREE.Mesh(new newGeometry(this.geometry),new newMaterial(this.material,this.color)); mesh.castShadow = true;}
		else  {mesh=new THREE.Mesh(new newGeometry(this.geometry),new newMaterial(this.material,this.color));}
		if (this.geometry==12) pivotPoint=new THREE.Vector3((mesh.position.x+mesh.scale.x/2500*200),0,(0));
		else if (this.geometry==11) pivotPoint=new THREE.Vector3((mesh.position.x+mesh.scale.x/1.5*200),0,(0));
		else
		pivotPoint=new THREE.Vector3((mesh.position.x+mesh.scale.x*200),0,(0));
		if (this.geometry==11) mesh.scale.setScalar( 0.3);

		//mesh.color=this.color;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		mesh.scale.setScalar(1 );

		scene.add(mesh);
	}
	this.update= function(){
		
		scene.remove(mesh); 
		var temp_mesh;
		var mesh_before;
		
		if (this.material==1){temp_mesh=new THREE.Points(new newGeometry(this.geometry),new newMaterial(this.material,this.color),100);}
		else if (this.material==4){temp_mesh=new THREE.Mesh(new newGeometry(this.geometry),new newMaterial(this.material,this.color)); mesh.castShadow = true; mesh.receiveShadow = true;}
		else  {temp_mesh=new THREE.Mesh(new newGeometry(this.geometry),new newMaterial(this.material,this.color));}

		temp_mesh.position.setX(mesh.position.x);
		temp_mesh.position.setY(mesh.position.y);
		temp_mesh.position.setZ(mesh.position.z);
		temp_mesh.scale.setX(mesh.scale.x);
		temp_mesh.scale.setY(mesh.scale.y);
		temp_mesh.scale.setZ(mesh.scale.z);
		temp_mesh.rotation.x=mesh.rotation._x;
		temp_mesh.rotation.y=mesh.rotation._y;
		temp_mesh.rotation.z=mesh.rotation._z;
		mesh=temp_mesh.clone();
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		if (this.geometry==11) 
		{mesh.rotation.x= -Math.PI/2;} 
		else {mesh.rotation.x=0;}
		if (this.geometry==12) mesh.scale.setScalar( 2500 );
		else if (this.geometry==11) mesh.scale.setScalar( 1.5 );
		else mesh.scale.setScalar(1 );
		if (this.geometry==12) {
			pivotPoint=new THREE.Vector3((mesh.position.x+mesh.scale.x/2500*200),0,(0));
		}
		else if (this.geometry==11) pivotPoint=new THREE.Vector3((mesh.position.x+mesh.scale.x/1.5*200),0,(0));
		else
		pivotPoint=new THREE.Vector3((mesh.position.x+mesh.scale.x*200),0,(0));

		scene.add(mesh);
	}
	
}
meshObj=new newObject();


function newEnv(){
	this.makeEnv=function(){
		wireplane = new THREE.InfiniteGridHelper(10000, 100);
		scene.add(wireplane);

	}
} envObj= new newEnv();
function newPlane(){
	this.togglePlane = true;
	this.texture = 7;
	this.repeat = 80;
	this.scale = 30;
	this.toggleWireframe = true;
	this.w_line = 1;
	this.w_scale = 30;
	this.opacity=0.3;
	this.makePlane = function() {
		pgeometry = new THREE.PlaneGeometry( 1000, 1000, 20, 20 );
		pmaterial = new THREE.MeshPhongMaterial({ color: 'rgb(50, 50, 50)' });
		//pmaterial = new THREE.ShadowMaterial( { color: 'rgb(0, 0, 0)' , opacity: 0.25, side: THREE.DoubleSide } );
		pmaterial.side=THREE.DoubleSide;
		plane = new THREE.Mesh( pgeometry, pmaterial );
		plane.rotation.x = - Math.PI / 2;
		plane.receiveShadow = true;
		plane.scale.set( 30, 30, 30 );
		scene.add( plane );

	};
	
} planeObj = new newPlane();

function newLight()
{
	this.color=0xffffff;
	this.makeLight=function(){
		
		scene.remove(light);
		light.dispose();
		light = new THREE.PointLight(this.color, 10, 10000);
		light.position.set( 150, 150, 150 );
		var geometry = new THREE.SphereGeometry(10, 24, 24);
		var material = new THREE.MeshBasicMaterial({
			color: this.color
		});
		spherelight = new THREE.Mesh(
			geometry,
			material 
		);
		light.castShadow = true;
		light.add(spherelight);
		Lightvisible=true;

		scene.add( light );
		
		//lightHelper=new THREE.PointLightHelper( light, 15 );
		//scene.add( lightHelper );
	}
	this.updateLight=function(light_t){
		
		scene.remove(light);
		light.dispose();
		light = new THREE.PointLight(this.color, 10, 10000);
		light.position.set( light_t.position.x, light_t.position.y, light_t.position.z );
		var geometry = new THREE.SphereGeometry(10, 24, 24);
		var material = new THREE.MeshBasicMaterial({
			color: this.color
		});
		spherelight = new THREE.Mesh(
			geometry,
			material 
		);
		light.castShadow = true;
		light.add(spherelight);
		Lightvisible=true;

		scene.add( light );
		
	}

		
	this.removeLight=function(){
		scene.remove(light);
		scene.remove(plane);
		Lightvisible=false;
		Light1=false;

	}
		
}lightObj = new newLight();