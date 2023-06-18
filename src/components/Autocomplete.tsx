import { useEffect, useId, useRef, useState } from 'react'
import cn from 'classnames'
import './Autocomplete.css'

export type AutocompleteProps = {
  onValueChange: (value: string) => void
  onSelect: (value: string) => void
  options?: string[]
}

export function Autocomplete({ onValueChange, options, onSelect }: AutocompleteProps) {
  const [text, setText] = useState<string>('')
  const [optionsVisible, setOptionsVisible] = useState<boolean>(true)
  const [currentIndex, setCurrentIndex] = useState<number>(-1)
  const currentRef = useRef<HTMLLIElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const shouldShowOptions = options && options.length && optionsVisible

  const inputId = useId()

  const clickOutsideHandler = (event: MouseEvent) => {    
    if (event.target !== inputRef.current) {
      setOptionsVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', clickOutsideHandler)
    return () => {
      document.removeEventListener('click', clickOutsideHandler)
    }
  }, [])

  

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nValue = event.target.value
    if (nValue === text) return
    setOptionsVisible(true)
    setText(nValue)
    onValueChange(nValue)
  }

  const handleSelect = (option: string) => {
    setText(option)
    setOptionsVisible(false)
    setCurrentIndex(-1)
    onSelect(option)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOptionsVisible(false)
      return
    }
    if (event.key === 'Enter') {
      if (options && currentIndex >= 0 && currentIndex < options.length) {
        handleSelect(options[currentIndex])
      }
      return
    }
    if (['ArrowDown', 'ArrowUp'].includes(event.key) && options && options.length) {
      event.preventDefault()
      let newIndex = currentIndex
      if (event.key === 'ArrowDown') {
        newIndex++
      }
      if (event.key === 'ArrowUp') {
        newIndex--
      }
      if (newIndex < 0) {
        newIndex = options.length - 1
      }
      if (newIndex >= options.length) {
        newIndex = 0
      }
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex)
        setText(options[newIndex])
        if (currentRef.current) {
          currentRef.current.scrollIntoView({ block: 'center' })
        }
      }
    }
  }

  return (
    <div className="ac-container">
      <input
        ref={inputRef}
        className="ac-input"
        id={inputId}
        name={inputId}
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Search by year"
        autoComplete="off"
        role="combobox"
        list=""
        onKeyDown={handleKeyDown}
      />
      {shouldShowOptions ? (
        <ul className="ac-options">
          {options?.map((option, index) => {
            return (
              <li
                className={cn('ac-option', { ['current']: index === currentIndex })}
                key={option}
                onClick={() => handleSelect(option)}
                ref={index === currentIndex ? currentRef : null}
              >
                {option}
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
