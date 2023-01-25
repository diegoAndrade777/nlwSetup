import { useCallback, useState } from "react";
import { Text, View, ScrollView } from "react-native";
import dayjs from "dayjs";
import Toast from "react-native-toast-message";

import { api } from "../lib/axios";
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";

import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Loading } from "../components/Loading";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const datesFromYearStart = generateDatesFromYearBeginning();
const minimumSummaryDatesSize = 18 * 5;
const amountOfDaysToFill = minimumSummaryDatesSize - datesFromYearStart.length;

type SummaryProps = {
  id: string;
  date: string;
  amount: number;
  completed: number;
}[];

export function Home() {
  const { navigate } = useNavigation();
  const [summary, setSummary] = useState<SummaryProps | []>([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      setLoading(true);

      const response = await api.get("summary");

      setSummary(response.data);
    } catch (error) {
      console.log(error);

      Toast.show({
        type: "error",
        text1: "Ops!",
        text2: "Falha ao listar hábitos!",
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View className="flex-row mt-6 mb-2">
        {weekDays.map((weekday, i) => (
          <Text
            key={`${weekday}-${i}`}
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            style={{ width: DAY_SIZE }}
          >
            {weekday}
          </Text>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {summary && (
          <View className="flex-row flex-wrap">
            {datesFromYearStart.map((date) => {
              const dayWithHabits = summary.find((day) => {
                return dayjs(date).isSame(day.date, "day");
              });

              return (
                <HabitDay
                  key={date.toISOString()}
                  onPress={() =>
                    navigate("habit", { date: date.toISOString() })
                  }
                  amountOfHabits={dayWithHabits?.amount}
                  amountCompleted={dayWithHabits?.completed}
                  date={date}
                />
              );
            })}

            {amountOfDaysToFill > 0 &&
              Array.from({ length: amountOfDaysToFill }).map((_, i) => {
                return (
                  <View
                    key={i}
                    className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                    style={{ width: DAY_SIZE, height: DAY_SIZE }}
                  />
                );
              })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
