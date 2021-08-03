import './App.css';

import {GoogleMap, useLoadScript, Marker, InfoWindow} from '@react-google-maps/api'
import mapStyle from './mapStyle.js';

const containerStyle = {
  width: '100vw',
  height: '100vh'
}

const center = {
  lat: 55.953251,
  lng: -3.188267
}
const options = {
  styles: mapStyle,
}

function App() {

  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
  })

  if (loadError) return "Could not load maps";
  if (!isLoaded) return "Loading..."


  return (
    <div className="App">
      <GoogleMap 
      mapContainerStyle={containerStyle}
      center = {center}
      zoom = {11}
      options={options}
      // onLoad = {onLoad}
      // onUnmount={onUnmount}
      ></GoogleMap>
    </div>
  )
}

export default App;
