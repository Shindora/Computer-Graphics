var sky,skyObj,water, sun,WaterObj;
var horseObj,horse;
var whaleObj,whale;
var morphs = [];
var whales=[];
var mixer=new THREE.AnimationMixer( scene );
var mixer1 = new THREE.AnimationMixer( scene );

const dracoLoader = new THREE.DRACOLoader();

const FLOOR = 0;
var pivotPoint_horse=new THREE.Vector3(-5,0,400);
var pivotPoint_whale=new THREE.Vector3(-5,-50,0);

function newWater()
{
    this.makeWater=function(){
        const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

				water = new THREE.Water(
					waterGeometry,
					{
						textureWidth: 512,
						textureHeight: 512,
						waterNormals: new THREE.TextureLoader().load( 'waternormals.jpg', function ( texture ) {

							texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

						} ),
						sunDirection: new THREE.Vector3(),
						sunColor: 0xffffff,
						waterColor: 0x001e0f,
						distortionScale: 3.7,
						fog: scene.fog !== undefined
					}
				);
        water.rotation.x = - Math.PI / 2;
        scene.add( water );
    }
}WaterObj=new newWater();

function newSunSky(){
    this.makeSky=function(){
    sky = new THREE.Sky();
    sky.scale.setScalar( 10000 );
    scene.add( sky );
    sun = new THREE.Vector3();

    const skyUniforms = sky.material.uniforms;

    skyUniforms[ 'turbidity' ].value = 10;
    skyUniforms[ 'rayleigh' ].value = 2;
    skyUniforms[ 'mieCoefficient' ].value = 0.005;
    skyUniforms[ 'mieDirectionalG' ].value = 0.8;

    const parameters = {
        elevation: 2,
        azimuth: 180
    };

    const pmremGenerator = new THREE.PMREMGenerator( renderer );

    function updateSun() {

        const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
        const theta = THREE.MathUtils.degToRad( parameters.azimuth );

        sun.setFromSphericalCoords( 1, phi, theta );

        sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
        water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

        scene.environment = pmremGenerator.fromScene( sky ).texture;

    }

    updateSun();
}

}skyObj=new newSunSky();

function newHorse(){
    this.makeHorse=function(){
        mixer = new THREE.AnimationMixer( scene );

				function addMorph( horse, clip, speed, duration, x, y, z, fudgeColor ) {

					horse = horse.clone();
					horse.material = horse.material.clone();

					if ( fudgeColor ) {

						horse.material.color.offsetHSL( 0, Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25 );

					}

					horse.speed = speed;

					mixer.clipAction( clip, horse ).
					setDuration( duration ).
					// to shift the playback out of phase:
						startAt( - duration * Math.random() ).
						play();

						horse.position.set( x, y, z );
					horse.rotation.y = Math.PI / 2;

					horse.castShadow = true;
					horse.receiveShadow = true;

					scene.add( horse );

					morphs.push( horse );

				}


				gltfloader.load( "geometries/Horse.glb", function ( gltf ) {

					const horse = gltf.scene.children[ 0 ];

					const clip = gltf.animations[ 0 ];

					addMorph( horse, clip, 550, 1, 100 - 0.1 * 1000, FLOOR, - 300, false );
					addMorph( horse, clip, 550, 1, 100 - 0.2 * 1000, FLOOR, - 450, false );
					addMorph( horse, clip, 550, 1, 100 - 0.3 * 1000, FLOOR, - 600, false );

				} );
    }
    this.delHorse=function(){
        morphs=[];
    }
    

}horseObj=new newHorse();

function newWhale(){
    this.makeWhale=function(){

        dracoLoader.setDecoderPath( '/draco/' );
        gltfloader.setDRACOLoader( dracoLoader );
        gltfloader.load( "killer_whale/scene.gltf", function ( gltf ) {
            whale = gltf.scene.children[ 0 ];
            whale.scale.set( 1, 1, 1 );
            
            scene.add( whale );
            whale.position.set( 100 - 0.3 * 1000, FLOOR-5, - 600 );
            whale.rotation.set(15,0,0);

            mixer1.clipAction( gltf.animations[ 0 ],whale ).setDuration( 1 ).play();
            whales.push(whale) ;

        } );
    }
    this.delWhale=function(){
        whales=[];
    }
}whaleObj=new newWhale();

