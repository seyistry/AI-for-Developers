import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, options } = body;

    if (!title || !description || !options || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json({ error: 'Title, description, and at least 2 options are required' }, { status: 400 });
    }

    // Here you would typically interact with your database to create a new poll.
    // For now, we'll just log the data and return a success response.
    console.log('Creating poll with:', { title, description, options });

    // Simulate database operation
    await new Promise(resolve => setTimeout(resolve, 500));

    const pollId = Math.random().toString(36).substring(7);

    return NextResponse.json({ message: 'Poll created successfully', pollId }, { status: 201 });
  } catch (error) {
    console.error('Failed to create poll:', error);
    return NextResponse.json({ error: 'Failed to create poll' }, { status: 500 });
  }
}
