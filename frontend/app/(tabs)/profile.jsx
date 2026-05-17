import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import GlassmorphismCard from "../../components/GlassmorphismCard/GlassmorphismCard";
import { useDispatch, useSelector } from "react-redux";
import { removeItem } from "../../utils/asyncStorage";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import GlassAlertModal from "../../components/Modals/GlassAlertModal";
import { useUpdateStudentProfileMutation } from "../../store/services/userApi";
import GlobalLoader from "../../components/GlobalLoader";
const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const [profileImg, setProfileImg] = useState(user?.profileImage?.url || null);
  console.log(user)
  const dispatch = useDispatch();
  const [showLogout, setShowLogout] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
 const [updateProfile, { isLoading: isUpdating }] = useUpdateStudentProfileMutation();
 useEffect(() => {
    if (user?.profileImage?.url) {
      setProfileImg(user.profileImage.url);
    }
  }, [user]); 
 const pickImage = async (type) => {
  const { status } =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== "granted") {
    return;
  }

  let result;

  if (type === "camera") {
    result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
  } else {
    result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
  }

  if (!result.canceled) {
    const selectedUri = result.assets[0].uri;
    setProfileImg(selectedUri);
    handleUpdateProfile(selectedUri);
  }

  setShowImagePicker(false);
};
const handleUpdateProfile = async (imageUri) => {
    try {
      const formData = new FormData();
      
      // Image data append karein
      formData.append("profileImage", {
        uri: Platform.OS === "ios" ? imageUri.replace("file://", "") : imageUri,
        name: `profile_${user.id}.jpg`,
        type: "image/jpeg",
      });

      const response = await updateProfile({ id: user.id, formData }).unwrap();
      if (response?.profileImage?.url) {
        setProfileImg(response.profileImage.url);
      }
      Alert.alert("Success", "Profile photo updated successfully!");
    } catch (err) {
      console.error("Update Error:", err);
      Alert.alert("Error", err?.data?.message || "Failed to update profile");
    }
  };
  const handleLogout =async () => {
          await removeItem("loggedIn");
          await removeItem("active_chat_id");
          router.replace("/login");
  };

  const MenuOption = ({ icon, title, subtitle, isLast, onPress,isArrow }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.menuItem, !isLast && styles.menuBorder]}
    >
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={22} color="#635BFF" />
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      {isArrow && <Ionicons
        name="chevron-forward"
        size={18}
        color="rgba(255,255,255,0.3)"
      />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <GlobalLoader visible={isUpdating} message="Uploading Photo..." />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header / ID Card Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Student Profile</Text>
          {/* <TouchableOpacity style={styles.editButton}>
            <Ionicons name="pencil" size={18} color="white" />
          </TouchableOpacity> */}
        </View>

        <GlassmorphismCard gradientStyle={styles.cardGradient}>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
             <TouchableOpacity onPress={() => setShowImagePicker(true)}>
  {profileImg ? (
    <Image source={{ uri: profileImg }} style={styles.avatar} />
  ) : (
    <View style={styles.avatarPlaceholder}>
      <Ionicons name="person" size={50} color="#635BFF" />
    </View>
  )}

  <View style={styles.editIconBadge}>
    <Ionicons name="camera" size={14} color="white" />
  </View>
</TouchableOpacity>
              <View style={styles.statusBadge} />
            </View>

            <Text style={styles.userName}>{user?.name}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user?.role}</Text>
            </View>

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Reg. Number</Text>
                <Text style={styles.infoValue}>{user?.registrationNumber}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Department</Text>
                <Text style={styles.infoValue}>{user?.department}</Text>
              </View>
            </View>
          </View>
        </GlassmorphismCard>

        {/* Account Settings */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <GlassmorphismCard
            style={styles.menuCard}
            gradientStyle={styles.menuGradient}
          >
            <MenuOption
              icon="mail-outline"
              title="Email"
              subtitle={user?.email}
            />
            <MenuOption
              icon="lock-closed-outline"
              title="Change Password"
              isLast={true}
              isArrow={true}
              onPress={() =>
                router.push({
                  pathname: "/(auth)/newpassword",
                  params: { email: user?.email, source: "profile" },
                })
              }
            />
            {/* <MenuOption icon="notifications-outline" title="Notifications" isLast={true} /> */}
          </GlassmorphismCard>
        </View>

        {/* Support Section */}
        {/* <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Support</Text>
          <GlassmorphismCard style={styles.menuCard} gradientStyle={styles.menuGradient}>
            <MenuOption icon="help-buoy-outline" title="Help Center" />
            <MenuOption icon="document-text-outline" title="Terms of Service" isLast={true} />
          </GlassmorphismCard>
        </View> */}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setShowLogout(true)}
        >
          <LinearGradient
            colors={["#EF4444", "#991B1B"]}
            style={styles.logoutGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons
              name="log-out"
              size={20}
              color="white"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.logoutText}>Sign Out</Text>
          </LinearGradient>
        </TouchableOpacity>

      
      </ScrollView>

        <GlassAlertModal
  visible={showLogout}
  title="Logout"
  message="Are you sure you want to sign out?"
  primaryText="Logout"
  secondaryText="Cancel"
  danger={true}
  icon={<Ionicons name="log-out-outline" size={40} color="#EF4444" />}
  onClose={() => setShowLogout(false)}
  onSecondaryPress={() => setShowLogout(false)}
  onPrimaryPress={handleLogout}
/>
<GlassAlertModal
  visible={showImagePicker}
  title="Update Profile Picture"
  message="Choose how you want to update your photo"
  primaryText="Camera"
  secondaryText="Gallery"
  icon={<Ionicons name="camera-outline" size={40} color="#635BFF" />}
  onClose={() => setShowImagePicker(false)}
  onPrimaryPress={() => pickImage("camera")}
  onSecondaryPress={() => pickImage("gallery")}
/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0C1013", paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  headerTitle: { color: "white", fontSize: 24, fontWeight: "700" },
  editButton: {
    backgroundColor: "#1C2D47",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
avatarPlaceholder: {
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: "rgba(99, 91, 255, 0.1)",
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 3,
  borderColor: "#635BFF",
},
  profileCard: { borderRadius: 24, padding: 20, alignItems: "center" },
  cardGradient: { padding: 25, borderRadius: 24 },
  avatarContainer: { position: "relative", marginBottom: 15 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#635BFF",
  },
  statusBadge: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#10B981",
    borderWidth: 3,
    borderColor: "#1C2D47",
  },
editIconBadge: {
  position: "absolute",
  bottom: 5,
  right: 5,
  backgroundColor: "#635BFF",
  padding: 6,
  borderRadius: 12,
  borderWidth: 2,
  borderColor: "#0C1013",
},
  userName: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 5,
  },
  roleBadge: {
    backgroundColor: "rgba(99, 91, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 20,
  },
  roleText: {
    color: "#635BFF",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },

  infoGrid: {
    flexDirection: "row",
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingTop: 20,
  },
  infoItem: { flex: 1, alignItems: "center" },
  infoLabel: { color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 5 },
  infoValue: { color: "white", fontSize: 13, fontWeight: "600" },

  sectionContainer: { marginTop: 30 },
  sectionTitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 15,
    marginLeft: 5,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  menuCard: { borderRadius: 20, overflow: "hidden" },
  menuGradient: { paddingHorizontal: 15 },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 15 },
  menuBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(99, 91, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuTextContainer: { flex: 1 },
  menuTitle: { color: "white", fontSize: 16, fontWeight: "500" },
  menuSubtitle: { color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 },

  logoutButton: {
    marginTop: 40,
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  logoutGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
  },
  logoutText: { color: "white", fontSize: 16, fontWeight: "700" },

overlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,


  margin: 0,
  padding: 0,

  backgroundColor: "rgba(0,0,0,0.7)",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
},
  alertBox: {
    width: "85%",
    backgroundColor: "#0F172A",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  alertTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10,
  },

  alertMsg: {
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    marginVertical: 10,
  },

 alertBtns: {
  flexDirection: "row",
  gap: 10,
  marginTop: 15,
},

alertBtn: {
  flex: 1,
  padding: 12,
  borderRadius: 12,
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "center",
},
});

export default Profile;
