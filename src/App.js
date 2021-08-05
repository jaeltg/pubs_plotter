import './App.css';
import { useState, useEffect } from 'react';
import Request from './helpers/request';
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
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: true,
}

function App() {

  const [allPubLocations, setAllPubLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [shotScope, setShotScope] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null)

  useEffect(() => {
    const request = new Request();

    request.get('https://aqueous-shelf-20406.herokuapp.com/https://pubplotter.azurewebsites.net/Pubs/GetPubs')
    .then((data) => {
        setAllPubLocations(data)
    })
  }, []) 

  useEffect(() => {
    if (selectedLocation) {
    const request = new Request();

    request.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${selectedLocation.lat},${selectedLocation.lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`)
    .then((data) => {
        setSelectedAddress(data.results[0].formatted_address)
    })}

  }, [selectedLocation])

  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
  })

  if (loadError) return "Could not load map";
  if (!isLoaded) return "Loading..."


  if (isLoaded) {
    return (
    <div className="App">
      <h1 className="Title">PUB PLOTTER</h1>
      <GoogleMap 
      mapContainerStyle={containerStyle}
      center = {center}
      zoom = {13}
      options={options}
      >
        {allPubLocations.map((pubLocation, i) => 
          <Marker
          key={i} 
          position={pubLocation}
          icon={{
            url: '/icons/beer3.svg',
            scaledSize: new window.google.maps.Size(40, 40),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(20, 20),
          }}
          onClick={() => {setSelectedLocation(pubLocation)}}
          />
        )}
        <Marker
          position={{lat:55.93671, lng:-3.13809}}
          icon={{
            url: '/icons/golf-ball.svg',
            scaledSize: new window.google.maps.Size(30, 30),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(15, 15),
          }}
          onClick={() => {setShotScope({lat:55.93671, lng:-3.13809})}}
        />

        {selectedLocation ? (<InfoWindow position={{lat: selectedLocation.lat, lng: selectedLocation.lng}} onCloseClick={() => {setSelectedLocation(null)}}>
          <div className="visited">
            <h3>Pub Visited &#10004;</h3>
            <p>{selectedAddress}</p>
          </div>
        </InfoWindow>) : null}

       {shotScope ? (<InfoWindow position={{lat:55.93671, lng:-3.13809}} onCloseClick={() => {setShotScope(null)}}>
          <div className="message">
            <p>Hope my Pub Plotter is a...</p>
            <img src={require("./holeInOne.gif").default} alt="Hole in One"/>
            <h3 className="HIO">Hole in One!</h3>
          </div>
        </InfoWindow>) : null}
      </GoogleMap>
    </div>
  )
 }
}

export default App;
