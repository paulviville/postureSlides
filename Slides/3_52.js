import Slide from './Slide.js';

import * as THREE from '../CMapJS/Libs/three.module.js';
import {OrbitControls} from '../CMapJS/Libs/OrbitsControls.js';
import Renderer from '../CMapJS/Rendering/Renderer.js';
import RendererDarts from '../CMapJS/Rendering/RendererDarts.js';
import {loadCMap2} from '../CMapJS/IO/SurfaceFormats/CMap2IO.js';
import {Clock} from '../CMapJS/Libs/three.module.js';

import {glRenderer, ambiantLightInt, pointLightInt} from './parameters.js';

import {cube_off} from '../Files/off_files.js'
import {cutAllEdges, quadrangulateAllFaces} from '../CMapJS/Utils/Subdivision.js';
import { catmullClark_inter} from '../CMapJS/Modeling/Subdivision/Surface/CatmullClark.js'
import catmullClark from '../CMapJS/Modeling/Subdivision/Surface/CatmullClark.js'
import IncidenceGraph from '../CMapJS/CMap/IncidenceGraph.js';


import Skeleton, {Key, SkeletonRenderer } from '../Skeleton.js';

import {DualQuaternion} from '../DualQuaternion.js';


export const slide_52 = new Slide(
	function(DOM_0, DOM_1, DOM_2)
	{
		this.camera = new THREE.PerspectiveCamera(45, DOM_0.width / DOM_0.height, 0.1, 1000.0);
		this.camera.position.set(0., 0.5, 1.8);
		const surfaceLayer = 0;
		const skelLayer = 1;
		const scafLayer = 3;
		const rawLayer = 4;
		const meshLayer = 6;

		const layer0 = 0;
		const layer1 = 1;
		const layer2 = 2;

		const layer5 = 5;

		const context0 = DOM_0.getContext('2d');
		const context1 = DOM_1.getContext('2d');
		const context2 = DOM_2.getContext('2d');


		const controls0 = new OrbitControls(this.camera, DOM_0);
		const controls1 = new OrbitControls(this.camera, DOM_1);
		const controls2 = new OrbitControls(this.camera, DOM_2);

		this.scene = new THREE.Scene()
		const ambiantLight = new THREE.AmbientLight(0xFFFFFF, ambiantLightInt);
		const pointLight = new THREE.PointLight(0xFFFFFF, pointLightInt);
		pointLight.position.set(10,8,15);

		ambiantLight.layers.enable(surfaceLayer);
		pointLight.layers.enable(surfaceLayer);
		ambiantLight.layers.enable(skelLayer);
		pointLight.layers.enable(skelLayer);
		ambiantLight.layers.enable(scafLayer);
		pointLight.layers.enable(scafLayer);
		ambiantLight.layers.enable(rawLayer);
		pointLight.layers.enable(rawLayer);
		ambiantLight.layers.enable(meshLayer);
		pointLight.layers.enable(meshLayer);

		this.scene.add(pointLight);
		this.scene.add(ambiantLight);

		this.group = new THREE.Group;
		this.scene.add(this.group);



		const worldUp = new THREE.Vector3(0, 0, 1);
		const worldY = new THREE.Vector3(0, 1, 0);

		const translation = new THREE.Quaternion(0, 0.5, 0, 0);
		const rotation = new THREE.Quaternion().setFromAxisAngle(worldUp, 0);
		const rotation1 = new THREE.Quaternion().setFromAxisAngle(worldUp, Math.PI *2/ 3);
		const transform = DualQuaternion.setFromRotationTranslation(rotation.clone(), translation.clone());
		const transformRoot = DualQuaternion.setFromRotationTranslation(new THREE.Quaternion, translation.clone().multiplyScalar(-1));
		const transform1 = DualQuaternion.setFromRotationTranslation(rotation1.clone(), translation.clone());

		const key0 = new Key(0, transform);
		const key1 = new Key(100, transform1);
		const keyRoot = new Key(0, transformRoot);

		const skeleton = new Skeleton;
		const root = skeleton.newBone("root");
		const bone0 = skeleton.newBone();
		const bone1 = skeleton.newBone();

		skeleton.setParent(bone0, root);
		skeleton.setParent(bone1, bone0);

		skeleton.addKey(root, keyRoot);
		skeleton.addKey(bone0, key0);
		skeleton.addKey(bone1, key0);
		skeleton.addKey(bone1, key1);

		skeleton.computeWorldTransforms(0);
		skeleton.setBindTransforms();
		skeleton.computeOffsets();

		const sRenderer = new SkeletonRenderer(skeleton);
		sRenderer.createVertices();
		sRenderer.createEdges();
		this.scene.add(sRenderer.vertices)
		this.scene.add(sRenderer.edges)


		const skeleton2 = new Skeleton;
		const root2 = skeleton2.newBone("root");
		const bone20 = skeleton2.newBone();
		const bone21 = skeleton2.newBone();

		skeleton2.setParent(bone20, root2);
		skeleton2.setParent(bone21, bone20);

		skeleton2.addKey(root2, keyRoot);
		skeleton2.addKey(bone20, key0);
		skeleton2.addKey(bone21, key0);
		skeleton2.addKey(bone21, key1);

		skeleton2.computeWorldTransforms(0);
		skeleton2.setBindTransforms();
		skeleton2.computeOffsets();

		console.log(skeleton2.getOffset(0))

		const sRenderer2 = new SkeletonRenderer(skeleton2);
		sRenderer2.createVertices();
		sRenderer2.createEdges();
		sRenderer2.vertices.layers.set(1)
		sRenderer2.edges.layers.set(1)
		this.scene.add(sRenderer2.vertices)
		this.scene.add(sRenderer2.edges)


		const weights = [
			[{b: 1, w: 1}],
			[{b: 1, w: 0.95}, {b: 2, w: 0.05}],
			[{b: 1, w: 0.9}, {b: 2, w: 0.1}],
			[{b: 1, w: 0.8}, {b: 2, w: 0.2}],
			[{b: 1, w: 0.65}, {b: 2, w: 0.35}],
			[{b: 1, w: 0.5}, {b: 2, w: 0.5}],
			[{b: 1, w: 0.35}, {b: 2, w: 0.65}],
			[{b: 1, w: 0.2}, {b: 2, w: 0.8}],
			[{b: 1, w: 0.1}, {b: 2, w: 0.9}],
			[{b: 1, w: 0.05}, {b: 2, w: 0.95}],
			[{b: 2, w: 1}]
		]


		const skin = new IncidenceGraph;
		skin.createEmbedding(skin.vertex);
		const skinPos = skin.addAttribute(skin.vertex, "position");
		const skinBind = skin.addAttribute(skin.vertex, "bind");
		const skinWeights = skin.addAttribute(skin.vertex, "weights");


		const skin2 = new IncidenceGraph;
		skin2.createEmbedding(skin2.vertex);
		const skinPos2 = skin2.addAttribute(skin2.vertex, "position");
		const skinBind2 = skin2.addAttribute(skin2.vertex, "bind");
		const skinWeights2 = skin2.addAttribute(skin2.vertex, "weights");



		const upVector = new THREE.Vector3(0, 1 / 10, 0);
		const radiusVector = new THREE.Vector3(0.15, 0, 0);
		
		const nbVerts = 10;
		const angle = 2*Math.PI/nbVerts;
		
		for(let w = 0; w < weights.length; ++w) {
			const tempVector = radiusVector.clone();
			tempVector.addScaledVector(upVector, w);
		
			for(let i = 0; i < nbVerts; ++i){
				let id = skin.addVertex();
				if(i != 0) skin.addEdge(id, id - 1);
				if(i == nbVerts - 1) skin.addEdge(id, id - i);
				if(w > 0) skin.addEdge(id, id - nbVerts);
				
				skinPos[id] = tempVector.clone().addScaledVector(translation, -1);
				skinBind[id] = skinPos[id].clone();
				skinWeights[id] = weights[w];
				
				tempVector.applyAxisAngle(worldY, angle);
			}
		}

		for(let w = 0; w < weights.length; ++w) {
			const tempVector = radiusVector.clone();
			tempVector.addScaledVector(upVector, w);
		
			for(let i = 0; i < nbVerts; ++i){
				let id = skin2.addVertex();
				if(i != 0) skin2.addEdge(id, id - 1);
				if(i == nbVerts - 1) skin2.addEdge(id, id - i);
				if(w > 0) skin2.addEdge(id, id - nbVerts);
				
				skinPos2[id] = tempVector.clone().addScaledVector(translation, -1);
				skinBind2[id] = skinPos2[id].clone();
				skinWeights2[id] = weights[w];
				
				tempVector.applyAxisAngle(worldY, angle);
			}
		}


		const skinRenderer = new Renderer(skin);
		skinRenderer.edges.create({layer:1, color: new THREE.Color(0x550000)});
		skinRenderer.edges.addTo(this.scene)
		

		const skinRenderer2 = new Renderer(skin2);
		skinRenderer2.edges.create({color: new THREE.Color(0x550000), layer: 2});
		skinRenderer2.edges.addTo(this.scene)


		const axis = new THREE.Vector3(0, 1, 0);
		this.clock = new Clock(true);
		this.time = 0;

		this.on = 1;
		this.pause = function(){
			this.on = 1 - this.on;
		};

		this.loop = function(){
			if(this.running){
				glRenderer.setSize(DOM_0.width, DOM_0.height);
				this.time += this.clock.getDelta() * this.on;
				this.group.setRotationFromAxisAngle(axis, Math.PI/2 + Math.PI / 90 * this.time);
				
				let s = (Math.sin(this.time)/2 + 0.5) * 100;
				sRenderer2.computePositions(s);
				// skeleton2.computeWorldTransforms(s)
				skeleton2.computeOffsets()
				sRenderer2.updateVertices();
				sRenderer2.updateEdges();

				sRenderer.computePositions(s);
				// skeleton.computeWorldTransforms(s)
				skeleton.computeOffsets()
				sRenderer.updateVertices();
				sRenderer.updateEdges();

				skin.foreach(skin.vertex, v => {
					let pb = skinBind[v].clone();
					let dqBlend = new DualQuaternion(new THREE.Quaternion(0,0,0,0), new THREE.Quaternion(0,0,0,0));
					let off;
					let b;
					for(let w = 0; w < skinWeights[v].length; ++w) {
						b = skinWeights[v][w];
						off = skeleton2.getOffset(b.b);
						dqBlend.addScaledDualQuaternion(off, b.w);
					}
					dqBlend.normalize();
					let pdq = DualQuaternion.setFromTranslation(pb);
					pdq.multiplyDualQuaternions(dqBlend, pdq)
			
					skinPos[v].copy(pdq.transform(new THREE.Vector3));
			
				});
				skinRenderer.edges.update();
				skinRenderer2.edges.update();

				this.camera.layers.enable(layer5);
				this.camera.layers.enable(layer0);
				glRenderer.render(this.scene, this.camera);
				context0.clearRect(0, 0, DOM_0.width, DOM_0.height);
				context0.drawImage(glRenderer.domElement, 0, 0);
				this.camera.layers.disable(layer0);

				this.camera.layers.enable(layer1);
				glRenderer.render(this.scene, this.camera);
				context1.clearRect(0, 0, DOM_0.width, DOM_0.height);
				context1.drawImage(glRenderer.domElement, 0, 0);
				this.camera.layers.disable(layer1);

				this.camera.layers.enable(layer2);
				glRenderer.render(this.scene, this.camera);
				context2.clearRect(0, 0, DOM_0.width, DOM_0.height);
				context2.drawImage(glRenderer.domElement, 0, 0);
				this.camera.layers.disable(layer2);


				requestAnimationFrame(this.loop.bind(this));
			}
		}
	});