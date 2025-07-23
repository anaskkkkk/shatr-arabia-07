import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Users, 
  Mail, 
  Trophy, 
  Clock, 
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GameInvite {
  id: string;
  from_user: {
    id: string;
    username: string;
    avatar: string;
    rating: number;
  };
  game_type: string;
  time_control: number;
  created_at: string;
}

interface Friend {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'in-game';
  rating: number;
}

interface ActiveGame {
  id: string;
  opponent: {
    username: string;
    avatar: string;
  };
  your_color: 'white' | 'black';
  status: 'waiting' | 'active' | 'finished';
  time_left: number;
}

const Dashboard = () => {
  const [user, setUser] = useState({
    username: 'اللاعب الذكي',
    avatar: '',
    rating: 1200,
    wins: 45,
    losses: 23,
    draws: 12
  });
  const [friends, setFriends] = useState<Friend[]>([]);
  const [invites, setInvites] = useState<GameInvite[]>([]);
  const [activeGames, setActiveGames] = useState<ActiveGame[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // REST: GET /api/user/profile -> get current user data
    // REST: GET /api/friends -> get friends list
    // REST: GET /api/invites -> get pending invites
    // REST: GET /api/games/active -> get active games
    
    // SOCKET: socket.on('friendStatusChanged', (data) => {
    //   // Update friend status in real-time
    // });
    
    // SOCKET: socket.on('inviteCreated', (invite) => {
    //   // Add new invite to list and show notification
    // });

    // Mock data for demo
    setFriends([
      { id: '1', username: 'أحمد الشطرنجي', avatar: '', status: 'online', rating: 1450 },
      { id: '2', username: 'فاطمة الذكية', avatar: '', status: 'in-game', rating: 1320 },
      { id: '3', username: 'محمد الاستراتيجي', avatar: '', status: 'offline', rating: 1180 }
    ]);

    setInvites([
      {
        id: '1',
        from_user: {
          id: '2',
          username: 'سارة المفكرة',
          avatar: '',
          rating: 1380
        },
        game_type: 'standard',
        time_control: 10,
        created_at: new Date().toISOString()
      }
    ]);
  }, []);

  const handleStartQuickGame = () => {
    // REST: POST /api/games/quick-match
    // Expected: { time_control: number, mode: 'random' }
    
    toast({
      title: "جاري البحث عن خصم",
      description: "سيتم إشعارك عند العثور على لاعب مناسب",
    });
  };

  const handleAcceptInvite = (inviteId: string) => {
    // REST: POST /api/invites/:id/accept
    // SOCKET: socket.emit('acceptInvite', { inviteId })
    
    toast({
      title: "تم قبول الدعوة",
      description: "سيتم توجيهك إلى المباراة",
    });
  };

  const handleDeclineInvite = (inviteId: string) => {
    // REST: POST /api/invites/:id/decline
    
    setInvites(invites.filter(invite => invite.id !== inviteId));
    toast({
      title: "تم رفض الدعوة",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'in-game': return 'bg-primary';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'متاح';
      case 'in-game': return 'في مباراة';
      case 'offline': return 'غير متصل';
      default: return 'غير معروف';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold">
                  {user.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-amiri text-xl font-bold">{user.username}</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    <Trophy className="w-3 h-3 ml-1" />
                    {user.rating}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="play" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="play" className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  ابدأ لعبة
                </TabsTrigger>
                <TabsTrigger value="friends" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  الأصدقاء
                </TabsTrigger>
                <TabsTrigger value="games" className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  المباريات
                </TabsTrigger>
              </TabsList>

              <TabsContent value="play">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="hover:shadow-elegant transition-shadow cursor-pointer"
                        onClick={handleStartQuickGame}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Play className="w-5 h-5 text-primary" />
                        لعبة سريعة
                      </CardTitle>
                      <CardDescription>
                        ابحث عن خصم عشوائي وابدأ المباراة فوراً
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="chess" className="w-full">
                        بحث عن خصم
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-elegant transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-secondary" />
                        تحدي صديق
                      </CardTitle>
                      <CardDescription>
                        أرسل دعوة لأحد أصدقائك لبدء مباراة
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="secondary" className="w-full">
                        اختر صديق
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-elegant transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-accent" />
                        ضد الحاسوب
                      </CardTitle>
                      <CardDescription>
                        تدرب مع الذكاء الاصطناعي
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full" disabled>
                        قريباً
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-elegant transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-primary-glow" />
                        اللوحة المادية
                      </CardTitle>
                      <CardDescription>
                        العب بالشطرنج المادي المتصل
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full" disabled>
                        قريباً
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="friends">
                <div className="space-y-4">
                  {friends.map((friend) => (
                    <Card key={friend.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar>
                                <AvatarImage src={friend.avatar} />
                                <AvatarFallback>{friend.username.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(friend.status)}`} />
                            </div>
                            <div>
                              <h3 className="font-cairo font-medium">{friend.username}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{getStatusText(friend.status)}</span>
                                <Badge variant="outline" className="text-xs">
                                  {friend.rating}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          {friend.status === 'online' && (
                            <Button size="sm" variant="chess">
                              تحدي
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="games">
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-amiri text-xl font-bold mb-2">لا توجد مباريات حالياً</h3>
                  <p className="text-muted-foreground">ابدأ لعبة جديدة لتظهر هنا</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="font-amiri">إحصائياتك</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>انتصارات</span>
                  <Badge variant="secondary">{user.wins}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>هزائم</span>
                  <Badge variant="destructive">{user.losses}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>تعادل</span>
                  <Badge variant="outline">{user.draws}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Invites */}
            {invites.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    الدعوات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {invites.map((invite) => (
                    <div key={invite.id} className="border rounded-lg p-3">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={invite.from_user.avatar} />
                          <AvatarFallback>{invite.from_user.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{invite.from_user.username}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {invite.time_control} دقيقة
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="chess"
                          className="flex-1 text-xs"
                          onClick={() => handleAcceptInvite(invite.id)}
                        >
                          قبول
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 text-xs"
                          onClick={() => handleDeclineInvite(invite.id)}
                        >
                          رفض
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;