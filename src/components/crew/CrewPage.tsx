import React, { useState, useEffect } from 'react'
import { Crew, Member } from '../../emulator/types'
import crewService from '../../emulator/crewService'
import CrewTable from './CrewTable'

function CrewPage (props: {}) {
  const [ crew, setCrew ] = useState<Crew>([])

  useEffect(
    () => {
      const unsub = crewService.onMemberUpdated(
        newMember => {
          // remove new item if it's already exists
          const _crew = crew.filter((member: Member) => newMember.id !== member.id)
          sortAndSetCrew([..._crew, newMember])
        }
      )
      return unsub
    }
  )

  useEffect(
    () => {
      crewService.getCrew().then(crew => sortAndSetCrew(crew))
    },
    []
  )

  function sortAndSetCrew (newCrew: Crew) {
    // sort newCrew by last name and set the state
    const sortedCrew = newCrew.sort((a, b) => a.lastName.localeCompare(b.lastName))
    setCrew(sortedCrew)
  }

  return <div className='tableContainer'>
    <CrewTable crew={crew} />
  </div>
}

export default CrewPage
