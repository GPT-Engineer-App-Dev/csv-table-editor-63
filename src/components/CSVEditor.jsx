import React, { useState } from 'react';
import { Button, Table, Thead, Tbody, Tr, Th, Td, Input, VStack, HStack } from '@chakra-ui/react';
import Papa from 'papaparse';

const CSVEditor = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      complete: (result) => {
        setHeaders(result.data[0]);
        setData(result.data.slice(1));
      }
    });
  };

  const handleInputChange = (rowIndex, columnIndex, value) => {
    const newData = [...data];
    newData[rowIndex][columnIndex] = value;
    setData(newData);
  };

  const addRow = () => {
    setData([...data, Array(headers.length).fill('')]);
  };

  const removeRow = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const downloadCSV = () => {
    const csv = Papa.unparse([headers, ...data]);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'edited_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <VStack spacing={4}>
      <Input type="file" accept=".csv" onChange={handleFileUpload} />
      <Table variant="simple">
        <Thead>
          <Tr>
            {headers.map((header, index) => (
              <Th key={index}>{header}</Th>
            ))}
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {row.map((cell, columnIndex) => (
                <Td key={columnIndex}>
                  <Input value={cell} onChange={(e) => handleInputChange(rowIndex, columnIndex, e.target.value)} />
                </Td>
              ))}
              <Td>
                <Button colorScheme="red" onClick={() => removeRow(rowIndex)}>Remove</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <HStack spacing={4}>
        <Button colorScheme="blue" onClick={addRow}>Add Row</Button>
        <Button colorScheme="green" onClick={downloadCSV}>Download CSV</Button>
      </HStack>
    </VStack>
  );
};

export default CSVEditor;