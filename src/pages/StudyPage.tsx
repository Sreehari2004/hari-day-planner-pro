
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AppLayout } from '@/components/layout/AppLayout';
import { formatDate, generateId, getTodayDateString } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addStudySession, updateStudySession, deleteStudySession, StudySession } from '@/redux/studySlice';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { BookOpen, CheckSquare, Clock, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const StudyPage = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const studySessions = useAppSelector(state => state.study.sessions);
  const totalMinutesStudied = useAppSelector(state => state.study.totalMinutesStudied);
  
  const [newSession, setNewSession] = useState<Omit<StudySession, 'id' | 'completed'>>({
    title: '',
    subject: '',
    duration: 30,
    date: getTodayDateString(),
    notes: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSession(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const duration = parseInt(e.target.value) || 0;
    setNewSession(prev => ({ ...prev, duration }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sessionToAdd = {
      ...newSession,
      id: generateId(),
      completed: false
    };
    
    dispatch(addStudySession(sessionToAdd));
    toast({
      title: 'Study Session Added',
      description: `${newSession.title} has been added to your study plan.`,
    });
    
    // Reset form
    setNewSession({
      title: '',
      subject: '',
      duration: 30,
      date: getTodayDateString(),
      notes: ''
    });
  };
  
  const handleToggleComplete = (session: StudySession) => {
    dispatch(updateStudySession({
      id: session.id,
      updates: { completed: !session.completed }
    }));
    toast({
      title: session.completed ? 'Session Unmarked' : 'Session Completed',
      description: `"${session.title}" ${session.completed ? 'marked as not completed' : 'marked as completed'}.`,
    });
  };
  
  const handleDelete = (id: string, title: string) => {
    dispatch(deleteStudySession(id));
    toast({
      title: 'Study Session Deleted',
      description: `"${title}" has been removed from your study plan.`,
      variant: 'destructive'
    });
  };
  
  // Filter and sort study sessions
  const upcomingSessions = studySessions
    .filter(session => !session.completed && new Date(session.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const completedSessions = studySessions
    .filter(session => session.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Study Planner</h1>
        <div className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-primary" />
          <span>Total: {Math.floor(totalMinutesStudied / 60)}h {totalMinutesStudied % 60}m</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add New Study Session Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              New Study Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={newSession.title}
                  onChange={handleInputChange}
                  placeholder="Mathematics Chapter 5"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={newSession.subject}
                  onChange={handleInputChange}
                  placeholder="Mathematics"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="5"
                  value={newSession.duration}
                  onChange={handleDurationChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newSession.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={newSession.notes}
                  onChange={handleInputChange}
                  placeholder="Additional notes about this study session..."
                  className="h-20"
                />
              </div>
              
              <Button type="submit" className="w-full">
                Add Study Session
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Upcoming Study Sessions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Study Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingSessions.length > 0 ? (
              <ul className="space-y-3">
                {upcomingSessions.map(session => (
                  <li key={session.id} className="flex items-center justify-between p-3 rounded-md bg-secondary">
                    <div>
                      <div className="font-medium">{session.title}</div>
                      <div className="text-sm text-muted-foreground">{session.subject}</div>
                      <div className="text-xs">{formatDate(session.date)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>{session.duration} min</Badge>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleToggleComplete(session)}
                      >
                        <CheckSquare className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(session.id, session.title)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No upcoming study sessions. Add one now!</p>
            )}
          </CardContent>
        </Card>
        
        {/* Completed Study Sessions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Completed Study Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {completedSessions.length > 0 ? (
              <ul className="space-y-3">
                {completedSessions.map(session => (
                  <li key={session.id} className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
                    <div>
                      <div className="font-medium line-through opacity-70">{session.title}</div>
                      <div className="text-sm text-muted-foreground">{session.subject}</div>
                      <div className="text-xs">{formatDate(session.date)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{session.duration} min</Badge>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleToggleComplete(session)}
                      >
                        <CheckSquare className="h-4 w-4 text-primary" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(session.id, session.title)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No completed study sessions yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default StudyPage;
