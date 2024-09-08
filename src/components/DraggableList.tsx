import { useState } from 'react';
import { XIcon } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  closestCenter,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DndContext,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from './ui/button';

export type Item = {
  id: number;
  artist: string;
  title: string;
  sequence: number;
};

const data = [
  {
    id: 1,
    artist: 'The Beatles',
    title: 'Hey Jude',
    sequence: 1,
  },
  {
    id: 2,
    artist: 'Neil Young',
    title: 'My My, Hey Hey',
    sequence: 2,
  },
  {
    id: 3,
    artist: 'The Rolling Stones',
    title: 'Wild Horses',
    sequence: 3,
  },
  {
    id: 4,
    artist: 'Led Zeppelin',
    title: 'Ten Years Gone',
    sequence: 4,
  },
  {
    id: 5,
    artist: 'Triumph',
    title: 'Magic Power',
    sequence: 5,
  },
];

export function DraggableList() {
  const [items, setItems] = useState(data);
  const [activeItem, setActiveItem] = useState<Item | undefined>(undefined);

  // for input methods detection
  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  const removeItem = (id: number) => {
    const updated = items
      .filter((item) => item.id !== id)
      .map((item, i) => ({ ...item, sequence: i + 1 }));

    setItems(updated);
  };

  // triggered when dragging starts
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveItem(items?.find((item) => item.sequence === active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeItem = items.find((ex) => ex.sequence === active.id);
    const overItem = items.find((ex) => ex.sequence === over.id);

    if (!activeItem || !overItem) {
      return;
    }

    const activeIndex = items.findIndex((ex) => ex.sequence === active.id);
    const overIndex = items.findIndex((ex) => ex.sequence === over.id);

    if (activeIndex !== overIndex) {
      setItems((prev) => {
        const updated = arrayMove(prev, activeIndex, overIndex).map(
          (ex, i) => ({ ...ex, sequence: i + 1 })
        );

        return updated;
      });
    }
    setActiveItem(undefined);
  };

  const handleDragCancel = () => {
    setActiveItem(undefined);
  };

  return (
    <div className='flex flex-col w-1/2 gap-2 mx-auto'>
      {items?.length ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={items.map((item) => item.sequence)}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence>
              {items.map((item) => (
                <SortableRow
                  key={item.id}
                  item={item}
                  removeItem={removeItem}
                />
              ))}
            </AnimatePresence>
          </SortableContext>

          <DragOverlay adjustScale style={{ transformOrigin: '0 0 ' }}>
            {activeItem ? (
              <SortableRow
                item={activeItem}
                removeItem={removeItem}
                forceDragging={true}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : null}
    </div>
  );
}

type SortableRowProps = {
  item: Item;
  removeItem: (id: number) => void;
  forceDragging?: boolean;
};

function SortableRow({
  item,
  removeItem,
  forceDragging = false,
}: SortableRowProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({
    id: item.sequence,
  });

  const parentStyles = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    opacity: isDragging ? '0.4' : '1',
    lineHeight: '4',
  };

  const draggableStyles = {
    cursor: isDragging || forceDragging ? 'grabbing' : 'grab',
  };

  return (
    <motion.article
      className='flex flex-col w-full gap-2 [&:not(:first-child)]:pt-2'
      ref={setNodeRef}
      style={parentStyles}
      initial={{ x: 25, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 25, opacity: 0 }}
      layout
    >
      <div className='flex items-center w-full gap-2 overflow-hidden rounded-md bg-secondary'>
        <div className='flex items-center w-12 h-full bg-ring'>
          <p className='w-full text-center text-secondary'>{item.sequence}</p>
        </div>

        <div
          ref={setActivatorNodeRef}
          className='flex-grow p-2'
          style={draggableStyles}
          {...attributes}
          {...listeners}
        >
          <h2 className='text-lg'>{item.title}</h2>
          <p className='text-sm'>{item.artist}</p>
        </div>

        <div className='flex items-center w-12 h-full'>
          <Button
            type='button'
            size='icon'
            variant='outline'
            onClick={() => removeItem(item.id)}
          >
            <XIcon className='text-red-500' />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
