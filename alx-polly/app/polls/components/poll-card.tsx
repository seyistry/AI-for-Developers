'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type PollCardProps = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  votesCount: number;
};

export function PollCard({ id, title, description, createdAt, votesCount }: PollCardProps) {
  return (
    <Link href={`/polls/${id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {new Date(createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{description}</p>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">{votesCount} votes</p>
        </CardFooter>
      </Card>
    </Link>
  );
}