import React, { useState, useMemo } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function App() {
  const [workouts, setWorkouts] = useState([]);

  const [query, setQuery] = useState("");

  const [isNewWorkoutDialogOpen, setIsNewWorkoutDialogOpen] = useState(false);

  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);

  const selectedWorkout = useMemo(
    () => workouts.find(({ id }) => id === selectedWorkoutId),
    [workouts, selectedWorkoutId]
  );

  const filtered = useMemo(() => {
    return workouts.filter((workout) =>
      workout.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [workouts, query]);

  const handleAddWorkout = (name, initialLoad) => {
    const newWorkout = {
      id: Date.now(),
      name,
      loads: [{ value: initialLoad, date: new Date().toISOString() }],
    };

    setWorkouts([...workouts, newWorkout]);
  };

  const handleDeleteWorkout = (id) => {
    setSelectedWorkoutId(null);

    setWorkouts(workouts.filter((w) => w.id !== id));
  };

  const handleAddLoad = (id, load) => {
    setWorkouts(
      workouts.map((w) => {
        if (w.id === id) {
          return {
            ...w,
            loads: [
              ...w.loads,
              { value: load, date: new Date().toISOString() },
            ],
          };
        }

        return w;
      })
    );
  };

  const handleRemoveLastLoad = () => {
    if (selectedWorkout && selectedWorkout.loads.length > 1) {
      const updatedWorkouts = workouts.map((w) => {
        if (w.id === selectedWorkout.id) {
          return { ...w, loads: w.loads.slice(0, -1) };
        }

        return w;
      });

      setWorkouts(updatedWorkouts);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Progressive Overload Tracker</h1>
      <div className="mb-4 flex justify-between items-start">
        <Input
          type="text"
          placeholder="Search workouts..."
          onChange={(e) => setQuery(e.target.value)}
          className="mb-4 w-auto"
        />
        <Button
          className="ml-2"
          onClick={() => setIsNewWorkoutDialogOpen(true)}
        >
          Add Workout
        </Button>
      </div>
      <WorkoutList workouts={filtered} onWorkoutClick={setSelectedWorkoutId} />
      <WorkoutDialog
        workout={selectedWorkout}
        onClose={() => setSelectedWorkoutId(null)}
        onDelete={handleDeleteWorkout}
        onAddLoad={handleAddLoad}
        onRemoveLastLoad={handleRemoveLastLoad}
      />
      <NewWorkoutDialog
        isOpen={isNewWorkoutDialogOpen}
        onClose={() => setIsNewWorkoutDialogOpen(false)}
        onAddWorkout={handleAddWorkout}
      />
    </div>
  );
}

function WorkoutList({ workouts, onWorkoutClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {workouts.map((workout) => (
        <Card
          key={workout.id}
          className="cursor-pointer hover:bg-gray-100"
          onClick={() => onWorkoutClick(workout.id)}
        >
          <CardHeader>
            <CardTitle>{workout.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Last load: {workout.loads[workout.loads.length - 1]?.value} kg
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function WorkoutDialog({
  workout,
  onClose,
  onDelete,
  onAddLoad,
  onRemoveLastLoad,
}) {
  const [newLoad, setNewLoad] = useState("");

  const handleAddLoad = () => {
    if (newLoad && parseFloat(newLoad) > 0) {
      onAddLoad(workout.id, parseFloat(newLoad));
      setNewLoad("");
    }
  };

  return (
    <Dialog open={!!workout} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            {workout?.name}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <h3 className="mb-2 font-semibold">Logged Loads:</h3>
          <ScrollArea className="h-48 p-2 rounded-md border">
            <ul className="space-y-2">
              {workout?.loads.map((load, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center h-10"
                >
                  <span>
                    {new Date(load.date).toLocaleDateString()}:{" "}
                    <b>{load.value}</b>kg
                  </span>
                  {workout.loads.length > 1 &&
                    index === workout.loads.length - 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-800 hover:text-red-900"
                        onClick={onRemoveLastLoad}
                      >
                        X
                      </Button>
                    )}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
        <div className="flex space-x-2">
          <Input
            type="number"
            placeholder="New load (kg)"
            value={newLoad}
            onChange={(e) => setNewLoad(e.target.value)}
          />
          <Button onClick={handleAddLoad}>Add Load</Button>
        </div>
        <div className="flex justify-between space-x-2">
          <Button variant="destructive" onClick={() => onDelete(workout.id)}>
            Delete
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NewWorkoutDialog({ isOpen, onClose, onAddWorkout }) {
  const [name, setName] = useState("");
  const [initialLoad, setInitialLoad] = useState("");

  const handleAddWorkout = () => {
    if (name && initialLoad && parseFloat(initialLoad) > 0) {
      onAddWorkout(name, parseFloat(initialLoad));
      setName("");
      setInitialLoad("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Workout</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Workout name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Initial load (kg)"
            value={initialLoad}
            onChange={(e) => setInitialLoad(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button className="mt-2 sm:mt-0" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAddWorkout}
            disabled={!initialLoad.trim() || !name.trim()}
          >
            Add Workout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
