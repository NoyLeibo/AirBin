import { StayPreview } from "./StayPreview"



export function StayList({stays}){

  return (
    <ul className="stay-list">
          {
          stays.map((stay) => {
           return <div key={stay._id}>
              <StayPreview stay={stay}/>
            </div> 
              }
          )
          }
        </ul>
  )
}