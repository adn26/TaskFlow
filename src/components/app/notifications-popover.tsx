"use client";

import { useState, useEffect } from 'react';
import { Bell, Zap, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { notifications as mockNotifications } from '@/lib/data';
import { prioritizeNotifications } from '@/ai/flows/intelligent-notifications';
import type { Notification, UserRole } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Badge } from '../ui/badge';

type PrioritizedNotification = {
    message: string;
    urgency: "high" | "medium" | "low";
    userRole: UserRole;
    taskId?: string | undefined;
    dueDate?: string | undefined;
}

export default function NotificationsPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<PrioritizedNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAndPrioritizeNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await prioritizeNotifications({ notifications: mockNotifications });
      setNotifications(response.prioritizedNotifications);
    } catch (err) {
      console.error(err);
      setError('AI prioritization failed. Showing default notifications.');
      // Fallback to showing the original notifications
      setNotifications(mockNotifications);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAndPrioritizeNotifications();
    }
  }, [isOpen]);
  
  const getUrgencyBadge = (urgency: "high" | "medium" | "low") => {
    switch (urgency) {
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'medium': return <Badge variant="secondary" className="bg-amber-400 text-black">Medium</Badge>;
      default: return <Badge variant="outline">Low</Badge>;
    }
  };


  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
           {mockNotifications.length > 0 && <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{mockNotifications.length}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <h4 className="font-medium leading-none flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Prioritized Alerts
                </h4>
                <Button variant="ghost" size="icon" onClick={fetchAndPrioritizeNotifications} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Important updates, sorted for you by AI.
            </p>
          </div>
          {error && (
             <Alert variant="destructive" className="text-xs">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-2">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-4 p-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-2/5" />
                    </div>
                </div>
              ))
            ) : notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div
                  key={index}
                  className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                >
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-accent" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {notification.message}
                    </p>
                    <div className="text-sm text-muted-foreground">
                        {getUrgencyBadge(notification.urgency)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No new notifications.</p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
