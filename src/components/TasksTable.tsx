import React from 'react';
import Link from 'next/link';

interface TasksTableProps {
  className?: string;
  tasks?: Task[];
  isLoading?: boolean;
}

interface Task {
  id: string;
  date: string;
  service: string;
  provider: string;
  avatar: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
  amount: string;
}

const statusStyles = {
  Completed: 'bg-[#c9f5de] text-[#087443]',
  Pending: 'bg-[#e9edf4] text-[#526070]',
  Cancelled: 'bg-[#ffd7d4] text-[#b42318]',
};

const TasksTable: React.FC<TasksTableProps> = ({ className, tasks = [], isLoading = false }) => {
  return (
    <section className={`ui-card ${className ?? ''}`}>
      <div className="flex h-[37px] items-center justify-between px-3">
        <h2 className="text-[18px] font-bold text-[#202b3d]">Tasks Posted</h2>
        <Link href="/tasks" className="ui-link text-[14px]">
          View All
        </Link>
      </div>

      <table className="ui-table table-fixed">
        <thead>
          <tr className="ui-table-head h-[34px] text-left">
            <th className="w-[13%] px-3">Task ID</th>
            <th className="w-[15%] px-3">Date</th>
            <th className="w-[21%] px-3">Service Name</th>
            <th className="w-[22%] px-3">Provider</th>
            <th className="w-[14%] px-3">Status</th>
            <th className="w-[15%] px-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? <tr><td colSpan={6} className="p-4"><div role="status" aria-label="Loading tasks" className="h-20 animate-pulse rounded bg-slate-200" /></td></tr> : tasks.length === 0 ? <tr><td colSpan={6} className="p-6 text-center text-[12px] text-[#64748b]">No tasks available.</td></tr> : tasks.map((task) => (
            <tr key={task.id} className="ui-table-row h-[57px]">
              <td className="px-3 text-[15px] font-bold text-[#0b63ce]">{task.id}</td>
              <td className="px-3 text-[14px] text-[#66758e]">{task.date}</td>
              <td className="px-3 text-[15px] leading-5 text-[#26354d]">{task.service}</td>
              <td className="px-3">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e8edf5] text-[12px] font-bold text-[#67758b]">
                    {task.avatar}
                  </span>
                  <span className="text-[15px] leading-5 text-[#26354d]">{task.provider}</span>
                </div>
              </td>
              <td className="px-3">
                <span className={`status-badge ${statusStyles[task.status]}`}>
                  {task.status}
                </span>
              </td>
              <td className="px-3 text-right text-[15px] font-bold text-[#26354d]">{task.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default TasksTable;
