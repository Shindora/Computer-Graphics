  var
  ASSETS_PATH = '/assets/',
  DEFAULT = 'default',
  IMAGE_SD = 'sd',
  IMAGE_HD = 'hd',
  COLOR_WHITE = 0xffffff,
  COLOR_BLACK = 0x000000;

/**
 * Utils
 */
var Utils = {
  windowRatio: function() {
    return window.innerWidth / window.innerHeight;
  }
};
var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('rgb(120, 120, 120)');
document.getElementById('webgl').appendChild(renderer.domElement);

/**
 * Skymap
 */
var Skymap = (function() {
  var _Skymap = function() {
    var self = this;

    var paramsDefault = function() {
      return {
        imgDef: IMAGE_SD,
        imgDefPrevious: undefined,
        cubeTextureLoader: {
          positionTag: '{pos}',
          positions: ['posx', 'negx', 'posy', 'negy', 'posz', 'negz'],
          filename: {
            sd: 'skymap_{pos}_512x512.jpg',
            hd: 'skymap_{pos}_512x512.jpg'
          }
        }
      };
    };

    var params = paramsDefault();

    this.init = function() {};

    this.setParamImgDef = function(imgDef) {
      params.imgDef = imgDef || paramsDefault().imgDef;
    };

    this.setSceneBgCubeTexture = function(_scene, imgDef) {
      this.setParamImgDef(imgDef);
      if (this.doesRefreshTextureNecessary()) {
        _scene.background = this.getCubeTextureLoader();
        this.disableRefreshTexture();
      }
    };

    this.getCubeTextureLoader = function() {
      return new THREE.CubeTextureLoader()
        .setPath(ASSETS_PATH)
        .load(this.getFilenames());
    };

    this.getFilenames = function() {
      var filenames = [];

      for (var i = 0; i < params.cubeTextureLoader.positions.length; i++) {
        filenames.push(
          this.getFilename(params.cubeTextureLoader.positions[i])
        );
      }

      return filenames;
    };

    this.getFilename = function(position) {
      return params.cubeTextureLoader.filename[params.imgDef].replace(
        params.cubeTextureLoader.positionTag,
        position
      );
    };

    this.doesRefreshTextureNecessary = function() {
      return params.imgDef !== params.imgDefPrevious;
    };

    this.disableRefreshTexture = function() {
      params.imgDefPrevious = params.imgDef;
    };

    this.init();
  };

  return new _Skymap();
})();

/**
 * Cloud
 */
var Cloud = (function() {
  var _Cloud = function() {
    var self = this;

    var paramsDefault = function() {
      return {
        imgDef: IMAGE_SD,
        imgDefPrevious: undefined,
        visible: true,
        material: {
          wireframe: false,
          transparent: true,
          color: COLOR_WHITE,
          bumpScale: 0.13,
          opacity: 0.9,
          alphaMap: {
            sd: ASSETS_PATH + 'earth_clouds_1024x512.jpg',
            //hd: ASSETS_PATH + 'earth_clouds_2048x1024.jpg'
          },
          bumpMap: {
            sd: ASSETS_PATH + 'earth_clouds_1024x512.jpg',
            //hd: ASSETS_PATH + 'earth_clouds_2048x1024.jpg'
          }
        },
        geometry: {
          radius: 50.3,
          widthSegments: 64,
          heightSegments: 32
        },
        animate: {
          enabled: true,
          rotationsYPerSecond: -0.0012
        }
      };
    };

    var params = paramsDefault();

    this.init = function() {
      this.material = new THREE.MeshPhongMaterial({
        wireframe: params.material.wireframe,
        color: params.material.color,
        opacity: params.material.opacity,
        transparent: params.material.transparent,
        bumpScale: params.material.bumpScale
      });

      this.setMaterialTextures();

      this.geometry = new THREE.SphereGeometry(
        params.geometry.radius,
        params.geometry.widthSegments,
        params.geometry.heightSegments
      );

      this.cloudMesh = new THREE.Mesh(this.geometry, this.material);
      this.cloudMesh.visible = params.visible;
    };

    this.animate = function(delta) {
      if (params.animate.enabled) {
        this.cloudMesh.rotation.y += delta * 2 * Math.PI * params.animate.rotationsYPerSecond;
      }
    };

    this.setParamImgDef = function(imgDef) {
      params.imgDef = imgDef || paramsDefault().imgDef;
    };

    this.setMaterialTextures = function(imgDef) {
      this.setParamImgDef(imgDef);

      if (this.doesRefreshTextureNecessary()) {
        this.material.alphaMap = new THREE.TextureLoader().load(params.material.alphaMap[params.imgDef]);
        this.material.bumpMap = new THREE.TextureLoader().load(params.material.bumpMap[params.imgDef]);
        this.disableRefreshTexture();
      }
    };

    this.doesRefreshTextureNecessary = function() {
      return params.imgDef !== params.imgDefPrevious;
    };

    this.disableRefreshTexture = function() {
      params.imgDefPrevious = params.imgDef;
    };

    this.init();
  };

  return new _Cloud();
})();

/**
 * Earth
 */
var Earth = (function(Cloud) {
  var _Earth = function() {
    var self = this;

    var paramsDefault = function() {
      return {
        imgDef: IMAGE_SD,
        imgDefPrevious: undefined,
        visible: true,
        material: {
          wireframe: false,
          map: {
            sd: ASSETS_PATH + 'earth_map_1024x512.jpg',
            hd: ASSETS_PATH + 'earth_map_1024x512.jpg'
          },
          bumpMap: {
            sd: ASSETS_PATH + 'earth_bump_1024x512.jpg',
            hd: ASSETS_PATH + 'earth_bump_1024x512.jpg'
          },
          bumpScale: 0.45,
          specularMap: {
            sd: ASSETS_PATH + 'earth_specular_1024x512.jpg',
            hd: ASSETS_PATH + 'earth_specular_1024x512.jpg'
          },
          specular: 0x2d4ea0,
          shininess: 6
        },
        geometry: {
          radius: 50,
          widthSegments: 64,
          heightSegments: 32
        },
        animate: {
          enabled: true,
          rotationsYPerSecond: 0.01
        }
      };
    };

    var params = paramsDefault();

    this.init = function() {
      this.geometry = new THREE.SphereGeometry(
        params.geometry.radius,
        params.geometry.widthSegments,
        params.geometry.heightSegments
      );

      this.material = new THREE.MeshPhongMaterial({
        wireframe: params.material.wireframe,
        bumpScale: params.material.bumpScale,
        specular: params.material.specular,
        shininess: params.material.shininess
      });

      this.setMaterialTextures();

      this.earthMesh = new THREE.Mesh(this.geometry, this.material);
      this.earthMesh.visible = params.visible;

      this.earthMesh.add(Cloud.cloudMesh);
    };

    this.animate = function(delta) {
      if (params.animate.enabled) {
        this.earthMesh.rotation.y += delta * 2 * Math.PI * params.animate.rotationsYPerSecond;
      }
    };

    this.setParamImgDef = function(imgDef) {
      params.imgDef = imgDef || paramsDefault().imgDef;
    };

    this.setMaterialTextures = function(imgDef) {
      this.setParamImgDef(imgDef);

      if (this.doesRefreshTextureNecessary()) {
        this.material.map = new THREE.TextureLoader().load(params.material.map[params.imgDef]);
        this.material.bumpMap = new THREE.TextureLoader().load(params.material.bumpMap[params.imgDef]);
        this.material.specularMap = new THREE.TextureLoader().load(params.material.specularMap[params.imgDef]);
        this.disableRefreshTexture();
      }
    };

    this.doesRefreshTextureNecessary = function() {
      return params.imgDef !== params.imgDefPrevious;
    };

    this.disableRefreshTexture = function() {
      params.imgDefPrevious = params.imgDef;
    };

    this.init();
  };

  return new _Earth();
})(Cloud);

/**
 * Moon
 */
var Moon = (function(Earth) {
  var _Moon = function() {
    var self = this;

    var paramsDefault = function() {
      return {
        imgDef: IMAGE_SD,
        imgDefPrevious: undefined,
        moonMesh: {
          visible: true,
          position: {
            x: 0,
            y: 0,
            z: -100,
          },
        },
        material: {
          wireframe: false,
          map: {
            sd: ASSETS_PATH + 'moon_map_512x256.jpg',
            hd: ASSETS_PATH + 'moon_map_512x256.jpg'
          },
          bumpMap: {
            sd: ASSETS_PATH + 'moon_bump_512x256.jpg',
            hd: ASSETS_PATH + 'moon_bump_512x256.jpg'
          },
          bumpScale: 0.1,
          shininess: 0
        },
        geometry: {
          radius: 10,
          widthSegments: 32,
          heightSegments: 16
        },
        animate: {
          enabled: true,
          pivotRotationsPerSecond: 0.05
        }
      };
    };

    var params = paramsDefault();

    this.init = function() {
      this.geometry = new THREE.SphereGeometry(
        params.geometry.radius,
        params.geometry.widthSegments,
        params.geometry.heightSegments
      );

      this.material = new THREE.MeshPhongMaterial({
        wireframe: params.material.wireframe,
        bumpScale: params.material.bumpScale,
        shininess: params.material.shininess
      });

      this.setMaterialTextures();

      this.moonMesh = new THREE.Mesh(this.geometry, this.material);

      this.moonMesh.position.set(
        params.moonMesh.position.x,
        params.moonMesh.position.y,
        params.moonMesh.position.z
      );

      this.moonMesh.visible = params.moonMesh.visible;
      this.pivot = this.createPivot();
    };

    this.createPivot = function() {
      var pivot = new THREE.Object3D();
      pivot.position = Earth.earthMesh.position;
      pivot.add(this.moonMesh);

      return pivot;
    };

    this.animate = function(delta) {
      if (params.animate.enabled) {
        this.pivot.rotation.y += delta * 2 * Math.PI * params.animate.pivotRotationsPerSecond;
      }
    };

    this.setParamImgDef = function(imgDef) {
      params.imgDef = imgDef || paramsDefault().imgDef;
    };

    this.setMaterialTextures = function(imgDef) {
      this.setParamImgDef(imgDef);

      if (this.doesRefreshTextureNecessary()) {
        this.material.map = new THREE.TextureLoader().load(params.material.map[params.imgDef]);
        this.material.bumpMap = new THREE.TextureLoader().load(params.material.bumpMap[params.imgDef]);
        this.disableRefreshTexture();
      }
    };

    this.doesRefreshTextureNecessary = function() {
      return params.imgDef !== params.imgDefPrevious;
    };

    this.disableRefreshTexture = function() {
      params.imgDefPrevious = params.imgDef;
    };


    this.init();
  };

  return new _Moon();
})(Earth);

/**
 * Sun
 */
var Sun = (function() {
  var _Sun = function() {
    var self = this;

    var paramsDefault = function() {
      return {
        imgDef: IMAGE_SD,
        imgDefPrevious: undefined,
        sunLight: {
          visible: true,
          color: COLOR_WHITE,
          intensity: 1.3,
          position: {
            x: -380,
            y: 240,
            z: -1000,
          }
        },
        sunLensFlare: {
          textures: {
            sun: {
              sd: ASSETS_PATH + 'lens_flare_sun_512x512.jpg',
              hd: ASSETS_PATH + 'lens_flare_sun_512x512.jpg'
            },
            circle: {
              sd: ASSETS_PATH + 'lens_flare_circle_32x32.jpg',
              hd: ASSETS_PATH + 'lens_flare_circle_32x32.jpg'
            },
            hexagon: {
              sd: ASSETS_PATH + 'lens_flare_hexagon_128x128.jpg',
              hd: ASSETS_PATH + 'lens_flare_hexagon_128x128.jpg'
            }
          },
          flareCircleSizeMax: 70,
          lensFlares: [{
            size: 700,
            opacity: 1,
            distance: 0
          }, {
            size: 20,
            opacity: 0.4,
            distance: 0.63
          }, {
            size: 40,
            opacity: 0.3,
            distance: 0.64
          }, {
            size: 70,
            opacity: 0.8,
            distance: 0.7
          }, {
            size: 110,
            opacity: 0.7,
            distance: 0.8
          }, {
            size: 60,
            opacity: 0.4,
            distance: 0.85
          }, {
            size: 30,
            opacity: 0.4,
            distance: 0.86
          }, {
            size: 120,
            opacity: 0.3,
            distance: 0.9
          }, {
            size: 260,
            opacity: 0.4,
            distance: 1
          }]
        }
      };
    };

    var params = paramsDefault();

    this.init = function() {
      this.textureLoader = new THREE.TextureLoader();
      this.sunLight = new THREE.DirectionalLight(params.sunLight.color, params.sunLight.intensity);

      this.sunLight.position.set(
        params.sunLight.position.x,
        params.sunLight.position.y,
        params.sunLight.position.z
      );

      this.sunLight.visible = params.sunLight.visible;

      this.createLensFlare();
      this.disableRefreshTexture();
    };

    this.setParamImgDef = function(imgDef) {
      params.imgDef = imgDef || paramsDefault().imgDef;
    };

    this.createLensFlare = function() {
      this.sunLensFlare = this.getSunLensFlare();
      this.sunLight.add(this.sunLensFlare);
    };

    this.getSunLensFlare = function() {
      this.loadLensFlareTextures();

      var sunLensFlare = new THREE.Lensflare();
        /*this.getTextureByIndex(0),
        params.sunLensFlare.lensFlares[0].size,
        params.sunLensFlare.lensFlares[0].distance
        ,THREE.AdditiveBlending
        );*/

      return this.addLensFlareSunCirclesAndHexagons(sunLensFlare);
    };

    this.addLensFlareSunCirclesAndHexagons = function(sunLensFlare) {
      for (var i = 0; i < params.sunLensFlare.lensFlares.length; i++) {
        sunLensFlare.addElement(
          new THREE.LensflareElement( this.getTextureByIndex(i),
          params.sunLensFlare.lensFlares[i].size,
          params.sunLensFlare.lensFlares[i].distance)
        //,THREE.AdditiveBlending
        );
      }

      return sunLensFlare;
    };

    this.getTextureByIndex = function(index) {
      if (0 === index) {
        return this.textureFlareSun;
      }
      return params.sunLensFlare.lensFlares[index].size < params.sunLensFlare.flareCircleSizeMax ?
        this.textureFlareCircle :
        this.textureFlareHexagon;
    };

    this.loadLensFlareTextures = function() {
      this.textureFlareSun = this.textureLoader.load(params.sunLensFlare.textures.sun[params.imgDef]);
      this.textureFlareCircle = this.textureLoader.load(params.sunLensFlare.textures.circle[params.imgDef]);
      this.textureFlareHexagon = this.textureLoader.load(params.sunLensFlare.textures.hexagon[params.imgDef]);
    };

    this.refreshTextures = function(imgDef) {
      this.setParamImgDef(imgDef);

      if (this.doesRefreshTextureNecessary()) {
        this.loadLensFlareTextures();

        for (var i = 0; i < params.sunLensFlare.lensFlares.length; i++) {
          this.sunLensFlare.lensFlares[i].texture = this.getTextureByIndex(i);
        }

        this.disableRefreshTexture();
      }
    };

    this.doesRefreshTextureNecessary = function() {
      return params.imgDef !== params.imgDefPrevious;
    };

    this.disableRefreshTexture = function() {
      params.imgDefPrevious = params.imgDef;
    };

    this.init();
  };

  return new _Sun();
})();

var SceneShadow = (function() {
  var _SceneShadow = function() {
    var self = this;

    var paramsDefault = function() {
      return {
        /*cameraHelper: {
          visible: false
        },*/
        shadow: {
          castShadow: true,
          camera: {
            near: 950,
            far: 1250,
            right: 150,
            left: -150,
            top: 150,
            bottom: -150
          },
          mapSize: {
            width: 512,
            height: 512
          },
          bias: 0
        }
      };
    };

    var params = paramsDefault();

    this.init = function() {
      this.setShadowConfiguration();
    };

    this.setShadowConfiguration = function() {
      //this.cameraHelper = new THREE.CameraHelper(Sun.sunLight.shadow.camera);
      //Scene.scene.add(this.cameraHelper);
      //this.cameraHelper.visible = params.cameraHelper.visible;

      Sun.sunLight.castShadow = true;
      Sun.sunLight.shadow.camera.near = 950;
      Sun.sunLight.shadow.camera.far = 1250;
      Sun.sunLight.shadow.mapSize.width = 512;
      Sun.sunLight.shadow.mapSize.height = 512;
      Sun.sunLight.shadow.bias = 0;

      Sun.sunLight.shadow.camera.right = 150;
      Sun.sunLight.shadow.camera.left = -150;
      Sun.sunLight.shadow.camera.top = 150;
      Sun.sunLight.shadow.camera.bottom = -150;

      Earth.earthMesh.castShadow = true;
      Earth.earthMesh.receiveShadow = true;

      Cloud.cloudMesh.receiveShadow = true;

      Moon.moonMesh.castShadow = true;
      Moon.moonMesh.receiveShadow = true;

      this.activeWebGLRendererShadowMap();

      this.updateShadow();
    };

    this.activeWebGLRendererShadowMap = function() {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.shadowMapSoft = true;
    };

    this.updateShadow = function() {
      Sun.sunLight.shadow.camera.updateProjectionMatrix();
     // this.cameraHelper.update();
    };

    this.init();
  };

  return new _SceneShadow();
})();
