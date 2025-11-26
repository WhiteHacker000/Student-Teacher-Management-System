import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Courses() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Courses</h1>
        <p className="text-muted-foreground mt-1">Browse and manage courses</p>
      </div>
      <Card className="card-gradient border-0">
        <CardHeader>
          <CardTitle>Course Catalog</CardTitle>
          <CardDescription>Coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">This is a placeholder page.</p>
        </CardContent>
      </Card>
    </div>
  );
}


