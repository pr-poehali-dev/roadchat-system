import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  text: string;
  username: string;
  timestamp: Date;
  isOwn: boolean;
}

interface User {
  email: string;
  nickname: string;
  isAuthenticated: boolean;
}

function Index() {
  const [currentView, setCurrentView] = useState<'auth' | 'nickname' | 'chat'>('auth');
  const [user, setUser] = useState<User>({ email: '', nickname: '', isAuthenticated: false });
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(42);
  const [isConnected, setIsConnected] = useState(true);
  const [cooldownTime, setCooldownTime] = useState(0);
  
  // Auth form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Nickname form state
  const [nicknameInput, setNicknameInput] = useState('');
  const [nicknameStatus, setNicknameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for demo
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        text: 'Привет всем! 👋',
        username: 'AstroNinja',
        timestamp: new Date(Date.now() - 300000),
        isOwn: false
      },
      {
        id: '2',
        text: 'Как дела, космонавты?',
        username: 'StarWanderer',
        timestamp: new Date(Date.now() - 240000),
        isOwn: false
      },
      {
        id: '3',
        text: 'Отлично! Готовлюсь к новой миссии 🚀',
        username: 'MoonExplorer',
        timestamp: new Date(Date.now() - 180000),
        isOwn: false
      }
    ];
    setMessages(mockMessages);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cooldown timer
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => setCooldownTime(cooldownTime - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownTime]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password.length >= 6) {
      setUser({ email, nickname: '', isAuthenticated: true });
      setCurrentView('nickname');
    }
  };

  const checkNickname = () => {
    if (nicknameInput.length >= 3) {
      setNicknameStatus('checking');
      setTimeout(() => {
        const isAvailable = !['admin', 'moderator', 'user'].includes(nicknameInput.toLowerCase());
        setNicknameStatus(isAvailable ? 'available' : 'taken');
      }, 800);
    }
  };

  const setNickname = () => {
    if (nicknameStatus === 'available') {
      setUser(prev => ({ ...prev, nickname: nicknameInput }));
      setCurrentView('chat');
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && cooldownTime === 0) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        username: user.nickname,
        timestamp: new Date(),
        isOwn: true
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setCooldownTime(30);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const logout = () => {
    setUser({ email: '', nickname: '', isAuthenticated: false });
    setCurrentView('auth');
    setMessages([]);
  };

  // Auth View
  if (currentView === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coral-50 via-teal-50 to-mint-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-scale-in">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 gradient-bg rounded-full flex items-center justify-center">
              <Icon name="MessageCircle" size={32} className="text-white" />
            </div>
            <CardTitle className="text-2xl gradient-text">REAL-TIME CHAT</CardTitle>
            <p className="text-muted-foreground">
              {isRegistering ? 'Создать новый аккаунт' : 'Войти в чат'}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Пароль (мин. 6 символов)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-12"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 gradient-bg hover:opacity-90 transition-opacity"
                disabled={!email || password.length < 6}
              >
                {isRegistering ? 'Зарегистрироваться' : 'Войти'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-coral hover:text-coral-600"
              >
                {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Nickname Selection View
  if (currentView === 'nickname') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coral-50 via-teal-50 to-mint-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-scale-in">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-teal rounded-full flex items-center justify-center">
              <Icon name="User" size={32} className="text-white" />
            </div>
            <CardTitle className="text-2xl">Выберите никнейм</CardTitle>
            <p className="text-muted-foreground">
              Никнейм должен быть уникальным и содержать 3-20 символов
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ваш никнейм"
                  value={nicknameInput}
                  onChange={(e) => {
                    setNicknameInput(e.target.value);
                    setNicknameStatus('idle');
                  }}
                  className="h-12"
                  minLength={3}
                  maxLength={20}
                />
                <Button
                  onClick={checkNickname}
                  disabled={nicknameInput.length < 3 || nicknameStatus === 'checking'}
                  variant="outline"
                  className="h-12 px-6"
                >
                  {nicknameStatus === 'checking' ? (
                    <Icon name="Loader2" size={16} className="animate-spin" />
                  ) : (
                    'Проверить'
                  )}
                </Button>
              </div>
              
              {nicknameStatus === 'available' && (
                <div className="flex items-center gap-2 text-green-600">
                  <Icon name="CheckCircle" size={16} />
                  <span>Никнейм свободен!</span>
                </div>
              )}
              
              {nicknameStatus === 'taken' && (
                <div className="flex items-center gap-2 text-red-600">
                  <Icon name="XCircle" size={16} />
                  <span>Никнейм уже занят</span>
                </div>
              )}
              
              <Button
                onClick={setNickname}
                disabled={nicknameStatus !== 'available'}
                className="w-full h-12 gradient-bg hover:opacity-90"
              >
                Войти в чат
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Chat View
  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-50 via-teal-50 to-mint-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center">
              <Icon name="MessageCircle" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">REAL-TIME CHAT</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="online-indicator"></div>
                <span>{onlineUsers} в сети</span>
                {isConnected ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <Icon name="Wifi" size={12} className="mr-1" />
                    Онлайн
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <Icon name="WifiOff" size={12} className="mr-1" />
                    Офлайн
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-medium">{user.nickname}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
            <Avatar>
              <AvatarFallback className="bg-coral text-white">
                {user.nickname.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={logout}>
              <Icon name="LogOut" size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto p-4">
        <Card className="h-[calc(100vh-200px)] flex flex-col">
          {/* Messages Area */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div className="max-w-xs">
                  {!message.isOwn && (
                    <div className="text-xs text-muted-foreground mb-1 px-3">
                      {message.username}
                    </div>
                  )}
                  <div className={`chat-message ${message.isOwn ? 'own' : 'other'}`}>
                    <div>{message.text}</div>
                    <div className={`text-xs mt-1 ${message.isOwn ? 'text-white/70' : 'text-gray-500'}`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>

          <Separator />

          {/* Message Input */}
          <div className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Введите сообщение..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={cooldownTime > 0}
                className="h-12"
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim() || cooldownTime > 0}
                className="h-12 px-6 gradient-bg hover:opacity-90"
              >
                {cooldownTime > 0 ? (
                  <span className="flex items-center gap-2">
                    <Icon name="Clock" size={16} />
                    {cooldownTime}s
                  </span>
                ) : (
                  <Icon name="Send" size={16} />
                )}
              </Button>
            </div>
            {cooldownTime > 0 && (
              <div className="text-xs text-muted-foreground mt-2">
                Подождите {cooldownTime} секунд перед отправкой следующего сообщения
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Index;