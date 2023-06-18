import { useEffect, useState } from 'react'

type GeoLocation = {
  type: string
  coordinates: number[]
}

type SourceMeteorData = {
  fall: string
  id: string
  mass: string
  name: string
  nametype: string
  recclass: string
  reclat: string
  reclong: string
  year: string
  geolocation: GeoLocation
}

type SourceMeteorDataArray = SourceMeteorData[]

export type MeteorData = {
  id: string
  name: string
  mass: number
  year: Date
  geolocation: GeoLocation
}

export type  MeteorSearch = {
  year?: string,
  mass?: {
    min: number,
    max: number
  }
}

function convertToMeteorData(data: SourceMeteorDataArray): MeteorData[] {
  return data.map(({ id, name, mass, year, geolocation }) => ({
    id,
    name,
    mass: parseFloat(mass),
    year: new Date(year),
    geolocation,
  }))
}

const matchesYear = (meteor: MeteorData, year: string | undefined) => {
  if(!year) {
    return true;
  }
  return meteor.year.getFullYear() === parseInt(year, 10);
}

const matchesMass = (meteor: MeteorData, mass: {min: number, max: number}| undefined) => {
  if(!mass) {
    return true;
  }
  return meteor.mass >= mass.min && meteor.mass <= mass.max;
}


export function useNasaStore() {
  const [data, setData] = useState<MeteorData[]>([])  
  const getAllData = async () => {
    const res = await fetch('https://data.nasa.gov/resource/y77d-th95.json')
    const result = (await res.json()) as unknown as SourceMeteorDataArray    
    setData(convertToMeteorData(result))
  }
  
  const findClosestInMass = (targetMass: number) : MeteorData[] => {
    const diffs = data.map((meteor) => Math.abs(meteor.mass - targetMass));
    const minDiff = Math.min(...diffs.filter(n=>!isNaN(n)));
    return data.filter((_meteor, index) => diffs[index] === minDiff);
  }

  const search = ({year, mass}: MeteorSearch): MeteorData[][] => {
    const result: MeteorData[] = [];
    let secondaryResult: MeteorData[] = [];

    for(const m of  data) {
      if(matchesYear(m, year) && matchesMass(m, mass)) {
        result.push(m)
      }
    }   
    if(mass && result.length === 0) {
      secondaryResult = findClosestInMass(mass.min);
    }    
    return [result, secondaryResult];
  }

  const getYearOptions = (queryYear: string) => {
    return queryYear ? [...(new Set(data.map((meteor) => {
      return meteor.year.getFullYear().toString()
    }).filter(y=>y.includes(queryYear))))].sort() : []
  }

  useEffect(() => {
    getAllData()
  }, [])

  return {
    data,    
    search,
    getYearOptions
  }
}
