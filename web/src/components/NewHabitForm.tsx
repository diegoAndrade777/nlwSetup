import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "phosphor-react";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../lib/axios";

const availableWeekdays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export function NewHabitForm() {
  const [title, setTitle] = useState("");
  const [weekDays, setWeekDays] = useState<number[]>([]);

  const createNewHabit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title || weekDays.length === 0) {
      toast.error(
        "Obrigatório adicionar um nome ao hábito e selecionar no mínimo 1 dia da semana!",
        {
          toastId: 1,
        }
      );
    }
    try {
      await api.post("habit", {
        title,
        weekDays,
      });

      setTitle("");
      setWeekDays([]);

      toast.success("Hábito criado com sucesso!", {
        toastId: 2,
      });
      
    } catch (error) {
      console.log("Falha ao criar hábito => ", error)
      toast.error("Falha ao criar hábito!", {
        toastId: 3,
      });
    }
  };

  const handleToggleWeekDay = (weekDay: number) => {
    if (weekDays.includes(weekDay)) {
      const weekDaysWithRemovedOne = weekDays.filter((day) => day !== weekDay);

      setWeekDays(weekDaysWithRemovedOne);
    } else {
      const weekDaysWithAddedOne = [...weekDays, weekDay];

      setWeekDays(weekDaysWithAddedOne);
    }
  };

  return (
    <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
      <label className="font-semibold leading-tight" htmlFor="title">
        Qual seu comprometimento?
      </label>

      <input
        type="text"
        id="title"
        placeholder="ex.: Exercícios, dormir bem, etc..."
        autoFocus
        className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-zinc-900"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <label className="font-semibold leading-tight mt-4" htmlFor="">
        Qual a recorrência?
      </label>

      {availableWeekdays.map((weekDay, index) => (
        <div key={weekDay} className="flex flex-col gap-2 mt-3">
          <Checkbox.Root
            key={weekDay}
            className="flex items-center gap-3 group transition-colors focus:outline-none"
            checked={weekDays.includes(index)}
            onCheckedChange={() => handleToggleWeekDay(index)}
          >
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-background">
              <Checkbox.Indicator>
                <Check size={20} className="text-white" />
              </Checkbox.Indicator>
            </div>

            <span className="text-white leading-tight">{weekDay}</span>
          </Checkbox.Root>
        </div>
      ))}

      <button
        type="submit"
        className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600   focus:ring-offset-2 focus:ring-offset-zinc-900"
      >
        <Check size={20} weight="bold" />
        Confirmar
      </button>
    </form>
  );
}
