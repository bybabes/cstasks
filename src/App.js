import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Plus, Search, CheckCircle2, Circle, X, Trash2, Lightbulb, Star, MessageSquare, RotateCcw, LayoutDashboard, ListTodo, TrendingUp, Award, Target, Zap, Sunrise, Calendar as CalendarIcon, History, ChevronLeft, ChevronRight, ArrowRight, Archive, AlertCircle, AlertTriangle } from 'lucide-react';

function ByBabesTaskTracker() {
  const [role, setRole] = useState('associate');
  const [mainTab, setMainTab] = useState('tasks');
  const [view, setView] = useState('today');
  const [dashboardPeriod, setDashboardPeriod] = useState('day');
  const [showModal, setShowModal] = useState(false);
  const [showLearningModal, setShowLearningModal] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedHistoryDate, setSelectedHistoryDate] = useState(null);
  
  // NEW: Custom confirmation modal state
  const [confirmModal, setConfirmModal] = useState({ 
    show: false, 
    title: '', 
    message: '', 
    onConfirm: null,
    confirmText: 'Confirm',
    confirmColor: '#ef4444'
  });

  // NEW: Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const getTodayString = () => new Date().toISOString().split('T')[0];
  const getDateOffset = (offset) => {
    const d = new Date();
    d.setDate(d.getDate() - offset);
    return d.toISOString().split('T')[0];
  };
  const formatDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };
  const formatDateShort = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  const recurringTaskTemplates = [
    { templateId: 'a-d-1', task: 'Reach out to customers who engage with our posts / follow us to ask if they need any help / give them a compliment / build relationship', priority: 'medium', assignee: 'CS Associate', role: 'associate', period: 'daily', dueTime: '9:00 AM' },
    { templateId: 'a-d-2', task: 'Notify Management of any requests or change of information needed on Zendesk / website', priority: 'high', assignee: 'CS Associate', role: 'associate', period: 'daily', dueTime: 'Ongoing' },
    { templateId: 'a-d-3', task: 'Amazon - Reply to any DMs', priority: 'high', assignee: 'CS Associate', role: 'associate', period: 'daily', dueTime: '9:30 AM' },
    { templateId: 'a-d-4', task: 'Mintsoft - Query raised / fraud risk / delayed orders', priority: 'high', assignee: 'CS Associate', role: 'associate', period: 'daily', dueTime: '10:00 AM' },
    { templateId: 'a-d-5', task: 'Loox reviews - Reply to good and bad reviews', priority: 'medium', assignee: 'CS Associate', role: 'associate', period: 'daily', dueTime: '10:30 AM' },
    { templateId: 'a-d-6', task: "Facebook DM's - Check FB DMs", priority: 'medium', assignee: 'CS Associate', role: 'associate', period: 'daily', dueTime: '11:00 AM' },
    { templateId: 'a-d-7', task: 'Instagram comments', priority: 'medium', assignee: 'CS Associate', role: 'associate', period: 'daily', dueTime: '11:15 AM' },
    { templateId: 'a-d-8', task: 'Instagram DMs', priority: 'medium', assignee: 'CS Associate', role: 'associate', period: 'daily', dueTime: '11:30 AM' },
    { templateId: 'a-d-9', task: 'TikTok Comments', priority: 'medium', assignee: 'CS Associate', role: 'associate', period: 'daily', dueTime: '12:00 PM' },
    { templateId: 'a-d-10', task: 'TikTok DMs', priority: 'medium', assignee: 'CS Associate', role: 'associate', period: 'daily', dueTime: '12:15 PM' },
    { templateId: 'a-d-11', task: 'Add claim information to spreadsheet', priority: 'high', assignee: 'CS Associate', role: 'associate', period: 'daily', dueTime: '1:00 PM' },
    { templateId: 'a-d-12', task: 'Add faulty items to spreadsheet', priority: 'high', assignee: 'CS Associate', role: 'associate', period: 'daily', dueTime: '1:15 PM' },
    { templateId: 'a-d-13', task: 'Email WH to open claims', priority: 'high', assignee: 'CS Associate', role: 'associate', period: 'daily', dueTime: '1:30 PM' },
    { templateId: 'a-d-14', task: 'Waiting on claim - Follow up', priority: 'medium', assignee: 'CS Associate', role: 'associate', period: 'daily', dueTime: '2:00 PM' },
    { templateId: 'a-d-15', task: 'Waiting on Warehouse - Follow up', priority: 'medium', assignee: 'CS Associate', role: 'associate', period: 'daily', dueTime: '2:15 PM' },
    { templateId: 'a-d-16', task: 'Waiting on customer - Follow up', priority: 'medium', assignee: 'CS Associate', role: 'associate', period: 'daily', dueTime: '2:30 PM' },
    { templateId: 'a-d-17', task: 'Tickets in your name - Review & action', priority: 'high', assignee: 'CS Associate', role: 'associate', period: 'daily', dueTime: '3:00 PM' },
    { templateId: 'a-d-18', task: 'Live chat 9am - 4pm', priority: 'high', assignee: 'CS Associate', role: 'associate', period: 'daily', dueTime: '9am - 4pm' },
    { templateId: 'a-d-19', task: 'TikTok shop appeal refunds / return', priority: 'high', assignee: 'CS Associate', role: 'associate', period: 'daily', dueTime: '3:30 PM' },
    { templateId: 'a-d-20', task: 'TikTok shop refund requests', priority: 'high', assignee: 'CS Associate', role: 'associate', period: 'daily', dueTime: '3:45 PM' },
    { templateId: 'a-d-21', task: 'TikTok shop return requests', priority: 'high', assignee: 'CS Associate', role: 'associate', period: 'daily', dueTime: '4:00 PM' },
    { templateId: 'a-d-22', task: 'TikTok shop reviews', priority: 'medium', assignee: 'CS Associate', role: 'associate', period: 'daily', dueTime: '4:15 PM' },
    { templateId: 'a-d-23', task: 'TikTok shop DMs', priority: 'medium', assignee: 'CS Associate', role: 'associate', period: 'daily', dueTime: '4:30 PM' },
    { templateId: 'a-w-1', task: 'Review all unresolved tickets from the week', priority: 'high', assignee: 'CS Associate', role: 'associate', period: 'weekly', dueTime: 'Friday' },
    { templateId: 'a-w-2', task: 'Compile weekly learnings & submit to manager', priority: 'high', assignee: 'CS Associate', role: 'associate', period: 'weekly', dueTime: 'Friday 3pm' },
    { templateId: 'a-w-3', task: 'Update personal FAQ notes / templates', priority: 'medium', assignee: 'CS Associate', role: 'associate', period: 'weekly', dueTime: 'Friday' },
    { templateId: 'a-m-1', task: 'Monthly performance review with manager', priority: 'high', assignee: 'CS Associate', role: 'associate', period: 'monthly', dueTime: 'EOM' },
    { templateId: 'a-m-2', task: 'Training refresh / new product knowledge', priority: 'medium', assignee: 'CS Associate', role: 'associate', period: 'monthly', dueTime: 'Mid-month' },
    { templateId: 'm-d-1', task: 'Review all team tickets - overall status check', priority: 'high', assignee: 'CS Manager', role: 'manager', period: 'daily', dueTime: '9:00 AM' },
    { templateId: 'm-d-2', task: 'Check escalated tickets & resolve', priority: 'high', assignee: 'CS Manager', role: 'manager', period: 'daily', dueTime: '9:30 AM' },
    { templateId: 'm-d-3', task: 'Daily team check-in / stand-up', priority: 'high', assignee: 'CS Manager', role: 'manager', period: 'daily', dueTime: '10:00 AM' },
    { templateId: 'm-d-4', task: 'Approve refunds over £50', priority: 'high', assignee: 'CS Manager', role: 'manager', period: 'daily', dueTime: 'Ongoing' },
    { templateId: 'm-d-5', task: 'Monitor response time SLAs', priority: 'high', assignee: 'CS Manager', role: 'manager', period: 'daily', dueTime: 'Throughout day' },
    { templateId: 'm-d-6', task: 'Liaise with warehouse on delayed orders', priority: 'high', assignee: 'CS Manager', role: 'manager', period: 'daily', dueTime: '11:00 AM' },
    { templateId: 'm-d-7', task: 'Review team performance metrics', priority: 'medium', assignee: 'CS Manager', role: 'manager', period: 'daily', dueTime: '2:00 PM' },
    { templateId: 'm-d-8', task: 'Handle founder escalations', priority: 'high', assignee: 'CS Manager', role: 'manager', period: 'daily', dueTime: 'Ongoing' },
    { templateId: 'm-d-9', task: 'Review negative reviews & respond personally', priority: 'high', assignee: 'CS Manager', role: 'manager', period: 'daily', dueTime: '3:00 PM' },
    { templateId: 'm-w-1', task: 'Weekly team meeting & training', priority: 'high', assignee: 'CS Manager', role: 'manager', period: 'weekly', dueTime: 'Monday 10am' },
    { templateId: 'm-w-2', task: 'Analyse ticket trends & common issues', priority: 'high', assignee: 'CS Manager', role: 'manager', period: 'weekly', dueTime: 'Friday' },
    { templateId: 'm-w-3', task: 'Review & approve associate weekly learnings', priority: 'high', assignee: 'CS Manager', role: 'manager', period: 'weekly', dueTime: 'Friday 4pm' },
    { templateId: 'm-w-4', task: 'Update FAQ / Zendesk macros', priority: 'medium', assignee: 'CS Manager', role: 'manager', period: 'weekly', dueTime: 'Wednesday' },
    { templateId: 'm-w-5', task: 'Process all open claims with warehouse', priority: 'high', assignee: 'CS Manager', role: 'manager', period: 'weekly', dueTime: 'Thursday' },
    { templateId: 'm-w-6', task: 'Report CS metrics to founder', priority: 'high', assignee: 'CS Manager', role: 'manager', period: 'weekly', dueTime: 'Friday EOD' },
    { templateId: 'm-w-7', task: 'Review refund rate & patterns', priority: 'high', assignee: 'CS Manager', role: 'manager', period: 'weekly', dueTime: 'Friday' },
    { templateId: 'm-w-8', task: 'Audit fraud risk cases', priority: 'medium', assignee: 'CS Manager', role: 'manager', period: 'weekly', dueTime: 'Thursday' },
    { templateId: 'm-m-1', task: 'Monthly NPS score analysis & report', priority: 'high', assignee: 'CS Manager', role: 'manager', period: 'monthly', dueTime: 'EOM' },
    { templateId: 'm-m-2', task: 'CS team performance reviews (1:1s)', priority: 'high', assignee: 'CS Manager', role: 'manager', period: 'monthly', dueTime: 'Mid-month' },
    { templateId: 'm-m-3', task: 'SOP review & update based on learnings', priority: 'high', assignee: 'CS Manager', role: 'manager', period: 'monthly', dueTime: 'End of month' },
    { templateId: 'm-m-4', task: 'Identify top 10 customer pain points', priority: 'high', assignee: 'CS Manager', role: 'manager', period: 'monthly', dueTime: 'EOM' },
    { templateId: 'm-m-5', task: 'Full monthly CS report to founder', priority: 'high', assignee: 'CS Manager', role: 'manager', period: 'monthly', dueTime: 'End of month' },
    { templateId: 'm-m-6', task: 'Team training session (new scripts, tools)', priority: 'medium', assignee: 'CS Manager', role: 'manager', period: 'monthly', dueTime: 'Mid-month' },
    { templateId: 'm-m-7', task: 'Review refund policy effectiveness', priority: 'medium', assignee: 'CS Manager', role: 'manager', period: 'monthly', dueTime: 'EOM' },
    { templateId: 'm-m-8', task: 'Budget review - CS tools & subscriptions', priority: 'medium', assignee: 'CS Manager', role: 'manager', period: 'monthly', dueTime: 'EOM' }
  ];

  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  const getCurrentWeek = () => getWeekNumber(new Date());
  const getCurrentMonth = () => new Date().getMonth() + 1;

  const generateInitialTasks = () => {
    const today = getTodayString();
    const currentWeek = getCurrentWeek();
    const currentMonth = getCurrentMonth();
    const tasks = [];
    
    recurringTaskTemplates.filter(t => t.period === 'daily').forEach(template => {
      tasks.push({ ...template, id: `${template.templateId}-${today}`, status: 'todo', dueDate: today, instanceDate: today });
    });
    recurringTaskTemplates.filter(t => t.period === 'weekly').forEach(template => {
      tasks.push({ ...template, id: `${template.templateId}-w${currentWeek}`, status: 'todo', dueDate: today, instanceDate: today, instanceWeek: currentWeek });
    });
    recurringTaskTemplates.filter(t => t.period === 'monthly').forEach(template => {
      tasks.push({ ...template, id: `${template.templateId}-m${currentMonth}`, status: 'todo', dueDate: today, instanceDate: today, instanceMonth: currentMonth });
    });

    const historicalData = [
      { offset: 1, completed: ['a-d-1', 'a-d-2', 'a-d-3', 'a-d-4', 'a-d-5', 'a-d-6', 'a-d-7', 'a-d-11', 'a-d-17'], incomplete: ['a-d-13', 'a-d-19', 'a-d-20'], role: 'associate' },
      { offset: 2, completed: ['a-d-1', 'a-d-2', 'a-d-3', 'a-d-4', 'a-d-17', 'a-d-18', 'a-d-19', 'a-d-20', 'a-d-5', 'a-d-11'], incomplete: ['a-d-13', 'a-d-12'], role: 'associate' },
      { offset: 3, completed: ['a-d-1', 'a-d-3', 'a-d-11', 'a-d-17', 'a-d-19', 'a-d-2', 'a-d-4'], incomplete: ['a-d-6', 'a-d-7', 'a-d-21', 'a-d-22'], role: 'associate' },
      { offset: 4, completed: ['a-d-1', 'a-d-2', 'a-d-3', 'a-d-4', 'a-d-5', 'a-d-17', 'a-d-11', 'a-d-13'], incomplete: ['a-d-20', 'a-d-21'], role: 'associate' },
      { offset: 1, completed: ['m-d-1', 'm-d-2', 'm-d-3', 'm-d-6', 'm-d-8'], incomplete: ['m-d-5', 'm-d-9'], role: 'manager' },
      { offset: 2, completed: ['m-d-1', 'm-d-2', 'm-d-3', 'm-d-4', 'm-d-6'], incomplete: ['m-d-7', 'm-d-9'], role: 'manager' }
    ];

    historicalData.forEach(hist => {
      const date = getDateOffset(hist.offset);
      hist.completed.forEach((tid, idx) => {
        const template = recurringTaskTemplates.find(t => t.templateId === tid);
        if (template) tasks.push({ ...template, id: `${tid}-${date}-done-${idx}`, status: 'done', dueDate: date, completedDate: date, instanceDate: date });
      });
      hist.incomplete.forEach((tid, idx) => {
        const template = recurringTaskTemplates.find(t => t.templateId === tid);
        if (template) tasks.push({ ...template, id: `${tid}-${date}-incomplete-${idx}`, status: 'todo', dueDate: date, instanceDate: date });
      });
    });
    return tasks;
  };

  const [tasks, setTasks] = useState(generateInitialTasks());

  const [learnings, setLearnings] = useState([
    { id: 1, week: 'Week of April 21, 2026', title: 'Customers confused about lash extension compatibility', insight: 'Multiple tickets this week about whether serum works with extensions. Need clearer messaging on product page.', action: 'Update product description + create FAQ entry', author: 'CS Associate', date: '2026-04-22' },
    { id: 2, week: 'Week of April 21, 2026', title: 'Delayed orders causing high ticket volume', insight: 'Warehouse backlog leading to 15+ "where is my order" tickets daily. Proactive email would reduce inbox volume.', action: 'Set up automated shipping delay notification', author: 'CS Manager', date: '2026-04-22' }
  ]);

  const [learningForm, setLearningForm] = useState({
    week: `Week of ${new Date().toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' })}`,
    title: '', insight: '', action: '', author: 'CS Associate'
  });

  const [formData, setFormData] = useState({
    task: '', priority: 'medium', status: 'todo', assignee: '', role: 'associate', period: 'daily',
    dueDate: getTodayString(), dueTime: ''
  });

  const priorityConfig = {
    high: { label: 'HIGH', bg: '#e85785', text: '#ffffff' },
    medium: { label: 'MEDIUM', bg: '#fef3c7', text: '#92400e' },
    low: { label: 'LOW', bg: '#dbeafe', text: '#1e40af' }
  };

  const statusConfig = {
    todo: { label: 'To Do', bg: '#f3f4f6', text: '#374151', border: '#d1d5db' },
    'in-progress': { label: 'In Progress', bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
    done: { label: 'Done', bg: '#d1fae5', text: '#065f46', border: '#10b981' }
  };

  const today = getTodayString();
  const currentWeek = getCurrentWeek();
  const currentMonth = getCurrentMonth();

  const roleTasks = tasks.filter(t => t.role === role);
  
  let viewTasks;
  if (view === 'all') {
    viewTasks = roleTasks.filter(t => t.instanceDate === today || (t.period === 'weekly' && t.instanceWeek === currentWeek) || (t.period === 'monthly' && t.instanceMonth === currentMonth));
  } else if (view === 'today') {
    viewTasks = roleTasks.filter(t => t.period === 'daily' && t.instanceDate === today);
  } else if (view === 'week') {
    viewTasks = roleTasks.filter(t => t.period === 'weekly' && t.instanceWeek === currentWeek);
  } else if (view === 'month') {
    viewTasks = roleTasks.filter(t => t.period === 'monthly' && t.instanceMonth === currentMonth);
  }
  
  const activeTasks = viewTasks.filter(t => t.status !== 'done');
  const completedTasks = viewTasks.filter(t => t.status === 'done');
  
  const filteredActiveTasks = activeTasks.filter(t => {
    if (searchTerm && !t.task.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    return true;
  });

  const filteredCompletedTasks = completedTasks.filter(t => {
    if (searchTerm && !t.task.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    return true;
  });

  const total = viewTasks.length;
  const completed = completedTasks.length;
  const inProgress = viewTasks.filter(t => t.status === 'in-progress').length;
  const todoCount = viewTasks.filter(t => t.status === 'todo').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const getPastDates = () => {
    const dates = new Set();
    tasks.filter(t => t.role === role && t.period === 'daily' && t.instanceDate < today).forEach(t => {
      dates.add(t.instanceDate);
    });
    return Array.from(dates).sort().reverse();
  };

  const pastDates = getPastDates();
  
  useEffect(() => {
    if (mainTab === 'history' && !selectedHistoryDate && pastDates.length > 0) {
      setSelectedHistoryDate(pastDates[0]);
    }
  }, [mainTab, pastDates, selectedHistoryDate]);

  const historyTasks = selectedHistoryDate 
    ? tasks.filter(t => t.role === role && t.period === 'daily' && t.instanceDate === selectedHistoryDate)
    : [];
  const historyCompleted = historyTasks.filter(t => t.status === 'done');
  const historyIncomplete = historyTasks.filter(t => t.status !== 'done');

  const allCompletedForRole = tasks.filter(t => t.role === role && t.status === 'done');
  const weekStartStr = (() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d.toISOString().split('T')[0];
  })();
  const monthStartStr = (() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().split('T')[0];
  })();
  
  const completedToday = allCompletedForRole.filter(t => t.completedDate === today);
  const completedThisWeek = allCompletedForRole.filter(t => t.completedDate >= weekStartStr);
  const completedThisMonth = allCompletedForRole.filter(t => t.completedDate >= monthStartStr);

  const dashboardData = {
    day: { label: 'Today', subtitle: new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), completed: completedToday, count: completedToday.length },
    week: { label: 'This Week', subtitle: `Week ${currentWeek} of 2026`, completed: completedThisWeek, count: completedThisWeek.length },
    month: { label: 'This Month', subtitle: new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }), completed: completedThisMonth, count: completedThisMonth.length }
  };

  const currentDashboard = dashboardData[dashboardPeriod];

  const dailyBreakdownData = [6, 5, 4, 3, 2, 1, 0].map(offset => ({
    day: offset === 0 ? 'Today' : new Date(getDateOffset(offset)).toLocaleDateString('en-GB', { weekday: 'short' }),
    count: allCompletedForRole.filter(t => t.completedDate === getDateOffset(offset)).length
  }));

  const priorityBreakdown = [
    { name: 'High', value: currentDashboard.completed.filter(t => t.priority === 'high').length, color: '#e85785' },
    { name: 'Medium', value: currentDashboard.completed.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
    { name: 'Low', value: currentDashboard.completed.filter(t => t.priority === 'low').length, color: '#3b82f6' }
  ].filter(p => p.value > 0);

  const openAddModal = () => {
    setEditingTask(null);
    setFormData({
      task: '', priority: 'medium', status: 'todo',
      assignee: role === 'manager' ? 'CS Manager' : 'CS Associate',
      role: role, period: view === 'today' ? 'daily' : view === 'week' ? 'weekly' : view === 'month' ? 'monthly' : 'daily',
      dueDate: today, dueTime: ''
    });
    setShowModal(true);
  };

  const openEditModal = (task) => { setEditingTask(task); setFormData(task); setShowModal(true); };

  const saveTask = () => {
    if (!formData.task.trim()) return;
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...formData, id: editingTask.id } : t));
      showToast('Task updated successfully');
    } else {
      setTasks([...tasks, { ...formData, id: `custom-${Date.now()}`, instanceDate: formData.dueDate, instanceWeek: formData.period === 'weekly' ? currentWeek : undefined, instanceMonth: formData.period === 'monthly' ? currentMonth : undefined }]);
      showToast('Task created successfully');
    }
    setShowModal(false);
  };

  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  
  const cycleStatus = (id) => {
    setTasks(tasks.map(t => {
      if (t.id !== id) return t;
      const nextStatus = t.status === 'todo' ? 'in-progress' : t.status === 'in-progress' ? 'done' : 'todo';
      return { ...t, status: nextStatus, completedDate: nextStatus === 'done' ? today : null };
    }));
  };

  const markComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'done', completedDate: today } : t));
    showToast('Task marked as complete! 🎉');
  };

  const markCompleteInHistory = (id, completedOn) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'done', completedDate: completedOn } : t));
    showToast('Task retroactively completed');
  };

  const restoreTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'todo', completedDate: null } : t));
    showToast('Task restored to active');
  };

  const carryToToday = (task) => {
    const newTask = {
      ...task, id: `${task.templateId || 'custom'}-carried-${Date.now()}`,
      status: 'todo', dueDate: today, instanceDate: today,
      carriedFrom: task.instanceDate, completedDate: null
    };
    setTasks([...tasks, newTask]);
    showToast(`Task carried to today ✓`);
  };

  // FIXED: Archive single task with custom modal
  const archiveTask = (id, taskName) => {
    setConfirmModal({
      show: true,
      title: 'Archive this task?',
      message: `"${taskName}" will be permanently removed from history. Completion data stays in your reports.`,
      confirmText: 'Archive',
      confirmColor: '#ef4444',
      onConfirm: () => {
        setTasks(tasks.filter(t => t.id !== id));
        setConfirmModal({ show: false });
        showToast('Task archived');
      }
    });
  };

  const carryAllToToday = () => {
    const newTasks = historyIncomplete.map(task => ({
      ...task, id: `${task.templateId || 'custom'}-carried-${Date.now()}-${Math.random()}`,
      status: 'todo', dueDate: today, instanceDate: today,
      carriedFrom: task.instanceDate, completedDate: null
    }));
    setTasks([...tasks, ...newTasks]);
    showToast(`${newTasks.length} tasks carried to today`);
  };

  // FIXED: Archive all with custom modal  
  const archiveAllIncomplete = () => {
    setConfirmModal({
      show: true,
      title: `Archive all ${historyIncomplete.length} incomplete tasks?`,
      message: `All incomplete tasks from ${formatDateShort(selectedHistoryDate)} will be permanently removed. This can't be undone. Completed tasks stay intact.`,
      confirmText: `Archive ${historyIncomplete.length} Tasks`,
      confirmColor: '#ef4444',
      onConfirm: () => {
        const idsToRemove = new Set(historyIncomplete.map(t => t.id));
        setTasks(tasks.filter(t => !idsToRemove.has(t.id)));
        setConfirmModal({ show: false });
        showToast(`${idsToRemove.size} tasks archived`);
      }
    });
  };

  const saveLearning = () => {
    if (!learningForm.title.trim() || !learningForm.insight.trim()) return;
    setLearnings([...learnings, { ...learningForm, id: Date.now(), date: today }]);
    setLearningForm({
      week: `Week of ${new Date().toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' })}`,
      title: '', insight: '', action: '', author: role === 'manager' ? 'CS Manager' : 'CS Associate'
    });
    setShowLearningModal(false);
    showToast('Learning logged');
  };

  const deleteLearning = (id) => setLearnings(learnings.filter(l => l.id !== id));

  const navigateHistoryDate = (direction) => {
    const currentIdx = pastDates.indexOf(selectedHistoryDate);
    if (direction === 'prev' && currentIdx < pastDates.length - 1) {
      setSelectedHistoryDate(pastDates[currentIdx + 1]);
    } else if (direction === 'next' && currentIdx > 0) {
      setSelectedHistoryDate(pastDates[currentIdx - 1]);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;600;700;800;900&family=Montserrat:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .bb-container { min-height: 100vh; background: #ffffff; font-family: 'Montserrat', sans-serif; color: #1a1a1a; }
        .bb-header-font { font-family: 'League Spartan', sans-serif; font-weight: 800; letter-spacing: -0.071em; line-height: 0.95; }
        .bb-btn-primary { background: #e85785; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-family: 'Montserrat'; font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
        .bb-btn-primary:hover { background: #d64574; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(232, 87, 133, 0.3); }
        .bb-btn-secondary { background: transparent; color: #1a1a1a; border: 1.5px solid #e5e7eb; padding: 8px 16px; border-radius: 8px; font-family: 'Montserrat'; font-weight: 500; font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .bb-btn-secondary:hover { border-color: #e85785; color: #e85785; }
        .bb-btn-danger { background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-family: 'Montserrat'; font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.5px; }
        .bb-btn-danger:hover { background: #dc2626; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); }
        .bb-main-tabs { display: flex; gap: 4px; background: #f9fafb; padding: 4px; border-radius: 12px; border: 1.5px solid #f3f4f6; }
        .bb-main-tab { padding: 12px 24px; border: none; background: transparent; color: #6b7280; font-family: 'Montserrat'; font-weight: 700; font-size: 13px; cursor: pointer; border-radius: 8px; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        .bb-main-tab.active { background: white; color: #e85785; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .bb-role-switcher { display: inline-flex; background: #f3f4f6; padding: 4px; border-radius: 10px; gap: 4px; }
        .bb-role-btn { padding: 10px 24px; border: none; background: transparent; color: #6b7280; font-family: 'Montserrat'; font-weight: 700; font-size: 12px; cursor: pointer; border-radius: 7px; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 8px; }
        .bb-role-btn.active { background: #1a1a1a; color: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .bb-view-tab { background: transparent; color: #6b7280; border: none; padding: 10px 18px; border-radius: 8px; font-family: 'Montserrat'; font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.5px; }
        .bb-view-tab.active { background: #e85785; color: white; }
        .bb-view-tab:not(.active):hover { background: #fdf2f8; color: #e85785; }
        .bb-stat-card { background: white; border: 1.5px solid #f3f4f6; border-radius: 12px; padding: 24px; position: relative; overflow: hidden; }
        .bb-stat-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; }
        .bb-stat-card.primary::before { background: #e85785; }
        .bb-stat-card.warning::before { background: #f59e0b; }
        .bb-stat-card.success::before { background: #10b981; }
        .bb-stat-card.info::before { background: #3b82f6; }
        .bb-stat-card.danger::before { background: #ef4444; }
        .bb-dashboard-hero { background: linear-gradient(135deg, #e85785 0%, #f472b6 100%); border-radius: 20px; padding: 40px; color: white; margin-bottom: 24px; position: relative; overflow: hidden; }
        .bb-dashboard-hero::before { content: ''; position: absolute; top: -50%; right: -10%; width: 400px; height: 400px; border-radius: 50%; background: rgba(255,255,255,0.1); }
        .bb-dashboard-hero::after { content: ''; position: absolute; bottom: -30%; left: -10%; width: 300px; height: 300px; border-radius: 50%; background: rgba(255,255,255,0.08); }
        .bb-dashboard-card { background: white; border: 1.5px solid #f3f4f6; border-radius: 16px; padding: 28px; transition: all 0.2s; }
        .bb-dashboard-card:hover { border-color: #e85785; box-shadow: 0 8px 24px rgba(232, 87, 133, 0.08); }
        .bb-dashboard-period-btn { padding: 12px 28px; background: white; border: 2px solid #f3f4f6; color: #6b7280; font-family: 'Montserrat'; font-weight: 700; font-size: 13px; cursor: pointer; border-radius: 10px; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.5px; }
        .bb-dashboard-period-btn.active { background: #e85785; color: white; border-color: #e85785; box-shadow: 0 4px 12px rgba(232, 87, 133, 0.25); }
        .bb-achievement-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.25); backdrop-filter: blur(10px); padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.3); }
        .bb-completed-list-item { background: white; border: 1.5px solid #f3f4f6; border-left: 4px solid #10b981; border-radius: 10px; padding: 14px 18px; margin-bottom: 8px; transition: all 0.2s; display: flex; align-items: center; gap: 16px; }
        .bb-task-row { background: white; border: 1.5px solid #f3f4f6; border-radius: 10px; padding: 14px 18px; margin-bottom: 8px; display: grid; grid-template-columns: 36px 3fr 100px 120px 140px 100px 36px; align-items: center; gap: 14px; transition: all 0.3s ease; cursor: pointer; }
        .bb-task-row:hover { border-color: #e85785; transform: translateX(2px); box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .bb-completed-row { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1.5px solid #bbf7d0; border-radius: 10px; padding: 14px 18px; margin-bottom: 8px; display: grid; grid-template-columns: 36px 3fr 100px 140px 120px 80px; align-items: center; gap: 14px; transition: all 0.2s; }
        .bb-history-row { background: white; border: 1.5px solid #f3f4f6; border-left: 4px solid #f59e0b; border-radius: 10px; padding: 16px 20px; margin-bottom: 8px; display: grid; grid-template-columns: 40px 3fr 100px 140px 260px; align-items: center; gap: 14px; transition: all 0.2s; }
        .bb-history-row.completed { border-left-color: #10b981; background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%); }
        .bb-status-circle { width: 26px; height: 26px; border-radius: 50%; border: 2px solid #d1d5db; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; background: white; }
        .bb-status-circle:hover { border-color: #e85785; transform: scale(1.1); }
        .bb-status-circle.in-progress { border-color: #f59e0b; background: #fef3c7; }
        .bb-status-circle.done { border-color: #10b981; background: #10b981; }
        .bb-priority-badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 10px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
        .bb-status-badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 10px; font-weight: 600; }
        .bb-assignee-pill { display: inline-flex; align-items: center; gap: 6px; background: #fdf2f8; color: #e85785; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .bb-assignee-avatar { width: 18px; height: 18px; border-radius: 50%; background: #e85785; color: white; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; }
        .bb-input { width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-family: 'Montserrat'; font-size: 13px; color: #1a1a1a; background: white; transition: all 0.2s; }
        .bb-input:focus { outline: none; border-color: #e85785; box-shadow: 0 0 0 3px rgba(232, 87, 133, 0.1); }
        .bb-textarea { width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-family: 'Montserrat'; font-size: 13px; color: #1a1a1a; background: white; min-height: 80px; resize: vertical; }
        .bb-label { font-family: 'Montserrat'; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block; }
        .bb-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 20px; }
        .bb-modal { background: white; border-radius: 16px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
        .bb-confirm-modal { background: white; border-radius: 16px; max-width: 480px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden; }
        .bb-progress-bar { background: #f3f4f6; height: 8px; border-radius: 4px; overflow: hidden; margin-top: 12px; }
        .bb-progress-fill { height: 100%; background: linear-gradient(90deg, #e85785 0%, #f472b6 100%); transition: width 0.5s ease; }
        .bb-icon-btn { background: transparent; border: none; color: #9ca3af; cursor: pointer; padding: 6px; border-radius: 6px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
        .bb-icon-btn:hover { background: #fdf2f8; color: #e85785; }
        .bb-search-wrap { position: relative; flex: 1; max-width: 300px; }
        .bb-search-input { width: 100%; padding: 10px 14px 10px 38px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-family: 'Montserrat'; font-size: 13px; background: white; }
        .bb-search-input:focus { outline: none; border-color: #e85785; }
        .bb-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; }
        .bb-select { padding: 8px 30px 8px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-family: 'Montserrat'; font-size: 13px; font-weight: 500; background: white; color: #1a1a1a; cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; }
        .bb-learning-card { background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); border: 1.5px solid #fbcfe8; border-radius: 12px; padding: 20px; margin-bottom: 12px; position: relative; transition: all 0.2s; }
        .bb-completed-section { background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%); border: 2px solid #bbf7d0; border-radius: 16px; padding: 24px; margin-top: 32px; }
        .bb-section-header { display: flex; justify-content: space-between; align-items: center; margin: 40px 0 16px; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastSlide { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .bb-fade-in { animation: slideIn 0.3s ease-out; }
        .bb-toast { position: fixed; bottom: 24px; right: 24px; background: #1a1a1a; color: white; padding: 14px 24px; border-radius: 12px; font-weight: 600; font-size: 13px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 100; animation: toastSlide 0.3s ease-out; display: flex; align-items: center; gap: 10px; }
        .bb-toast.success { background: #10b981; }
        .bb-toast.error { background: #ef4444; }
        .bb-date-nav { display: flex; align-items: center; gap: 16px; background: white; border: 1.5px solid #f3f4f6; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; }
        .bb-date-nav-btn { background: #f9fafb; border: 1.5px solid #e5e7eb; width: 40px; height: 40px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #6b7280; transition: all 0.2s; }
        .bb-date-nav-btn:hover:not(:disabled) { background: #fdf2f8; border-color: #e85785; color: #e85785; }
        .bb-date-nav-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .bb-history-date-pill { padding: 8px 14px; border: 1.5px solid #e5e7eb; background: white; border-radius: 8px; font-family: 'Montserrat'; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; color: #6b7280; }
        .bb-history-date-pill:hover { border-color: #e85785; color: #e85785; }
        .bb-history-date-pill.active { background: #e85785; border-color: #e85785; color: white; }
        .bb-action-btn { background: white; border: 1.5px solid #e5e7eb; padding: 6px 12px; border-radius: 6px; font-family: 'Montserrat'; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 4px; text-transform: uppercase; letter-spacing: 0.3px; }
        .bb-action-btn.carry { border-color: #e85785; color: #e85785; }
        .bb-action-btn.carry:hover { background: #e85785; color: white; }
        .bb-action-btn.complete { border-color: #10b981; color: #10b981; }
        .bb-action-btn.complete:hover { background: #10b981; color: white; }
        .bb-action-btn.archive { border-color: #ef4444; color: #ef4444; }
        .bb-action-btn.archive:hover { background: #ef4444; color: white; }
        .bb-reset-indicator { display: inline-flex; align-items: center; gap: 6px; background: #dcfce7; color: #166534; padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; border: 1px solid #bbf7d0; }
      `}</style>

      <div className="bb-container">
        {/* Header */}
        <div style={{ background: 'white', borderBottom: '1.5px solid #f3f4f6', padding: '24px 40px', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h1 className="bb-header-font" style={{ fontSize: '44px', margin: 0, color: '#1a1a1a', textTransform: 'uppercase' }}>Customer Service Hub</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                  <p style={{ color: '#6b7280', margin: 0, fontSize: '13px', fontWeight: '500' }}>
                    By Babes · {role === 'manager' ? 'Manager Dashboard' : 'Associate Dashboard'}
                  </p>
                  <span className="bb-reset-indicator"><Sunrise size={12} />Auto-Reset Active</span>
                </div>
              </div>
              {mainTab === 'tasks' && (
                <button className="bb-btn-primary" onClick={openAddModal}><Plus size={16} />Add Task</button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="bb-main-tabs">
                <button className={`bb-main-tab ${mainTab === 'tasks' ? 'active' : ''}`} onClick={() => setMainTab('tasks')}>
                  <ListTodo size={16} />Tasks
                </button>
                <button className={`bb-main-tab ${mainTab === 'history' ? 'active' : ''}`} onClick={() => setMainTab('history')}>
                  <History size={16} />History
                </button>
                <button className={`bb-main-tab ${mainTab === 'dashboard' ? 'active' : ''}`} onClick={() => setMainTab('dashboard')}>
                  <LayoutDashboard size={16} />Dashboard
                </button>
              </div>

              <div className="bb-role-switcher">
                <button className={`bb-role-btn ${role === 'associate' ? 'active' : ''}`} onClick={() => setRole('associate')}>
                  <MessageSquare size={14} />CS Associate
                </button>
                <button className={`bb-role-btn ${role === 'manager' ? 'active' : ''}`} onClick={() => setRole('manager')}>
                  <Star size={14} />CS Manager
                </button>
              </div>
            </div>

            {mainTab === 'tasks' && (
              <div style={{ display: 'flex', gap: '4px' }}>
                {[{ id: 'today', label: 'Daily' }, { id: 'week', label: 'Weekly' }, { id: 'month', label: 'Monthly' }, { id: 'all', label: 'All Tasks' }].map(tab => (
                  <button key={tab.id} onClick={() => setView(tab.id)} className={`bb-view-tab ${view === tab.id ? 'active' : ''}`}>
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px' }}>
          
          {/* HISTORY TAB */}
          {mainTab === 'history' && (
            <>
              <div style={{ marginBottom: '24px' }}>
                <h2 className="bb-header-font" style={{ fontSize: '32px', margin: 0, color: '#1a1a1a', textTransform: 'uppercase' }}>Task History Manager</h2>
                <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>Review past days, complete missed tasks, carry forward, or archive incomplete items</p>
              </div>

              <div className="bb-date-nav">
                <button className="bb-date-nav-btn" onClick={() => navigateHistoryDate('prev')} disabled={!selectedHistoryDate || pastDates.indexOf(selectedHistoryDate) >= pastDates.length - 1}>
                  <ChevronLeft size={18} />
                </button>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Viewing History For</p>
                  <p className="bb-header-font" style={{ fontSize: '24px', margin: '2px 0 0', color: '#1a1a1a', textTransform: 'uppercase' }}>
                    {selectedHistoryDate ? formatDateLabel(selectedHistoryDate) : 'Select a date'}
                  </p>
                </div>
                <button className="bb-date-nav-btn" onClick={() => navigateHistoryDate('next')} disabled={!selectedHistoryDate || pastDates.indexOf(selectedHistoryDate) <= 0}>
                  <ChevronRight size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {pastDates.map(date => (
                  <button key={date} className={`bb-history-date-pill ${selectedHistoryDate === date ? 'active' : ''}`} onClick={() => setSelectedHistoryDate(date)}>
                    {formatDateShort(date)}
                  </button>
                ))}
              </div>

              {selectedHistoryDate && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                    <div className="bb-stat-card primary">
                      <p className="bb-label">Total Tasks</p>
                      <p className="bb-header-font" style={{ fontSize: '38px', margin: '4px 0', color: '#1a1a1a' }}>{historyTasks.length}</p>
                      <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>on this day</p>
                    </div>
                    <div className="bb-stat-card success">
                      <p className="bb-label">Completed</p>
                      <p className="bb-header-font" style={{ fontSize: '38px', margin: '4px 0', color: '#10b981' }}>{historyCompleted.length}</p>
                      <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>tasks done</p>
                    </div>
                    <div className="bb-stat-card danger">
                      <p className="bb-label">Incomplete</p>
                      <p className="bb-header-font" style={{ fontSize: '38px', margin: '4px 0', color: '#ef4444' }}>{historyIncomplete.length}</p>
                      <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>needs action</p>
                    </div>
                    <div className="bb-stat-card warning">
                      <p className="bb-label">Completion Rate</p>
                      <p className="bb-header-font" style={{ fontSize: '38px', margin: '4px 0', color: '#f59e0b' }}>
                        {historyTasks.length > 0 ? Math.round((historyCompleted.length / historyTasks.length) * 100) : 0}%
                      </p>
                      <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>for that day</p>
                    </div>
                  </div>

                  {historyIncomplete.length > 0 && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '20px 24px', background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)', border: '1.5px solid #fed7aa', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AlertCircle size={20} color="white" />
                          </div>
                          <div>
                            <h3 className="bb-header-font" style={{ fontSize: '22px', margin: 0, color: '#92400e', textTransform: 'uppercase' }}>
                              {historyIncomplete.length} Incomplete {historyIncomplete.length === 1 ? 'Task' : 'Tasks'}
                            </h3>
                            <p style={{ color: '#b45309', fontSize: '12px', margin: '2px 0 0', fontWeight: 600 }}>Decide what to do with each task below</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="bb-action-btn carry" onClick={carryAllToToday} style={{ padding: '10px 18px', fontSize: '12px' }}>
                            <ArrowRight size={14} />Carry All to Today
                          </button>
                          <button className="bb-action-btn archive" onClick={archiveAllIncomplete} style={{ padding: '10px 18px', fontSize: '12px' }}>
                            <Archive size={14} />Archive All
                          </button>
                        </div>
                      </div>

                      <div style={{ marginBottom: '32px' }}>
                        {historyIncomplete.map(task => (
                          <div key={task.id} className="bb-history-row bb-fade-in">
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fef3c7', border: '2px solid #f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <AlertCircle size={14} color="#f59e0b" />
                            </div>
                            <div>
                              <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#1a1a1a', lineHeight: 1.4 }}>{task.task}</p>
                              <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#b45309', fontWeight: 600 }}>
                                ⚠ Not completed on {formatDateShort(task.instanceDate)}
                                {task.dueTime && ` · Was due ${task.dueTime}`}
                              </p>
                            </div>
                            <div>
                              <span className="bb-priority-badge" style={{ background: priorityConfig[task.priority].bg, color: priorityConfig[task.priority].text }}>
                                {priorityConfig[task.priority].label}
                              </span>
                            </div>
                            <div>
                              <span className="bb-assignee-pill">
                                <span className="bb-assignee-avatar">{task.assignee.charAt(0)}</span>
                                {task.assignee}
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              <button className="bb-action-btn complete" onClick={() => markCompleteInHistory(task.id, task.instanceDate)}>
                                <CheckCircle2 size={12} />Complete
                              </button>
                              <button className="bb-action-btn carry" onClick={() => carryToToday(task)}>
                                <ArrowRight size={12} />Carry
                              </button>
                              <button className="bb-action-btn archive" onClick={() => archiveTask(task.id, task.task)}>
                                <Archive size={12} />Archive
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {historyCompleted.length > 0 && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CheckCircle2 size={20} color="white" />
                        </div>
                        <div>
                          <h3 className="bb-header-font" style={{ fontSize: '22px', margin: 0, color: '#166534', textTransform: 'uppercase' }}>
                            {historyCompleted.length} Completed
                          </h3>
                          <p style={{ color: '#059669', fontSize: '12px', margin: '2px 0 0', fontWeight: 600 }}>Already done on this day</p>
                        </div>
                      </div>

                      <div>
                        {historyCompleted.map(task => (
                          <div key={task.id} className="bb-history-row completed bb-fade-in">
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <CheckCircle2 size={14} color="white" />
                            </div>
                            <div>
                              <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: '#6b7280', textDecoration: 'line-through', lineHeight: 1.4 }}>{task.task}</p>
                              <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#059669', fontWeight: 600 }}>
                                ✓ Completed on {formatDateShort(task.completedDate)}
                              </p>
                            </div>
                            <div>
                              <span className="bb-priority-badge" style={{ background: priorityConfig[task.priority].bg, color: priorityConfig[task.priority].text, opacity: 0.6 }}>
                                {priorityConfig[task.priority].label}
                              </span>
                            </div>
                            <div>
                              <span className="bb-assignee-pill" style={{ background: '#dcfce7', color: '#166534' }}>
                                <span className="bb-assignee-avatar" style={{ background: '#10b981' }}>{task.assignee.charAt(0)}</span>
                                {task.assignee}
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              <button className="bb-action-btn" onClick={() => restoreTask(task.id)}>
                                <RotateCcw size={12} />Undo
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}

          {/* DASHBOARD TAB */}
          {mainTab === 'dashboard' && (
            <>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                {[{ id: 'day', label: 'Today' }, { id: 'week', label: 'This Week' }, { id: 'month', label: 'This Month' }].map(p => (
                  <button key={p.id} className={`bb-dashboard-period-btn ${dashboardPeriod === p.id ? 'active' : ''}`} onClick={() => setDashboardPeriod(p.id)}>
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="bb-dashboard-hero">
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div className="bb-achievement-badge" style={{ marginBottom: '16px' }}>
                    <Award size={12} />{currentDashboard.label}
                  </div>
                  <h2 className="bb-header-font" style={{ fontSize: '64px', margin: 0, color: 'white', textTransform: 'uppercase', lineHeight: '1' }}>
                    {currentDashboard.count} Tasks
                  </h2>
                  <p style={{ fontSize: '20px', fontWeight: 600, margin: '12px 0 0', opacity: 0.95 }}>Completed {currentDashboard.label.toLowerCase()}</p>
                  <p style={{ fontSize: '13px', margin: '4px 0 0', opacity: 0.8 }}>{currentDashboard.subtitle}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div className="bb-dashboard-card">
                  <h3 className="bb-header-font" style={{ fontSize: '24px', margin: '0 0 8px', color: '#1a1a1a', textTransform: 'uppercase' }}>Last 7 Days</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={dailyBreakdownData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                      <Tooltip contentStyle={{ background: 'white', border: '1.5px solid #f3f4f6', borderRadius: '8px', fontSize: '12px' }} />
                      <Bar dataKey="count" fill="#e85785" radius={[8, 8, 0, 0]} name="Completed" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bb-dashboard-card">
                  <h3 className="bb-header-font" style={{ fontSize: '24px', margin: '0 0 8px', color: '#1a1a1a', textTransform: 'uppercase' }}>By Priority</h3>
                  {priorityBreakdown.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={priorityBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                          {priorityBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px 0' }}>No data yet</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* TASKS TAB */}
          {mainTab === 'tasks' && (
            <>
              <div style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)', border: '1.5px solid #bbf7d0', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Sunrise size={20} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#166534' }}>Auto-Reset Schedule Active</p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#059669' }}>
                    📅 Daily tasks reset every morning · Visit the <strong>History tab</strong> to manage incomplete tasks
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                <div className="bb-stat-card primary">
                  <p className="bb-label">Total Tasks</p>
                  <p className="bb-header-font" style={{ fontSize: '38px', margin: '4px 0', color: '#1a1a1a' }}>{total}</p>
                  <div className="bb-progress-bar"><div className="bb-progress-fill" style={{ width: `${completionRate}%` }}></div></div>
                  <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '8px', fontWeight: 600 }}>{completionRate}% COMPLETE</p>
                </div>
                <div className="bb-stat-card info">
                  <p className="bb-label">To Do</p>
                  <p className="bb-header-font" style={{ fontSize: '38px', margin: '4px 0', color: '#3b82f6' }}>{todoCount}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>pending tasks</p>
                </div>
                <div className="bb-stat-card warning">
                  <p className="bb-label">In Progress</p>
                  <p className="bb-header-font" style={{ fontSize: '38px', margin: '4px 0', color: '#f59e0b' }}>{inProgress}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>active tasks</p>
                </div>
                <div className="bb-stat-card success">
                  <p className="bb-label">Completed Today</p>
                  <p className="bb-header-font" style={{ fontSize: '38px', margin: '4px 0', color: '#10b981' }}>{completed}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>moved to board ↓</p>
                </div>
              </div>

              <div style={{ background: 'white', border: '1.5px solid #f3f4f6', borderRadius: '12px', padding: '16px', marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="bb-search-wrap">
                  <Search size={16} className="bb-search-icon" />
                  <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bb-search-input" />
                </div>
                <select className="bb-select" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <h2 className="bb-header-font" style={{ fontSize: '28px', margin: 0, color: '#1a1a1a', textTransform: 'uppercase' }}>Active Tasks</h2>
                  <span style={{ background: '#fdf2f8', color: '#e85785', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', border: '1px solid #fbcfe8' }}>
                    {filteredActiveTasks.length} ACTIVE
                  </span>
                </div>

                {filteredActiveTasks.map(task => (
                  <div key={task.id} className={`bb-task-row bb-fade-in ${task.status}`} onClick={() => openEditModal(task)}>
                    <button className={`bb-status-circle ${task.status}`} onClick={(e) => { e.stopPropagation(); cycleStatus(task.id); }}>
                      {task.status === 'in-progress' && <Circle size={8} fill="#f59e0b" stroke="#f59e0b" />}
                    </button>
                    <div>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#1a1a1a', lineHeight: 1.4 }}>{task.task}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '10px', color: task.carriedFrom ? '#e85785' : '#9ca3af', textTransform: 'capitalize', fontWeight: task.carriedFrom ? 700 : 400 }}>
                        {task.carriedFrom ? `↪ Carried from ${formatDateShort(task.carriedFrom)}` : (task.period === 'daily' ? '📅 Daily · Recurring' : task.period === 'weekly' ? '📆 Weekly · Recurring' : '🗓️ Monthly · Recurring')}
                      </p>
                    </div>
                    <div>
                      <span className="bb-priority-badge" style={{ background: priorityConfig[task.priority].bg, color: priorityConfig[task.priority].text }}>
                        {priorityConfig[task.priority].label}
                      </span>
                    </div>
                    <div>
                      <span className="bb-status-badge" style={{ background: statusConfig[task.status].bg, color: statusConfig[task.status].text, border: `1px solid ${statusConfig[task.status].border}` }}>
                        {statusConfig[task.status].label}
                      </span>
                    </div>
                    <div>
                      <span className="bb-assignee-pill">
                        <span className="bb-assignee-avatar">{task.assignee.charAt(0)}</span>
                        {task.assignee}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500 }}>{task.dueTime || task.dueDate}</div>
                    <div>
                      <button className="bb-icon-btn" onClick={(e) => { e.stopPropagation(); markComplete(task.id); }} style={{ color: '#10b981' }}>
                        <CheckCircle2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCompletedTasks.length > 0 && (
                <div className="bb-completed-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1.5px dashed #bbf7d0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle2 size={20} color="white" />
                      </div>
                      <div>
                        <h2 className="bb-header-font" style={{ fontSize: '28px', margin: 0, color: '#166534', textTransform: 'uppercase' }}>Completed Today</h2>
                        <p style={{ color: '#059669', fontSize: '12px', margin: '2px 0 0', fontWeight: 600 }}>
                          {filteredCompletedTasks.length} {filteredCompletedTasks.length === 1 ? 'task' : 'tasks'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {filteredCompletedTasks.map(task => (
                    <div key={task.id} className="bb-completed-row bb-fade-in">
                      <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle2 size={14} color="white" />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, lineHeight: 1.4, textDecoration: 'line-through', color: '#6b7280' }}>{task.task}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '10px', color: '#059669', fontWeight: 600 }}>✓ Completed {task.completedDate}</p>
                      </div>
                      <div>
                        <span className="bb-priority-badge" style={{ background: priorityConfig[task.priority].bg, color: priorityConfig[task.priority].text, opacity: 0.6 }}>
                          {priorityConfig[task.priority].label}
                        </span>
                      </div>
                      <div>
                        <span className="bb-assignee-pill" style={{ background: '#dcfce7', color: '#166534' }}>
                          <span className="bb-assignee-avatar" style={{ background: '#10b981' }}>{task.assignee.charAt(0)}</span>
                          {task.assignee}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600, textTransform: 'capitalize' }}>
                        {task.period === 'daily' ? '📅 Daily' : task.period === 'weekly' ? '📆 Weekly' : '🗓️ Monthly'}
                      </div>
                      <div>
                        <button onClick={() => restoreTask(task.id)} style={{ background: 'white', border: '1.5px solid #bbf7d0', color: '#059669', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <RotateCcw size={12} />Restore
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* CONFIRMATION MODAL (replaces broken confirm()) */}
        {confirmModal.show && (
          <div className="bb-modal-overlay" onClick={() => setConfirmModal({ show: false })}>
            <div className="bb-confirm-modal" onClick={(e) => e.stopPropagation()}>
              <div style={{ padding: '32px 32px 24px', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <AlertTriangle size={32} color="#ef4444" />
                </div>
                <h2 className="bb-header-font" style={{ fontSize: '24px', margin: 0, color: '#1a1a1a', textTransform: 'uppercase' }}>
                  {confirmModal.title}
                </h2>
                <p style={{ color: '#6b7280', margin: '12px 0 0', fontSize: '14px', lineHeight: 1.5 }}>
                  {confirmModal.message}
                </p>
              </div>
              <div style={{ padding: '0 32px 24px', display: 'flex', gap: '12px' }}>
                <button className="bb-btn-secondary" style={{ flex: 1, padding: '12px', justifyContent: 'center', display: 'flex' }} onClick={() => setConfirmModal({ show: false })}>
                  Cancel
                </button>
                <button 
                  className="bb-btn-danger" 
                  style={{ flex: 1, padding: '12px', justifyContent: 'center', display: 'flex' }}
                  onClick={confirmModal.onConfirm}
                >
                  {confirmModal.confirmText}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TOAST NOTIFICATION */}
        {toast.show && (
          <div className={`bb-toast ${toast.type}`}>
            <CheckCircle2 size={16} />
            {toast.message}
          </div>
        )}

        {/* Task Modal */}
        {showModal && (
          <div className="bb-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="bb-modal" onClick={(e) => e.stopPropagation()}>
              <div style={{ padding: '28px 28px 0', display: 'flex', justifyContent: 'space-between' }}>
                <h2 className="bb-header-font" style={{ fontSize: '32px', margin: 0, color: '#1a1a1a', textTransform: 'uppercase' }}>
                  {editingTask ? 'Edit Task' : 'New Task'}
                </h2>
                <button className="bb-icon-btn" onClick={() => setShowModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <div style={{ padding: '24px 28px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label className="bb-label">Task Name</label>
                  <input type="text" className="bb-input" placeholder="What needs to be done?" value={formData.task} onChange={(e) => setFormData({ ...formData, task: e.target.value })} autoFocus />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label className="bb-label">Priority</label>
                    <select className="bb-input bb-select" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="bb-label">Due Time</label>
                    <input type="text" className="bb-input" placeholder="e.g. 2:00 PM" value={formData.dueTime} onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })} />
                  </div>
                </div>
              </div>
              <div style={{ padding: '20px 28px', borderTop: '1.5px solid #f3f4f6', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className="bb-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="bb-btn-primary" onClick={saveTask}>{editingTask ? 'Save' : 'Create Task'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default ByBabesTaskTracker;
