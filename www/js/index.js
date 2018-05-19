/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById("border").addEventListener('click', this.takePhoto);
        document.getElementById("right-navbar").addEventListener('click', this.restartCameraView);
        this.initCameraView();
    },
    // deviceSynced: Boolean() = false,
    // 0 == 
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    // Update DOM on a Received Event

    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
    },

    onDeviceReady: function() {
        var options = {
            frequency: 10
        }; // Update every .05 seconds
        this.startCameraAbove();
        this.initCameraView();
    },
    initCameraView: function() {
        window.addEventListener("deviceorientation", this.handleOrientation, true);
        var cameraView = document.getElementById('camera-interface');
        cameraView.style.display = "block";
        var analyzeView = document.getElementById('analyze-interface');
        analyzeView.style.display = "none";
        CameraPreview.show();
        document.getElementById("border").style.position = "absolute";
        document.getElementById("border").style.display = "block";

    },
    restartCameraView: function() {

        window.addEventListener("deviceorientation", this.handleOrientation, true);

        var image = document.getElementById('my-image');
        var analyzeView = document.getElementById('analyze-interface');
        var cameraView = document.getElementById('camera-interface');
        var rightIcon = document.getElementById('right-icon')

        cameraView.style.display = "block";
        cameraView.style.color = "rgba(0,0,0,0)";
        document.getElementById("border").style.position = "absolute";
        document.getElementById("border").style.display = "block";
        document.getElementById("main-text").innerHTML = "Calculating";
        analyzeView.style.display = "none";
        console.log(analyzeView.style.display);
        CameraPreview.show();



    },
    initAnalyzeView: function() {
        window.removeEventListener("deviceorientation", this.handleOrientation, true);
        var cameraView = document.getElementById('camera-interface');
        cameraView.style.display = "none";
        var analyzeView = document.getElementById('analyze-interface');
        analyzeView.style.display = "block";

    },
    handleOrientation: function(event) {
        var absolute = event.absolute;
        var alpha = event.alpha; // yaw
        var beta = event.beta; // pitch
        var gamma = event.gamma; // roll

        var right = document.getElementById('right');
        var left = document.getElementById('left');
        var up = document.getElementById('up');
        var down = document.getElementById('down');
        var border = document.getElementById("border");

        var straight = Math.abs(beta) < 2 && Math.abs(gamma) < 2;
        var rightIcon = document.getElementById('right-icon');
        if (document.getElementById('analyze-interface').style.display == "none") {
            if (straight) {
                left.style.color = "rgba(63, 140, 233,0)";
                right.style.color = "rgba(63, 140, 233,0)";
                up.style.color = "rgba(63, 140, 233,0)";
                down.style.color = "rgba(63, 140, 233,0)";
                border.style.borderColor = "rgba(63, 140, 233,1)";
                rightIcon.classList.remove("fas");
                rightIcon.classList.remove("fa-spin");
                rightIcon.classList.remove("fa-sync");
                rightIcon.classList.add("far");
                rightIcon.classList.add("fa-check-circle");
                // this.deviceSynced = true;
                app.receivedEvent('deviceready');
            } else {
                // this.deviceSynced = false;
                border.style.borderColor = "rgba(63, 140, 233,0)";
                if (rightIcon.classList.contains("fa-spin") == true) {
                    console.log("true");
                } else {
                    rightIcon.classList.add("fas");
                    rightIcon.classList.add("fa-spin");
                    rightIcon.classList.add("fa-sync");
                    rightIcon.classList.remove("far");
                    rightIcon.classList.remove("fa-check-circle");
                }
                console.log(gamma / 4)

                if (gamma > 0) { // Left/Right
                    console.log("moister")
                    left.style.color = "rgba(63, 140, 233," + (gamma / 8).toString() + ")"; //Left
                    right.style.color = "rgba(63, 140, 233,0)";
                } else {
                    console.log("cloister");
                    right.style.color = "rgba(63, 140, 233," + (-1 * gamma / 8).toString() + ")"; //Right
                    left.style.color = "rgba(63, 140, 233,0)";
                }

                if (beta > 0) { //Up/Down
                    up.style.color = "rgba(63, 140, 233," + (beta / 8).toString() + ")"; //Down
                    down.style.color = "rgba(63, 140, 233,0)";
                } else {
                    down.style.color = "rgba(63, 140, 233," + (-1 * beta / 8).toString() + ")"; //Up
                    up.style.color = "rgba(63, 140, 233,0)";
                }
            }
        } else {
            border.style.borderColor = "rgba(63, 140, 233,0)";
            rightIcon.classList.add("fas");
            rightIcon.classList.add("fa-redo");
            rightIcon.classList.remove("far");
            rightIcon.classList.remove("fa-check-circle");
        }


    },

    restartApp: function() {
        var image = document.getElementById('myImage');
        var photoButton = document.getElementById('deviceready');
        var restartButton = document.getElementById('restart-button');
        image.setAttribute('style', 'display:none;');
        photoButton.setAttribute('style', 'display:block;');
        restartButton.setAttribute('style', 'display:none;');
        document.getElementById("main-text").innerHTML = "Take a Photo to Begin";
    },
    startCameraAbove: function() {
        CameraPreview.startCamera({ x: 0, y: (window.screen.height * .1), width: window.screen.width, height: (window.screen.height * .9), toBack: true, previewDrag: false, tapPhoto: false });
        CameraPreview.setFlashMode(CameraPreview.FLASH_MODE.OFF);
    },

    stopCamera: function() {
        CameraPreview.stopCamera();
    },


    takePhoto: function() {
        console.log("recognized func");
        if (document.getElementById('right-icon').classList.contains("fa-check-circle") == true) {
            CameraPreview.takePicture(function(base64PictureData) {
                /* code here */
                imageSrcData = 'data:image/jpeg;base64,' + base64PictureData;
                cameraSuccess(imageSrcData);
            });

            function cameraSuccess(imageURI) {
                // import ImageParser from 'js/image-parser.js';
                // Display the image we just took,  replace the picture taking element with a restart 
                // button, and give the canopy cover value
                console.log("reached");

                var image = document.getElementById('my-image');
                var analyzeView = document.getElementById('analyze-interface');
                var cameraView = document.getElementById('camera-interface');

                cameraView.style.display = "none";
                cameraView.style.color = "rgba(0,0,0,0)";
                document.getElementById("border").style.position = "static";
                document.getElementById("border").style.display = "none";
                document.getElementById("main-text").innerHTML = "Calculating";
                analyzeView.style.display = "block";
                console.log(analyzeView.style.display);
                CameraPreview.hide();
                // Image Working
                image.src = imageURI;
                image.onload = function() {
                    percent_cover = processPhoto(image)
                    document.getElementById("main-text").innerHTML = percent_cover.toFixed(2) + "% Canopy Cover";
                    image.style.transform = 'rotate(' + 90 + 'deg)';
                };

            }

            function processPhoto(image) {
                var percent_cover = 0.00;
                var RED_CUTOFF = 200;
                var GREEN_CUTOFF = 150;
                var BLUE_CUTOFF = 200;
                var canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
                count_canopy = 0;
                total_size = image.width * image.height;
                for (i = 0; i < image.width; i++) {
                    for (j = 0; j < image.height; j++) {
                        Data = canvas.getContext('2d').getImageData(i, j, 1, 1).data;
                        if ((Data[0] < RED_CUTOFF) || (Data[1] < GREEN_CUTOFF) || (Data[2] < BLUE_CUTOFF)) {
                            count_canopy += 1;
                        } else {
                            canvas.fillStyle = 'red';
                            canvas.fillRect(i, j, 1, 1);
                        }
                    }
                }
                percent_cover = (count_canopy / total_size) * 100;
                return (percent_cover);
            }

            function cameraError(message) {
                console.log('Failed because: ' + message);
            }


        }
    },

};

app.initialize();