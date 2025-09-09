'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type PollOption = {
  id: string;
  text: string;
};

export default function CreatePollPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<PollOption[]>([
    { id: '1', text: '' },
    { id: '2', text: '' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddOption = () => {
    setOptions([...options, { id: `${options.length + 1}`, text: '' }]);
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) return; // Minimum 2 options required
    setOptions(options.filter(option => option.id !== id));
  };

  const handleOptionChange = (id: string, text: string) => {
    setOptions(
      options.map(option => {
        if (option.id === id) {
          return { ...option, text };
        }
        return option;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      alert('Please enter a poll title');
      return;
    }
    
    if (!description.trim()) {
      alert('Please enter a poll description');
      return;
    }
    
    const validOptions = options.filter(option => option.text.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please enter at least 2 options');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          options: validOptions.map(o => ({ text: o.text })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create poll');
      }
      
      // Redirect to polls page after successful creation
      alert('Poll created successfully!');
      router.push('/polls');
    } catch (error) {
      console.error('Failed to create poll:', error);
      if (error instanceof Error) {
        alert(`Failed to create poll: ${error.message}`);
      } else {
        alert('Failed to create poll. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
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
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Poll</CardTitle>
          <CardDescription>
            Fill out the form below to create a new poll
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Poll Title</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter poll title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter poll description"
                required
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Poll Options</label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddOption}
                >
                  Add Option
                </Button>
              </div>
              
              {options.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Input
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveOption(option.id)}
                    disabled={options.length <= 2}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Poll...' : 'Create Poll'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}