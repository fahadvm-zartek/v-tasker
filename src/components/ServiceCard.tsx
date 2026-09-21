import React from 'react';

interface ServiceCardProps {
  icon: React.ReactNode;
  name: string;
  tasks: number;
  revenue: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, name, tasks, revenue }) => {
  return (
    <tr className="ui-table-row">
      <td className="py-2">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-[#eef4ff]">
            {icon}
          </span>
          <span className="text-[14px] font-medium text-[#26354d]">{name}</span>
        </div>
      </td>
      <td className="py-2 text-right text-[14px] text-[#26354d]">{tasks}</td>
      <td className="py-2 text-right text-[14px] font-semibold text-[#26354d]">{revenue}</td>
    </tr>
  );
};

export default ServiceCard;
