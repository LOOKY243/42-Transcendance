import * as THREE from "three"
import { CameraManager } from "./CameraManager.js";
import { Map } from "./Map.js";
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';

const color = ["Black", "Blue", "Red", "Whiite"];

document.addEventListener("DOMContentLoaded", () => {
    const game = new GameBattleship();
    game.Start(); 
});

export class GameBattleship
{
    gameWindow;
    scene;
    renderer;
    cameraManager;
    map;
    enemyMap;
    composer;
    world;
    currentPlayer = 0;
    nextPlayer = 1;
    clock;

    constructor()
    {
    }

    Start()
    {
        this.clock = new THREE.Clock();
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
        this.enemyMap.Update();
        this.TurnHandler();

        if (this.currentPlayer == 0)
        {
            this.enemyMap.SetActive(false);
            this.map.SetActive(true);
        }
        else if (this.currentPlayer == 1)
        {
            this.enemyMap.SetActive(true);
            this.map.SetActive(false);
        }
        else
        {
            this.enemyMap.SetActive(false);
            this.map.SetActive(false);
        }
    }

    OnDestroy()
    {
    }

    TurnHandler()
    {
        if (this.currentPlayer == 0 && this.map.cannon.bNeedSwitch)
        {
            if (!this.ClockChecker(1.5))
                return;

            this.GoBlack(1);
        }
        else if (this.currentPlayer == 1 && this.enemyMap.cannon.bNeedSwitch)
        {
            if (!this.ClockChecker(1.5))
                return;

            this.GoBlack(0);
        }
        else if (this.currentPlayer == -1)
        {
            if (!this.ClockChecker(1.5))
                return;

            this.currentPlayer = this.nextPlayer;
            this.map.cannon.bNeedSwitch = false;
            this.enemyMap.cannon.bNeedSwitch = false;
        }
    }

    GoBlack(_next)
    {
        this.currentPlayer = -1;
        this.nextPlayer = _next;
    }

    ClockChecker(_time)
    {
        if (!this.clock.running)
            this.clock.start();

        if (this.clock.getElapsedTime() >= _time)
        {
            this.clock.stop();
            return true;
        }

        return false;
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
        this.map = new Map(this, color[1], 0xFFFFFF, "Starter");
        this.enemyMap = new Map(this, color[2], 0xFFFFFF, "Follower");
        this.map.otherMap = this.enemyMap;
        this.enemyMap.otherMap = this.map;
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
    }

    #OnKeyDown(event) 
    {
    }

    #OnKeyUp(event) 
    {
    }
}