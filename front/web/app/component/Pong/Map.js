import * as THREE from "three"
import { Ball } from "./Ball.js"
import { Player } from "./Player.js"

const DEG2RAD = Math.PI / 180;

const cube = new THREE.BoxGeometry(1, 1, 1);

export class Map
{
    iPlayers;
    #game;
    width;
    height;
    iPaddleWidth = 0.1;
    paddles = [];
    walls = [];
    ball;
    textureLoader;
    ground;
    texture;
    fCap = 1.9;

    constructor(_iPlayers, _game)
    {
        // this.iPlayers = _iPlayers > 8 ? 8 : _iPlayers;
        this.iPlayers = _iPlayers;
        this.#game = _game;
        this.textureLoader = new THREE.TextureLoader();
        this.texture = this.textureLoader.load("app/assets/img/halftone.jpg");
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;
        this.GenerateMap();
        setInterval(() => this.MovePlayerIA(), 25); // 1000
    }

    GenerateMap()
    {
        this.#GenerateDot();

        if (this.iPlayers <= 2)
            this.#GenerateSimpleGround();
        else
            this.#GenerateGround();
    }

    MovePlayerIA()
    {
        for (let i = 0; i < this.paddles.length; i++)
            {
            if (this.paddles[i].bIA)
                this.paddles[i].UpdateIA(this.ball);
        }
    }

    MovePlayer(_index, _direction)
    {
        if (_index + 1 > this.iPlayers || _index + 1 > this.paddles.length)
            return;

        this.paddles[_index].Move(_direction);
    }

    Update(_scene)
    {
        this.ball.Update(_scene);

        for (let i = 0; i < this.paddles.length; i++)
        {
            if (!this.paddles[i]?.bCanPlay)
            {
                this.paddles[i]?.Die(_scene);
                this.paddles.splice(i, 1);

                if (this.paddles.length <= 1)
                    this.ball.SetNoRespawn();
            }
        }
    }

    #GenerateDot()
    {
        const material = new THREE.MeshLambertMaterial({color: 0xffffff});
        material.emissive.set(0xffffff);
        const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.11);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
        mesh.receiveShadow = true;
        this.#game.scene.add(mesh);
    }

    // #region Simple
    #GenerateSimpleGround()
    {
        this.fCap = this.#GetCap();
        this.width = 10;
        this.height = 5;
        const texture = this.texture.clone();
        texture.repeat.set(1, 1);
        const material = new THREE.MeshLambertMaterial({color: 0x222222, map: texture});
        const mesh = new THREE.Mesh(cube, material);
        mesh.scale.set(this.width, 0.1, this.height);
        mesh.position.set(0, 0, 0);
        mesh.receiveShadow = true;
        this.ground = mesh;
        this.#game.scene.add(mesh);
        this.#GenerateSimplePlayerArea();
    }

    #GenerateSimplePlayerArea()
    {
        this.walls.push(this.#CreateSimpleWall(0, this.height / 2 + this.iPaddleWidth / 2, this.width - this.iPaddleWidth));
        this.walls.push(this.#CreateSimpleWall(0, -this.height / 2 - this.iPaddleWidth / 2, this.width - this.iPaddleWidth));
        this.paddles.push(this.#CreateSimplePaddle(-this.width / 2, 0, 0));  
        this.paddles.push(this.#CreateSimplePaddle(this.width / 2, 0, 1));
        this.ball = new Ball(this.#game, this.#game.scene);
    }

    #CreateSimpleWall(_x, _y, _width)
    {
        const material = new THREE.MeshLambertMaterial({color: 0xffffff});
        material.emissive.set(0xffffff);
        // const capsule = new THREE.CapsuleGeometry(this.iPaddleWidth, _width, 8, 8);
        const capsule = new THREE.BoxGeometry(this.iPaddleWidth, _width, this.iPaddleWidth);
        const mesh = new THREE.Mesh(capsule, material);
        mesh.rotation.set(90 * DEG2RAD, 0, 90 * DEG2RAD);
        mesh.position.set(_x, this.iPaddleWidth * 2, _y);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.#game.scene.add(mesh);
        this.#CreateSimpleKillZone(_x * 1.5, _y * 1.5, _width * 2);
        return mesh;
    }

    #CreateSimpleKillZone(_x, _y, _width)
    {
        const material = new THREE.MeshLambertMaterial({color: 0xff0000, transparent: true});
        material.emissive.set(0xff0000);
        material.opacity = 0;
        const capsule = new THREE.CapsuleGeometry(this.iPaddleWidth, _width, 8, 8);
        const mesh = new THREE.Mesh(capsule, material);
        mesh.rotation.set(90 * DEG2RAD, 0, 90 * DEG2RAD);
        mesh.position.set(_x, this.iPaddleWidth * 2, _y);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData.isKillZone = true;
        this.#game.scene.add(mesh);
    }

    #CreateSimplePaddle(_x, _y, _index)
    {
        const position = new THREE.Vector3(_x, this.iPaddleWidth * 2, _y);
        let offset = 1;
        if (_index == 1)
            offset = -1;

        const rotation = new THREE.Vector3(90 * DEG2RAD * offset, 0, 0);
        return new Player(this.#game.scene, "Player " + _index, position, rotation, this.fCap);
    }
    // #endregion

    // #region Multi
    #GenerateGround()
    {
        const mult = 0.2;
        this.fCap = this.#GetCap();
        this.width = 5;
        const dist = 1 + ((this.iPlayers - 3) * mult);
        this.width = this.width * dist;
        const texture = this.texture.clone();
        texture.repeat.set(1, 1);
        const geometry = new THREE.CylinderGeometry(this.width, this.width, 0.1, this.iPlayers);
        const material = new THREE.MeshLambertMaterial({color: 0x222222, map: texture});
        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData.isKillZone = true;
        mesh.position.set(0, 0, 0);
        mesh.receiveShadow = true;
        this.ground = mesh;
        this.#game.scene.add(mesh);
        this.#game.cameraManager.iCameraDistance *= dist;
        this.#GeneratePlayerArea();
    }

    #GeneratePlayerArea()
    {
        this.walls.push(this.#CreateWall(0, 0, this.width * 1.5));

        for (let i = 0; i < this.iPlayers; i++)
            this.paddles.push(this.#CreatePaddle(i));

        this.ball = new Ball(this.#game, this.#game.scene);
    }

    #CreateWall(_x, _y, _width)
    {
        const texture = this.texture.clone();
        texture.repeat.set(1, 1);
        const material = new THREE.MeshLambertMaterial({color: 0xffffff, map: texture});
        material.emissive.set(0xffffff);
        material.emissiveIntensity = 1;
        const geometry = new THREE.TorusGeometry(_width, this.iPaddleWidth);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.set(90 * DEG2RAD, 0, 0);
        mesh.position.set(_x, this.iPaddleWidth, _y);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.#game.scene.add(mesh);
        return mesh;
    }

    #GetCap()
    {
        if (this.iPlayers == 4 || this.iPlayers == 2)
            return 2.0;
        else if (this.iPlayers == 8)
            return 1.7;

        return 1.9;
    }

    #GetDiff()
    {
        if (this.iPlayers == 3)
            return 30 * DEG2RAD;
        else if (this.iPlayers == 4)
            return -45 * DEG2RAD;
        else if (this.iPlayers == 5)
            return -17.5 * DEG2RAD;
        else if (this.iPlayers == 7)
            return 12.5 * DEG2RAD;
        else if (this.iPlayers == 8)
            return -22.5 * DEG2RAD;

        return 0;
    }

    #GetPosition(_index)
    {
        const diff = this.#GetDiff();
        const angle = (2 * Math.PI / this.iPlayers) * _index + diff;
        let mult = 1;

        if (this.iPlayers == 3)
            mult = 2;
        if (this.iPlayers == 4)
            mult = 1.4;
        else if (this.iPlayers == 5)
            mult = 1.23;
        else if (this.iPlayers == 6)
            mult = 1.15;
        else if (this.iPlayers == 7)
            mult = 1.105;
        else if (this.iPlayers == 8)
            mult = 1.08;

        let x = Math.cos(angle) * this.width / mult;
        let y = Math.sin(angle) * this.width / mult;

        return new THREE.Vector3(x, this.iPaddleWidth, y);
    }

    #GetRotation(_index)
    {
        const rotationIncrement = 360 / this.iPlayers;

        if (this.iPlayers >= 3 && this.iPlayers <= 5)
            _index += 1;
        else if (this.iPlayers == 6)
            _index += 0;
        else if (this.iPlayers >= 7)
            _index += 2;

        const rotate = _index * rotationIncrement * DEG2RAD;
        let offset = 90 * DEG2RAD;

        if (this.iPlayers == 4)
            offset = 45 * DEG2RAD;
        else if (this.iPlayers == 6)
            offset = 0;
        else if (this.iPlayers == 8)
            offset = 67 * DEG2RAD;

        return new THREE.Vector3(90 * DEG2RAD, 0, rotate + offset);
    }

    #CreatePaddle(_index)
    {
        return new Player(this.#game.scene, "Player " + _index, this.#GetPosition(_index), this.#GetRotation(_index), this.fCap);
    }
    // #endregion
}