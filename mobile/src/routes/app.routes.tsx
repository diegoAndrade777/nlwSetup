import { createNativeStackNavigator } from "@react-navigation/native-stack";

const { Navigator, Screen } = createNativeStackNavigator();

import { Home } from "../Screens/Home";
import { Habit } from "../Screens/Habit";
import { New } from "../Screens/New";

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="home" component={Home} />
      <Screen name="habit" component={Habit} />
      <Screen name="new" component={New} />
    </Navigator>
  );
}
