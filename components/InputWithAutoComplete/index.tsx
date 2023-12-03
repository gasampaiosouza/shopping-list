import React, { useCallback, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useList } from '@/contexts/ListContext'
import { debounce } from '@/lib/debounce'

interface AutocompleteProps {
  callback: (value: string) => void
}

const DEFAULT_OPTION_INDEX = -1

const InputWithAutoComplete: React.FC<AutocompleteProps> = ({ callback }) => {
  const [activeOptionIndex, setActiveOptionIndex] = useState(DEFAULT_OPTION_INDEX)
  const [filteredOptions, setFilteredOptions] = useState<string[]>([])
  const [showOptions, setShowOptions] = useState(false)
  const [userInput, setUserInput] = useState('')

  const { getItemRecommendations, clearRecommendations } = useList()

  const filterOptions = useCallback((input: string, options: string[]) => {
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(input.toLowerCase())
    )

    return filtered
  }, [])

  async function handleRecommendations(input: string) {
    if (!input || input.length < 2) {
      clearRecommendations()
      return
    }

    const recommendations = await getItemRecommendations(input)
    const filteredRecommendations = filterOptions(input, recommendations)

    setActiveOptionIndex(DEFAULT_OPTION_INDEX)
    setFilteredOptions(filteredRecommendations)
    setShowOptions(true)
  }

  const changeDebouncedFn = useCallback(debounce(handleRecommendations, 400), [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setUserInput(input)

    changeDebouncedFn(input)
  }

  const handleOptionClick = (clickedOption: string) => {
    setActiveOptionIndex(DEFAULT_OPTION_INDEX)
    setFilteredOptions([])
    setShowOptions(false)
    setUserInput('')

    callback(clickedOption)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const lastIndex = filteredOptions.length - 1

    if (e.key === 'Enter') {
      setShowOptions(false)
      setUserInput('')
      callback(filteredOptions[activeOptionIndex] || userInput)
      return
    }

    if (e.key === 'ArrowUp') {
      if (activeOptionIndex === 0) return
      setActiveOptionIndex((prev) => prev - 1)
      return
    }

    if (e.key === 'ArrowDown') {
      if (activeOptionIndex === lastIndex) return
      setActiveOptionIndex((prev) => prev + 1)
      return
    }
  }

  const renderOptions = () => {
    if (!showOptions || !userInput) return null

    // no option found
    if (filteredOptions.length === 0) return null

    return (
      <ul className="mt-2 absolute top-[40px] left-0 border border-[#eaeaea] dark:border-0 bg-white dark:bg-[#14171D] w-full p-2 rounded-md h-auto max-h-80 md:max-h-max overflow-y-scroll md:overflow-hidden">
        {filteredOptions.map((option, index) => {
          const isActive =
            index === activeOptionIndex ? 'bg-[#f5f5f5] dark:bg-[#1c2029]' : ''

          return (
            <li
              key={option}
              className={`hover:bg-[#f5f5f5] dark:hover:bg-[#1c2029] text-sm p-2 rounded-md select-none ${isActive}`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          )
        })}
      </ul>
    )
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    callback(userInput)

    setUserInput('')
    setShowOptions(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-3 justify-between">
        <div className="w-full relative">
          <Input
            type="search"
            placeholder="What do you want to add to your list?"
            className="dark:border-[#242934] border border-[#eaeaea] focus-visible:ring-0 text-black dark:text-[#eaeaea] focus-visible:ring-offset-0"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            value={userInput}
          />

          {renderOptions()}
        </div>

        <Button type="submit" className="bg-[#5EC401] hover:bg-[#4ec101] text-white">
          Add
        </Button>
      </form>
    </>
  )
}

export default InputWithAutoComplete
