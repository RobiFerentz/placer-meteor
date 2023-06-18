import { useState } from 'react'
import './App.css'
import { Autocomplete } from './components/Autocomplete'
import { MeteorData, useNasaStore } from './store/store'
import { MeteorList } from './components/MeteorList'

function App() {
  const { search, getYearOptions } = useNasaStore()
  const [queryYear, setQueryYear] = useState<string>('')
  const [queryMass, setQueryMass] = useState<string>('')

  const handleMassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryMass(event.target.value)
  }
  console.log('queryYear', queryYear)
  const handleCardClick = (meteor: MeteorData) => { // TODO: do something interesting here
    console.log('Clicked on meteor', meteor)    
  }

  const options = getYearOptions(queryYear)

  const min = Number(queryMass)
  const massSearch = queryMass && !isNaN(min) ? { min, max: Number.MAX_VALUE } : undefined
  const [result, secondaryResult] = search({ year: queryYear, mass: massSearch })

  return (
    <>
      <header>
        <h1>Meteor Landings</h1>
      </header>
      <main>
        <div className="search">
          <Autocomplete onValueChange={setQueryYear} options={options} onSelect={setQueryYear} />
          <div>
            <input type="text" placeholder="Filter by Mass" value={queryMass} onChange={handleMassChange} />
          </div>
        </div>
        <section>
          {queryYear ? <MeteorList meteors={result} showHeader={true} onCardClick={handleCardClick} /> : null}
          {queryYear && secondaryResult.length ? (
            <>
              <div>The closest in mass are: </div>
              <br />
              <MeteorList meteors={secondaryResult} onCardClick={handleCardClick} />
            </>
          ) : null}
        </section>
      </main>
    </>
  )
}

export default App
