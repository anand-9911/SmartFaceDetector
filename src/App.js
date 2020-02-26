import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecoginitation from './components/FaceRecoginitation/FaceRecoginitation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';


import './App.css';

import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '8f936481d0af4cda975b0a9d4753b3a0'
});


const particlesOptions = {
  "particles": {
    "number": {
      "value": 200
    },
    "size": {
      "value": 3
    }
  },
  "interactivity": {
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse",
        "color": "#00000"
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }
  onInputChange = (event) => {
    if (this.route === 'signout') {
      this.setState({ isSignedIn: false })
    } else if (this.route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ input: event.target.value })
  }

  calculateFaceLocation = (data) => {
    const calarifyFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: calarifyFace.left_col * width,
      topRow: calarifyFace.top_row * height,
      rightCol: width - (calarifyFace.right_col * width),
      bottomRow: height - (calarifyFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box })
  }


  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models.predict(

      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ isSignedIn: false })
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route });
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">

        <Particles className='particle'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {
          route === 'home'
            ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecoginitation box={box} imageUrl={imageUrl} />
            </div>
            : (
              route === 'signin'
                ? <SignIn onRouteChange={this.onRouteChange} />
                : <Register onRouteChange={this.onRouteChange} />
            )
        }

      </div>
    )
  }
}
export default App;
