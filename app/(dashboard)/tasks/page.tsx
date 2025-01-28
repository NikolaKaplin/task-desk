'use client';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialItems = [
  { id: '1', content: 'Задача 1' },
  { id: '2', content: 'Задача 2' },
  { id: '3', content: 'Задача 3' },
];

const initialCompleted = [
  { id: '4', content: 'Завершенная задача 1' }
];

export default function Home() {
  const [items, setItems] = useState(initialItems);
  const [completed, setCompleted] = useState(initialCompleted);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Если элемент был перетащен в одно и то же место
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const itemsList = source.droppableId === 'items' ? items : completed;
      const setItemsList = source.droppableId === 'items' ? setItems : setCompleted;

      const [removed] = itemsList.splice(source.index, 1);
      itemsList.splice(destination.index, 0, removed);

      setItemsList([...itemsList]);
    } else {
      const sourceList = source.droppableId === 'items' ? items : completed;
      const targetList = source.droppableId === 'items' ? completed : items;
      const setSourceList = source.droppableId === 'items' ? setItems : setCompleted;
      const setTargetList = source.droppableId === 'items' ? setCompleted : setItems;

      const [removed] = sourceList.splice(source.index, 1);
      targetList.splice(destination.index, 0, removed);

      setSourceList([...sourceList]);
      setTargetList([...targetList]);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="items">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ width: '300px', background: '#f0f0f0', padding: '10px' }}
            >
              <h3>Несделанные задачи</h3>
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        userSelect: 'none',
                        padding: '10px',
                        margin: '5px',
                        background: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        ...provided.draggableProps.style,
                      }}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <Droppable droppableId="completed">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ width: '300px', background: '#f0f0f0', padding: '10px' }}
            >
              <h3>Завершенные задачи</h3>
              {completed.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        userSelect: 'none',
                        padding: '10px',
                        margin: '5px',
                        background: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        ...provided.draggableProps.style,
                      }}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}