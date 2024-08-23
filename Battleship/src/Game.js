import * as THREE from "three"
import { CameraManager } from "./CameraManager.js";
import { Map } from "./Map.js";
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';

document.addEventListener("DOMContentLoaded", () => {
    const game = new Game();
    game.Start(); 
});

export class Game
{
    gameWindow;
    scene;
    renderer;
    cameraManager;
    map;
    composer;
    world;

    constructor()
    {
    }

    Start()
    {
        this.#CreateScene();
        this.#PostProcess();
        window.addEventListener("resize", () => { this.#OnResize(); });
        window.addEventListener("keydown", (event) => this.#OnKeyDown(event));
        window.addEventListener("keyup", (event) => this.#OnKeyUp(event));
        this.renderer.setAnimationLoop(() => this.#Draw());
    }

    Update() 
    {
        this.cameraManager.Update();
        this.composer.render();
        this.map.Update();
    }

    OnDestroy()
    {
    }

    #OnResize()
    {
        this.cameraManager.camera.aspect = this.gameWindow.offsetWidth / this.gameWindow.offsetHeight;
        this.cameraManager.camera.updateProjectionMatrix();
        this.renderer.setSize(this.gameWindow.offsetWidth, this.gameWindow.offsetHeight);
    }

    #Draw()
    {
        this.Update();
    }

    #PostProcess()
    {
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.cameraManager.camera);
        this.composer.addPass(renderPass);

        const bloomPass = new UnrealBloomPass(new THREE.Vector2(this.gameWindow.innerWidth, this.gameWindow.innerHeight), 0.3, 0.4, 0); // Str, Rad, Tresh
        this.composer.addPass(bloomPass);
    }

    #CreateScene()
    {
        this.gameWindow = document.getElementById("render-target");
        this.scene = new THREE.Scene();
        this.cameraManager = new CameraManager(new THREE.Vector3(), this.gameWindow);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.gameWindow.offsetWidth, this.gameWindow.offsetHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.gameWindow.appendChild(this.renderer.domElement);
        this.#CreateLight();
        this.cameraManager.Update();
        this.map = new Map(this);
    }

    #CreateLight()
    {
        const skybox = new THREE.HemisphereLight(0xB1E1FF, 0xB97A20, 2);
        this.scene.add(skybox);
        const sun = new THREE.DirectionalLight(0xffffff, 1);
        sun.position.set(-20, 20, 20);
        sun.castShadow = true;
        sun.shadow.camera.left = -40;
        sun.shadow.camera.right = 40;
        sun.shadow.camera.top = 40;
        sun.shadow.camera.bottom = -40;
        sun.shadow.mapSize.width = 1024;
        sun.shadow.mapSize.height = 1024;
        sun.shadow.camera.near = 0.5;
        sun.shadow.camera.far = 100;
        this.scene.add(sun);
        //const helper = new THREE.CameraHelper(sun.shadow.camera);
        //this.scene.add(helper);
    }

    #OnKeyDown(event) 
    {
    }

    #OnKeyUp(event) 
    {
    }
}