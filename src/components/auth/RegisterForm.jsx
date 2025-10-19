import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { GraduationCap, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const { register: registerUser, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ name, email, password, role });
      toast({ title: 'Account created', description: 'You are now signed in.' });
    } catch (error) {
      toast({ title: 'Registration failed', description: error.message || 'Please try again', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen hero-section flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center text-white">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
              <GraduationCap className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">EduManage</h1>
          <p className="text-white/80">Create your account</p>
        </div>

        <Card className="card-gradient border-0 backdrop-blur-sm bg-white/95">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl gradient-text">Sign Up</CardTitle>
            <CardDescription>Register as a new user</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
              <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90" disabled={isLoading}>
                {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>) : 'Create Account'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="text-primary">Log in</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterForm;


