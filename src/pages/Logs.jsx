import React, { useState } from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Table from '@mui/joy/Table';
import IconButton from '@mui/joy/IconButton';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Sheet from '@mui/joy/Sheet';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import { logger, LogType } from '../utils/logger';

export default function Logs() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  
  const logs = logger.getLogs();
  
  // Фильтрация логов
  const filteredLogs = logs.filter(log => {
    const matchesType = filter === 'all' || log.type === filter;
    const matchesSearch = search === '' || 
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      JSON.stringify(log.details).toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Экспорт логов
  const exportLogs = () => {
    const data = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 2, height: '100vh', overflow: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography level="h2">Логи системы</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startDecorator={<FileDownloadIcon />}
            onClick={exportLogs}
          >
            Экспорт
          </Button>
          <Button
            color="danger"
            startDecorator={<DeleteIcon />}
            onClick={() => logger.clear()}
          >
            Очистить
          </Button>
        </Box>
      </Box>

      <Sheet sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Select
          value={filter}
          onChange={(_, value) => setFilter(value)}
          sx={{ width: 200 }}
        >
          <Option value="all">Все типы</Option>
          <Option value={LogType.INFO}>Информация</Option>
          <Option value={LogType.ERROR}>Ошибки</Option>
          <Option value={LogType.WARNING}>Предупреждения</Option>
          <Option value={LogType.ACTION}>Действия</Option>
        </Select>
        
        <Input
          startDecorator={<SearchIcon />}
          placeholder="Поиск в логах..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1 }}
        />
      </Sheet>

      <Table>
        <thead>
          <tr>
            <th>Время</th>
            <th>Тип</th>
            <th>Сообщение</th>
            <th>Детали</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log) => (
            <tr key={log.id}>
              <td style={{ whiteSpace: 'nowrap' }}>
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td>
                <Typography
                  component="span"
                  sx={{
                    color: {
                      [LogType.INFO]: 'primary.500',
                      [LogType.ERROR]: 'danger.500',
                      [LogType.WARNING]: 'warning.500',
                      [LogType.ACTION]: 'success.500'
                    }[log.type]
                  }}
                >
                  {log.type.toUpperCase()}
                </Typography>
              </td>
              <td>{log.message}</td>
              <td>
                {log.details && (
                  <pre style={{ margin: 0 }}>
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
} 