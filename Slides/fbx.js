import Slide from './Slide.js';

import * as THREE from '../CMapJS/Libs/three.module.js';
import {OrbitControls} from '../CMapJS/Libs/OrbitsControls.js';

import {Clock} from '../CMapJS/Libs/three.module.js';

import {glRenderer} from './parameters.js';
import { FBXLoader } from '../FBXLoader.js';




const mesh_color = new THREE.Color(0x60c3f4);



export const slide_fbx = new Slide(
	function(DOM_hexmesh)
	{
		this.camera = new THREE.PerspectiveCamera(45, DOM_hexmesh.width / DOM_hexmesh.height, 0.1, 1000.0);
		this.camera.position.set(0, 100,280);
		console.log(this.camera.target)
		const surfaceLayer = 0;
		const meshLayer = 1;

		const contextInput = DOM_hexmesh.getContext('2d');

		const orbitControlsInput = new OrbitControls(this.camera, DOM_hexmesh);
		orbitControlsInput.target.copy(new THREE.Vector3(0, 100, 0))
		orbitControlsInput.update()
		this.scene = new THREE.Scene()
		const ambiantLight = new THREE.AmbientLight(0xFFFFFF, 0.9);
		const pointLight = new THREE.PointLight(0xFFFFFF, 5);
		pointLight.position.set(100,180,150);

		ambiantLight.layers.enable(surfaceLayer);
		pointLight.layers.enable(surfaceLayer);
		ambiantLight.layers.enable(meshLayer);
		pointLight.layers.enable(meshLayer);

		this.scene.add(pointLight);
		this.scene.add(ambiantLight);

		this.group = new THREE.Group;
		this.scene.add(this.group);


		const axis = new THREE.Vector3(0, 1, 0);
		this.clock = new Clock(true);
		this.time = 0;
		
		this.on = true

		let delta = 0;




		let scene = this.scene
		let mixer;

		const loader = new FBXLoader();
		loader.load( './Files/SambaDancing.fbx', function ( object ) {
			
			mixer = new THREE.AnimationMixer( object );
			console.log(object)
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
					scene.add( skeleton );

			scene.add( object );
		} );








		this.loop = function(){
			delta = this.clock.getDelta()
			if(this.running){
				glRenderer.setSize(DOM_hexmesh.width, DOM_hexmesh.height);
				if ( mixer ) mixer.update( delta );
				console.log(mixer)
				// this.time += this.clock.getDelta()
				this.time += delta
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