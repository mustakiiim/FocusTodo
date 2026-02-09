import React from 'react';
import type { Todo } from '../../types/todo'; // Import Type
import { TodoItem } from './TodoItem';

interface TodoListProps {
    todos: Todo[];
}

export const TodoList: React.FC<TodoListProps> = ({ todos }) => {
    if (todos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
                <p className="max-w-xs mx-auto mt-1">Try adjusting your filters or search query.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
            ))}
        </div>
    );
};
