import React, { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const exercises = [
  "Mountain Climbers",
  "Lunge Jumps",
  "Burpee",
  "High Knees",
  "Jumping Jack",
  "Squat Jump",
  "Plank",
  "High Plank",
  "Plank Jacks",
  "Lunge",
  "Russian Twist",
  "Bicycle Crunch",
  "Skater",
  "Pushups",
  "Leg Lift",
  "V Holds",
];

export default function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [timer, setTimer] = useState({
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [settings, setSettings] = useState({
    sets: 3,
    restBetweenReps: 10,
    restBetweenSets: 120,
    repDuration: 20,
    workouts: [
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
    ],
  });
  const [currentSet, setCurrentSet] = useState(1);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  useEffect(() => {
    let interval;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer.milliseconds > 0) {
            return { ...prevTimer, milliseconds: prevTimer.milliseconds - 10 };
          } else if (prevTimer.seconds > 0) {
            return {
              ...prevTimer,
              seconds: prevTimer.seconds - 1,
              milliseconds: 990,
            };
          } else if (prevTimer.minutes > 0) {
            return {
              ...prevTimer,
              minutes: prevTimer.minutes - 1,
              seconds: 59,
              milliseconds: 990,
            };
          } else {
            handleTimerEnd();
            return prevTimer;
          }
        });
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused, timer]);

  const handleTimerEnd = () => {
    if (currentExerciseIndex + 1 < settings.workouts.length) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setTimer({
        minutes: 0,
        seconds: settings.restBetweenReps,
        milliseconds: 0,
      });
    } else if (currentSet < settings.sets) {
      setCurrentSet(currentSet + 1);
      setCurrentExerciseIndex(0);
      setTimer({ minutes: 0, seconds: 3, milliseconds: 0 }); // Get ready for next set
    } else {
      stopTimer();
    }
  };

  const startTimer = () => {
    setIsRunning(true);
    setTimer({ minutes: 0, seconds: 3, milliseconds: 0 }); // Start with "Get Ready"
  };

  const pauseTimer = () => setIsPaused(true);
  const resumeTimer = () => setIsPaused(false);
  const stopTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimer({ minutes: 0, seconds: 0, milliseconds: 0 });
    setCurrentSet(1);
    setCurrentExerciseIndex(0);
  };

  const openSettings = () => {
    pauseTimer();
    setIsSettingsOpen(true);
  };

  const formatTime = (time) => {
    return `${String(time.minutes).padStart(2, "0")}:${String(
      time.seconds
    ).padStart(2, "0")}.${String(time.milliseconds / 10).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>HIIT Timer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={openSettings}>Settings</Button>
          <div className="text-4xl text-center">{formatTime(timer)}</div>
          <div className="text-center">
            {timer.seconds === 3 && timer.minutes === 0
              ? `Get Ready - Set ${currentSet}`
              : currentExerciseIndex < settings.workouts.length
              ? settings.workouts[currentExerciseIndex]
              : "Finished"}
          </div>
          <div className="flex justify-center space-x-4">
            {!isRunning ? (
              <Button onClick={startTimer}>Start</Button>
            ) : isPaused ? (
              <Button onClick={resumeTimer}>Resume</Button>
            ) : (
              <Button onClick={pauseTimer}>Pause</Button>
            )}
            <Button onClick={stopTimer}>Stop</Button>
          </div>
        </CardContent>
      </Card>
      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        setSettings={setSettings}
        stopTimer={stopTimer}
      />
    </div>
  );
}

function SettingsDialog({ isOpen, onClose, settings, setSettings, stopTimer }) {
  const updateSettings = (newSettings) => {
    stopTimer();
    setSettings(newSettings);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            type="number"
            value={settings.sets}
            onChange={(e) =>
              updateSettings({ ...settings, sets: parseInt(e.target.value) })
            }
            placeholder="Number of Sets"
          />
          <Input
            type="number"
            value={settings.restBetweenReps}
            onChange={(e) =>
              updateSettings({
                ...settings,
                restBetweenReps: parseInt(e.target.value),
              })
            }
            placeholder="Rest Between Reps (sec)"
          />
          <Input
            type="number"
            value={settings.restBetweenSets / 60}
            onChange={(e) =>
              updateSettings({
                ...settings,
                restBetweenSets: parseInt(e.target.value) * 60,
              })
            }
            placeholder="Rest Between Sets (min)"
          />
          <Input
            type="number"
            value={settings.repDuration}
            onChange={(e) =>
              updateSettings({
                ...settings,
                repDuration: parseInt(e.target.value),
              })
            }
            placeholder="Rep Duration (sec)"
          />
          <div>
            <Label>Workouts</Label>
            {settings.workouts.map((workout, idx) => (
              <div key={idx} className="flex items-center space-x-2 my-2">
                <Select>
                  <SelectContent>
                    {exercises.map((ex) => (
                      <SelectItem key={ex} value={ex}>
                        {ex}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() =>
                    updateSettings({
                      ...settings,
                      workouts: settings.workouts.filter((_, i) => i !== idx),
                    })
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              onClick={() =>
                updateSettings({
                  ...settings,
                  workouts: [...settings.workouts, "Jumping Jack"],
                })
              }
            >
              Add Workout
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onClose}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
