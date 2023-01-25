import * as Checkbox from "@radix-ui/react-checkbox";
import dayjs from "dayjs";
import { Check } from "phosphor-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../lib/axios";

interface HabitListProps {
  date: Date;
  onCompletedChanged: (completed: number) => void
}

interface HabitListDayProps {
  possibleHabits: {
    id: string;
    title: string;
    created_at: Date;
  }[];
  completedHabits: string[];
}

export function HabitsList({ date, onCompletedChanged }: HabitListProps) {
  const [habitsInfo, setHabitsInfo] = useState<HabitListDayProps>();

  const getHabitsDay = async (date: Date) => {
    try {
      const response = await api.get("day", {
        params: {
          date: date.toISOString(),
        },
      });

      setHabitsInfo(response.data);
    } catch (error) {
      console.log("Falha ao listar detalhes dos hábitos => ", error);

      toast.error("Falha ao listar detalhes dos hábitos", {
        toastId: 1
      });
    }
  };

  useEffect(() => {
    getHabitsDay(date);
  }, []);

  const isDateInPast = dayjs(date).endOf("day").isBefore(new Date());

  const handleToggleHabit = async (habitId: string) => {
    try {
      await api.patch(`habits/${habitId}/toggle`);

      const isHabitAlreadyCompleted =
        habitsInfo!.completedHabits.includes(habitId);

      let completedHabits: string[] = [];

      if (isHabitAlreadyCompleted) {
        completedHabits = habitsInfo!.completedHabits.filter(
          (id) => id !== habitId
        );
      } else {
        completedHabits = [...habitsInfo!.completedHabits, habitId];
      }

      setHabitsInfo({
        possibleHabits: habitsInfo!.possibleHabits,
        completedHabits,
      });

      onCompletedChanged(completedHabits.length)
    } catch (error) {
      console.log("Falha ao checkar hábito => ", error);
      toast.error("Falha ao checkar hábito!", {
        toastId: 1
      });
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-3">
      {habitsInfo?.possibleHabits.map((habit) => (
        <Checkbox.Root
          key={habit.id}
          onCheckedChange={() => handleToggleHabit(habit.id)}
          className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed"
          disabled={isDateInPast}
          checked={habitsInfo.completedHabits.includes(habit.id)}
        >
          <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-background">
            <Checkbox.Indicator>
              <Check size={20} className="text-white" />
            </Checkbox.Indicator>
          </div>

          <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-gray-400">
            {habit.title}
          </span>
        </Checkbox.Root>
      ))}
    </div>
  );
}
