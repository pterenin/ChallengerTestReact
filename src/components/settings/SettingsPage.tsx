import React, { useState, useEffect } from 'react'
import { Job } from '../../emulator/types'
import settingsService from '../../emulator/settingsService'

interface InputProps {
  job: Job
  onChange: (value: string) => void
  onBlur: () => void
  value: string
  validation: Validation
}

interface Validation {
  isValid: boolean,
  messages: string[]
}

function Input (props: InputProps) {
  return <div className='settingInput'>
    <label>
      <span className={props.job}>{props.job}</span>
      <input
        name={props.job}
        className={props.validation.isValid ? '' : 'not-valid'}
        onBlur={event => {
          props.onBlur()
        }}
        onChange={event => {
          props.onChange(event.target.value)
        }}
        value={props.value}
      />
      %
    </label>
    {props.validation.messages.map(message => <span key={message}>{message}</span>)}
  </div>
}

function SettingsPage (props: {}) {
  const [isLoading, setIsLoading] = useState(true)
  const [medic, setMedic] = useState('')
  const [engineer, setEngineer] = useState('')
  const [pilot, setPilot] = useState('')

  const [validation, setValidation] = useState({
    medic: { isValid: true, messages: [] } as Validation,
    engineer: { isValid: true, messages: [] } as Validation,
    pilot: { isValid: true, messages: [] } as Validation,
    form: { isValid: true, messages: [] } as Validation
  })

  useEffect(() => {
    const unsub = settingsService.onJobSplit(
      (jobSplit) => {
        setMedic(String(jobSplit.medic))
        setEngineer(String(jobSplit.engineer))
        setPilot(String(jobSplit.pilot))
        setIsLoading(false)
      }
    )
    return unsub
  }, [])

  function handleSubmit () {
    validate();
    
    if (!isFormValid()) {
      return
    }
    settingsService.setJobSplit({
      medic: parseInt(medic),
      engineer: parseInt(engineer),
      pilot: parseInt(pilot),
    })
  }

  function validateValue (value: string): Validation  {
    let isValid = true
    const messages: string[] = []
    const number = Number.parseInt(value)
    if (!Number.isInteger(number)) {
      isValid = false
      messages.push('The value should be an Integer')
    } else if (number < 0) {
      isValid = false
      messages.push('The value should be 0 or grater')
    } else if (number > 100) {
      isValid = false
      messages.push('The value should be 100 or less')
    }
    return { isValid, messages }
  }

  function isFormValid(): boolean {
    return Object.keys(validation).every(key => validation[key as keyof typeof validation].isValid);
  }

  function validate (): void {
    validation.medic = validateValue(medic)
    validation.engineer = validateValue(engineer)
    validation.pilot = validateValue(pilot)
    if (Number.parseInt(medic) + Number.parseInt(engineer) + Number.parseInt(pilot) !== 100) {
      validation.form.isValid = false
      validation.form.messages = ['The sum of 3 numbers should be 100%']
    } else {
      validation.form.isValid = true;
      validation.form.messages = []
    }
    setValidation({ ...validation })
  }

  if (isLoading) {
    return null
  }

  return <>
    <Input job={Job.medic} validation={validation.medic} onChange={setMedic} onBlur={validate} value={medic} />
    <Input job={Job.engineer} validation={validation.engineer} onChange={setEngineer} onBlur={validate} value={engineer} />
    <Input job={Job.pilot} validation={validation.pilot} onChange={setPilot} onBlur={validate} value={pilot} />

    <button onClick={handleSubmit} className={isFormValid() ? '' : 'disabled'}>
      Apply
    </button>
    <div>
      {validation.form.messages.map(message => <span key={message}>{message}</span>)}
    </div>
  </>
}

export default SettingsPage
