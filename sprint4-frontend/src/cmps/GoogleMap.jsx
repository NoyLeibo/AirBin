import React, { useState, useEffect } from "react"
import GoogleMapReact from 'google-map-react'
import { BsHouseFill } from "react-icons/bs";

const AnyReactComponent = ({ text }) => <div className="flex column align-center"><BsHouseFill size="22" className="map-house-icon" /><div className="flex column text-center  fs12">{text}</div></div>
const API_KEY='AIzaSyB0dUlJsQSAuB636Yc1NGBUaJbwvYjfS1s'
export default function SimpleMap({lat=32.109333,lng=34.855499,marker}){
  if(lat<-90||lat>90){
    lat=0
  }
  const [mapCenter, setMapCenter] = useState({ lat: lat, lng: lng })
  useEffect(() => {
    // Simulate changing coordinates every 3 seconds (you can replace this with your data updating logic)
    const interval = setInterval(() => {
      setMapCenter({ lat: lat, lng: lng })
    }, 1000)

    return () => clearInterval(interval)
  }, [lat, lng])
  return (
    <div style={{ height: '500px', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: API_KEY }} 
        defaultCenter={{ lat: lat, lng: lng }}
        center={mapCenter}
        defaultZoom={11}
      >
        <AnyReactComponent
          lat={mapCenter.lat}
          lng={mapCenter.lng}
          text={marker}
        />
      </GoogleMapReact>
    </div>
  )
// export default function SimpleMap({lat=32.109333,lng=34.855499,marker}){
//   const defaultProps = {
//     center: {
//       lat: lat,
//       lng: lng
//     },
//     zoom: 11
//   };

//   return (
//     // Important! Always set the container height explicitly
//     <div style={{ height: '500px', width: '100%' }}>
//       <GoogleMapReact
//         bootstrapURLKeys={{ key: "AIzaSyB0dUlJsQSAuB636Yc1NGBUaJbwvYjfS1s" }}
//         defaultCenter={defaultProps.center}
//         defaultZoom={defaultProps.zoom}
//       >  
//         <AnyReactComponent
//           lat={lat}
//           lng={lng}
//           text={"🚩" + marker}
//         />
//       </GoogleMapReact>
//     </div>
//   );
}