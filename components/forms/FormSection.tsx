import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/react-ui/card';

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xs">{title}</CardTitle>
        {description && <p className="text-xs text-zinc-400">{description}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
}