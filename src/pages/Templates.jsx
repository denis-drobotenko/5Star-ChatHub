import React, { useState, useRef } from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import IconButton from '@mui/joy/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Textarea from '@mui/joy/Textarea';
import Card from '@mui/joy/Card';
import Divider from '@mui/joy/Divider';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Chip from '@mui/joy/Chip';

// Общие стили заголовка (как в App.jsx)
const headerStyles = {
  height: '48px',
  minHeight: '48px',
  p: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid',
  borderColor: 'divider',
  bgcolor: 'var(--TableCell-headBackground)',
  fontFamily: 'var(--joy-fontFamily-body)',
  fontSize: 'var(--joy-fontSize-sm)',
  lineHeight: 'var(--joy-lineHeight-md)',
  color: 'var(--joy-palette-text-primary)',
  '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
  '--Table-headerUnderlineThickness': '1px'
};

export default function Templates({ initialTemplates }) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [currentText, setCurrentText] = useState('');
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const textareaRef = useRef(null);

  // Все доступные переменные
  const availableVariables = [
    'clientName',
    'clientEmail',
    'clientPhone',
    'clientRegDate',
    'clientStatus',
    'ticketId',
    'paymentDate'
  ];

  const insertVariable = (variable) => {
    const textarea = textareaRef.current;
    const value = `{${variable}}`;
    
    if (textarea && textarea.selectionStart !== undefined) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = currentText;
      
      const newText = text.substring(0, start) + value + text.substring(end);
      const newPosition = start + value.length;
      
      // Сначала обновляем текст
      setCurrentText(newText);
      
      // Сразу устанавливаем фокус и позицию курсора
      textarea.focus();
      textarea.setSelectionRange(newPosition, newPosition);
    } else {
      setCurrentText((prev) => prev + value);
      // Фокусируем и ставим курсор в конец
      if (textarea) {
        textarea.focus();
        const length = currentText.length + value.length;
        textarea.setSelectionRange(length, length);
      }
    }
  };

  // Фильтруем шаблоны по поисковому запросу
  const filteredTemplates = templates.filter(template =>
    template.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setCurrentText(template.text);
  };

  const handleDelete = (templateId) => {
    setTemplates(templates.filter(t => t.id !== templateId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentText.trim()) return;

    if (editingTemplate) {
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id 
          ? { ...t, text: currentText } 
          : t
      ));
      setEditingTemplate(null);
    } else {
      setTemplates([...templates, {
        id: Math.max(...templates.map(t => t.id)) + 1,
        text: currentText,
        variables: [] // Можно определять переменные автоматически из текста
      }]);
    }
    setCurrentText('');
  };

  const handleCancel = () => {
    setEditingTemplate(null);
    setCurrentText('');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        height: '100%',
        maxHeight: '100vh',
        overflow: 'hidden',
        bgcolor: 'background.surface',
        borderRadius: 'sm',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'sm',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%'
        }}
      >
        <Box component="header" sx={headerStyles}>
          <Typography
            sx={{
              fontWeight: 'lg',
              fontSize: 'lg',
            }}
          >
            Шаблоны сообщений
          </Typography>
          <Input
            size="sm"
            placeholder="Поиск шаблонов..."
            startDecorator={<SearchRoundedIcon />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ 
              width: '300px',
              ml: 'auto'
            }}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            minHeight: 0,
            maxHeight: 'calc(100vh - 200px)'
          }}
        >
          <List
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {filteredTemplates.map((template, index) => (
              <ListItem
                key={template.id}
                onClick={() => handleEdit(template)}
                sx={{
                  cursor: 'pointer',
                  py: 2,
                  borderBottom: index !== filteredTemplates.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                  '&:hover': {
                    bgcolor: 'background.level1',
                  },
                  ...(editingTemplate?.id === template.id && {
                    bgcolor: 'background.level1'
                  })
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    width: '100%'
                  }}
                >
                  <Typography
                    level="body-sm"
                    sx={{
                      flex: 1,
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {template.text}
                  </Typography>
                  <IconButton
                    size="sm"
                    variant="plain"
                    color="neutral"
                    sx={{ 
                      opacity: 0.5,
                      ml: 1,
                      '&:hover': { 
                        opacity: 1,
                        color: 'var(--joy-palette-danger-plainColor)'
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(template.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box
          component="footer"
          sx={{
            p: 2,
            bgcolor: 'var(--joy-palette-background-level1)',
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Box sx={{ flex: 1 }}>
                <Textarea
                  ref={textareaRef}
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  placeholder={editingTemplate 
                    ? "Редактирование шаблона..." 
                    : "Введите новый шаблон..."}
                  minRows={4}
                  sx={{ 
                    mb: 1,
                    bgcolor: 'var(--joy-palette-background-surface)',
                    '--Textarea-focusedHighlight': 'var(--joy-palette-primary-500)',
                  }}
                />
                <Box 
                  sx={{ 
                    display: 'flex', 
                    gap: 0.5, 
                    flexWrap: 'wrap'
                  }}
                >
                  {availableVariables.map((variable) => (
                    <Chip
                      key={variable}
                      size="sm"
                      variant="soft"
                      color="neutral"
                      onClick={() => insertVariable(variable)}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'background.level2'
                        }
                      }}
                    >
                      {variable}
                    </Chip>
                  ))}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button 
                  type="submit"
                  disabled={!currentText.trim()}
                >
                  {editingTemplate ? 'Сохранить' : 'Добавить'}
                </Button>
                {editingTemplate && (
                  <Button
                    variant="plain"
                    color="neutral"
                    onClick={handleCancel}
                  >
                    Отмена
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
} 