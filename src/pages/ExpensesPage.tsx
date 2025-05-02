
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppLayout } from '@/components/layout/AppLayout';
import { formatDate, generateId, getTodayDateString, calculateTotalByCategory } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { 
  addExpense, 
  updateExpense, 
  deleteExpense, 
  addCategory,
  setBudget,
  Expense 
} from '@/redux/expenseSlice';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { IndianRupee, PieChart, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#ec4899'];

const ExpensesPage = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const expenses = useAppSelector(state => state.expenses.expenses);
  const categories = useAppSelector(state => state.expenses.categories);
  const budget = useAppSelector(state => state.expenses.budget);
  
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    description: '',
    amount: 0,
    category: 'Food',
    date: getTodayDateString(),
  });
  
  const [newCategory, setNewCategory] = useState('');
  const [newBudget, setNewBudget] = useState(budget.toString());
  
  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);
  
  const categoryData = useMemo(() => {
    const totals = calculateTotalByCategory(expenses);
    return Object.entries(totals).map(([category, amount]) => ({
      category,
      amount,
      percentage: Math.round((amount / totalExpenses) * 100)
    }));
  }, [expenses, totalExpenses]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) || 0 : value }));
  };
  
  const handleCategoryChange = (value: string) => {
    setNewExpense(prev => ({ ...prev, category: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expenseToAdd = {
      ...newExpense,
      id: generateId(),
    };
    
    dispatch(addExpense(expenseToAdd));
    toast({
      title: 'Expense Added',
      description: `₹${expenseToAdd.amount.toFixed(2)} for ${expenseToAdd.description}`,
    });
    
    // Reset form
    setNewExpense({
      description: '',
      amount: 0,
      category: 'Food',
      date: getTodayDateString(),
    });
  };
  
  const handleDeleteExpense = (id: string, description: string) => {
    dispatch(deleteExpense(id));
    toast({
      title: 'Expense Deleted',
      description: `"${description}" has been removed.`,
      variant: 'destructive',
    });
  };
  
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    
    dispatch(addCategory(newCategory));
    toast({
      title: 'Category Added',
      description: `${newCategory} has been added to your categories.`,
    });
    setNewCategory('');
  };
  
  const handleUpdateBudget = () => {
    const budgetValue = parseFloat(newBudget);
    if (isNaN(budgetValue) || budgetValue < 0) return;
    
    dispatch(setBudget(budgetValue));
    toast({
      title: 'Budget Updated',
      description: `Your budget has been set to ₹${budgetValue.toFixed(2)}.`,
    });
  };
  
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Expense Tracker</h1>
        <div className="flex items-center gap-2">
          <IndianRupee className="h-5 w-5 text-primary" />
          <span className="text-lg">
            Budget: ₹{budget.toFixed(2)} | Spent: ₹{totalExpenses.toFixed(2)}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Add Expense Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={newExpense.description}
                  onChange={handleInputChange}
                  placeholder="Coffee"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newExpense.amount || ''}
                  onChange={handleInputChange}
                  placeholder="100"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  onValueChange={handleCategoryChange}
                  value={newExpense.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newExpense.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">
                Add Expense
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Budget and Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Budget & Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="budget">Set Monthly Budget</Label>
              <div className="flex gap-2">
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  placeholder="10000"
                />
                <Button onClick={handleUpdateBudget}>Update</Button>
              </div>
            </div>
            
            <div>
              <Label>Add Category</Label>
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Entertainment"
                />
                <Button onClick={handleAddCategory}>Add</Button>
              </div>
            </div>
            
            <div>
              <Label>Current Categories</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {categories.map(category => (
                  <Badge key={category} variant="outline">{category}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Expense Breakdown Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            {totalExpenses > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="category"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                  <Legend />
                </RechartsChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No expenses to show</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length > 0 ? (
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 text-left font-medium">Date</th>
                    <th className="p-2 text-left font-medium">Description</th>
                    <th className="p-2 text-left font-medium">Category</th>
                    <th className="p-2 text-right font-medium">Amount</th>
                    <th className="p-2 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[...expenses]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(expense => (
                      <tr key={expense.id} className="border-t">
                        <td className="p-2">{formatDate(expense.date)}</td>
                        <td className="p-2">{expense.description}</td>
                        <td className="p-2">
                          <Badge variant="outline">{expense.category}</Badge>
                        </td>
                        <td className="p-2 text-right font-medium">₹{expense.amount.toFixed(2)}</td>
                        <td className="p-2 text-right">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDeleteExpense(expense.id, expense.description)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">No expenses recorded. Add your first expense above.</p>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default ExpensesPage;
