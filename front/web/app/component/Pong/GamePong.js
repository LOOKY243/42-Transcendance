import * as THREE from "three"
import { CameraManager } from "./CameraManager.js";
import { Map } from "./Map.js";
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

let room_name = "test"
let url = `ws://localhost:8000/ws/socket-server/${room_name}`;
const socket = new WebSocket(url);

socket.onmessage = function(e)
{
    let data = JSON.parse(e.data);
    console.log("Receive:", data.message);
}

socket.onopen = function(e)
{
    console.log("Connected to game room");
}

socket.onclose = function(e)
{
    console.log("Disconnected from the game room");
}

export class GamePong
{
    gameWindow;
    scene;
    renderer;
    cameraManager;
    map;
    composer;
    world;
    iPlayers;
    iPoints;
    theme;
    fBallSpeed = 10;
    iPaddleDirection = [2];
    fPaddleSpeed = 10;

    constructor(_ballSpeed, _iPlayers, _iPoints, _theme)
    {
        this.iPlayers = _iPlayers;
        this.iPoints = _iPoints;
        this.theme = _theme;

        if (_ballSpeed == "normal")
            this.fBallSpeed = 0.075;
        else if (_ballSpeed == "slow")
            this.fBallSpeed = 0.05;
        else
            this.fBallSpeed = 0.1;
    }

    Start()
    {
        this.#CreateScene();
        this.#PostProcess();
        this.iPaddleDirection[0] = 0;
        this.iPaddleDirection[1] = 0;
        window.addEventListener("resize", () => { this.#OnResize(); });
        window.addEventListener("keydown", (event) => this.#OnKeyDown(event));
        window.addEventListener("keyup", (event) => this.#OnKeyUp(event));
        this.renderer.setAnimationLoop(() => this.#Draw());
    }

    Update() 
    {
        if (!this.map.init)
            return;

        const speed = -0.15;

        this.map.Update(this.scene);
        this.map.MovePlayer(0, this.iPaddleDirection[1] * speed);
        this.map.MovePlayer(1, this.iPaddleDirection[0] * speed);
        this.cameraManager.Update();
        // this.renderer.render(this.scene, this.cameraManager.camera);
        this.composer.render();  
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
        const renderTarget = new THREE.WebGLRenderTarget(
            this.gameWindow.offsetWidth,
            this.gameWindow.offsetHeight,
            {
                format: THREE.RGBAFormat,
                type: THREE.UnsignedByteType,
                depthBuffer: true,
                stencilBuffer: false,
            }
        );
        this.composer = new EffectComposer(this.renderer, renderTarget);

        const renderPass = new RenderPass(this.scene, this.cameraManager.camera);
        renderPass.clearColor = new THREE.Color(0x000000); 
        renderPass.clearAlpha = 0;
        this.composer.addPass(renderPass);

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(this.gameWindow.innerWidth, this.gameWindow.innerHeight),
            0.5,  // Bloom strength
            0.4,  // Bloom radius
            0     // Bloom threshold
        );
        this.composer.addPass(bloomPass);
    }

    #CreateScene()
    {
        this.gameWindow = document.getElementById("render-target");
        this.scene = new THREE.Scene();
        this.scene.background = null;
        this.cameraManager = new CameraManager(new THREE.Vector3(), this.gameWindow);
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true
        });
        this.renderer.setSize(this.gameWindow.offsetWidth, this.gameWindow.offsetHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.gameWindow.appendChild(this.renderer.domElement);
        this.#CreateLight();
        this.map = new Map(this);
    }

    #CreateLight()
    {
        const skybox = new THREE.HemisphereLight(0xB1E1FF, 0xB97A20, 2);
        this.scene.add(skybox);
        const sun = new THREE.DirectionalLight(0xffffff, 1);
        sun.position.set(-20, 20, 20);
        sun.castShadow = true;
        sun.shadow.camera.left = -20;
        sun.shadow.camera.right = 20;
        sun.shadow.camera.top = 20;
        sun.shadow.camera.bottom = -20;
        sun.shadow.mapSize.width = 1024;
        sun.shadow.mapSize.height = 1024;
        sun.shadow.camera.near = 0.5;
        sun.shadow.camera.far = 100;
        this.scene.add(sun);
    }

    #OnKeyDown(event) 
    {
        if (event.code === "ArrowUp")
            this.iPaddleDirection[0] = -1;
        else if (event.code === "ArrowDown")
            this.iPaddleDirection[0] = 1;

        if (event.code === "KeyW")
            this.iPaddleDirection[1] = 1;
        else if (event.code === "KeyS")
            this.iPaddleDirection[1] = -1;
    }

    #OnKeyUp(event) 
    {
        if (event.code === "ArrowUp" || event.code === "ArrowDown")
            this.iPaddleDirection[0] = 0;

        if (event.code === "KeyW" || event.code === "KeyS")
            this.iPaddleDirection[1] = 0;
    }
}