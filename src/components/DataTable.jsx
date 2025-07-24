import React from "react";

const CategoryTable = ({ data }) => {
  return (
    <table className="border-collapse w-full">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-4 py-2">ID</th>
          <th className="border px-4 py-2">Icon</th>
          <th className="border px-4 py-2">Category Name</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td className="border px-4 py-2">{item.id}</td>
            <td className="border px-4 py-2 text-2xl">{item.icon}</td>
            <td className="border px-4 py-2">{item.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CategoryTable;
