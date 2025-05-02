
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { AppLayout } from '@/components/layout/AppLayout';
import { formatDate, generateId, getTodayDateString, getPriorityColor } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { 
  addProject, 
  updateProject, 
  deleteProject, 
  Project, 
  ProjectTask, 
  addProjectTask,
  toggleProjectTask
} from '@/redux/projectSlice';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Briefcase, CheckSquare, Clock, Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ProjectsPage = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const projects = useAppSelector(state => state.projects.projects);
  
  const [newProject, setNewProject] = useState<Omit<Project, 'id' | 'progress' | 'tasks' | 'createdAt'>>({
    title: '',
    description: '',
    deadline: '',
    priority: 'medium',
    category: 'Study',
  });
  
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [newTask, setNewTask] = useState('');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewProject(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectToAdd: Project = {
      ...newProject,
      id: generateId(),
      progress: 0,
      tasks: [],
      createdAt: new Date().toISOString(),
    };
    
    dispatch(addProject(projectToAdd));
    toast({
      title: 'Project Added',
      description: `${newProject.title} has been added to your projects.`,
    });
    
    // Reset form
    setNewProject({
      title: '',
      description: '',
      deadline: '',
      priority: 'medium',
      category: 'Study',
    });
  };
  
  const handleAddTask = () => {
    if (!selectedProject || !newTask.trim()) return;
    
    const task: ProjectTask = {
      id: generateId(),
      title: newTask,
      completed: false,
    };
    
    dispatch(addProjectTask({
      projectId: selectedProject,
      task,
    }));
    
    setNewTask('');
    toast({
      title: 'Task Added',
      description: `New task added to project.`,
    });
  };
  
  const handleToggleTask = (projectId: string, taskId: string) => {
    dispatch(toggleProjectTask({ projectId, taskId }));
  };
  
  const handleDeleteProject = (id: string, title: string) => {
    dispatch(deleteProject(id));
    if (selectedProject === id) {
      setSelectedProject(null);
    }
    toast({
      title: 'Project Deleted',
      description: `${title} has been deleted.`,
      variant: 'destructive',
    });
  };
  
  const activeProject = selectedProject 
    ? projects.find(p => p.id === selectedProject) 
    : null;
  
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setSelectedProject(null)}
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Project List */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Your Projects</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto">
              {projects.length > 0 ? (
                <ul className="space-y-3">
                  {projects.map(project => (
                    <li 
                      key={project.id} 
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedProject === project.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                      onClick={() => setSelectedProject(project.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{project.title}</div>
                          <div className="text-xs opacity-80">{project.category}</div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(project.priority)}`} />
                      </div>
                      <div className="mt-2">
                        <div className="text-xs mb-1 flex justify-between">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No projects yet. Create one now!</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Project Detail or Create New */}
        <div className="md:col-span-2">
          <Card>
            {!activeProject ? (
              <>
                <CardHeader>
                  <CardTitle>Create New Project</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Project Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={newProject.title}
                        onChange={handleInputChange}
                        placeholder="Research Project"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={newProject.description}
                        onChange={handleInputChange}
                        placeholder="Describe your project..."
                        className="h-20"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          name="category"
                          value={newProject.category}
                          onChange={handleInputChange}
                          placeholder="Study, Work, etc."
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="deadline">Deadline (Optional)</Label>
                        <Input
                          id="deadline"
                          name="deadline"
                          type="date"
                          value={newProject.deadline}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select 
                        onValueChange={(value) => handleSelectChange('priority', value)}
                        value={newProject.priority}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Create Project
                    </Button>
                  </form>
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader className="flex flex-col space-y-1.5">
                  <div className="flex items-center justify-between">
                    <CardTitle>{activeProject.title}</CardTitle>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDeleteProject(activeProject.id, activeProject.title)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {activeProject.category} • {activeProject.priority} priority
                  </div>
                  {activeProject.deadline && (
                    <div className="text-sm">
                      Deadline: {formatDate(activeProject.deadline)}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-1 flex justify-between">
                      <span>Progress</span>
                      <span>{activeProject.progress}%</span>
                    </div>
                    <Progress value={activeProject.progress} className="h-2" />
                  </div>
                  
                  <div>
                    <p className="text-sm">{activeProject.description}</p>
                  </div>
                  
                  <div>
                    <div className="mb-2">
                      <h3 className="font-medium">Tasks</h3>
                    </div>
                    
                    <div className="flex gap-2 mb-4">
                      <Input 
                        value={newTask} 
                        onChange={(e) => setNewTask(e.target.value)} 
                        placeholder="Add a new task"
                      />
                      <Button onClick={handleAddTask}>Add</Button>
                    </div>
                    
                    {activeProject.tasks.length > 0 ? (
                      <ul className="space-y-2">
                        {activeProject.tasks.map(task => (
                          <li key={task.id} className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="p-1 h-auto"
                              onClick={() => handleToggleTask(activeProject.id, task.id)}
                            >
                              <CheckSquare className={`h-5 w-5 ${task.completed ? 'text-primary' : ''}`} />
                            </Button>
                            <span className={task.completed ? 'line-through opacity-70' : ''}>
                              {task.title}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-muted-foreground">No tasks yet. Add one above.</p>
                    )}
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectsPage;
