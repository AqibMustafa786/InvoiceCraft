
'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useMemo } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    useDroppable
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskStatus, TaskPriority, Subtask, TaskComment } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, Plus, Calendar, GripVertical, CheckSquare, MessageSquare, Trash2, Send, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useFirebase } from '@/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { useUserAuth } from '@/context/auth-provider';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

interface KanbanBoardProps {
    companyId: string;
}

const statusMap: Record<TaskStatus, string> = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Done'
};

const priorityColors: Record<TaskPriority, string> = {
    'low': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'medium': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'high': 'bg-red-500/10 text-red-500 border-red-500/20',
};

// Sortable Item Component
function SortableTaskItem({ task, onClick }: { task: Task, onClick: (task: Task) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id, data: { type: 'Task', task } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3" onClick={() => onClick(task)}>
            <TaskCard task={task} />
        </div>
    );
}

function TaskCard({ task }: { task: Task }) {
    const { firestore } = useFirebase();

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!firestore) return;
        try {
            await deleteDoc(doc(firestore, 'companies', task.companyId, 'tasks', task.id));
            toast({ title: "Task deleted" });
        } catch (error) {
            console.error(error);
            toast({ title: "Error deleting task", variant: "destructive" });
        }
    }

    const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
    const totalSubtasks = task.subtasks?.length || 0;
    const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    return (
        <div className="bg-card/50 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all group cursor-pointer active:cursor-grabbing relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className={`${priorityColors[task.priority]} capitalize text-[10px] px-2 py-0.5 h-5`}>
                    {task.priority}
                </Badge>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-3 w-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleDelete} className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <h4 className="font-semibold text-sm mb-1 line-clamp-2">{task.title}</h4>
            <div className="flex items-center gap-3 mt-2 mb-3">
                {totalSubtasks > 0 && (
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-md">
                        <CheckSquare className="h-3 w-3" />
                        <span>{completedSubtasks}/{totalSubtasks}</span>
                    </div>
                )}
                {task.comments && task.comments.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-md">
                        <MessageSquare className="h-3 w-3" />
                        <span>{task.comments.length}</span>
                    </div>
                )}
            </div>

            {totalSubtasks > 0 && (
                <div className="mb-3 h-1 w-full bg-secondary/30 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
            )}

            <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5 border border-white/10">
                        <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
                            {task.assigneeName?.substring(0, 2).toUpperCase() || 'UN'}
                        </AvatarFallback>
                    </Avatar>
                    {task.dueDate && (
                        <div className="flex items-center text-[10px] text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(task.dueDate), 'MMM d')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Droppable Column Component
function KanbanColumn({ id, title, tasks, onTaskClick }: { id: TaskStatus, title: string, tasks: Task[], onTaskClick: (task: Task) => void }) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className="flex-1 min-w-[300px] bg-muted/20 rounded-2xl p-4 flex flex-col h-full border border-gray-200 dark:border-white/5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${id === 'todo' ? 'bg-slate-400' : id === 'in-progress' ? 'bg-blue-500' : 'bg-green-500'}`} />
                    {title}
                    <span className="ml-2 py-0.5 px-2 bg-white/5 rounded-full text-xs text-muted-foreground font-mono">
                        {tasks.length}
                    </span>
                </h3>
            </div>

            <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                    <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        <div className="flex flex-col gap-2 p-1 min-h-[100px]">
                            {tasks.map(task => (
                                <SortableTaskItem key={task.id} task={task} onClick={onTaskClick} />
                            ))}
                        </div>
                    </SortableContext>
                </ScrollArea>
            </div>
        </div>
    );
}

function TaskDetailsDialog({
    task,
    isOpen,
    onOpenChange,
    onUpdate
}: {
    task: Task | null,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
    onUpdate: (taskId: string, data: Partial<Task>) => Promise<void>
}) {
    const { user } = useUserAuth();
    const [newSubtask, setNewSubtask] = useState('');
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!task) return null;

    const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
    const totalSubtasks = task.subtasks?.length || 0;
    const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    const handleAddSubtask = async () => {
        if (!newSubtask.trim()) return;
        const subtask: Subtask = {
            id: crypto.randomUUID(),
            title: newSubtask,
            completed: false
        };
        await onUpdate(task.id, {
            subtasks: [...(task.subtasks || []), subtask]
        });
        setNewSubtask('');
    };

    const toggleSubtask = async (subtaskId: string, completed: boolean) => {
        const updatedSubtasks = task.subtasks?.map(s =>
            s.id === subtaskId ? { ...s, completed } : s
        ) || [];
        await onUpdate(task.id, { subtasks: updatedSubtasks });
    };

    const handleDeleteSubtask = async (subtaskId: string) => {
        const updatedSubtasks = task.subtasks?.filter(s => s.id !== subtaskId) || [];
        await onUpdate(task.id, { subtasks: updatedSubtasks });
    };

    const handleAddComment = async () => {
        if (!newComment.trim() || !user) return;
        setIsSubmitting(true);
        try {
            const comment: TaskComment = {
                id: crypto.randomUUID(),
                text: newComment,
                userId: user.uid,
                userName: user.displayName || user.email || 'User',
                createdAt: new Date() // Will be converted to timestamp by firestore if needed, but for local optimistic update date is fine
            };
            await onUpdate(task.id, {
                comments: [...(task.comments || []), comment]
            });
            setNewComment('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
                <div className="p-6 pb-2">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="space-y-1">
                            <DialogTitle className="text-xl font-bold">{task.title}</DialogTitle>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className={`${priorityColors[task.priority]} capitalize`}>{task.priority}</Badge>
                                <span className="text-sm text-muted-foreground">• In {statusMap[task.status]}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1 p-6 pt-0">
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
                            <p className="text-sm whitespace-pre-wrap">{task.description || "No description provided."}</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-muted-foreground">Subtasks ({completedSubtasks}/{totalSubtasks})</h4>
                            </div>
                            <Progress value={progress} className="h-1.5" />
                            <div className="space-y-2">
                                {task.subtasks?.map(subtask => (
                                    <div key={subtask.id} className="flex items-center gap-2 group">
                                        <Checkbox
                                            checked={subtask.completed}
                                            onCheckedChange={(checked) => toggleSubtask(subtask.id, checked as boolean)}
                                        />
                                        <span className={cn("text-sm flex-1", subtask.completed && "line-through text-muted-foreground")}>{subtask.title}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                                            onClick={() => handleDeleteSubtask(subtask.id)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add a subtask..."
                                    value={newSubtask}
                                    onChange={(e) => setNewSubtask(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                                    className="h-8 text-sm"
                                />
                                <Button size="sm" variant="secondary" onClick={handleAddSubtask} disabled={!newSubtask}>Add</Button>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <h4 className="text-sm font-medium text-muted-foreground">Comments</h4>
                            <div className="space-y-4">
                                {task.comments?.map((comment) => (
                                    <div key={comment.id} className="flex gap-3 text-sm">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                                {comment.userName?.substring(0, 2).toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-xs">{comment.userName}</span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {/* Determine if createdAt is standard Date object or Firestore Timestamp */}
                                                    {comment.createdAt && (typeof comment.createdAt.toDate === 'function'
                                                        ? format(comment.createdAt.toDate(), 'MMM d, h:mm a')
                                                        : format(new Date(comment.createdAt), 'MMM d, h:mm a'))}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground">{comment.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs bg-primary/10 text-primary">ME</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 flex gap-2">
                                    <Input
                                        placeholder="Write a comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                    />
                                    <Button size="icon" disabled={!newComment || isSubmitting} onClick={handleAddComment}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter className="mr-6 mb-6">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function KanbanBoard({ companyId }: KanbanBoardProps) {
    const { firestore, user } = useFirebase();
    const { userProfile } = useUserAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Task Details State
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' as TaskPriority, status: 'todo' as TaskStatus });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        if (!firestore || !companyId) return;

        const q = query(collection(firestore, 'companies', companyId, 'tasks'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedTasks = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
                updatedAt: doc.data().updatedAt?.toDate(),
                dueDate: doc.data().dueDate ? doc.data().dueDate.toDate() : null
            })) as Task[];
            setTasks(fetchedTasks);

            // Update selected task in real-time if open
            if (selectedTask) {
                const updatedSelected = fetchedTasks.find(t => t.id === selectedTask.id);
                if (updatedSelected) {
                    setSelectedTask(updatedSelected);
                }
            }
        });

        return () => unsubscribe();
    }, [firestore, companyId, selectedTask?.id]); // Added selectedTask.id dependency to refresh details

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;
        if (!firestore) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeTask = tasks.find(t => t.id === activeId);
        if (!activeTask) return;

        let newStatus: TaskStatus = activeTask.status;

        if (Object.keys(statusMap).includes(overId)) {
            newStatus = overId as TaskStatus;
        } else {
            const overTask = tasks.find(t => t.id === overId);
            if (overTask) {
                newStatus = overTask.status;
            }
        }

        if (newStatus !== activeTask.status) {
            const updatedTasks = tasks.map(t =>
                t.id === activeId ? { ...t, status: newStatus } : t
            );
            setTasks(updatedTasks);

            try {
                await updateDoc(doc(firestore, 'companies', companyId, 'tasks', activeId), {
                    status: newStatus,
                    updatedAt: serverTimestamp()
                });
            } catch (error) {
                console.error("Failed to update status", error);
            }
        }
    };

    const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

    const handleCreateTask = async () => {
        if (!firestore || !user) return;
        try {
            await addDoc(collection(firestore, 'companies', companyId, 'tasks'), {
                ...newTask,
                companyId,
                createdBy: user.uid,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                assigneeName: user.displayName || user.email,
                assigneeId: user.uid,
                subtasks: [],
                comments: []
            });
            setIsDialogOpen(false);
            setNewTask({ title: '', description: '', priority: 'medium', status: 'todo' });
            toast({ title: "Task created successfully" });
        } catch (error) {
            console.error(error);
            toast({ title: "Error creating task", variant: "destructive" });
        }
    };

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setIsDetailsOpen(true);
    };

    const handleUpdateTask = async (taskId: string, data: Partial<Task>) => {
        if (!firestore) return;
        try {
            // Optimistic update for local state to feel instant
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...data } : t));
            if (selectedTask && selectedTask.id === taskId) {
                setSelectedTask({ ...selectedTask, ...data });
            }

            await updateDoc(doc(firestore, 'companies', companyId, 'tasks', taskId), {
                ...data,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error updating task:", error);
            toast({ title: "Failed to update task", variant: "destructive" });
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold font-headline tracking-tight">Tasks</h2>
                    <p className="text-muted-foreground text-sm">Manage team tasks and projects</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> New Task
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Task</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    placeholder="Task title..."
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    placeholder="Details..."
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Priority</Label>
                                    <Select
                                        value={newTask.priority}
                                        onValueChange={(val: TaskPriority) => setNewTask({ ...newTask, priority: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select
                                        value={newTask.status}
                                        onValueChange={(val: TaskStatus) => setNewTask({ ...newTask, status: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todo">To Do</SelectItem>
                                            <SelectItem value="in-progress">In Progress</SelectItem>
                                            <SelectItem value="done">Done</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreateTask} disabled={!newTask.title}>Create Task</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-6 h-full overflow-x-auto pb-4">
                    <KanbanColumn id="todo" title="To Do" tasks={tasks.filter(t => t.status === 'todo')} onTaskClick={handleTaskClick} />
                    <KanbanColumn id="in-progress" title="In Progress" tasks={tasks.filter(t => t.status === 'in-progress')} onTaskClick={handleTaskClick} />
                    <KanbanColumn id="done" title="Done" tasks={tasks.filter(t => t.status === 'done')} onTaskClick={handleTaskClick} />
                </div>

                <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) }}>
                    {activeTask ? <TaskCard task={activeTask} /> : null}
                </DragOverlay>
            </DndContext>

            {/* Task Details Dialog */}
            <TaskDetailsDialog
                task={selectedTask}
                isOpen={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                onUpdate={handleUpdateTask}
            />
        </div>
    );
}
