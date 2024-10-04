import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function App() {
  const [workouts, setWorkouts] = useState([]);
  const [dialogOpen, setDialogOpen] = useState({ type: null, data: null });
  const [searchTerm, setSearchTerm] = useState("");

  const addWorkout = (name, initialLoad) => {
    setWorkouts((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: name,
        loads: [
          { value: initialLoad, date: new Date().toISOString().split("T")[0] },
        ],
      },
    ]);
  };

  const updateWorkout = (id, load) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout) =>
        workout.id === id
          ? {
              ...workout,
              loads: [
                ...workout.loads,
                { value: load, date: new Date().toISOString().split("T")[0] },
              ],
            }
          : workout
      )
    );
  };

  const deleteLastLoad = (id) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout) =>
        workout.id === id
          ? { ...workout, loads: workout.loads.slice(0, -1) }
          : workout
      )
    );
  };

  const filteredWorkouts = workouts.filter((workout) =>
    workout.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Progressive Overload Tracker</h1>
      <Button onClick={() => setDialogOpen({ type: "newWorkout" })}>
        Add Workout
      </Button>
      <div className="mt-4 relative">
        <Input
          placeholder="Search workouts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
      </div>
      <WorkoutList
        workouts={filteredWorkouts}
        onSelectWorkout={(workout) =>
          setDialogOpen({ type: "viewWorkout", data: workout })
        }
      />

      {/* New Workout Dialog */}
      {dialogOpen.type === "newWorkout" && (
        <NewWorkoutDialog
          onClose={() => setDialogOpen({ type: null })}
          onConfirm={addWorkout}
        />
      )}

      {/* View Workout Dialog */}
      {dialogOpen.type === "viewWorkout" && (
        <WorkoutDialog
          workout={dialogOpen.data}
          onClose={() => setDialogOpen({ type: null })}
          onUpdate={updateWorkout}
          onDeleteLast={deleteLastLoad}
        />
      )}
    </div>
  );
}

function WorkoutList({ workouts, onSelectWorkout }) {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {workouts.map((workout) => (
        <Card
          key={workout.id}
          onClick={() => onSelectWorkout(workout)}
          className="cursor-pointer"
        >
          <CardHeader>
            <CardTitle>{workout.name}</CardTitle>
          </CardHeader>
          <CardContent>
            Last Load: {workout.loads[workout.loads.length - 1]?.value || "N/A"}{" "}
            kg
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function NewWorkoutDialog({ onClose, onConfirm }) {
  const [name, setName] = useState("");
  const [load, setLoad] = useState("");

  const handleSubmit = () => {
    if (name && parseFloat(load) > 0) {
      onConfirm(name, parseFloat(load));
      onClose();
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogContent>
        <DialogHeader>Add New Workout</DialogHeader>
        <Input
          placeholder="Workout Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-2"
        />
        <Input
          type="number"
          placeholder="Initial Load (kg)"
          value={load}
          onChange={(e) => setLoad(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={!name || parseFloat(load) <= 0}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function WorkoutDialog({ workout, onClose, onUpdate, onDeleteLast }) {
  const [newLoad, setNewLoad] = useState("");

  return (
    <Dialog open onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          {workout.name}
          <Button
            variant="destructive"
            onClick={() => onDeleteLast(workout.id)}
            className="ml-auto"
          >
            Delete Last
          </Button>
        </DialogHeader>
        {workout.loads.map((load, index) => (
          <div key={index}>
            {load.value} kg - {load.date}
          </div>
        ))}
        <Input
          type="number"
          placeholder="Add new load (kg)"
          value={newLoad}
          onChange={(e) => setNewLoad(e.target.value)}
          className="mt-2"
        />
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
          <Button
            onClick={() => {
              if (parseFloat(newLoad) > 0) {
                onUpdate(workout.id, parseFloat(newLoad));
                setNewLoad("");
              }
            }}
            disabled={parseFloat(newLoad) <= 0}
          >
            Add Load
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
