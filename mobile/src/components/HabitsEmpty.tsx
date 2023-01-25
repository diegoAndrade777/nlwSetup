import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";

export function HabitsEmpty() {
  const { navigate } = useNavigation();
  return (
    <Text className="text-zinc-400 text-base">
      Nenhum hábito cadastrado. {' '}
      <Text
        className="text-violet-400 text-base underline active:text-violet-500"
        onPress={() => navigate("new")}
      >
        Vamos cadastrar?
      </Text>
    </Text>
  );
}
