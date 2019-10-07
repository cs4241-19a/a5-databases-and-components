import React, {Component} from 'react';
import {resume_data} from '../resume_data';
import * as BABYLON from 'babylonjs';
import {GridMaterial} from 'babylonjs-materials';
import flareTexture from './textures/flare.png'
import heightMap from './textures/heightMap.png'
import roseImage from './rose.jpeg'
import roseResume from './Profile.pdf'
import './Header.css';

class Header extends Component {

    constructor(props) {
        super(props);
    }

    static randomCircleCoords(radius, yBase) {
        var rndAngle = 2 * Math.random() * Math.PI;
        var randX = Math.random() * radius * Math.sin(rndAngle);
        var randY = yBase;
        var randZ = Math.random() * radius * Math.cos(rndAngle);

        return [randX, randY, randZ];
    }

    componentDidMount() {
        var canvas = document.getElementById("renderCanvas"); // Get the canvas element
        var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

        // Create the scene space
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3.Black();

        // Add a camera to the scene and attach it to the canvas
        var camera = new BABYLON.ArcRotateCamera("camera1", - Math.PI / 3, 5 * Math.PI / 12, 50, new BABYLON.Vector3(0, 5, 0), scene);

        // Add lights to the scene
        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
        var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

        var groundMaterial = new GridMaterial("groundMaterial", scene);
        groundMaterial.majorUnitFrequency = 5;
        groundMaterial.minorUnitVisibility = 0.45;
        groundMaterial.gridRatio = 2;
        groundMaterial.backFaceCulling = false;
        groundMaterial.mainColor = new BABYLON.Color3(1, 1, 1);
        groundMaterial.lineColor = new BABYLON.Color3(1.0, 1.0, 1.0);
        groundMaterial.opacity = 0.98;

        var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", heightMap, 100, 100, 100, 0, 10, scene, false);
        ground.material = groundMaterial;


        // Register a render loop to repeatedly render the scene
        engine.runRenderLoop(function () {
            camera.alpha += 0.003;

            scene.render();
        });

        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () {
            engine.resize();
        });
    }

    render() {
        return (
            <header>
                <nav id="nav-wrap">
                    <ul id="nav" className="nav">
                        <li><a className="smoothscroll" href="#education">Education</a></li>
                        <li><a className="smoothscroll" href="#experience">Experience</a></li>
                        <li><a className="smoothscroll" href="#projects">Projects</a></li>
                        <li><a className="smoothscroll" href={roseResume} target='_blank' rel='noopener noreferrer'>Resume</a></li>
                    </ul>
                </nav>
                <canvas id="renderCanvas"/>
                <div className="centerDiv">
                    <img src={roseImage} className="profileImg"/>
                    <h1 className="profile_heading">{resume_data.header.name}</h1>
                    <h2 className="profile_sub">{
                        resume_data.header.description.map((val, index) => {
                            return(
                                <span>
                                    {index < resume_data.header.description.length - 1 ? (<span>{val} &#183; </span>) : <span>{val}</span>}
                                </span>
                            );
                        })
                    }</h2>
                </div>
            </header>
        );
    }
}

export default Header;