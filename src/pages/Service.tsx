import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Define types for table, column, and row data
interface Table {
  table_name: string;
}

interface Column {
  COLUMN_NAME: string;
}

interface RowData {
  [key: string]: any; // Key-value pairs representing dynamic row data
}

interface ColumnDef {
  field: string;
}

const App: React.FC = () => {

  console.log("hello");
  const [tables, setTables] = useState<Table[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedTable, setSelectedTable] = useState<string>(''); // Track selected table
  const [tableData, setTableData] = useState<RowData[]>([]); // Data for the table
  const [columnDefs, setColumnDefs] = useState<ColumnDef[]>([]); // Column definitions for AgGrid

  // Fetch the list of tables from the backend when the component mounts
  useEffect(() => {

    axios
      .get<Table[]>('http://localhost:5001/api/tables')
      .then((response) => {
        setTables(response.data); // Store the table data
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching tables');
        setLoading(false);
      });
  }, []);

  // Fetch columns of the selected table
  const fetchColumns = (tableName: string): void => {
    if (!tableName) return;

    setLoading(true);
    setSelectedTable(tableName); // Set the selected table name
    axios
      .get<Column[]>(`http://localhost:5001/api/columns/${tableName}`)
      .then((response) => {
        setColumns(response.data); // Store the column data
        fetchTableData(tableName); // Fetch data after fetching columns
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching columns');
        setLoading(false);
      });
  };

  // Fetch table data when a table is selected
  const fetchTableData = (tableName: string): void => {
    if (!tableName) return;

    setLoading(true);
    axios
      .get<RowData[]>(`http://localhost:5001/api/data/${tableName}`) // Fetch data from backend
      .then((response) => {
        setTableData(response.data); // Store the table data
        if (response.data.length > 0) {
          const cols: ColumnDef[] = Object.keys(response.data[0]).map((key) => ({ field: key })); // Set column definitions
          setColumnDefs(cols);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching table data');
        setLoading(false);
      });
  };


  return (
    <div>

      <h1>SQL Server Table Viewer</h1>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <div>
          <label htmlFor="table-select">GET A TABLE TO DISPLAY: </label>
          <select
            id="table-select"
            value={selectedTable}
            onChange={(e) => fetchColumns(e.target.value)} // Fetch columns and data when table is selected
          >
            <option value="">--Choose a table--</option>
            {tables.map((table, index) => (
              <option key={index} value={table.table_name}>
                {table.table_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Display columns of the selected table */}
      {selectedTable && (
        <div>
          <h2>Columns in {selectedTable}</h2>
          {columns.length > 0 ? (
            <ul>
              {columns.map((column, index) => (
                <li key={index}>{column.COLUMN_NAME}</li>
              ))}
            </ul>
          ) : (
            <p>No columns found for this table.</p>
          )}
        </div>
      )}

      {/* Display table data using AgGrid */}
      {tableData.length > 0 && (
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>

          <h2>Table details</h2>
          <AgGridReact rowData={tableData} columnDefs={columnDefs} />
        </div>
      )}
    </div>
  );
};

export default App;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// interface Table {
//   table_name: string;
// }

// interface Column {
//   COLUMN_NAME: string;
// }

// interface RowData {
//   [key: string]: any;
// }

// const App: React.FC = () => {
//   const [tables, setTables] = useState<Table[]>([]);
//   const [columns, setColumns] = useState<Column[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [selectedTable, setSelectedTable] = useState<string>('');
//   const [tableData, setTableData] = useState<RowData[]>([]);

//   useEffect(() => {
//     axios
//       .get<Table[]>('http://localhost:5001/api/tables')
//       .then((response) => {
//         setTables(response.data);
//         setLoading(false);
//       })
//       .catch(() => {
//         setError('Error fetching tables');
//         setLoading(false);
//       });
//   }, []);

//   const fetchColumns = (tableName: string): void => {
//     if (!tableName) return;

//     setLoading(true);
//     setSelectedTable(tableName);
//     axios
//       .get<Column[]>(`http://localhost:5001/api/columns/${tableName}`)
//       .then((response) => {
//         setColumns(response.data);
//         fetchTableData(tableName);
//         setLoading(false);
//       })
//       .catch(() => {
//         setError('Error fetching columns');
//         setLoading(false);
//       });
//   };

//   const fetchTableData = (tableName: string): void => {
//     if (!tableName) return;

//     setLoading(true);
//     axios
//       .get<RowData[]>(`http://localhost:5001/api/data/${tableName}`)
//       .then((response) => {
//         setTableData(response.data);
//         setLoading(false);
//       })
//       .catch(() => {
//         setError('Error fetching table data');
//         setLoading(false);
//       });
//   };

//   return (
//     <div>
//       <h1>Tables in SQL Database</h1>

//       {loading && <p>Loading...</p>}
//       {error && <p>{error}</p>}

//       {!loading && !error && (
//         <div>
//           <label htmlFor="table-select">Get a tablename: </label>
//           <select
//             id="table-select"
//             value={selectedTable}
//             onChange={(e) => fetchColumns(e.target.value)}
//           >
//             <option value="">--Choose a table--</option>
//             {tables.map((table, index) => (
//               <option key={index} value={table.table_name}>
//                 {table.table_name}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {selectedTable && columns.length > 0 && (
//         <div>
//           <h2>Columns in {selectedTable}</h2>
//           <ul>
//             {columns.map((column, index) => (
//               <li key={index}>{column.COLUMN_NAME}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {tableData.length > 0 && (
//         <div>
//           <h2>Table Data</h2>
//           <table className="table-style">
//             <thead>
//               <tr>
//                 {columns.map((column, index) => (
//                   <th key={index}>{column.COLUMN_NAME}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {tableData.map((row, index) => (
//                 <tr key={index}>
//                   {columns.map((column, colIndex) => (
//                     <td key={colIndex}>{row[column.COLUMN_NAME]}</td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;

