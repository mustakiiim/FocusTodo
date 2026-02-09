import React, { useState, useEffect } from 'react';
import { useTodos } from '../../context/TodoContext';
import { Modal } from '../UI/Modal';
import type { Todo, Priority } from '../../types/todo';

interface TodoModalProps {
    isOpen: boolean;
    onClose: () => void;
    todo?: Todo;
}

export const TodoModal: React.FC<TodoModalProps> = ({ isOpen, onClose, todo }) => {
    const { addTodo, updateTodo } = useTodos();
    const [text, setText] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Priority>('medium');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (todo) {
                setText(todo.text);
                setDescription(todo.description || '');
                setPriority(todo.priority);
                setDueDate(todo.dueDate || '');
            } else {
                setText('');
                setDescription('');
                setPriority('medium');
                setDueDate('');
            }
        }
    }, [isOpen, todo]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        if (todo) {
            updateTodo(todo.id, {
                text,
                description: description || undefined,
                priority,
                dueDate: dueDate || undefined,
            });
        } else {
            addTodo(text, priority, description, dueDate);
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={todo ? "Edit Task" : "Add New Task"}>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Task Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="e.g., Buy groceries"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
                        required
                        autoFocus
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add details about this task..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none h-28 placeholder:text-gray-400"
                    />
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Priority</label>
                        <div className="relative">
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as Priority)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white appearance-none"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Due Date</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-600"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                    >
                        {todo ? "Save Changes" : "Add Task"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
