import React, { useState } from 'react';
import type { Todo } from '../../types/todo';
import { useTodos } from '../../context/TodoContext';
import { Trash2, CheckCircle2, Circle, Calendar, Pencil, AlertCircle } from 'lucide-react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import clsx from 'clsx';
import { TodoModal } from './TodoModal';

interface TodoItemProps {
    todo: Todo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
    const { toggleTodo, deleteTodo } = useTodos();
    const [isEditing, setIsEditing] = useState(false);

    const dueDateObj = todo.dueDate ? new Date(todo.dueDate) : null;
    const isOverdue = dueDateObj ? isPast(dueDateObj) && !isToday(dueDateObj) && !todo.completed : false;

    const priorityColor = {
        low: 'text-green-600 bg-green-50 border-green-200',
        medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        high: 'text-red-600 bg-red-50 border-red-200',
    };

    return (
        <>
            <div className={clsx(
                "group flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md",
                todo.completed && "bg-gray-50/50"
            )}>
                <button
                    onClick={() => toggleTodo(todo.id)}
                    className="mt-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                    {todo.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-blue-600" />
                    ) : (
                        <Circle className="w-6 h-6 hover:stroke-2" />
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className={clsx(
                            "font-semibold text-gray-900 leading-snug truncate pr-2",
                            todo.completed && "line-through text-gray-500"
                        )}>
                            {todo.text}
                        </h3>
                    </div>

                    {todo.description && (
                        <p className={clsx("text-sm text-gray-600 mt-1 line-clamp-2", todo.completed && "text-gray-400")}>
                            {todo.description}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                        {todo.dueDate && (
                            <div className={clsx(
                                "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md",
                                isOverdue ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600",
                                todo.completed && "opacity-50"
                            )}>
                                {isOverdue ? <AlertCircle className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
                                <span>
                                    {isToday(new Date(todo.dueDate)) ? 'Today' :
                                        isTomorrow(new Date(todo.dueDate)) ? 'Tomorrow' :
                                            format(new Date(todo.dueDate), 'MMM d, yyyy')}
                                </span>
                            </div>
                        )}
                        <span className={clsx("px-2.5 py-0.5 rounded-full border text-[10px] uppercase font-bold tracking-wider", priorityColor[todo.priority], todo.completed && "opacity-50")}>
                            {todo.priority}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        aria-label="Edit task"
                    >
                        <Pencil className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => deleteTodo(todo.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        aria-label="Delete task"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <TodoModal
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                todo={todo}
            />
        </>
    );
};
