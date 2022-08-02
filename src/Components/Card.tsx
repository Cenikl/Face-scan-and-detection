import React, {FC, useState} from 'react';
import Logo from './icon-picture-17.jpg';
import '../App.css';
import * as AWS from "aws-sdk";
import {Credentials} from "aws-sdk";


const Card :FC = () => {
    // Link of the image
    const [link,setLinkle] = useState(Logo);

    //Style for the bounding box
    const [test, setTest] = useState({
        width:0,
        height:0,
        marginTop:0,
        marginLeft:0,
        border: '0px solid limegreen'
    });

    //Variables for style
     var margTop = 0;
     var margLeft = 0;
     var long = 0;
     var larg = 0;

     //Scan the image and give the results
    function ProcessImage() {
        AnonLog();
        const control = document.getElementById("imgfile");
        // @ts-ignore
        const file = control.files[0];

        //Get the size of the image
        var width = 0;
        var height = 0;
        var photo = new Image();
        photo.onload =function(){
            height = photo.naturalHeight;
            width = photo.naturalWidth;
        }
        photo.src = link;

        // Load base64 encoded image for display
        var reader = new FileReader();
        reader.onload = (function (theFile) {
            return function (e) {
                //Call Rekognition
                // @ts-ignore
                AWS.region = process.env.REACT_APP_REGION;
                var rekognition = new AWS.Rekognition();
                var params = {
                    Image: {
                        // @ts-ignore
                        Bytes: e.target.result
                    },
                    Attributes: [
                        'ALL',
                    ]
                };
                // @ts-ignore
                rekognition.detectFaces(params,function (err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else {

                        var table = "";
                       // show each face and build out the values
                        // @ts-ignore
                        for (var i = 0; i < data.FaceDetails.length; i++) {

                            //Set the bounding boxes
                            // @ts-ignore
                            margTop += parseInt(((data.FaceDetails[i].BoundingBox.Top)*(height)));
                            // @ts-ignore
                            margLeft += parseInt(((data.FaceDetails[i].BoundingBox.Left)*(width)));
                            // @ts-ignore
                            larg += parseInt(((data.FaceDetails[i].BoundingBox.Width)*(width)));
                            // @ts-ignore
                            long += parseInt(((data.FaceDetails[i].BoundingBox.Height)*(height)));
                            setTest({
                                width:larg,
                                height:long,
                                marginTop:margTop,
                                marginLeft:margLeft,
                                border: '1px solid limegreen'
                            });

                            //Loop to get all values and confiences of emotions
                            var emotion = "";
                            // @ts-ignore
                            for(var y = 0; y < 8; y++){
                                // @ts-ignore
                                emotion += data.FaceDetails[i].Emotions[y].Type + " (" + data.FaceDetails[i].Emotions[y].Confidence.toFixed(0) + " %) " + ' <br>';
                            }

                            // @ts-ignore
                            table = '<table><tr><th>Age Minimum</th><td>' + data.FaceDetails[i].AgeRange.Low +
                                // @ts-ignore
                                '</td></tr><tr><th>Age Maximum</th><td>' + data.FaceDetails[i].AgeRange.High +
                                // @ts-ignore
                                '</td></tr><tr><th>Gender</th><td>' + data.FaceDetails[i].Gender.Value + " (" + data.FaceDetails[i].Gender.Confidence.toFixed(0) + "%) " +
                                // @ts-ignore
                                '</td></tr><tr><th>Smile</th><td>' + data.FaceDetails[i].Smile.Value + " (" + data.FaceDetails[i].Smile.Confidence.toFixed(0) + "%) " +
                                // @ts-ignore
                                '</td></tr><tr><th>Sunglasses</th><td>' + data.FaceDetails[i].Sunglasses.Value + " (" + data.FaceDetails[i].Sunglasses.Confidence.toFixed(0) + "%) " +
                                // @ts-ignore
                                '</td></tr><tr><th>Beard</th><td>' + data.FaceDetails[i].Beard.Value + " (" + data.FaceDetails[i].Beard.Confidence.toFixed(0) + "%) " +
                                // @ts-ignore
                                '</td></tr><tr><th>EyesOpen</th><td>' + data.FaceDetails[i].EyesOpen.Value + " (" + data.FaceDetails[i].EyesOpen.Confidence.toFixed(0) + "%) " +
                                // @ts-ignore
                                '</td></tr><tr><th>Eyeglasses</th><td>' + data.FaceDetails[i].Eyeglasses.Value + " (" + data.FaceDetails[i].Eyeglasses.Confidence.toFixed(0) + "%) " +
                                // @ts-ignore
                                '</td></tr><tr><th>Sunglasses</th><td>' + data.FaceDetails[i].Mustache.Value + " (" + data.FaceDetails[i].Mustache.Confidence.toFixed(0) + "%) " +
                                // @ts-ignore
                                '</td></tr><tr><th>MouthOpen</th><td>' + data.FaceDetails[i].MouthOpen.Value + " (" + data.FaceDetails[i].MouthOpen.Confidence.toFixed(0) + "%) " +
                                // @ts-ignore
                                '</td></tr><tr><th>Mustache</th><td>' + data.FaceDetails[i].Mustache.Value + " (" + data.FaceDetails[i].MouthOpen.Confidence.toFixed(0) + "%) " +
                                // @ts-ignore
                                '</td></tr><tr><th>Quality</th><td>' + "Sharpness("  + data.FaceDetails[i].Quality.Sharpness.toFixed() + "%) " + " <br>Brightness(" + data.FaceDetails[i].Quality.Brightness.toFixed(0) + "%) " +
                                // @ts-ignore
                                '</td></tr><tr><th>Emotions</th><td>' + emotion +
                                '</td></tr>';
                        }
                        table += "</table>";
                        // @ts-ignore
                        document.getElementById("opResult").innerHTML = table;
                    }
                });
            };
        })(file);
        reader.readAsArrayBuffer(file);
    }

    //Connect to AWS with the credential
    function AnonLog() {
        // Configure the credentials provider to use your identity pool
        AWS.config.region = process.env.REACT_APP_REGION; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: process.env.REACT_APP_POOL_ID as string,
        });
        // Make the call to obtain credentials
        (AWS.config.credentials as Credentials).get(function () {
            // Credentials will be available when this function is called.
            const accessKeyId = AWS.config.credentials?.accessKeyId;
            const secretAccessKey = AWS.config.credentials?.secretAccessKey;
            const sessionToken = AWS.config.credentials?.sessionToken;
        });
    }

    //Begin all operations
    function loadPath(event:any){
            // @ts-ignore
            const image = document.getElementById("imgfile").value;
            const linkle = URL.createObjectURL(event.target.files[0]);
            const text = document.getElementById("opResult");
            setLinkle(linkle);
            ProcessImage();
        };

    return (
        <div className="content">
            <div className="picStat">
                <div className="pic" >
                    <form>
                        <label htmlFor="imgfile"> Select image
                        <input type="file" accept="image/*" id="imgfile" name="img" onInput={loadPath} /> <br/>
                        </label>
                    </form>
                    <div className="IMG">
                        <div className="border" style={test} ></div>
                    <img src={link}/>
                    </div>
                </div>
                <div className="status" >
                    <h1>Status</h1>
                    <hr/>
                    <div id="opResult">
                        <div className="first"></div>
                        <div className="second"></div>
                        <div className="third"></div>
                    </div>
                </div>
            </div>
            <p>Description of the actual face scanning</p> <br/>
        </div>
    )
};

export default Card;