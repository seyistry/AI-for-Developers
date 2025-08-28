'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Poll = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  votesCount: number;
};

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch polls data
    const fetchPolls = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        const mockPolls: Poll[] = [
          {
            id: '1',
            title: 'Favorite Programming Language',
            description: 'What is your favorite programming language?',
            createdAt: new Date().toISOString(),
            votesCount: 42,
          },
          {
            id: '2',
            title: 'Best Frontend Framework',
            description: 'Which frontend framework do you prefer?',
            createdAt: new Date().toISOString(),
            votesCount: 36,
          },
          {
            id: '3',
            title: 'Remote Work Preference',
            description: 'Do you prefer remote work, office work, or hybrid?',
            createdAt: new Date().toISOString(),
            votesCount: 89,
          },
        ];
        
        setPolls(mockPolls);
      } catch (error) {
        console.error('Failed to fetch polls:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolls();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Loading polls...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Polls</h1>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {polls.map((poll) => (
          <Link key={poll.id} href={`/polls/${poll.id}`}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>{poll.title}</CardTitle>
                <CardDescription>
                  {new Date(poll.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{poll.description}</p>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-500">{poll.votesCount} votes</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {polls.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-600">No polls found</h2>
          <p className="mt-2 text-gray-500">Create your first poll to get started!</p>
        </div>
      )}
    </div>
  );
}