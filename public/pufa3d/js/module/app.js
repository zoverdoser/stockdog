var THREE = require("../libs/three.min.js");
var TWEEN = require('@tweenjs/tween.js');
require('../libs/Projector.js');
require('../libs/OrbitControls.js');
require('../libs/JDLoader.min.js');
require('../libs/GPUParticleSystem.js');
import res from '../fla/rescc';
var camPath = require('../cam.json');

var APP = {
    Player: function () {
        var allReady = false;
        var loader = new THREE.ObjectLoader();
        var camera, scene, renderer, controls;
        var projector = new THREE.Projector();
        var directions = [], skybox, animationEnded = true, bgLoaded = false, camPathLoaded = false;
        var nebula = [];
        var animationMesh, camBox, targetBox, mixer, mixers = [];
        var raycaster = new THREE.Raycaster();
        var city = [];
        var originPoint = new THREE.Vector3(0, 0, 0);
        var cameraIn = false;
        var cameraTargetPos = new THREE.Vector3(0, 0, 0), cameraBackPos = new THREE.Vector3(0, 0, 0);
        var targetsDistance = [];
        var targetIndex = -1;
        var cameraTween;
        var cameraCurrentTarget = new THREE.Vector3();
        var userAction = false;
        var dustSystem,
            dustClock = new THREE.Clock,
            dustTick = 0,
            dustOptions = {
                position: new THREE.Vector3(),
                positionRandomness: 700,
                velocity: new THREE.Vector3(),
                velocityRandomness: 1.5,
                color: 0xffffff,
                colorRandomness: 1,
                turbulence: .15,
                lifetime: 10,
                size: 24,
                sizeRandomness: 2
            },
            meteor = new THREE.Object3D(),
            meteorTimer = false;

        var events = {
            init: [],
            start: [],
            stop: [],
            mousemove: [],
            touchstart: [],
            touchend: [],
            touchmove: [],
            click: [],
            update: []
        };

        var rotationStart;

        var specialPos = {
            'Movie':  {x: -19.5050243615143, y: 198.37187903738797, z: -398.439555584788},
            'Bank02': {x: -353.8249871036927, y: 156.9197304043981, z: -220.61015688276657},
            'Wifi': {x: -353.8249871036927, y: 156.9197304043981, z: -220.61015688276657},
            'Money': {x: -180.49187029519075, y: 195.4306915519263, z: 357.32209844490336},
            'Coin': {x: 214.07280522214722, y: 209.66702904866875, z: 329.64324661770917},
            'Bank01': {x: 367.83417867062485, y: 145.42641203488685, z: -205.02308368449093},
            'Bank01P': {x: 367.83417867062485, y: 145.42641203488685, z: -205.02308368449093}
        };

        var directionPos = [
            {x: 0, y: 80, z: 0},            //center
            {x: 35, y: 35, z: -20},         //coupon
            {x: -8.6, y: 7.2, z: -42.23},   //movie
            {x: -30.19, y: 93.16, z: 6.58}, //ball
            {x: -43.28, y: 8.72, z: -24.8}, //data
            {x: -25.94, y: 17.46, z: 39.99},//money
            {x: 18.2, y: 12.59, z: 36.94}   //coin
        ];
        var directions = ['Center', 'Bank01', 'Movie', 'Ball', 'Bank02', 'Money', 'Coin'];
        var directionDOM = $("#marker li"),
            directionDistance = [458, 448, 448, 458, 458, 458, 458];

        var request, clock = new THREE.Clock, tick = 0;

        this.dom = document.querySelector('#canvasBox');

        this.width = window.innerWidth;

        this.height = window.innerHeight;

        this.load = function(json) {
            renderer = new THREE.WebGLRenderer({antialias: false});
            renderer.setClearColor(0x241B54, 1);
            renderer.setPixelRatio(window.devicePixelRatio);

            if(json.project.gammaInput) renderer.gammaInput = true;
            if(json.project.gammaOutput) renderer.gammaOutput = true;

            if(json.project.shadows) {
                renderer.shadowMap.enabled = false;
                // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            }
            this.dom.appendChild(renderer.domElement);
            scene = loader.parse(json.scene);
            for(let i = 0; i < scene.children.length; i++) {
                if(scene.children[i].name == 'city.obj') {
                    for(let j = 0; j < scene.children[i].children.length; j++) {
                        if(scene.children[i].children[j].name != 'Mountain' && scene.children[i].children[j].name != 'Plane') {
                            city.push(scene.children[i].children[j]);
                        }
                    }
                }
                if(scene.children[i].name == 'Coin.obj') {
                    city.push(scene.children[i].children[0]);
                }
            }
            
            this.loadSkyBox();
            this.setCamera();

            var scriptWrapParams = 'player,renderer,scene,camera';
            var scriptWrapResultObj = {};

            for(let eventKey in events) {
                scriptWrapParams += ',' + eventKey;
                scriptWrapResultObj[ eventKey ] = eventKey;
            }

            var scriptWrapResult = JSON.stringify(scriptWrapResultObj).replace(/\"/g, '');

            for(let uuid in json.scripts) {
                let object = scene.getObjectByProperty('uuid', uuid, true);
                if (object === undefined) {
                    console.warn('APP.Player: Script without object.', uuid);
                    continue;
                }

                var scripts = json.scripts[uuid];
                for(let i = 0; i < scripts.length; i ++) {
                    let script = scripts[i];
                    let functions = (new Function(scriptWrapParams, script.source + '\nreturn ' + scriptWrapResult + ';').bind(object))(this, renderer, scene, camera);
                    for(let name in functions) {
                        if (functions[name] === undefined) continue;
                        if (events[name] === undefined) {
                            console.warn('APP.Player: Event type not supported (', name, ')');
                            continue;
                        }
                        events[name].push(functions[name].bind(object));
                    }
                }
            }

            buildNebula(150);
            buildMeteor();
            dispatch(events.init, arguments);
        };

        this.loadSkyBox = function() {
            let loader = new THREE.TextureLoader();
            loader.load('images/bg.jpg', onBackgroundLoaded);
        };

        this.loadAnimation = function() {
            let JDloader = new THREE.JDLoader();
            let pathData = JDloader.parse(camPath, false);
            buildCamPath(pathData);
        }

        this.setCamera = function (value) {
            camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 2600);
            camera.updateProjectionMatrix();
            scene.add(camera);
            this.loadAnimation();
        };

        this.setSize = function (width, height) {
            this.width = width;
            this.height = height;

            if(camera) {
                camera.aspect = this.width / this.height;
                camera.updateProjectionMatrix();
            }

            if(renderer) {
                renderer.setSize(width, height);
            }
        };

        this.cameraGoBack = cameraGoBack;

        this.play = function() {
            document.addEventListener('touchstart', touchstartHandler);
            document.addEventListener('touchend', touchendHandler);
            document.addEventListener('touchmove', touchmoveHandler);
            document.addEventListener('click', clickHandler);
            dispatch(events.start, arguments);
            request = requestAnimationFrame(animate);
        };

        this.stop = function() {
            document.removeEventListener('touchstart', touchstartHandler);
            document.removeEventListener('touchend', touchendHandler);
            document.removeEventListener('touchmove', touchmoveHandler);
            document.removeEventListener('click', clickHandler);

            dispatch(events.stop, arguments);

            cancelAnimationFrame(request);
        };

        this.dispose = function() {
            while(this.dom.children.length) {
                this.dom.removeChild(this.dom.firstChild);
            }

            renderer.dispose();

            camera = undefined;
            scene = undefined;
            renderer = undefined;
        };

        function onBackgroundLoaded(texture) {
            var geometry = new THREE.SphereGeometry(1000, 20, 20);
            var material = new THREE.MeshBasicMaterial({
                map: texture
            });
            skybox = new THREE.Mesh(geometry, material);
            skybox.scale.x = -1;
            scene.add(skybox);
            bgLoaded = true;
            if(camPathLoaded) {
                startAnimation();
            }
        }

        function updateDirections() {
            let vector = new THREE.Vector3();
            for(let i = 0; i < directionPos.length; i++) {
                vector.set(directionPos[i].x, directionPos[i].y, directionPos[i].z);
                let screenPos = getVectorScreenPos(vector),
                    distance = vector.distanceTo(camera.position);
                if(i == 3) {
                    targetsDistance[i] = distance + 20;
                } else {
                    targetsDistance[i] = distance;
                }
                
                if(distance < directionDistance[i]) {
                    directionDOM.eq(i).removeClass('off').css({
                        'left': screenPos.x + 'px',
                        'top': screenPos.y + 'px'
                    });
                } else {
                    directionDOM.eq(i).addClass('off');
                }
            }
        }

        function hideDirections() {
            directionDOM.addClass('off');
        }

        function getVectorScreenPos(pos) {
            let vector = new THREE.Vector3(pos.x, pos.y, pos.z);
            vector.project(camera);
            let halfWidth = window.innerWidth / 2,
                halfHeight = window.innerHeight / 2;
            return {
                x: Math.round(vector.x * halfWidth + halfWidth),
                y: Math.round(-vector.y * halfHeight + halfHeight)
            };
        }

        function buildCamPath(data) {
            if(!data.geometries.length) {
                startUserView();
                return;
            }
            var multiMaterial = data.materials;
            animationMesh = new THREE.SkinnedMesh(data.geometries[1], multiMaterial);
            scene.add(animationMesh);
            
            for(var i = 0; i < animationMesh.children[0].children.length; ++i) {
                if(animationMesh.children[0].children[i].name == 'CamBox') {
                    camBox = animationMesh.children[0].children[i];
                } else if(animationMesh.children[0].children[i].name == 'CamTargetBox') {
                    targetBox = animationMesh.children[0].children[i];
                }
            }
            
            camera.position.setFromMatrixPosition(camBox.matrixWorld);
            animationMesh.visible = false;
            camera.updateProjectionMatrix();

            if(animationMesh.geometry.animations) {
                mixer = new THREE.AnimationMixer(animationMesh);
                mixers.push(mixer);
                camPathLoaded = true;
                if(bgLoaded) {
                    startAnimation();
                }
            }
        }

        function startAnimation() {
            allReady = true;
            mixer.clipAction(animationMesh.geometry.animations[0]).play();
            animationEnded = false;
            mixer.addEventListener('loop', function(e) {
                animationEnded = true;
                mixer.stopAllAction();
                startUserView();
            });
        }

        function startUserView() {
            if(animationMesh) {
                scene.remove(animationMesh);
            }
            $("#scene .hand, #scene .holdBtn, #scene .slogan").addClass('on');
            buildDust();
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.target = new THREE.Vector3(0,0,0);
            controls.rotateSpeed = 0.05;
            controls.minPolarAngle = Math.PI / 4;
            controls.maxPolarAngle = Math.PI / 2;
            controls.enableKeys = false;
            controls.autoRotate = true;
            controls.autoRotateSpeed = -0.1;
            //controls.addEventListener('change', render); // remove when using animation loop
            //enable animation loop when using damping or autorotation
            controls.enableDamping = true;
            controls.dampingFactor = 0.1;
            controls.enableZoom = false;
            controls.enablePan = false;
            buildNebula(50);
            //buildMeteor();

            events.touchstart.push(userTouchstartHandler);
            events.touchmove.push(getRotationSpeed);
            events.touchend.push(rotationEndHandler);
            events.click.push(clickIsland);
            $("#scene .holdBtn").on("touchstart", matchBuilding);
            $("#scene").on("touchend", cameraGoBack);
        }

        function matchBuilding(event) {
            event.stopPropagation();
            event.preventDefault();
            userTouchstartHandler();
            let min = 0;
            for(let i = 0; i < 7; i++) {
                if(!min) {
                    min = targetsDistance[0];
                    targetIndex = 0;
                    
                } else if(min > targetsDistance[i]) {
                    min = targetsDistance[i];
                    targetIndex = i;
                }
            }
            zoomInBuilding(targetIndex);
        }

        function zoomInBuilding(buildingIndex) {
            if(buildingIndex == -1) return;
            hideDirections();
            cameraIn = true;
            cameraTargetPos.set(directionPos[buildingIndex].x, directionPos[buildingIndex].y, directionPos[buildingIndex].z);

            var moveEndPos = new THREE.Vector3();
            if(specialPos[directions[buildingIndex]]) {
                var endPos = specialPos[directions[buildingIndex]];
                cameraBackPos.set(endPos.x, endPos.y, endPos.z);
                moveEndPos.set(endPos.x, endPos.y, endPos.z).multiplyScalar(0.6);
            } else {
                cameraBackPos.copy(camera.position);
                moveEndPos.copy(camera.position).multiplyScalar(0.6);
            }

            if(cameraTween) {
                TWEEN.removeAll();
            }
            cameraTween = new TWEEN.Tween({x: camera.position.x, y: camera.position.y, z: camera.position.z})
                .to({x: moveEndPos.x, y: moveEndPos.y, z: moveEndPos.z}, 1000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onStart(function() {
                    controls.autoRotate = false;
                }).onUpdate(function(t) {
                    cameraCurrentTarget.x = THREE.Math.lerp(0, cameraTargetPos.x, t);
                    cameraCurrentTarget.y = THREE.Math.lerp(0, cameraTargetPos.y, t);
                    cameraCurrentTarget.z = THREE.Math.lerp(0, cameraTargetPos.z, t);
                    camera.position.set(this.x, this.y, this.z);
                    camera.lookAt(cameraCurrentTarget);
                }).onComplete(function() {
                    showPop(directions[buildingIndex]);
                }).start();
        }

        function getRotationSpeed(event) {
            if(!rotationStart) {
                rotationStart = event.changedTouches[0].screenX;
            }
        }

        function rotationEndHandler(event) {
            let scrollDistance = event.changedTouches[0].screenX - rotationStart;
            if(scrollDistance > 0) {
                controls.autoRotateSpeed = 0.1;
            } else {
                controls.autoRotateSpeed = -0.1;
            }
            rotationStart = false;
        }

        function userTouchstartHandler() {
            $("#scene .hand, #scene .slogan").removeClass('on');
            userAction = true;
        }

        function clickIsland(event) {
            if(cameraIn) return;
            event.stopPropagation();
            event.preventDefault();
            var mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            var intersects = raycaster.intersectObjects(city);
            if(intersects.length) {
                hideDirections();
                cameraIn = true;
                var moveEndPos = new THREE.Vector3();
                if(specialPos[intersects[0].object.name]) {
                    var endPos = specialPos[intersects[0].object.name];
                    cameraBackPos.set(endPos.x, endPos.y, endPos.z);
                    moveEndPos.set(endPos.x, endPos.y, endPos.z).multiplyScalar(0.6);
                } else {
                    cameraBackPos.copy(camera.position);
                    moveEndPos.copy(camera.position).multiplyScalar(0.6);
                }

                cameraTargetPos.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
                if(cameraTween) {
                    TWEEN.removeAll();
                }
                var tweenMove = new TWEEN.Tween({x: camera.position.x, y: camera.position.y, z: camera.position.z})
                    .to({x: moveEndPos.x, y: moveEndPos.y, z: moveEndPos.z}, 1000)
                    .easing(TWEEN.Easing.Cubic.Out)
                    .onStart(function() {
                        controls.autoRotate = false;
                    }).onUpdate(function(t) {
                        cameraCurrentTarget.x = THREE.Math.lerp(0, cameraTargetPos.x, t);
                        cameraCurrentTarget.y = THREE.Math.lerp(0, cameraTargetPos.y, t);
                        cameraCurrentTarget.z = THREE.Math.lerp(0, cameraTargetPos.z, t);
                        camera.position.set(this.x, this.y, this.z);
                        camera.lookAt(cameraCurrentTarget);
                    }).onComplete(function() {
                        showPop(intersects[0].object.name);
                    }).start();
            }
        }

        function showPop(name) {
            switch(name) {
                case 'Movie':
                    targetIndex = 2;
                    break;
                case 'Bank02':
                    targetIndex = 4;
                    break;
                case 'Wifi':
                    targetIndex = 4;
                    break;
                case 'Money':
                    targetIndex = 5;
                    break;
                case 'Coin':
                    targetIndex = 6;
                    break;
                case 'Bank01':
                    targetIndex = 1;
                    break;
                case 'Bank01P':
                    targetIndex = 1;
                    break;
                case 'Center':
                    targetIndex = 0;
                    break;
                case 'Line002':
                    targetIndex = 0;
                    break;
                case 'Ball':
                    targetIndex = 3;
                    break;
                case 'BallP':
                    targetIndex = 3;
                    break;
            }
            $(".pop.inside").fadeIn(function() {
                res.goto(directions[targetIndex].toLowerCase());
            });
        }

        function cameraGoBack(event) {
            if(!cameraIn || targetIndex  == -1) return;
            if(event) {
                event.stopPropagation();
                event.preventDefault();
                $(document).trigger("CLOSE_INSIDEPOP");
            }
            let vector = new THREE.Vector3();
            if(cameraTween) {
                TWEEN.removeAll();
            }
            cameraTween = new TWEEN.Tween({x: camera.position.x, y: camera.position.y, z: camera.position.z})
                .to({x: cameraBackPos.x, y: cameraBackPos.y, z: cameraBackPos.z}, 600)
                .easing(TWEEN.Easing.Cubic.Out)
                .onStart(function() {
                    controls.autoRotate = false;
                }).onUpdate(function(t) {
                    vector.x = THREE.Math.lerp(cameraCurrentTarget.x, 0, t);
                    vector.y = THREE.Math.lerp(cameraCurrentTarget.y, 0, t);
                    vector.z = THREE.Math.lerp(cameraCurrentTarget.z, 0, t);
                    camera.position.set(this.x, this.y, this.z);
                    camera.lookAt(vector);
                }).onStop(function() {
                    targetIndex = -1;
                    cameraIn = false;
                }).onComplete(function() {
                    controls.autoRotate = true;
                    targetIndex = -1;
                    cameraIn = false;
                }).start();
        }

        function getCenterPoint(mesh) {
            let middle = new THREE.Vector3(),
                geometry = mesh.geometry;
            geometry.computeBoundingBox();
            middle.x = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
            middle.y = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
            middle.z = (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;
            mesh.localToWorld(middle);
            return middle;
        }

        function buildDust() {
            dustSystem = new THREE.GPUParticleSystem({
                maxParticles: 180
            });
            scene.add(dustSystem);
        }

        function buildNebula(num) {
            let loader = new THREE.TextureLoader(),
                originFace = new THREE.Vector3(-32.20887298323841, 51.64147002188788, -417.28196950147253);
            loader.load('images/particle1.png', function(texture) {
                let width = 2 + Math.random() * 7;
                let geometry = new THREE.PlaneBufferGeometry(width, width, 1);
                for(let i = 0; i < num; i++) {
                    let material = new THREE.MeshBasicMaterial({
                        map: texture,
                        transparent: true
                    });
                    material.opacity = Math.random() * 0.6 + 0.2;
                    let plane = new THREE.Mesh(geometry, material);
                    let posX, posY, posZ, rad = 350 + Math.random() * 400;
                    posX = Math.random() * rad * 2 - rad;
                    posY = Math.random() * rad * 2 - rad;
                    while(rad * rad - posX * posX - posY * posY < 0) {
                        posY = Math.random() * rad * 2 - rad;
                    }
                    
                    posZ = Math.sqrt(rad * rad - posX * posX - posY * posY) * (Math.random() > 0.5? 1 : - 1);
                    plane.position.x = posX;
                    plane.position.y = posY;
                    plane.position.z = posZ;
                    plane.lookAt(originFace);
                    nebula.push(plane);
                    scene.add(plane);
                }
            });
        }

        function buildMeteor() {
            let loader = new THREE.TextureLoader();
            loader.load('images/meteor.png', function(texture) {
                let geometry = new THREE.PlaneBufferGeometry(texture.image.width/3, texture.image.height/3, 1);
                let material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true
                });
                let meteorPlane = new THREE.Mesh(geometry, material);
                meteorPlane.rotateZ(-45);
                meteor.add(meteorPlane);
                meteor.inited = true;
            });
            meteor.originalPos = new THREE.Vector3(200, 400 - 350 * Math.random(), -900);
            meteor.vector = new THREE.Vector3(-8, -5, 0);
            meteor.position.copy(meteor.originalPos);
            camera.add(meteor);
        }

        function resetMetro() {
            if(meteorTimer) return;
            meteor.inited = false;
            meteorTimer = setTimeout(() => {
                meteor.originalPos = new THREE.Vector3(200, 400 - 350 * Math.random(), -900);
                meteor.position.copy(meteor.originalPos);
                meteor.inited = true;
                clearTimeout(meteorTimer);
                meteorTimer = false;
            }, 5000 + 3000 * Math.random())
        }

        function updateAnimation() {
            if(animationEnded || !allReady) return;
            var delta = clock.getDelta();
            mixers[0].update(delta);
            camera.position.setFromMatrixPosition(camBox.matrixWorld);
            camera.lookAt(targetBox.position);
        }

        function animate(time) {
            updateAnimation();

            if(!allReady) {
                request = requestAnimationFrame(animate);
                return;
            }

            if(controls) {
                if(!cameraIn) {
                    controls.update();
                    if(userAction) {
                        updateDirections();
                    }

                    var delta = dustClock.getDelta();
                    dustTick += delta;
                    if(dustTick < 0) dustTick = 0;
                    if(delta > 0) {
                        for (let x = 0; x < 50 * delta; x++) {
                            dustSystem.spawnParticle(dustOptions);
                        }
                    }
                    dustSystem.update(dustTick);
                }
                let startNum = nebula.length;
                for(let i = 0; i < startNum; i++) {
                    nebula[i].lookAt(camera.position);
                }
                if(meteor.inited) {
                    meteor.position.add(meteor.vector);
                    if(meteor.position.x < -200) {
                        resetMetro();
                    }
                }
            }

            TWEEN.update();

            render();

            request = requestAnimationFrame(animate);
        }

        function render() {
            renderer.render(scene, camera);
        }

        function dispatch(array, event) {
            for(let i = 0, l = array.length; i < l; i++) {
                array[i](event);
            }
        }

        function touchstartHandler(event) {
            dispatch(events.touchstart, event);
        }

        function touchendHandler(event) {
            dispatch(events.touchend, event);
        }

        function touchmoveHandler(event) {
            dispatch(events.touchmove, event);
        }

        function clickHandler(event) {
            dispatch(events.click, event);
        }
    }
};

export default APP;