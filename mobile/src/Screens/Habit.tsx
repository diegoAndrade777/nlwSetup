import { ScrollView, View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import Toast from "react-native-toast-message";

import { BackButton } from "../components/BackButton";
import { ProgresBar } from "../components/ProgressBar";
import { CheckBox } from "../components/CheckBox";
import { api } from "../lib/axios";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";

import { generateProgressPercentage } from "../utils/generate-progress-percentage";
import { HabitsEmpty } from "../components/HabitsEmpty";
import clsx from "clsx";

interface Params {
  date: string;
}

interface HabitListDayProps {
  possibleHabits: {
    id: string;
    title: string;
    created_at: Date;
  }[];
  completedHabits: string[];
}
export function Habit() {
  const route = useRoute();
  const { date } = route.params as Params;

  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/MM");
  const isDateInPast = parsedDate.endOf("day").isBefore(new Date());

  const [habitsInfo, setHabitsInfo] = useState<HabitListDayProps>();
  const [loading, setLoading] = useState(true);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  const habitsProgress = habitsInfo?.possibleHabits.length
    ? generateProgressPercentage(
        habitsInfo.possibleHabits.length,
        completedHabits.length
      )
    : 0;

  const handleGetHabits = async (date: string) => {
    try {
      setLoading(true);

      const response = await api.get("day", {
        params: {
          date,
        },
      });

      setHabitsInfo(response.data);
      setCompletedHabits(response.data.completedHabits);
    } catch (error) {
      console.log(error);

      Toast.show({
        type: "error",
        text1: "Ops!",
        text2: "Falha ao carregar informações dos hábitos!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHabit = async (habitId: string) => {
    try {
      if (completedHabits.includes(habitId)) {
        setCompletedHabits((prevState) =>
          prevState.filter((id) => id !== habitId)
        );
      } else {
        setCompletedHabits((prevState) => [...prevState, habitId]);
      }

      setHabitsInfo({
        possibleHabits: habitsInfo!.possibleHabits,
        completedHabits,
      });

      await api.patch(`habits/${habitId}/toggle`);
    } catch (error) {
      console.log("Falha ao checkar hábito => ", error);

      Toast.show({
        type: "error",
        text1: "Ops!",
        text2: "Falha ao checkar hábito!",
      });
    }
  };

  useEffect(() => {
    handleGetHabits(date);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgresBar progress={habitsProgress} />

        <View
          className={clsx("mt-6", {
            ["opacity-50"]: isDateInPast,
          })}
        >
          {habitsInfo?.possibleHabits.length ? (
            habitsInfo?.possibleHabits.map((habit) => (
              <CheckBox
                key={habit.id}
                checked={completedHabits.includes(habit.id)}
                title={habit.title}
                disabled={isDateInPast}
                onPress={() => handleToggleHabit(habit.id)}
              />
            ))
          ) : (
            <HabitsEmpty />
          )}
        </View>

        {isDateInPast && (
          <Text className="text-white mt-10 text-center">
            Você não pode editar um hábito retroativo
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
