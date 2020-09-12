import { Member, Job } from '../emulator/types'
import crewService from '../emulator/crewService'
import settingsService from '../emulator/settingsService'

class AutoAssignService {
  public onMemberAdded () {
    // subscribe to member added event
    const unsub = crewService.onMemberAdded(
      newMember => this.autoAssigne(newMember)
    )
    return unsub
  }

  private autoAssigne (newMember: Member) {
    const jobSplit = settingsService.getJobSplit()

    const summary = crewService.getSummary()
    let diff = 0
    // set initial jobToAssign as rendom value. It may change value later if it will find right pecentage gup
    let jobToAssign = Job[Object.keys(Job)[Math.floor(Math.random() * Object.keys(Job).length - 1)] as Job] 

    for (let job in jobSplit) {
      const currentPercent = (summary.counts[job as Job] / summary.totalMembers * 100)
      const expectedPercent = jobSplit[job as keyof typeof jobSplit]
      const _diff = expectedPercent - currentPercent
      // look for the biggest difference between expected percent and current percent
      if (_diff > diff) {
        // if this is the biggest difference so far than change jobToAssign value
        jobToAssign = job as Job
        diff = _diff
      }
    }
    crewService.assignJob(newMember.id, jobToAssign)
  }
}

export default new AutoAssignService()
