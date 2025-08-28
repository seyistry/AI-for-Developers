'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type PollOption = {
  id: string;
  text: string;
  votes: number;
};

type Poll = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  options: PollOption[];
  totalVotes: number;
};

export default function PollDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pollId = params.id as string;
  
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        const mockPoll: Poll = {
          id: pollId,
          title: 'Favorite Programming Language',
          description: 'What is your favorite programming language?',
          createdAt: new Date().toISOString(),
          options: [
            { id: '1', text: 'JavaScript', votes: 15 },
            { id: '2', text: 'Python', votes: 12 },
            { id: '3', text: 'TypeScript', votes: 8 },
            { id: '4', text: 'Java', votes: 5 },
            { id: '5', text: 'C#', votes: 2 },
          ],
          totalVotes: 42,
        };
        
        setPoll(mockPoll);
      } catch (error) {
        console.error('Failed to fetch poll:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (pollId) {
      fetchPoll();
    }
  }, [pollId]);

  const handleVote = async () => {
    if (!selectedOption) return;
    
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state to reflect the vote
      if (poll) {
        const updatedOptions = poll.options.map(option => {
          if (option.id === selectedOption) {
            return { ...option, votes: option.votes + 1 };
          }
          return option;
        });
        
        setPoll({
          ...poll,
          options: updatedOptions,
          totalVotes: poll.totalVotes + 1,
        });
      }
      
      // Show success message or redirect
      alert('Vote submitted successfully!');
    } catch (error) {
      console.error('Failed to submit vote:', error);
      alert('Failed to submit vote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Loading poll...</h1>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Poll not found</h1>
        <Button onClick={() => router.push('/polls')}>Back to Polls</Button>
      </div>
    );
  }

  // Calculate percentages for the progress bars
  const getPercentage = (votes: number) => {
    if (poll.totalVotes === 0) return 0;
    return Math.round((votes / poll.totalVotes) * 100);
  };

  return (
    <div className="container mx-auto py-8">
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => router.push('/polls')}
      >
        Back to Polls
      </Button>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">{poll.title}</CardTitle>
          <CardDescription>
            Created on {new Date(poll.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">{poll.description}</p>
          
          <div className="space-y-4">
            {poll.options.map((option) => (
              <div key={option.id} className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id={option.id}
                    name="poll-option"
                    className="mr-2"
                    checked={selectedOption === option.id}
                    onChange={() => setSelectedOption(option.id)}
                  />
                  <label htmlFor={option.id} className="text-sm font-medium">
                    {option.text}
                  </label>
                  <span className="ml-auto text-sm text-gray-500">
                    {getPercentage(option.votes)}% ({option.votes} votes)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${getPercentage(option.votes)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleVote} 
            disabled={!selectedOption || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Vote'}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="text-center text-sm text-gray-500">
        Total votes: {poll.totalVotes}
      </div>
    </div>
  );
}