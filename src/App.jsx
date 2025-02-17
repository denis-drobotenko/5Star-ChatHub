import React, { useState, useEffect, useRef } from 'react'
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles'
import CssBaseline from '@mui/joy/CssBaseline'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import ListItemButton from '@mui/joy/ListItemButton'
import Avatar from '@mui/joy/Avatar'
import IconButton from '@mui/joy/IconButton'
import ChatRoundedIcon from '@mui/icons-material/ChatRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import ListItemDecorator from '@mui/joy/ListItemDecorator'
import Chip from '@mui/joy/Chip'
import Button from '@mui/joy/Button'
import Input from '@mui/joy/Input'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import Card from '@mui/joy/Card'
import Divider from '@mui/joy/Divider'
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded'
import Logs from './pages/Logs'
import { logger, LogType } from './utils/logger'
import { deepmerge } from '@mui/utils';
import { extendTheme } from '@mui/joy/styles';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Templates from './pages/Templates';
import SettingsIcon from '@mui/icons-material/Settings';
import Textarea from '@mui/joy/Textarea'

// Настройка темы
const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        background: {
          body: 'var(--joy-palette-neutral-50)',
          surface: 'var(--joy-palette-common-white)',
        },
      },
    },
    dark: {
      palette: {
        background: {
          body: 'var(--joy-palette-common-black)',
          surface: 'var(--joy-palette-neutral-900)',
        },
      },
    },
  },
  components: {
    JoyBox: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.vars.radius.sm,
        }),
      },
    },
  },
});

// Общий стиль для всех заголовков блоков
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
  position: 'sticky',
  top: 0,
  zIndex: 'var(--joy-zIndex-table)',
  '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
  '--Table-headerUnderlineThickness': '1px'
};

// Стиль для текста заголовков
const headerTitleStyles = {
  fontWeight: 'var(--joy-fontWeight-lg)',
  fontSize: 'var(--joy-fontSize-lg)',
  color: 'var(--joy-palette-text-primary)',
  fontFamily: 'var(--joy-fontFamily-display)',
  lineHeight: 'var(--joy-lineHeight-md)'
};

// Общий стиль для текста в блоках
const contentTextStyles = {
  fontSize: 'sm',
  fontFamily: 'var(--joy-fontFamily-body)',
  color: 'text.primary'
};

function ColorSchemeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }

  return (
    <IconButton
      id="toggle-mode"
      size="sm"
      variant="soft"
      color="neutral"
      onClick={() => {
        if (mode === 'light') {
          setMode('dark');
        } else {
          setMode('light');
        }
      }}
      sx={{
        '--IconButton-size': '32px'
      }}
    >
      {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}

// Шаблоны с переменными
const templatePatterns = [
  { 
    id: 1, 
    text: 'Здравствуйте, {clientName}! Чем могу помочь?',
    variables: ['clientName']
  },
  { 
    id: 2, 
    text: 'Спасибо за обращение, {clientName}! Хорошего дня!',
    variables: ['clientName']
  },
  { 
    id: 3, 
    text: 'Я отправил информацию на ваш email: {clientEmail}',
    variables: ['clientEmail']
  },
  { 
    id: 4, 
    text: 'Для подтверждения личности, скажите последние 4 цифры номера телефона {clientPhone}',
    variables: ['clientPhone']
  },
  { 
    id: 5, 
    text: 'Вижу, что вы с нами с {clientRegDate}. Спасибо за доверие!',
    variables: ['clientRegDate']
  },
  {
    id: 6,
    text: 'Подскажите, пожалуйста, какой у вас браузер и его версия?',
    variables: []
  },
  {
    id: 7,
    text: 'Попробуйте очистить кэш браузера и перезагрузить страницу',
    variables: []
  },
  {
    id: 8,
    text: 'Мы зафиксировали ваше обращение под номером #{ticketId}',
    variables: ['ticketId']
  },
  {
    id: 9,
    text: 'Я уточнил информацию у технического отдела. Проблема будет исправлена в течение часа.',
    variables: []
  },
  {
    id: 10,
    text: 'Давайте проверим настройки вашего аккаунта. Сейчас я отправлю инструкцию на {clientEmail}',
    variables: ['clientEmail']
  },
  {
    id: 11,
    text: 'К сожалению, в данный момент сервис временно недоступен. Мы работаем над устранением проблемы.',
    variables: []
  },
  {
    id: 12,
    text: 'Для решения вашего вопроса мне нужно подключить специалиста. Пожалуйста, подождите несколько минут.',
    variables: []
  },
  {
    id: 13,
    text: 'Отправьте, пожалуйста, скриншот ошибки',
    variables: []
  },
  {
    id: 14,
    text: 'Я проверил статус вашего платежа от {paymentDate}. Средства поступят в течение 24 часов.',
    variables: ['paymentDate']
  },
  {
    id: 15,
    text: 'Для восстановления доступа я отправил код подтверждения на номер {clientPhone}',
    variables: ['clientPhone']
  }
];

// Функция для подстановки значений в шаблон
const replaceVariables = (template, clientInfo) => {
  let text = template.text;
  template.variables.forEach(variable => {
    const mapping = {
      clientName: clientInfo.name,
      clientEmail: clientInfo.email,
      clientPhone: clientInfo.phone,
      clientRegDate: clientInfo.regDate,
      clientStatus: clientInfo.status
    };
    text = text.replace(`{${variable}}`, mapping[variable] || '');
  });
  return text;
};

// Добавим в начало компонента App
const availableVariables = [
  'clientName',
  'clientEmail',
  'clientPhone',
  'clientRegDate',
  'clientStatus',
  'ticketId',
  'paymentDate'
];

function App() {
  const [currentPage, setCurrentPage] = useState('chats');
  const [activeDialog, setActiveDialog] = useState(1); // ID активного диалога
  const [templateSearch, setTemplateSearch] = useState('');
  const [messageText, setMessageText] = useState('');
  const messageTextareaRef = useRef(null);

  // Обновленные тестовые данные
  const dialogs = [
    { 
      id: 1, 
      name: 'Иван Петров', 
      avatar: '/avatars/ivan.jpg',
      clientInfo: {
        name: 'Иван Петров',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67',
        status: 'Активный клиент',
        regDate: '01.01.2024'
      },
      messages: [
        { id: 1, sender: 'client', text: 'Здравствуйте! У меня проблема с оплатой.', time: '10:00' },
        { id: 2, sender: 'operator', text: 'Добрый день! Я помогу вам решить этот вопрос.', time: '10:01' },
        { id: 3, sender: 'ai', text: 'Подсказка: Проверьте соединение с интернетом и попробуйте очистить кэш браузера.', time: '10:01' },
        { id: 4, sender: 'client', text: 'При оплате пишет "Ошибка соединения"', time: '10:02' },
        { id: 5, sender: 'operator', text: 'Давайте проверим несколько вещей. Какой браузер вы используете?', time: '10:03' },
        { id: 6, sender: 'client', text: 'Google Chrome', time: '10:03' },
        { id: 7, sender: 'ai', text: 'В Chrome часто помогает очистка кэша и cookies. Давайте проведем пользователя через этот процесс.', time: '10:04' },
        { id: 8, sender: 'operator', text: 'Отличное предложение! Давайте попробуем очистить кэш. Нажмите Ctrl+Shift+Delete, выберите "Все время" и отметьте "Cookies" и "Кэш".', time: '10:04' },
        { id: 9, sender: 'client', text: 'Хорошо, сделал как вы сказали', time: '10:06' },
        { id: 10, sender: 'operator', text: 'Теперь попробуйте снова произвести оплату', time: '10:06' },
        { id: 11, sender: 'client', text: 'Да, теперь всё работает! Спасибо большое за помощь!', time: '10:08' },
        { id: 12, sender: 'operator', text: 'Рад, что смог помочь! Если возникнут еще вопросы, обращайтесь.', time: '10:08' },
        { id: 13, sender: 'ai', text: 'Отличное решение проблемы! Сохраняю этот сценарий для будущих обращений.', time: '10:09' },
      ]
    },
    { 
      id: 2, 
      name: 'Мария Сидорова', 
      avatar: '/avatars/maria.jpg',
      clientInfo: {
        name: 'Мария Сидорова',
        email: 'maria@example.com',
        phone: '+7 (999) 765-43-21',
        status: 'Новый клиент',
        regDate: '15.03.2024'
      },
      messages: [
        { id: 1, sender: 'client', text: 'Добрый день! Не могу зайти в личный кабинет', time: '09:30' },
        { id: 2, sender: 'operator', text: 'Здравствуйте! Сейчас помогу вам с этим', time: '09:31' },
        { id: 3, sender: 'ai', text: 'Возможно, проблема с кэшем браузера', time: '09:31' },
      ]
    },
    { 
      id: 3, 
      name: 'Алексей Иванов', 
      avatar: '/avatars/alexey.jpg',
      clientInfo: {
        name: 'Алексей Иванов',
        email: 'alexey@example.com',
        phone: '+7 (999) 555-55-55',
        status: 'VIP клиент',
        regDate: '10.06.2023'
      },
      messages: [
        { id: 1, sender: 'client', text: 'Когда будет доступна новая версия?', time: '11:20' },
        { id: 2, sender: 'operator', text: 'Обновление запланировано на следующую неделю', time: '11:22' },
      ]
    },
  ];

  // Получаем активный диалог и информацию о клиенте
  const activeDialogData = dialogs.find(d => d.id === activeDialog);
  const currentClientInfo = activeDialogData?.clientInfo;

  // Получаем готовые шаблоны с подставленными значениями для текущего клиента
  const templates = templatePatterns.map(template => ({
    id: template.id,
    text: currentClientInfo ? replaceVariables(template, currentClientInfo) : template.text
  }));

  // Фильтрация шаблонов
  const filteredTemplates = templates.filter(template =>
    template.text.toLowerCase().includes(templateSearch.toLowerCase())
  );

  // Функция определения цвета сообщения
  const getMessageColor = (sender) => {
    switch(sender) {
      case 'operator': return 'primary';
      case 'ai': return 'success';
      default: return 'neutral';
    }
  };

  // Добавим логирование действий
  const handlePageChange = (page) => {
    setCurrentPage(page)
    logger.action('Переход на страницу', { page })
  }

  // В начале компонента
  useEffect(() => {
    logger.info('Приложение запущено');
    return () => {
      logger.info('Приложение закрыто');
    };
  }, []);

  // В обработчике выхода
  const handleLogout = () => {
    logger.action('Выход из системы', { operator: 'Оператор' });
    // Логика выхода
  };

  // Обработчик выбора диалога
  const handleDialogSelect = (dialogId) => {
    setActiveDialog(dialogId);
    logger.action('Выбран диалог', { dialogId });
  };

  // В обработчике отправки сообщения
  const handleSendMessage = (text) => {
    logger.action('Отправка сообщения', { text });
    // Логика отправки
  };

  // В обработчике включения AI
  const handleAIToggle = () => {
    logger.action('Переключение AI');
    // Логика включения/выключения AI
  };

  const insertVariable = (variable) => {
    const textarea = messageTextareaRef.current;
    const value = `{${variable}}`;
    
    if (textarea && textarea.selectionStart !== undefined) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = messageText;
      
      const newText = text.substring(0, start) + value + text.substring(end);
      const newPosition = start + value.length;
      
      setMessageText(newText);
      
      textarea.focus();
      textarea.setSelectionRange(newPosition, newPosition);
    } else {
      setMessageText((prev) => prev + value);
      if (textarea) {
        textarea.focus();
        const length = messageText.length + value.length;
        textarea.setSelectionRange(length, length);
      }
    }
  };

  // Добавим функцию вставки шаблона
  const insertTemplate = (text) => {
    const textarea = messageTextareaRef.current;
    
    if (textarea && textarea.selectionStart !== undefined) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentText = messageText;
      
      const newText = currentText.substring(0, start) + text + currentText.substring(end);
      const newPosition = start + text.length;
      
      setMessageText(newText);
      
      textarea.focus();
      textarea.setSelectionRange(newPosition, newPosition);
    } else {
      setMessageText((prev) => prev + text);
      if (textarea) {
        textarea.focus();
        const length = messageText.length + text.length;
        textarea.setSelectionRange(length, length);
      }
    }
  };

  // Обновим рендер основного контента
  const renderContent = () => {
    return (
      <>
        {/* Sidebar */}
        <Box
          component="aside"
          id="Sidebar"
          sx={{
            width: '200px',
            height: '100%',
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.surface',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* ProjectName */}
          <Box
            component="header"
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.surface'
            }}
          >
            <Typography
              level="title-lg"
              sx={{
                fontSize: 'md',
                lineHeight: 1.2
              }}
            >
              5Star ChatHub
            </Typography>
            <ColorSchemeToggle />
          </Box>

          {/* Menu */}
          <List
            sx={{
              flex: 1,
              p: 2,
              gap: 1,
              '--ListItem-radius': '8px',
            }}
          >
            <ListItem>
              <ListItemButton 
                selected={currentPage === 'chats'}
                onClick={() => handlePageChange('chats')}
              >
                <ListItemDecorator>
                  <ChatRoundedIcon />
                </ListItemDecorator>
                <Typography level="body-sm">
                  Чаты
                </Typography>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton 
                selected={currentPage === 'templates'}
                onClick={() => handlePageChange('templates')}
              >
                <ListItemDecorator>
                  <DescriptionRoundedIcon />
                </ListItemDecorator>
                <Typography level="body-sm">
                  Шаблоны
                </Typography>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton 
                selected={currentPage === 'logs'}
                onClick={() => handlePageChange('logs')}
              >
                <ListItemDecorator>
                  <AssessmentRoundedIcon />
                </ListItemDecorator>
                <Typography level="body-sm">
                  Логи
                </Typography>
              </ListItemButton>
            </ListItem>
          </List>

          {/* Operator */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.surface'
            }}
          >
            <Avatar
              size="sm"
              src="/operator-avatar.jpg"
              sx={{ 
                '--Avatar-size': '32px',
                border: '2px solid',
                borderColor: 'background.body' 
              }}
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography level="title-sm">Оператор</Typography>
              <Typography level="body-xs">Online</Typography>
            </Box>
            <IconButton
              size="sm"
              variant="plain"
              color="neutral"
              sx={{
                '--IconButton-size': '32px',
                '&:hover': {
                  bgcolor: 'neutral.plainHoverBg'
                }
              }}
            >
              <LogoutRoundedIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Основной контент */}
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            minWidth: 0,
            gap: 1,
            p: { xs: 1, md: 1 },
            bgcolor: 'background.body',
            position: 'relative'
          }}
        >
          {currentPage === 'logs' ? (
            <Logs />
          ) : currentPage === 'templates' ? (
            <Templates initialTemplates={templatePatterns} />
          ) : currentPage === 'chats' ? (
            <>
              {/* Dialogs */}
              <Box
                component="section"
                id="Dialogs"
                sx={{
                  width: '250px',
                  bgcolor: 'background.surface',
                  borderRadius: 'sm',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'sm',
                  overflow: 'hidden'
                }}
              >
                <Box
                  component="header"
                  sx={headerStyles}
                >
                  <Typography sx={headerTitleStyles}>Диалоги</Typography>
                </Box>
                
                <List
                  sx={{
                    '--ListItem-radius': '8px',
                    '--ListItem-gap': '8px',
                    p: 2
                  }}
                >
                  {dialogs.map((dialog) => (
                    <ListItem key={dialog.id}>
                      <ListItemButton
                        selected={dialog.id === activeDialog}
                        onClick={() => handleDialogSelect(dialog.id)}
                        sx={{
                          p: 2,
                          '&:hover': {
                            bgcolor: 'background.level1'
                          }
                        }}
                      >
                        <ListItemDecorator>
                          <Avatar 
                            src={dialog.avatar}
                            sx={{ 
                              '--Avatar-size': '32px',
                              border: '2px solid',
                              borderColor: 'background.body'
                            }}
                          />
                        </ListItemDecorator>
                        <Typography 
                          level="body-sm" 
                          sx={contentTextStyles}
                        >
                          {dialog.name}
                        </Typography>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>

              {/* Chat */}
              <Box
                component="section"
                id="Chat"
                sx={{
                  flex: 1,
                  bgcolor: 'background.surface',
                  borderRadius: 'sm',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'sm',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
              >
                <Box
                  component="header"
                  id="ChatName"
                  sx={headerStyles}
                >
                  <Typography sx={headerTitleStyles}>
                    {activeDialogData?.name || 'Выберите диалог'}
                  </Typography>
                  <Button
                    size="sm"
                    variant="soft"
                    color="success"
                    startDecorator={<SmartToyRoundedIcon />}
                    sx={{
                      '--Button-gap': '8px',
                      '&:hover': {
                        bgcolor: 'success.softHoverBg'
                      }
                    }}
                  >
                    Вернуть AI
                  </Button>
                </Box>

                <Box
                  component="section"
                  id="Messages"
                  sx={{
                    flex: 1,
                    overflow: 'auto',
                    p: 2,
                    bgcolor: 'background.surface',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    gap: 2,
                    maxHeight: 'calc(100vh - 180px)'
                  }}
                >
                  {activeDialogData?.messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: message.sender === 'client' ? 'flex-start' : 'flex-end',
                        mb: 2
                      }}
                    >
                      <Card
                        variant="soft"
                        color={getMessageColor(message.sender)}
                        sx={{ 
                          maxWidth: '80%',
                          mb: 0.5,
                          boxShadow: 'sm',
                          '--Card-padding': '0.75rem'
                        }}
                      >
                        <Typography>
                          {message.text}
                        </Typography>
                      </Card>
                      <Typography 
                        level="body-xs" 
                        sx={{ 
                          px: 1,
                          color: 'neutral.500'
                        }}
                      >
                        {message.time}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box
                  component="footer"
                  id="NewMessage"
                  sx={{
                    p: 2,
                    bgcolor: 'var(--joy-palette-background-level1)',
                    borderTop: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Textarea
                        ref={messageTextareaRef}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        size="lg"
                        placeholder="Введите сообщение..."
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
                        {currentClientInfo && (
                          <>
                            <Chip
                              size="sm"
                              variant="soft"
                              color="neutral"
                              onClick={() => insertVariable('clientName')}
                              sx={{ 
                                cursor: 'pointer',
                                '&:hover': {
                                  bgcolor: 'background.level2'
                                }
                              }}
                            >
                              {currentClientInfo.name}
                            </Chip>
                            <Chip
                              size="sm"
                              variant="soft"
                              color="neutral"
                              onClick={() => insertVariable('clientEmail')}
                              sx={{ 
                                cursor: 'pointer',
                                '&:hover': {
                                  bgcolor: 'background.level2'
                                }
                              }}
                            >
                              {currentClientInfo.email}
                            </Chip>
                            <Chip
                              size="sm"
                              variant="soft"
                              color="neutral"
                              onClick={() => insertVariable('clientPhone')}
                              sx={{ 
                                cursor: 'pointer',
                                '&:hover': {
                                  bgcolor: 'background.level2'
                                }
                              }}
                            >
                              {currentClientInfo.phone}
                            </Chip>
                            <Chip
                              size="sm"
                              variant="soft"
                              color="neutral"
                              onClick={() => insertVariable('clientRegDate')}
                              sx={{ 
                                cursor: 'pointer',
                                '&:hover': {
                                  bgcolor: 'background.level2'
                                }
                              }}
                            >
                              {currentClientInfo.regDate}
                            </Chip>
                            <Chip
                              size="sm"
                              variant="soft"
                              color="neutral"
                              onClick={() => insertVariable('clientStatus')}
                              sx={{ 
                                cursor: 'pointer',
                                '&:hover': {
                                  bgcolor: 'background.level2'
                                }
                              }}
                            >
                              {currentClientInfo.status}
                            </Chip>
                          </>
                        )}
                      </Box>
                    </Box>
                    <Button 
                      variant="solid"
                      sx={{
                        alignSelf: 'flex-start',
                        borderRadius: '8px',
                        '&:hover': {
                          bgcolor: 'primary.solidHoverBg'
                        }
                      }}
                    >
                      <SendRoundedIcon />
                    </Button>
                  </Box>
                </Box>
              </Box>

              {/* Правая панель */}
              <Box
                component="aside"
                sx={{
                  width: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                {/* ClientInfo */}
                <Box
                  component="section"
                  id="ClientInfo"
                  sx={{
                    bgcolor: 'background.surface',
                    borderRadius: 'sm',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 'sm',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    component="header"
                    sx={headerStyles}
                  >
                    <Typography sx={headerTitleStyles}>Информация о клиенте</Typography>
                  </Box>
                  <Box 
                    sx={{ 
                      p: 2,
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 1 
                    }}
                  >
                    <Typography sx={contentTextStyles}>Имя: {currentClientInfo?.name || 'Выберите диалог'}</Typography>
                    <Typography sx={contentTextStyles}>Email: {currentClientInfo?.email || '-'}</Typography>
                    <Typography sx={contentTextStyles}>Телефон: {currentClientInfo?.phone || '-'}</Typography>
                    <Typography sx={contentTextStyles}>Статус: {currentClientInfo?.status || '-'}</Typography>
                    <Typography sx={contentTextStyles}>Дата регистрации: {currentClientInfo?.regDate || '-'}</Typography>
                  </Box>
                </Box>

                {/* TemplatesList */}
                <Box
                  component="section"
                  id="TemplatesList"
                  sx={{
                    flex: 1,
                    bgcolor: 'background.surface',
                    borderRadius: 'sm',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 'sm',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box
                    component="header"
                    sx={headerStyles}
                  >
                    <Typography sx={headerTitleStyles}>Шаблоны сообщений</Typography>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Input
                      size="sm"
                      placeholder="Поиск шаблонов..."
                      startDecorator={<SearchRoundedIcon />}
                      value={templateSearch}
                      onChange={(e) => setTemplateSearch(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <List
                      sx={{
                        '--ListItem-paddingY': '0.5rem',
                        '--ListItem-paddingX': '0.75rem',
                        overflow: 'auto',
                        maxHeight: 'calc(100vh - 400px)' // Оставляем место для поиска и заголовка
                      }}
                    >
                      {filteredTemplates.map((template, index) => (
                        <ListItem
                          key={template.id}
                          onClick={() => insertTemplate(template.text)}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: 'background.level1'
                            },
                            borderBottom: index !== filteredTemplates.length - 1 ? '1px solid' : 'none',
                            borderColor: 'divider'
                          }}
                        >
                          <Typography 
                            level="body-sm" 
                            sx={contentTextStyles}
                          >
                            {template.text}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Box>
              </Box>
            </>
          ) : null}
        </Box>
      </>
    );
  };

  return (
    <CssVarsProvider theme={theme} defaultMode="system">
      <CssBaseline />
      <Box
        component="main"
        sx={{
          display: 'flex',
          height: '100vh',
          width: '100%',
          bgcolor: 'background.body',
          overflow: 'hidden'
        }}
      >
        {renderContent()}
      </Box>
    </CssVarsProvider>
  );
}

export default App 