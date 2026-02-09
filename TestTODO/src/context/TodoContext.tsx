import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Todo, Priority } from '../types/todo';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from './AuthContext';

interface TodoContextType {
    todos: Todo[];
    addTodo: (text: string, priority: Priority, description?: string, dueDate?: string) => Promise<void>;
    toggleTodo: (id: string) => Promise<void>;
    deleteTodo: (id: string) => Promise<void>;
    updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchTodos();
        } else {
            setTodos([]);
        }
    }, [user]);

    const fetchTodos = async () => {
        try {
            const { data } = await api.get('/todos');
            // Backend returns _id, frontend uses id. Map it?
            // Or update frontend types to use _id?
            // Let's map it for now to avoid breaking changes in components
            const mappedTodos = data.map((t: any) => ({
                ...t,
                id: t._id
            }));
            setTodos(mappedTodos);
        } catch (error) {
            console.error("Failed to fetch todos", error);
        }
    };

    const addTodo = async (text: string, priority: Priority, description?: string, dueDate?: string) => {
        try {
            const { data } = await api.post('/todos', { text, priority, description, dueDate });
            const newTodo = { ...data, id: data._id };
            setTodos((prev) => [newTodo, ...prev]);
            toast.success('Task added successfully!');
        } catch (error) {
            toast.error('Failed to add task');
        }
    };

    const toggleTodo = async (id: string) => {
        try {
            const todo = todos.find(t => t.id === id);
            if (!todo) return;

            const { data } = await api.put(`/todos/${id}`, { completed: !todo.completed });

            setTodos((prev) => prev.map((t) =>
                t.id === id ? { ...data, id: data._id } : t
            ));

            if (data.completed) {
                toast.success('Task completed!');
            }
        } catch (error) {
            toast.error('Failed to update task');
        }
    };

    const deleteTodo = async (id: string) => {
        try {
            await api.delete(`/todos/${id}`);
            setTodos((prev) => prev.filter((todo) => todo.id !== id));
            toast.success('Task deleted');
        } catch (error) {
            toast.error('Failed to delete task');
        }
    };

    const updateTodo = async (id: string, updates: Partial<Todo>) => {
        try {
            const { data } = await api.put(`/todos/${id}`, updates);
            setTodos((prev) =>
                prev.map((todo) => (todo.id === id ? { ...data, id: data._id } : todo))
            );
            toast.success('Task updated');
        } catch (error) {
            toast.error('Failed to update task');
        }
    };

    return (
        <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo, updateTodo }}>
            {children}
        </TodoContext.Provider>
    );
};

export const useTodos = () => {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('useTodos must be used within a TodoProvider');
    }
    return context;
};
