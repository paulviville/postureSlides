import Slide from './Slide.js';

import * as THREE from '../CMapJS/Libs/three.module.js';
import {OrbitControls} from '../CMapJS/Libs/OrbitsControls.js';
import * as Display from '../CMapJS/Utils/Display.js';
// import * as Lung from '../Files/anim_files.js';
import * as Lung0 from '../Files/anim0_files.js';
import * as Lung1 from '../Files/anim1_files.js';
import * as Lung2 from '../Files/anim2_files.js';
import * as Lung3 from '../Files/anim3_files.js';
import {Clock} from '../CMapJS/Libs/three.module.js';

import {glRenderer, ambiantLightInt, pointLightInt} from './parameters.js';
import {FBXLoader} from '../FBXLoader.js';

export const slide_fbx0 = new Slide(
	function(DOM_hexmesh)
	{
		this.camera = new THREE.PerspectiveCamera(45, DOM_hexmesh.width / DOM_hexmesh.height, 0.1, 1000.0);
		this.camera.position.set(100, 200,300);
		
		const surfaceLayer = 0;
		const meshLayer = 1;

		const contextInput = DOM_hexmesh.getContext('2d');

		const orbitControlsInput = new OrbitControls(this.camera, DOM_hexmesh);
		orbitControlsInput.target.set(0, 100, 0)
		orbitControlsInput.update()
		this.scene = new THREE.Scene()
		const ambiantLight = new THREE.AmbientLight(0xFFFFFF, 0.9);
		const pointLight = new THREE.PointLight(0xFFFFFF, 0.9);
		pointLight.position.set(40,48,55);

		ambiantLight.layers.enable(surfaceLayer);
		pointLight.layers.enable(surfaceLayer);
		ambiantLight.layers.enable(meshLayer);
		pointLight.layers.enable(meshLayer);

		this.scene.add(pointLight);
		this.scene.add(ambiantLight);


		const axis = new THREE.Vector3(0, 1, 0);
		this.clock = new Clock(true);
		this.time = 0;
		

		this.on = 1;
		this.pause = function(){
			this.on = 1 - this.on;
		};

		let mixer

		const scene = this.scene
		const loader = new FBXLoader();
				loader.load( './Samba Dancing.fbx', function ( object ) {

					mixer = new THREE.AnimationMixer( object );

					const action = mixer.clipAction( object.animations[ 0 ] );
					action.play();

					object.traverse( function ( child ) {

						if ( child.isMesh ) {

							child.castShadow = true;
							child.receiveShadow = true;

						}

					} );

					let skeleton = new THREE.SkeletonHelper( object );
					skeleton.visible = true;
					object.visible = false
					scene.add( skeleton );
					scene.add( object );

				} );





		this.loop = function(){
			if(this.running){

				const delta = this.clock.getDelta();
				if ( mixer ) mixer.update( delta );

				glRenderer.setSize(DOM_hexmesh.width, DOM_hexmesh.height);
				this.time += delta * this.on;

				this.camera.layers.enable(surfaceLayer);
				this.camera.layers.enable(meshLayer);
				glRenderer.render(this.scene, this.camera);
				contextInput.clearRect(0, 0, DOM_hexmesh.width, DOM_hexmesh.height);
				contextInput.drawImage(glRenderer.domElement, 0, 0)
				this.camera.layers.disable(surfaceLayer);
				this.camera.layers.disable(meshLayer);

				requestAnimationFrame(this.loop.bind(this));
			}
		}
	});