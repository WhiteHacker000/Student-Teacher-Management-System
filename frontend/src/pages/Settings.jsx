import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';

export default function Settings() {
  const { user, deleteAccount, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      // Check if user and token exist before deletion
      const token = localStorage.getItem('sms_token');
      if (!token || !user) {
        toast({
          title: 'Authentication required',
          description: 'Your session has expired. Please log in again.',
          variant: 'destructive',
        });
        setIsDeleting(false);
        setShowConfirm(false);
        navigate('/login', { replace: true });
        return;
      }

      await deleteAccount();
      toast({
        title: 'Account deleted',
        description: 'Your account has been permanently deleted.',
      });
      // Small delay to ensure state is cleared before navigation
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 100);
    } catch (error) {
      console.error('Delete account error in Settings:', error);
      toast({
        title: 'Failed to delete account',
        description: error.message || 'An error occurred. Please try again.',
        variant: 'destructive',
      });
      setIsDeleting(false);
      setShowConfirm(false);
      
      // If it's an auth error, redirect to login
      if (error.message && error.message.includes('session has expired')) {
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      }
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences</p>
      </div>
      
      <Card className="card-gradient border-0">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Username</p>
            <p className="text-sm text-muted-foreground">{user?.Username || 'N/A'}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Role</p>
            <p className="text-sm text-muted-foreground capitalize">{user?.Role || 'N/A'}</p>
          </div>
          {user?.CreatedAt && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Account Created</p>
              <p className="text-sm text-muted-foreground">
                {new Date(user.CreatedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="card-gradient border-2 border-red-300 shadow-lg">
        <CardHeader className="bg-red-50/50">
          <CardTitle className="text-red-600 text-xl">Danger Zone</CardTitle>
          <CardDescription className="text-red-700">
            Irreversible and destructive actions - proceed with caution
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {!showConfirm ? (
            <>
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-900">
                  Delete Your Account
                </p>
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. This will permanently delete:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 ml-2">
                  <li>Your user account</li>
                  <li>All associated profile data</li>
                  <li>All your records and information</li>
                </ul>
              </div>
              <Button
                variant="outline"
                onClick={handleDeleteAccount}
                disabled={isLoading || isDeleting}
                className="border-2 border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 font-medium w-full sm:w-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete My Account
              </Button>
            </>
          ) : (
            <div className="space-y-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-base font-bold text-red-900 mb-2">
                    Are you absolutely sure?
                  </p>
                  <p className="text-sm text-red-800 mb-3">
                    This action cannot be undone. This will permanently delete your account
                    and remove all associated data from our servers. You will not be able to recover any of this information.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="bg-red-600 text-white hover:bg-red-700 font-medium flex-1"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting Account...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Yes, Delete My Account Permanently
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isDeleting}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


