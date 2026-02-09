import { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import { TodoList } from '../components/Todo/TodoList';
import { TodoModal } from '../components/Todo/TodoModal';
import { StatsGraph } from '../components/Dashboard/StatsGraph';
import { TodoFilters } from '../components/Todo/TodoFilters';
import { Plus, LayoutList, LogOut, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import type { Priority } from '../types/todo';
import { useAuth } from '../context/AuthContext';

export function TodoPage() {
    const { todos } = useTodos();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
    const [priority, setPriority] = useState<'all' | Priority>('all');
    const { logout, user } = useAuth();

    const debouncedSearch = useDebounce(search, 300);

    const filteredTodos = todos.filter(todo => {
        const matchesSearch = todo.text.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            todo.description?.toLowerCase().includes(debouncedSearch.toLowerCase());

        const matchesStatus = activeTab === 'active' ? !todo.completed : todo.completed;
        const matchesPriority = priority === 'all' ? true : todo.priority === priority;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10 transition-shadow hover:shadow-sm">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-xl">
                            <LayoutList className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-800 tracking-tight">Focus TODO</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            to="/profile"
                            className="flex items-center gap-2 p-1 pr-3 hover:bg-gray-100 rounded-full transition-all group"
                        >
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-50 flex items-center justify-center border border-indigo-100 group-hover:border-indigo-300 transition-colors">
                                {user?.profilePicture ? (
                                    <img src={user.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon className="w-4 h-4 text-indigo-600" />
                                )}
                            </div>
                            <span className="text-sm font-medium text-gray-700 hidden sm:inline">{user?.name || user?.email}</span>
                        </Link>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 font-medium active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="hidden sm:inline">New Task</span>
                        </button>
                        <button
                            onClick={logout}
                            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8 pb-24">
                {/* Collapsible Stats */}
                <StatsGraph />

                {/* Tabs */}
                <div className="flex items-center gap-8 border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`pb-3 text-sm font-semibold transition-all relative ${activeTab === 'active'
                            ? 'text-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Active Tasks
                        {activeTab === 'active' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`pb-3 text-sm font-semibold transition-all relative ${activeTab === 'completed'
                            ? 'text-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Completed
                        {activeTab === 'completed' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>
                        )}
                    </button>
                </div>

                <TodoFilters
                    search={search} setSearch={setSearch}
                    priority={priority} setPriority={setPriority}
                />

                <TodoList todos={filteredTodos} />
            </main>

            <TodoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Mobile FAB */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-6 right-6 sm:hidden p-4 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-300 hover:bg-indigo-700 transition-colors z-40 active:scale-90"
                aria-label="Add new task"
            >
                <Plus className="w-6 h-6" />
            </button>
        </div>
    );
}
