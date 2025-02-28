import React from "react";
import sizeData from "./SizeData";
function Size_Chart() {
  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-lg font-semibold mb-2">Size Chart</h2>
      <table className="border-collapse border border-gray-400 w-full">
        <thead>
          <tr className="bg-gray-200">
            {sizeData.headers.map((header, index) => (
              <th key={index} className="border border-gray-400 px-2 py-1">
                {header}
              </th>
              
            ))}
          </tr>
        </thead>
        <tbody>
          {sizeData.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border border-gray-400 px-2 py-1 font-medium">
                {row.label}
              </td>
              {row.values.map((value, colIndex) => (
                <td key={colIndex} className="border border-gray-400 px-2 py-1">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Size_Chart;
