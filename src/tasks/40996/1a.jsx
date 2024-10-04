import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewWorkoutOpen, setNewWorkoutOpen] = useState(false);
  const [isWorkoutViewOpen, setWorkoutViewOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const addWorkout = (name, load) => {
    if (name && load > 0) {
      setWorkouts([...workouts, { id: Date.now(), name, logs: [{ load, date: new Date() }] }]);
      setNewWorkoutOpen(false);
    }
  };

  const updateWorkout = (workoutId, load) => {
    if (load > 0) {
      setWorkouts(prev => 
        prev.map(w => w.id === workoutId ? { ...w, logs: [...w.logs, { load, date: new Date() }] } : w)
      );
    }
  };

  const filteredWorkouts = workouts.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Gym Progress Tracker</h1>
      <Input 
        placeholder="Search workouts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Button onClick={() => setNewWorkoutOpen(true)}>Add New Workout</Button>
      
      <WorkoutList 
        workouts={filteredWorkouts} 
        onSelect={setSelectedWorkout} 
        openDialog={setWorkoutViewOpen} 
      />

      <NewWorkoutDialog 
        isOpen={isNewWorkoutOpen} 
        onClose={() => setNewWorkoutOpen(false)}
        onAdd={addWorkout}
      />

      <WorkoutDialog 
        workout={selectedWorkout}
        isOpen={isWorkoutViewOpen}
        onClose={() => setWorkoutViewOpen(false)}
        onUpdate={updateWorkout}
        onDelete={() => {
          setWorkouts(workouts.filter(w => w.id !== selectedWorkout.id));
          setWorkoutViewOpen(false);
        }}
      />
    </div>
  );
}

function WorkoutList({ workouts, onSelect, openDialog }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {workouts.map(workout => (
        <WorkoutItem key={workout.id} workout={workout} onClick={() => { onSelect(workout); openDialog(true); }} />
      ))}
    </div>
  );
}

function WorkoutItem({ workout, onClick }) {
  const lastLog = workout.logs[workout.logs.length - 1] || { load: 'N/A', date: 'No logs' };
  return (
    <Card onClick={onClick} className="cursor-pointer">
      <CardHeader>
        <CardTitle>{workout.name}</CardTitle>
        <p>Last Load: {lastLog.load}kg</p>
      </CardHeader>
    </Card>
  );
}

function NewWorkoutDialog({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [load, setLoad] = useState('');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Workout</DialogTitle>
        </DialogHeader>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Workout Name" />
        <Input type="number" value={load} onChange={(e) => setLoad(e.target.value)} placeholder="Initial Load in kg" />
        <DialogFooter>
          <Button onClick={() => onAdd(name, parseFloat(load))}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function WorkoutDialog({ workout, isOpen, onClose, onUpdate, onDelete }) {
  if (!workout) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{workout.name}</DialogTitle>
          <Button onClick={onDelete} variant="destructive">Delete Workout</Button>
        </DialogHeader>
        {workout.logs.map((log, index) => (
          <p key={index}>{log.load}kg - {format(log.date, 'yyyy-MM-dd')}</p>
        ))}
        <Input 
          type="number" 
          onChange={(e) => {
            if (e.target.value > 0) onUpdate(workout.id, parseFloat(e.target.value));
          }} 
          placeholder="Add new load in kg"
        />
      </DialogContent>
    </Dialog>
  );
}

export default App;