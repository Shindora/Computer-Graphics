dracoLoader.setDecoderPath( '/draco/gltf/' );
var grid;
const bodyMaterial = new THREE.MeshPhysicalMaterial( {
    color: 0xffffff, metalness: 0.6, roughness: 0.4, clearcoat: 0.05, clearcoatRoughness: 0.05
} );
var carModel;
const wheels = [];
var driver;

function newCar()
{
    this.makeCar=function(){
        const pmremGenerator = new THREE.PMREMGenerator( renderer );
        renderer.outputEncoding = THREE.sRGBEncoding;

        scene.environment = pmremGenerator.fromScene( new THREE.RoomEnvironment() ).texture;
        scene.fog = new THREE.Fog( 0xeeeeee, 1, 3000 );
        scene.add( new THREE.HemisphereLight( 0xfffffff, 0x111122 ) );
        // Textures

        const txtloader = new THREE.CubeTextureLoader();
        txtloader.setPath( '/Bridge2/' );

        textureCube = txtloader.load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
        textureCube.encoding = THREE.sRGBEncoding;

        scene.background = textureCube;
        const shadow_car = new THREE.TextureLoader().load( 'ferrari_ao.png' );
        

        const detailsMaterial = new THREE.MeshStandardMaterial( {
            color: 0x0000ff, metalness: 1.0, roughness: 0.5
        } );

        const glassMaterial = new THREE.MeshPhysicalMaterial( {
            color: 0xffffff, metalness: 0, roughness: 0.1, transmission: 0.9, transparent: true
        } );


        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath( '/draco/gltf/' );

        const loader = new THREE.GLTFLoader();
        loader.setDRACOLoader( dracoLoader );

        
        const stlloader = new THREE.STLLoader();

        stlloader.load( '/GTR_Driver_only.stl', function ( geometry ) {

            driver = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: 0xfffffff, specular: 0x111111, shininess: 200 } ) );

            driver.castShadow = true;
            driver.receiveShadow = true;
            driver.scale.setScalar(50);
            driver.position.set(0,-90,50);
            driver.rotation.x=-1.8;
            driver.rotation.z=3.1;
            scene.add( driver );

        } );
        loader.load( '/ferrari.glb', function ( gltf ) {

            carModel = gltf.scene.children[ 0 ];

            carModel.getObjectByName( 'body' ).material = bodyMaterial;

            carModel.getObjectByName( 'rim_fl' ).material = detailsMaterial;
            carModel.getObjectByName( 'rim_fr' ).material = detailsMaterial;
            carModel.getObjectByName( 'rim_rr' ).material = detailsMaterial;
            carModel.getObjectByName( 'rim_rl' ).material = detailsMaterial;
            carModel.getObjectByName( 'trim' ).material = detailsMaterial;

            carModel.getObjectByName( 'glass' ).material = glassMaterial;

            wheels.push(
                carModel.getObjectByName( 'wheel_fl' ),
                carModel.getObjectByName( 'wheel_fr' ),
                carModel.getObjectByName( 'wheel_rl' ),
                carModel.getObjectByName( 'wheel_rr' )
            );

            // shadow
            const mesh = new THREE.Mesh(
                new THREE.PlaneGeometry( 0.655 * 4, 1.3 * 4 ),
                new THREE.MeshBasicMaterial( {
                    map: shadow_car, blending: THREE.MultiplyBlending, toneMapped: false, transparent: true
                } )
            );
            mesh.rotation.x = - Math.PI / 2;
            mesh.renderOrder = 2;
            carModel.add( mesh );
            //control.attach(driver);
            //control.setMode( 'rotate' );

            carModel.scale.setScalar(50);
            carModel.position.set(0,-100,0);
            carModel.position.set(0,-100,0);
            scene.add( carModel );

        } );

    }
}carObj=new newCar();
