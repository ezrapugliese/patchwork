'use client';

import { useEffect } from 'react';
import { ProfileDashboard } from '@/components/ProfileDashboard';

export default function Home() {
  // Demo: create a sample profile if none exists
  useEffect(() => {
    const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
    if (profiles.length === 0) {
      const defaultProfile = {
        id: 'default',
        name: 'My World',
        members: [
          {
            id: '1',
            name: 'Alex',
            pronouns: 'they/them',
            avatar: '🌟',
            color: '#3b82f6',
            description: 'Your guide',
            tags: [],
          },
        ],
        boards: [
          {
            id: '1',
            name: 'Daily Log',
            posts: [
              {
                id: '1',
                authorId: '1',
                date: new Date(Date.now() - 86400000 * 2).toISOString(),
                text: 'Just had a really productive session today.',
                tags: ['progress', 'today'],
              },
            ],
          },
        ],
        tags: ['progress', 'today', 'idea'],
      };
      localStorage.setItem('profiles', JSON.stringify([defaultProfile]));
    }
  }, []);

  return (
    <div className="min-h-screen">
      <ProfileDashboard />
    </div>
  );
}
