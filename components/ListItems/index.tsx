'use client'

import { X } from 'lucide-react'

import { useList, ListItem as ListItemType } from '@/contexts/ListContext'
import { cn } from '@/lib/utils'

import { Checkbox } from '../ui/checkbox'
import { Skeleton } from '../ui/skeleton'

const ListItems = () => {
  const { list, removeItemFromList, handleItemCheck } = useList()

  if (list === null) {
    return Array.from({ length: 3 }, (_, index) => (
      <Skeleton key={index} className="h-[44px] w-full mb-[12px]" aria-label="loading" />
    ))
  }

  if (!list.length) return <EmptyListMessage />

  const handleRemoveItem = (id: string) => {
    removeItemFromList(id)
  }

  return (
    <div className="divide-y divide-[#f0f0f0] dark:divide-[#3d3d3d8c]">
      {list.map((item) => (
        <ListItem
          key={item.id}
          item={item}
          handleItemCheck={handleItemCheck}
          handleRemoveItem={handleRemoveItem}
        />
      ))}
    </div>
  )
}

interface ListItemProps {
  item: ListItemType
  handleItemCheck: (id: string) => void
  handleRemoveItem: (id: string) => void
}

const ListItem = ({ item, handleItemCheck, handleRemoveItem }: ListItemProps) => {
  const { id, label, isChecked } = item

  return (
    <div className="flex items-center justify-between">
      <label
        className="flex items-center space-x-3 w-full py-3.5 cursor-pointer"
        htmlFor={label}
      >
        <Checkbox
          defaultChecked={isChecked}
          id={label}
          className="data-[state=checked]:bg-[#5ec401] data-[state=checked]:border-0 w-[20px] h-[20px] data-[state=unchecked]:bg-[#F0F1F2] dark:data-[state=unchecked]:bg-[#19202a] border-0 rounded-full"
          onCheckedChange={() => handleItemCheck(id)}
        />
        <span
          className={cn('text-sm font-medium', {
            'line-through text-gray-500': isChecked,
          })}
        >
          {label}
        </span>
      </label>

      <button
        className="text-gray-500 hover:text-black dark:hover:text-white"
        onClick={() => handleRemoveItem(id)}
        aria-label="Remove item"
      >
        <X size={16} />
      </button>
    </div>
  )
}

const EmptyListMessage = () => (
  <div className="text-center text-gray-500 text-xs">
    <p>You don&apos;t have any items in your list yet.</p>
    <p>Start adding some!</p>
  </div>
)

export default ListItems
