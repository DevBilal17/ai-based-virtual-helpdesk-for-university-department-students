import { Drawer } from "expo-router/drawer";
import CustomDrawer from "../../../components/Chat/CustomDrawer";
export default function ChatLayout() {
  return (
    <Drawer
  drawerContent={(props) => <CustomDrawer {...props} />}
  screenOptions={{
    headerShown: false,
    drawerType: "slide",
    overlayColor: "rgba(0,0,0,0.4)",
    drawerStyle: {
      backgroundColor: "#0C1013",
      width: 300,
    },
  }}
>
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "AI Desk",
          title: "AI Desk",
        }}
      />
    </Drawer>
  );
}