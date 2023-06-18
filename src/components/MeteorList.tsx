import { MeteorData } from '../store/store'
import './MeteorList.css'

type MeteorListProps = {
  meteors: MeteorData[]
  showHeader?: boolean,
  onCardClick?: (meteor: MeteorData) => void
}
export function MeteorList({ meteors, showHeader, onCardClick }: MeteorListProps) {
  if (!meteors || !meteors.length) {
    return <p>No meteors found</p>
  }
  return (
    <>
      {showHeader ? <h2>{meteors.length} results found.</h2> : null}
      <ul className="card-list">
        {meteors.map((meteor) => {
          return <MeteorCard key={meteor.id} meteor={meteor} onClick={()=>onCardClick && onCardClick(meteor)} />
        })}
      </ul>
    </>
  )
}

function MeteorCard({ meteor, onClick }: { meteor: MeteorData, onClick?: () => void }) {
  const { name, id, geolocation, mass, year } = meteor
  return (
    <div className="card" onClick={onClick}>
      <div className="card-header">
        <div>{id}</div>
        <div>{name}</div>
      </div>
      <div>
        <div>Coords:</div>
        <div>{geolocation?.coordinates.join(', ')}</div>
      </div>
      <div>
        <div>Mass: </div>
        <div>{mass}</div>
      </div>
      <div>
        <div>Year:</div>
        <div>{year.getFullYear()}</div>
      </div>
    </div>
  )
}
