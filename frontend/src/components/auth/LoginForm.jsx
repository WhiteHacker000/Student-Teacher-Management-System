import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { GraduationCap, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen hero-section flex items-center justify-center p-4 relative">
      <div className="w-full max-w-md space-y-8 animate-fade-in relative z-10">
        <div className="text-center text-white">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-3xl backdrop-blur-sm border border-purple-500/30 shadow-neon">
              <GraduationCap className="h-14 w-14 text-purple-300" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
            EduManage
          </h1>
          <p className="text-slate-300 text-lg">Student Management System</p>
        </div>

        <Card className="card-gradient border-purple-500/30 backdrop-blur-xl bg-slate-900/60 shadow-neon">
          <CardHeader className="text-center border-b border-purple-500/20 pb-6">
            <CardTitle className="text-3xl gradient-text">Welcome Back</CardTitle>
            <CardDescription className="text-slate-400 mt-2">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-all duration-300 focus:scale-[1.01] focus:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="transition-all duration-300 focus:scale-[1.01] focus:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-purple-500/10 backdrop-blur-sm rounded-xl border border-purple-500/20">
              <p className="text-sm text-purple-200 mb-3 font-semibold">Demo Accounts:</p>
              <div className="space-y-2 text-xs text-slate-300">
                <p><strong>Teacher:</strong> teacher1</p>
                <p><strong>Student:</strong> student1</p>
                <p><strong>Password:</strong> password123</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="text-center text-sm text-white/90">
          New here? <Link to="/register" className="underline">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
