import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTodos } from '../../context/TodoContext';
import { ChevronDown, ChevronUp, PieChart as PieChartIcon } from 'lucide-react';

export const StatsGraph: React.FC = () => {
    const { todos } = useTodos();
    const [isOpen, setIsOpen] = useState(false);

    const completed = todos.filter(t => t.completed).length;
    const pending = todos.length - completed;

    const data = [
        { name: 'Completed', value: completed, color: '#10b981' }, // emerald-500
        { name: 'Pending', value: pending, color: '#f59e0b' }, // amber-500
    ];

    if (todos.length === 0) return null;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 overflow-hidden transition-all">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-2 text-gray-800 font-bold">
                    <PieChartIcon className="w-5 h-5 text-indigo-600" />
                    <h3>Overview</h3>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 font-medium">
                        {Math.round((completed / todos.length) * 100)}% Done
                    </span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
            </button>

            {isOpen && (
                <div className="p-6 pt-0 h-64 w-full animate-in slide-in-from-top-4 duration-300">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                                cornerRadius={4}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                iconType="circle"
                                iconSize={8}
                                wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 500 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};
