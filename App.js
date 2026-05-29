import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import MapView, { Circle } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const C = {
  blue: "#0B5FFF",
  bg: "#F8FAFC",
  card: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  border: "#E5E7EB",
  green: "#10B981",
  red: "#EF4444",
  amber: "#F59E0B",
};

const departments = ["Police", "Municipality", "Transport", "Water Supply", "Electricity"];
const issueTypes = ["Delay", "Poor Service", "Misconduct", "Bribery Demand", "Lack of Response"];

const zones = [
  { name: "Central Zone", level: "High", reports: 34, color: C.red, lat: 23.8315, lng: 91.2868, radius: 900 },
  { name: "North Zone", level: "Medium", reports: 22, color: C.amber, lat: 23.8563, lng: 91.2792, radius: 750 },
  { name: "West Zone", level: "Low", reports: 12, color: C.green, lat: 23.825, lng: 91.255, radius: 700 },
];

export default function App() {
  const [tab, setTab] = useState("Map");
  const [selectedZone, setSelectedZone] = useState(null);
  const [reports, setReports] = useState([]);
  const [department, setDepartment] = useState("Police");
  const [issue, setIssue] = useState("Delay");
  const [desc, setDesc] = useState("");

  const submitReport = () => {
    if (!desc.trim()) {
      Alert.alert("Add description", "Please describe the issue briefly.");
      return;
    }

    setReports([
      {
        id: Date.now().toString(),
        department,
        issue,
        desc,
        area: "Central Zone",
        status: "Submitted",
        date: "Today",
      },
      ...reports,
    ]);

    setDesc("");
    setTab("Success");
  };

  const Pill = ({ text, color }) => (
    <View style={[styles.pill, { backgroundColor: color + "20" }]}>
      <Text style={{ color, fontSize: 12, fontWeight: "800" }}>{text}</Text>
    </View>
  );

  const Header = ({ title, sub }) => (
    <View style={{ marginBottom: 18 }}>
      <Text style={styles.title}>{title}</Text>
      {sub ? <Text style={styles.sub}>{sub}</Text> : null}
    </View>
  );

  const MapScreen = () => (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: 23.8315,
          longitude: 91.2868,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      >
        {zones.map((z) => (
          <Circle
            key={z.name}
            center={{ latitude: z.lat, longitude: z.lng }}
            radius={z.radius}
            strokeColor={z.color}
            fillColor={z.color + "45"}
            strokeWidth={2}
            onPress={() => setSelectedZone(z)}
          />
        ))}
      </MapView>

      <SafeAreaView style={styles.mapTop}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.logo}>CivicLens</Text>
            <Text style={styles.small}>Public Service Activity Near You</Text>
          </View>
          <Ionicons name="notifications-outline" size={23} color={C.text} />
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={C.muted} />
            <Text style={{ color: C.muted }}>Search area</Text>
          </View>

          <Pressable style={styles.filterBtn} onPress={() => setTab("Filters")}>
            <Ionicons name="options-outline" size={18} color={C.text} />
            <Text style={{ fontWeight: "800" }}>Filters</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <Pressable style={styles.reportFab} onPress={() => setTab("Report")}>
        <Ionicons name="add" size={32} color="white" />
        <Text style={{ color: "white", fontWeight: "800" }}>Report</Text>
      </Pressable>

      {selectedZone && (
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.sheetTitle}>{selectedZone.name}</Text>
              <Text style={styles.sub}>{selectedZone.reports} reports in last 7 days</Text>
            </View>
            <Pill text={`${selectedZone.level} Activity`} color={selectedZone.color} />
          </View>

          {[
            ["Delay", "60%", C.red],
            ["Poor Service", "25%", C.amber],
            ["Misconduct", "10%", C.amber],
            ["Bribery Demand", "5%", C.green],
          ].map(([label, pct, color]) => (
            <View key={label} style={styles.breakRow}>
              <Text style={styles.breakLabel}>{label}</Text>
              <View style={styles.track}>
                <View style={[styles.fill, { width: pct, backgroundColor: color }]} />
              </View>
              <Text style={styles.pct}>{pct}</Text>
            </View>
          ))}

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={18} color={C.blue} />
            <Text style={styles.infoText}>
              Data is anonymized and aggregated. It does not identify individuals or prove wrongdoing.
            </Text>
          </View>

          <Pressable onPress={() => setSelectedZone(null)} style={styles.closeBtn}>
            <Text style={{ color: C.blue, fontWeight: "900" }}>Close</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  const ReportScreen = () => (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Header
          title="Submit a Report"
          sub="Do not include names, phone numbers, addresses, or personal information."
        />

        <Text style={styles.label}>Location</Text>
        <View style={styles.locationCard}>
          <Ionicons name="location" size={22} color={C.blue} />
          <View>
            <Text style={styles.bold}>Central Zone</Text>
            <Text style={styles.sub}>Approximate area</Text>
          </View>
        </View>

        <Text style={styles.label}>Department</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {departments.map((d) => (
            <Pressable
              key={d}
              onPress={() => setDepartment(d)}
              style={[styles.choice, department === d && styles.activeChoice]}
            >
              <Text style={[styles.choiceText, department === d && styles.activeChoiceText]}>{d}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.label}>Issue Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {issueTypes.map((i) => (
            <Pressable
              key={i}
              onPress={() => setIssue(i)}
              style={[styles.choice, issue === i && styles.activeChoice]}
            >
              <Text style={[styles.choiceText, issue === i && styles.activeChoiceText]}>{i}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.label}>Description</Text>
        <TextInput
          multiline
          maxLength={200}
          placeholder="Describe the issue briefly..."
          value={desc}
          onChangeText={setDesc}
          style={styles.textArea}
        />
        <Text style={styles.counter}>{desc.length}/200</Text>

        <Pressable style={styles.uploadBox}>
          <Ionicons name="image-outline" size={20} color={C.muted} />
          <Text style={{ color: C.muted }}>Tap to upload private photo</Text>
        </Pressable>

        <Pressable style={styles.primaryBtn} onPress={submitReport}>
          <Ionicons name="lock-closed-outline" size={18} color="white" />
          <Text style={styles.primaryText}>Submit Privately</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );

  const MyReportsScreen = () => {
    const list = reports.length
      ? reports
      : [
          {
            id: "1",
            department: "Police",
            issue: "Delay",
            area: "Central Zone",
            status: "Accepted for Aggregation",
            date: "12 May 2025",
          },
          {
            id: "2",
            department: "Municipality",
            issue: "Poor Service",
            area: "North Zone",
            status: "Under Review",
            date: "10 May 2025",
          },
        ];

    return (
      <SafeAreaView style={styles.screen}>
        <FlatList
          contentContainerStyle={styles.content}
          data={list}
          ListHeaderComponent={<Header title="My Reports" sub="Your reports are visible only to you." />}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reportCard}>
              <View style={styles.iconBox}>
                <Ionicons name="shield-checkmark" size={24} color={C.blue} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.bold}>{item.department}</Text>
                <Text style={styles.smallText}>{item.issue}</Text>
                <Text style={styles.sub}>{item.area}</Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.date}>{item.date}</Text>
                <Pill
                  text={item.status}
                  color={item.status === "Accepted for Aggregation" ? C.green : C.amber}
                />
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    );
  };

  const ProfileScreen = () => (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHero}>
          <Ionicons name="settings-outline" size={22} color="white" style={{ alignSelf: "flex-end" }} />

          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={42} color={C.blue} />
            </View>

            <View>
              <Text style={styles.profileName}>Anonymous Citizen</Text>
              <Text style={{ color: "white" }}>******1234</Text>
            </View>
          </View>
        </View>

        <View style={styles.trustCard}>
          <Text style={styles.bold}>Trust Score</Text>
          <Text style={styles.score}>0.50</Text>
          <Text style={{ color: C.amber, fontWeight: "800", textAlign: "center" }}>Moderate</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.miniStat}>
            <Text style={styles.bold}>12</Text>
            <Text style={styles.sub}>Total Reports</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.bold}>6</Text>
            <Text style={styles.sub}>Accepted</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.bold}>2</Text>
            <Text style={styles.sub}>Flagged</Text>
          </View>
        </View>

        <Pressable style={styles.menuItem}>
          <Text style={styles.bold}>Privacy Settings</Text>
          <Ionicons name="chevron-forward" size={20} />
        </Pressable>

        <Pressable style={styles.menuItem} onPress={() => setTab("About")}>
          <Text style={styles.bold}>About Data</Text>
          <Ionicons name="chevron-forward" size={20} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );

  const FiltersScreen = () => (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.rowBetween}>
          <Text style={styles.title}>Filters</Text>
          <Pressable onPress={() => setTab("Map")}>
            <Ionicons name="close" size={26} />
          </Pressable>
        </View>

        <Text style={styles.label}>Department</Text>
        <View style={styles.selectBox}>
          <Text>All Departments</Text>
          <Ionicons name="chevron-down" size={18} />
        </View>

        <Text style={styles.label}>Issue Type</Text>
        <View style={styles.selectBox}>
          <Text>All Issue Types</Text>
          <Ionicons name="chevron-down" size={18} />
        </View>

        <Text style={styles.label}>Time Range</Text>
        <View style={styles.wrapRow}>
          {["24 Hours", "7 Days", "30 Days", "90 Days"].map((x) => (
            <Pressable key={x} style={[styles.filterChip, x === "7 Days" && styles.activeChoice]}>
              <Text style={x === "7 Days" ? styles.activeChoiceText : styles.choiceText}>{x}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.primaryBtn} onPress={() => setTab("Map")}>
          <Ionicons name="options-outline" size={18} color="white" />
          <Text style={styles.primaryText}>Apply Filters</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );

  const AboutScreen = () => (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Header title="About CivicLens Data" sub="How anonymized civic insights are created." />

        {[
          ["How reports are collected", "Citizens submit public service experience reports.", "business-outline", C.blue],
          ["How aggregation works", "Reports are grouped by area and issue type. Individual reports are never public.", "map-outline", "#7C3AED"],
          ["Minimum threshold", "An area is shown only if it has at least 10 valid reports.", "shield-checkmark-outline", C.amber],
          ["Disclaimer", "The heatmap shows user-reported patterns, not proof of misconduct.", "information-circle-outline", C.red],
        ].map(([t, d, icon, color]) => (
          <View key={t} style={styles.aboutItem}>
            <View style={[styles.aboutIcon, { backgroundColor: color }]}>
              <Ionicons name={icon} size={18} color="white" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bold}>{t}</Text>
              <Text style={styles.sub}>{d}</Text>
            </View>
          </View>
        ))}

        <Pressable style={styles.primaryBtn} onPress={() => setTab("Profile")}>
          <Text style={styles.primaryText}>Back</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );

  const SuccessScreen = () => (
    <SafeAreaView style={styles.screen}>
      <View style={styles.successWrap}>
        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={70} color="white" />
        </View>

        <Text style={styles.thank}>Thank You!</Text>
        <Text style={styles.successText}>Your report has been submitted privately.</Text>

        <View style={styles.greenBox}>
          <Ionicons name="lock-closed" size={25} color={C.green} />
          <Text style={{ flex: 1 }}>It may be included in aggregated insights after review.</Text>
        </View>

        <Pressable style={styles.primaryBtn} onPress={() => setTab("My Reports")}>
          <Text style={styles.primaryText}>Go to My Reports</Text>
        </Pressable>

        <Pressable onPress={() => setTab("Report")}>
          <Text style={styles.link}>Submit Another Report</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );

  let screen = <MapScreen />;
  if (tab === "Report") screen = <ReportScreen />;
  if (tab === "My Reports") screen = <MyReportsScreen />;
  if (tab === "Profile") screen = <ProfileScreen />;
  if (tab === "Filters") screen = <FiltersScreen />;
  if (tab === "About") screen = <AboutScreen />;
  if (tab === "Success") screen = <SuccessScreen />;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      {screen}

      {!["Filters", "About", "Success"].includes(tab) && (
        <View style={styles.tabBar}>
          {[
            ["Map", "map-outline"],
            ["Report", "shield-checkmark-outline"],
            ["My Reports", "briefcase-outline"],
            ["Profile", "person-outline"],
          ].map(([name, icon]) => (
            <Pressable key={name} style={styles.tabItem} onPress={() => setTab(name)}>
              <Ionicons name={icon} size={22} color={tab === name ? C.blue : C.muted} />
              <Text style={[styles.tabText, tab === name && { color: C.blue, fontWeight: "900" }]}>
                {name}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  content: { padding: 20, paddingBottom: 110 },
  title: { fontSize: 25, fontWeight: "900", color: C.text },
  sub: { color: C.muted, fontSize: 13, marginTop: 4, lineHeight: 19 },
  small: { fontSize: 12, color: C.text },
  smallText: { fontSize: 13, color: C.text, marginTop: 2 },
  logo: { fontSize: 25, fontWeight: "900", color: C.blue },
  mapTop: { paddingHorizontal: 18, paddingTop: 12 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  searchRow: { flexDirection: "row", gap: 10 },
  searchBox: { flex: 1, height: 46, backgroundColor: C.card, borderRadius: 14, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, borderWidth: 1, borderColor: C.border },
  filterBtn: { height: 46, backgroundColor: C.card, borderRadius: 14, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, borderWidth: 1, borderColor: C.border },
  reportFab: { position: "absolute", right: 18, bottom: 95, width: 74, height: 74, borderRadius: 37, backgroundColor: C.blue, justifyContent: "center", alignItems: "center", elevation: 8 },
  sheet: { position: "absolute", bottom: 72, left: 0, right: 0, backgroundColor: C.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20 },
  handle: { width: 48, height: 5, backgroundColor: C.border, borderRadius: 99, alignSelf: "center", marginBottom: 16 },
  sheetTitle: { fontSize: 23, fontWeight: "900", color: C.text },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
  pill: { borderRadius: 99, paddingHorizontal: 10, paddingVertical: 6 },
  breakRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 14 },
  breakLabel: { width: 105, fontWeight: "700", color: C.text, fontSize: 13 },
  track: { flex: 1, height: 8, borderRadius: 99, backgroundColor: "#EEF2F7", overflow: "hidden" },
  fill: { height: 8, borderRadius: 99 },
  pct: { width: 38, textAlign: "right", fontWeight: "800", fontSize: 12 },
  infoBox: { marginTop: 18, padding: 12, backgroundColor: "#EFF6FF", borderRadius: 14, flexDirection: "row", gap: 8 },
  infoText: { flex: 1, color: C.text, fontSize: 12, lineHeight: 18 },
  closeBtn: { marginTop: 14, alignItems: "center" },
  label: { marginTop: 18, marginBottom: 8, fontWeight: "900", color: C.text },
  locationCard: { backgroundColor: "#EFF6FF", borderRadius: 14, padding: 14, flexDirection: "row", gap: 10, alignItems: "center" },
  bold: { fontWeight: "900", color: C.text },
  choice: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.card, marginRight: 8 },
  activeChoice: { backgroundColor: C.blue, borderColor: C.blue },
  choiceText: { color: C.text, fontWeight: "700" },
  activeChoiceText: { color: "white", fontWeight: "800" },
  textArea: { height: 105, backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 14, textAlignVertical: "top" },
  counter: { textAlign: "right", color: C.muted, marginTop: 5 },
  uploadBox: { height: 50, borderRadius: 14, borderWidth: 1, borderStyle: "dashed", borderColor: C.border, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 14 },
  primaryBtn: { marginTop: 22, height: 52, borderRadius: 14, backgroundColor: C.blue, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  primaryText: { color: "white", fontWeight: "900", fontSize: 15 },
  reportCard: { backgroundColor: C.card, borderRadius: 16, padding: 14, marginBottom: 12, flexDirection: "row", gap: 12, borderWidth: 1, borderColor: C.border },
  iconBox: { width: 48, height: 48, borderRadius: 14, backgroundColor: "#EFF6FF", justifyContent: "center", alignItems: "center" },
  date: { color: C.muted, fontSize: 11, marginBottom: 8 },
  profileHero: { backgroundColor: C.blue, padding: 22, margin: -20, marginBottom: 70, paddingTop: 40 },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 20 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: "white", justifyContent: "center", alignItems: "center" },
  profileName: { color: "white", fontSize: 19, fontWeight: "900" },
  trustCard: { backgroundColor: C.card, borderRadius: 18, padding: 18, marginTop: -55, borderWidth: 1, borderColor: C.border },
  score: { fontSize: 30, fontWeight: "900", textAlign: "center", marginTop: 15 },
  stats: { flexDirection: "row", gap: 10, marginTop: 14 },
  miniStat: { flex: 1, backgroundColor: C.card, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.border },
  menuItem: { marginTop: 12, backgroundColor: C.card, borderRadius: 14, padding: 16, flexDirection: "row", justifyContent: "space-between", borderWidth: 1, borderColor: C.border },
  selectBox: { backgroundColor: C.card, height: 48, borderRadius: 12, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  wrapRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  filterChip: { paddingVertical: 11, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.card },
  aboutItem: { flexDirection: "row", gap: 12, marginBottom: 20 },
  aboutIcon: { width: 34, height: 34, borderRadius: 17, justifyContent: "center", alignItems: "center" },
  successWrap: { flex: 1, justifyContent: "center", padding: 28 },
  successCircle: { width: 105, height: 105, borderRadius: 60, backgroundColor: C.green, justifyContent: "center", alignItems: "center", alignSelf: "center", marginBottom: 22 },
  thank: { fontSize: 29, fontWeight: "900", textAlign: "center", color: C.text },
  successText: { textAlign: "center", color: C.text, fontSize: 16, marginTop: 8, marginBottom: 24 },
  greenBox: { backgroundColor: "#ECFDF5", borderWidth: 1, borderColor: "#A7F3D0", borderRadius: 14, padding: 16, flexDirection: "row", gap: 12, alignItems: "center" },
  link: { color: C.blue, fontWeight: "900", textAlign: "center", marginTop: 18 },
  tabBar: { position: "absolute", left: 0, right: 0, bottom: 0, height: 72, backgroundColor: C.card, borderTopWidth: 1, borderColor: C.border, flexDirection: "row", alignItems: "center" },
  tabItem: { flex: 1, alignItems: "center", gap: 4 },
  tabText: { fontSize: 11, color: C.muted },
});