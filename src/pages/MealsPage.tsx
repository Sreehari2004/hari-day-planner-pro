
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AppLayout } from '@/components/layout/AppLayout';
import { formatDate, generateId, getTodayDateString } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { 
  addMeal, 
  updateMeal, 
  deleteMeal, 
  toggleMealCompleted,
  setDailyCalorieGoal,
  Meal 
} from '@/redux/foodSlice';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Check, CheckCircle, Circle, Utensils, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MealsPage = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const meals = useAppSelector(state => state.food.meals);
  const dailyCalorieGoal = useAppSelector(state => state.food.dailyCalorieGoal);
  
  const [newMeal, setNewMeal] = useState<Omit<Meal, 'id' | 'completed'>>({
    name: '',
    category: 'breakfast',
    date: getTodayDateString(),
    calories: undefined,
    ingredients: [],
    notes: '',
  });
  
  const [ingredients, setIngredients] = useState('');
  const [newCalorieGoal, setNewCalorieGoal] = useState(dailyCalorieGoal.toString());
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'calories') {
      setNewMeal(prev => ({ ...prev, calories: value ? parseInt(value) : undefined }));
    } else {
      setNewMeal(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleCategoryChange = (value: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    setNewMeal(prev => ({ ...prev, category: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const mealToAdd: Meal = {
      ...newMeal,
      id: generateId(),
      completed: false,
      ingredients: ingredients.split(',').map(item => item.trim()).filter(Boolean),
    };
    
    dispatch(addMeal(mealToAdd));
    toast({
      title: 'Meal Added',
      description: `${mealToAdd.name} has been added to your meal plan.`,
    });
    
    // Reset form
    setNewMeal({
      name: '',
      category: 'breakfast',
      date: getTodayDateString(),
      calories: undefined,
      ingredients: [],
      notes: '',
    });
    setIngredients('');
  };
  
  const handleToggleMeal = (id: string) => {
    dispatch(toggleMealCompleted(id));
  };
  
  const handleDeleteMeal = (id: string, name: string) => {
    dispatch(deleteMeal(id));
    toast({
      title: 'Meal Deleted',
      description: `${name} has been removed from your meal plan.`,
      variant: 'destructive',
    });
  };
  
  const handleUpdateCalorieGoal = () => {
    const calories = parseInt(newCalorieGoal);
    if (isNaN(calories) || calories < 0) return;
    
    dispatch(setDailyCalorieGoal(calories));
    toast({
      title: 'Calorie Goal Updated',
      description: `Your daily calorie goal is now ${calories} calories.`,
    });
  };
  
  // Group meals by date
  const mealsByDate = React.useMemo(() => {
    const groupedMeals: Record<string, Meal[]> = {};
    
    meals.forEach(meal => {
      const date = meal.date;
      if (!groupedMeals[date]) {
        groupedMeals[date] = [];
      }
      groupedMeals[date].push(meal);
    });
    
    // Sort dates in descending order
    return Object.entries(groupedMeals)
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime());
  }, [meals]);
  
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Meal Planner</h1>
        <div className="flex items-center gap-2">
          <Utensils className="h-5 w-5 text-primary" />
          <span className="text-lg">Daily Goal: {dailyCalorieGoal} calories</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Add Meal Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Meal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Meal Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newMeal.name}
                  onChange={handleInputChange}
                  placeholder="Grilled Chicken Salad"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  onValueChange={(value: any) => handleCategoryChange(value)}
                  value={newMeal.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newMeal.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="calories">Calories (Optional)</Label>
                <Input
                  id="calories"
                  name="calories"
                  type="number"
                  min="0"
                  value={newMeal.calories || ''}
                  onChange={handleInputChange}
                  placeholder="500"
                />
              </div>
              
              <div>
                <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
                <Textarea
                  id="ingredients"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="Chicken, lettuce, tomato, olive oil"
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={newMeal.notes}
                  onChange={handleInputChange}
                  placeholder="Any additional notes about this meal..."
                  className="h-20"
                />
              </div>
              
              <Button type="submit" className="w-full">
                Add Meal
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Daily Calorie Goal */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Calorie Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Set your daily calorie goal to track your nutritional intake.
              </p>
              
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="0"
                  value={newCalorieGoal}
                  onChange={(e) => setNewCalorieGoal(e.target.value)}
                  placeholder="2000"
                />
                <Button onClick={handleUpdateCalorieGoal}>Update</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Meal Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Meal Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Breakfast</span>
                <Badge variant="outline" className="bg-planner-blue bg-opacity-10">
                  Morning Energy
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Lunch</span>
                <Badge variant="outline" className="bg-planner-green bg-opacity-10">
                  Midday Fuel
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Dinner</span>
                <Badge variant="outline" className="bg-planner-purple bg-opacity-10">
                  Evening Nourishment
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Snack</span>
                <Badge variant="outline" className="bg-planner-amber bg-opacity-10">
                  Quick Bite
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Meal Plan Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Your Meal Plan</CardTitle>
        </CardHeader>
        <CardContent>
          {mealsByDate.length > 0 ? (
            <div className="space-y-8">
              {mealsByDate.map(([date, dayMeals]) => (
                <div key={date} className="space-y-2">
                  <div className="font-medium text-lg border-b pb-2">
                    {formatDate(date)}
                  </div>
                  
                  <div className="space-y-4 pt-2">
                    {['breakfast', 'lunch', 'dinner', 'snack'].map(category => {
                      const mealsInCategory = dayMeals.filter(meal => meal.category === category);
                      
                      if (mealsInCategory.length === 0) return null;
                      
                      return (
                        <div key={category} className="ml-4">
                          <h4 className="font-medium capitalize mb-2">{category}</h4>
                          <div className="space-y-2">
                            {mealsInCategory.map(meal => (
                              <div 
                                key={meal.id} 
                                className={`flex items-start justify-between p-2 rounded-md ${
                                  meal.completed ? 'bg-muted line-through opacity-70' : 'bg-secondary/50'
                                }`}
                              >
                                <div className="flex gap-3">
                                  <button 
                                    className="mt-1"
                                    onClick={() => handleToggleMeal(meal.id)}
                                  >
                                    {meal.completed ? (
                                      <CheckCircle className="h-5 w-5 text-primary" />
                                    ) : (
                                      <Circle className="h-5 w-5" />
                                    )}
                                  </button>
                                  
                                  <div>
                                    <div className="font-medium">{meal.name}</div>
                                    {meal.calories && (
                                      <div className="text-xs text-muted-foreground">
                                        {meal.calories} calories
                                      </div>
                                    )}
                                    {meal.ingredients && meal.ingredients.length > 0 && (
                                      <div className="text-xs text-muted-foreground">
                                        {meal.ingredients.join(', ')}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleDeleteMeal(meal.id, meal.name)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No meals planned yet. Add your first meal above.</p>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default MealsPage;
