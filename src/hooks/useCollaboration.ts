import { useState, useEffect, useRef } from 'react';
import { CollabUser, User } from '../types';
import { USERS } from '../data/seed';
import { useStore } from '../store/useStore';

const COLLAB_USERS: User[] = USERS.slice(0, 4);

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function useCollaboration() {
  const tasks = useStore(s => s.tasks);
  const [collabUsers, setCollabUsers] = useState<CollabUser[]>([]);
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  useEffect(() => {
    const taskIds = tasksRef.current.slice(0, 50).map(t => t.id);

    const initial: CollabUser[] = COLLAB_USERS.map(user => ({
      user,
      taskId: pickRandom(taskIds),
      action: Math.random() > 0.5 ? 'viewing' : 'editing',
    }));
    setCollabUsers(initial);

    const interval = setInterval(() => {
      setCollabUsers(prev =>
        prev.map(cu => {
          if (Math.random() > 0.35) return cu;
          return {
            ...cu,
            taskId: pickRandom(taskIds),
            action: Math.random() > 0.5 ? 'viewing' : 'editing',
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return collabUsers;
}
