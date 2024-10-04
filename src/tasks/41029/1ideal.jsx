import { memo, useState, useEffect, useCallback } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEFAULT_WORKOUTS = [
  "Jumping Jack",
  "Squat Jump",
  "High Knees",
  "Burpee",
  "Russian Twist",
  "Leg Lift",
  "Plank",
  "V Holds",
  "Lunge",
  "Pushups",
];

const ALL_WORKOUTS = [
  ...DEFAULT_WORKOUTS,
  "Mountain Climbers",
  "Lunge Jumps",
  "High Plank",
  "Plank Jacks",
  "Bicycle Crunch",
  "Skater",
];

const DEFAULT_SETTINGS = {
  sets: 3,
  restBetweenReps: 10,
  restBetweenSets: 2,
  repDuration: 20,
  workouts: DEFAULT_WORKOUTS,
};

export default function App() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [settingsOpen, setSettingsOpen] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  const [currentPhase, setCurrentPhase] = useState("");
  const [currentSet, setCurrentSet] = useState(1);
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);

  const resetTimer = useCallback(() => {
    setTime(0);
    setCurrentPhase("");
    setCurrentSet(1);
    setCurrentWorkoutIndex(0);
    setIsRunning(false);
  }, []);

  const startTimer = useCallback(() => {
    setIsRunning(true);
    setCurrentPhase("getReady");
    setTime(3000);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 10;
          } else {
            clearInterval(interval);

            return 0;
          }
        });
      }, 10);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (time === 0 && isRunning) {
      if (currentPhase === "getReady") {
        setCurrentPhase("workout");

        setTime(settings.repDuration * 1000);
      } else if (currentPhase === "workout") {
        if (currentWorkoutIndex < settings.workouts.length - 1) {
          setCurrentWorkoutIndex((prev) => prev + 1);
          setCurrentPhase("rest");

          setTime(settings.restBetweenReps * 1000);
        } else if (currentSet < settings.sets) {
          setCurrentSet((prev) => prev + 1);
          setCurrentWorkoutIndex(0);
          setCurrentPhase("getReady");

          setTime(settings.restBetweenSets * 60000);
        } else {
          resetTimer();
        }
      } else if (currentPhase === "rest") {
        setCurrentPhase("workout");

        setTime(settings.repDuration * 1000);
      }
    }
  }, [
    time,
    isRunning,
    currentPhase,
    currentSet,
    currentWorkoutIndex,
    settings,
  ]);

  useEffect(() => {
    if (settingsOpen) {
      pauseTimer();
    }
  }, [settingsOpen, pauseTimer]);

  const getTimerLabel = () => {
    if (currentPhase === "getReady") {
      return `Get Ready - Set ${currentSet}`;
    } else if (currentPhase === "workout") {
      return settings.workouts[currentWorkoutIndex];
    } else if (currentPhase === "rest") {
      return "Rest";
    }

    return "";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            HIIT Timer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => setSettingsOpen(true)}>
              Settings
            </Button>
          </div>
          <Timer time={time} label={getTimerLabel()} />
          <div className="flex justify-center space-x-2">
            {!isRunning && time === 0 && (
              <Button onClick={startTimer}>Start</Button>
            )}
            {isRunning && <Button onClick={pauseTimer}>Pause</Button>}
            {!isRunning && time > 0 && (
              <Button onClick={resumeTimer}>Resume</Button>
            )}
            {time > 0 && (
              <Button onClick={resetTimer} variant="destructive">
                Stop
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <Settings
        settings={settings}
        setSettings={setSettings}
        open={settingsOpen}
        setOpen={setSettingsOpen}
        resetTimer={resetTimer}
      />
    </div>
  );
}

function formatTime(time) {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = time % 1000;

  const minStr = minutes.toString().padStart(2, "0");
  const secStr = seconds.toString().padStart(2, "0");
  const msStr = milliseconds.toString().padStart(3, "0");

  return `${minStr}:${secStr}.${msStr}`;
}

function Timer({ time, label }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold">{formatTime(time)}</div>
      <div className="text-xl mt-2">{label}</div>
    </div>
  );
}

const Settings = memo(function Settings({
  settings,
  setSettings,
  open,
  setOpen,
  resetTimer,
}) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLocalSettings({
      ...localSettings,
      [name]: value.trim() ? parseInt(value.trim(), 10) : 0,
    });
  };

  const handleSave = () => {
    resetTimer();
    setSettings(localSettings);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sets" className="text-right">
              Sets
            </Label>
            <Input
              id="sets"
              name="sets"
              type="number"
              value={localSettings.sets || ''}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="restBetweenReps" className="text-right">
              Rest between reps (s)
            </Label>
            <Input
              id="restBetweenReps"
              name="restBetweenReps"
              type="number"
              value={localSettings.restBetweenReps || ''}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="restBetweenSets" className="text-right">
              Rest between sets (min)
            </Label>
            <Input
              id="restBetweenSets"
              name="restBetweenSets"
              type="number"
              value={localSettings.restBetweenSets || ''}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="repDuration" className="text-right">
              Rep duration (s)
            </Label>
            <Input
              id="repDuration"
              name="repDuration"
              type="number"
              value={localSettings.repDuration || ''}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Workouts</Label>
            <div className="col-span-3">
              <WorkoutList
                workouts={localSettings.workouts}
                setWorkouts={(workouts) =>
                  setLocalSettings({ ...localSettings, workouts })
                }
              />
            </div>
          </div>
        </div>
        <Button onClick={handleSave}>Save Changes</Button>
      </DialogContent>
    </Dialog>
  );
});

function WorkoutList({ workouts, setWorkouts }) {
  const [selectedWorkout, setSelectedWorkout] = useState("");

  const addWorkout = () => {
    if (selectedWorkout) {
      setWorkouts([...workouts, selectedWorkout]);

      setSelectedWorkout("");
    }
  };

  const removeWorkout = (workout) => {
    setWorkouts(workouts.filter((w) => w !== workout));
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Select value={selectedWorkout} onValueChange={setSelectedWorkout}>
          <SelectTrigger className="flex-auto">
            <SelectValue placeholder="Select workout" />
          </SelectTrigger>
          <SelectContent>
            {ALL_WORKOUTS.map((workout) => (
              <SelectItem key={workout} value={workout}>
                {workout}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={addWorkout}>Add</Button>
      </div>
      <ScrollArea className="h-48 p-2 rounded-md border">
        <ul className="space-y-1">
          {workouts.map((workout, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{workout}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeWorkout(workout)}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
