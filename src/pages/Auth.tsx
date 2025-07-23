import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // REST: POST /api/auth/login
      // Expected: { email, password }
      // Response: { token, user: { id, username, avatar, rating } }
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في شطرنج العرب",
      });
      
      // Navigate to dashboard after successful login
      // window.location.href = '/dashboard';
      
    } catch (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "يرجى التحقق من البيانات المدخلة",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمتا المرور غير متطابقتان",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // REST: POST /api/auth/register
      // Expected: { username, email, password }
      // Response: { token, user: { id, username, avatar, rating } }
      
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "مرحباً بك في شطرنج العرب",
      });
      
      // Navigate to dashboard after successful registration
      // window.location.href = '/dashboard';
      
    } catch (error) {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-amiri font-bold text-white mb-2">
            شطرنج العرب
          </h1>
          <p className="text-white/80 text-lg">
            منصة الشطرنج الذكية
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-white/95 shadow-elegant border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-amiri text-2xl">الدخول إلى حسابك</CardTitle>
            <CardDescription>
              ادخل إلى عالم الشطرنج العربي الممتع
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="font-cairo">
                  تسجيل الدخول
                </TabsTrigger>
                <TabsTrigger value="register" className="font-cairo">
                  إنشاء حساب
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">البريد الإلكتروني</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      required
                      className="text-right"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">كلمة المرور</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="أدخل كلمة المرور"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="chess"
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? "جاري تسجيل الدخول..." : "دخول"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username">اسم المستخدم</Label>
                    <Input
                      id="register-username"
                      placeholder="اختر اسم مستخدم"
                      value={registerData.username}
                      onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                      required
                      className="text-right"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">البريد الإلكتروني</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      required
                      className="text-right"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">كلمة المرور</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="أدخل كلمة المرور"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="أعد إدخال كلمة المرور"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="chess"
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;