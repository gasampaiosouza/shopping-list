'use client'

import { useList } from '@/contexts/ListContext'
import InputWithAutoComplete from '../InputWithAutoComplete'

const ListInput = () => {
  const { addNewItemToList, clearRecommendations } = useList()

  function handleInputAdditionBehavior(newItem: string) {
    if (!newItem) return

    addNewItemToList(newItem)
    clearRecommendations()
  }

  return (
    <div className="flex align-center mb-5">
      <div className="w-full relative">
        <InputWithAutoComplete callback={handleInputAdditionBehavior} />
      </div>
    </div>
  )
}

export default ListInput
