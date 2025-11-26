import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function MyAttendance() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">My Attendance</h1>
        <p className="text-muted-foreground mt-1">Your attendance records</p>
      </div>
      <Card className="card-gradient border-0">
        <CardHeader>
          <CardTitle>Attendance</CardTitle>
          <CardDescription>Coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">This is a placeholder page.</p>
        </CardContent>
      </Card>
    </div>
  );
}


