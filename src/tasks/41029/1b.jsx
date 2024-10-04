import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Components
const TimerDisplay = ({ time }) => (
  <div className="text-4xl font-bold">{time}</div>
);

const SettingsDialog = ({ isOpen, onClose, settings, setSettings }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[425px]">
      {/* Settings inputs here */}
    </DialogContent>
  </Dialog>
);

const WorkoutCard = ({
  currentState,
  timeRemaining,
  onStart,
  onPause,
  onResume,
  onStop,
}) => (
  <Card>
    <CardContent>
      <h2 className="text-2xl">{currentState}</h2>
      <TimerDisplay time={timeRemaining} />
      <div className="flex space-x-2 mt-4">
        <Button onClick={onStart}>Start</Button>
        <Button onClick={onPause}>Pause</Button>
        <Button onClick={onResume}>Resume</Button>
        <Button onClick={onStop}>Stop</Button>
      </div>
    </CardContent>
  </Card>
);

export default function App() {
  const [settings, setSettings] = useState({
    sets: 3,
    restBetweenReps: 10,
    restBetweenSets: 2,
    repDuration: 20,
    workouts: ["Jumping Jack", "Squat Jump"],
  });
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  // Additional state for tracking current workout phase

  const startTimer = () => {
    /* Logic for starting */
  };
  const pauseTimer = () => {
    /* Pause logic */
  };
  const resumeTimer = () => {
    /* Resume logic */
  };
  const stopTimer = () => {
    /* Stop and reset logic */
  };

  useEffect(() => {
    // Timer logic to decrement time and switch between workout phases
  }, [timeRemaining, isRunning]);

  return (
    <div className="container mx-auto p-4">
      <Button>Settings</Button>
      <SettingsDialog
        onClose={() => {}}
        settings={settings}
        setSettings={setSettings}
      />
      <WorkoutCard
        currentState={"Get Ready"}
        timeRemaining={timeRemaining}
        onStart={startTimer}
        onPause={pauseTimer}
        onResume={resumeTimer}
        onStop={stopTimer}
      />
    </div>
  );
}
