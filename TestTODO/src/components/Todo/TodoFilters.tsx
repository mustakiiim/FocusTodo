import React from 'react';
import { Search, X } from 'lucide-react';
import type { Priority } from '../../types/todo';
import clsx from 'clsx';

interface TodoFiltersProps {
    search: string;
    setSearch: (value: string) => void;
    priority: 'all' | Priority;
    setPriority: (value: 'all' | Priority) => void;
}

export const TodoFilters: React.FC<TodoFiltersProps> = ({
    search,
    setSearch,
    priority,
    setPriority,
}) => {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search tasks..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                    <span className="text-sm font-medium text-gray-500">Priority:</span>
                    {(['all', 'low', 'medium', 'high'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPriority(p as 'all' | Priority)}
                            className={clsx(
                                "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors capitalize whitespace-nowrap",
                                priority === p
                                    ? "bg-indigo-100 text-indigo-700"
                                    : "text-gray-600 hover:bg-gray-100"
                            )}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
