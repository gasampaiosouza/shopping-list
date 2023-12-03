'use client'

import {
  createContext,
  ReactNode,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react'

import axios from 'axios'

export type ListItem = { id: string; label: string; isChecked: boolean }

type IListContext = {
  recommendations: string[]
  list: ListItem[] | null
  getItemRecommendations: (input: string) => Promise<string[]>
  clearRecommendations: () => void
  addNewItemToList: (label: string) => void
  removeItemFromList: (id: string) => void
  handleItemCheck: (id: string) => void
}

export const ListContext = createContext({} as IListContext)

type ListContextProviderProps = {
  children: ReactNode
}

export function ListContextProvider({ children }: ListContextProviderProps) {
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [list, setList] = useState<ListItem[] | null>(null)

  // This function is used to send the checked items to the bottom of the list
  const filterListByChecked = useCallback((list: ListItem[]) => {
    const uncheckedItems = list?.filter((item) => item.isChecked)
    const checkedItems = list
      ?.filter((item) => !item.isChecked)
      .sort((a, b) => a.label.localeCompare(b.label))

    return [...(checkedItems || []), ...(uncheckedItems || [])]
  }, [])

  useEffect(() => {
    const storagedList = localStorage.getItem('list')

    if (!storagedList) {
      setList([])
      return
    }

    const parsedList = JSON.parse(storagedList) as ListItem[]
    const filteredList = filterListByChecked(parsedList)

    setList(filteredList)
  }, [filterListByChecked])

  async function getItemRecommendations(input: string) {
    try {
      const URL = `https://api.frontendeval.com/fake/food/${input}`

      const { data } = await axios.get<string[]>(URL)

      setRecommendations(data)
      return data
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      return []
    }
  }

  function clearRecommendations() {
    setRecommendations([])
  }

  const handleItemCheck = useCallback((id: string) => {
    setList((prevList) => {
      if (!prevList) return []

      const newList = prevList.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )

      localStorage.setItem('list', JSON.stringify(newList))

      return newList
    })
  }, [])

  const addNewItemToList = useCallback(
    (label: string) => {
      if (!list) return

      const newId = Date.now().toString()

      const newList = [...list, { id: newId, label, isChecked: false }]

      localStorage.setItem('list', JSON.stringify(newList))
      setList(newList)
    },
    [list]
  )

  const removeItemFromList = useCallback((id: string) => {
    setList((prevList) => {
      if (!prevList) return []

      const newList = prevList.filter((item) => item.id !== id)

      localStorage.setItem('list', JSON.stringify(newList))

      return newList
    })
  }, [])

  return (
    <ListContext.Provider
      value={{
        getItemRecommendations,
        clearRecommendations,
        recommendations,
        list,
        addNewItemToList,
        removeItemFromList,
        handleItemCheck,
      }}
    >
      {children}
    </ListContext.Provider>
  )
}

export const useList = () => useContext(ListContext)
