import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const cardWidth = (width - 52) / 2;

export default function TankiDashboard() {
  const [tankLevel] = useState(65);
  const [volume] = useState(650);
  const [maxVolume] = useState(1000);
  const [estimatedTime] = useState("~3 Days");
  const [lastSync] = useState("2m ago");
  const [battery] = useState(92);

  const [pumpOn, setPumpOn] = useState(false);
  const [coolerOn, setCoolerOn] = useState(false);
  const [heaterOn, setHeaterOn] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Ionicons name="water" size={24} color="#3B9EFF" />
            </View>
            <Text style={styles.title}>Tanki</Text>
          </View>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </View>

        {/* TANK VISUAL */}
        <View style={styles.tankContainer}>
          <View style={styles.tankCircle}>
            <View style={styles.innerTank}>
              <View style={[styles.waterFill, { height: `${tankLevel}%` }]}>
                <LinearGradient
                  colors={["#4DA8FF", "#2E8BE6"]}
                  style={styles.waterGradient}
                >
                  <Text style={styles.percentage}>{tankLevel}%</Text>
                  <View style={styles.levelPill}>
                    <Text style={styles.levelText}>Normal Level</Text>
                  </View>
                </LinearGradient>
              </View>
            </View>
          </View>
        </View>

        {/* SYSTEM STATUS */}
        <View style={styles.statusCard}>
          <View style={styles.statusLeft}>
            <View style={styles.statusIcon}>
              <Ionicons name="checkmark" size={20} color="#00D9A5" />
            </View>
            <View>
              <Text style={styles.statusTitle}>System Status</Text>
              <Text style={styles.statusSubtitle}>
                Everything looks good. No warnings.
              </Text>
            </View>
          </View>
          <Text style={styles.details}>Details</Text>
        </View>

        {/* MAIN CONTROLS */}
        <View style={styles.controlRow}>
          {/* WATER PUMP */}
          <View style={[styles.controlCard, { width: cardWidth }]}>
            <Ionicons name="power" size={26} color="#64748B" />
            <TouchableOpacity
              style={[styles.toggle, pumpOn && styles.toggleActive]}
              onPress={() => setPumpOn(!pumpOn)}
            >
              <View
                style={[styles.toggleKnob, pumpOn && styles.toggleKnobActive]}
              />
            </TouchableOpacity>
            <Text style={styles.controlLabel}>Water Pump</Text>
            <Text style={styles.controlValue}>
              {pumpOn ? "Running" : "Standby"}
            </Text>
          </View>

          {/* HISTORY */}
          <TouchableOpacity style={[styles.historyCard, { width: cardWidth }]}>
            <LinearGradient
              colors={["#4DA8FF", "#2E8BE6"]}
              style={styles.historyGradient}
            >
              <Ionicons name="bar-chart" size={28} color="#fff" />
              <View>
                <Text style={styles.historySmall}>View</Text>
                <Text style={styles.historyBig}>History</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* COOLER & HEATER (STACKED, HORIZONTAL CONTENT) */}
        <View style={styles.longControlsStack}>
          {/* COOLER */}
          <View style={styles.longControlCard}>
            <View style={styles.longCardLeft}>
              <Ionicons name="snow" size={24} color="#67E8F9" />
              <Text style={styles.longCardTitle}>Cooler</Text>
            </View>

            <View style={styles.longCardRight}>
              <TouchableOpacity
                style={[styles.toggle, coolerOn && styles.toggleActive]}
                onPress={() => setCoolerOn(!coolerOn)}
              >
                <View
                  style={[
                    styles.toggleKnob,
                    coolerOn && styles.toggleKnobActive,
                  ]}
                />
              </TouchableOpacity>
              <Text style={styles.longCardStatus}>
                {coolerOn ? "Running" : "Standby"}
              </Text>
            </View>
          </View>

          {/* HEATER */}
          <View style={styles.longControlCard}>
            <View style={styles.longCardLeft}>
              <Ionicons name="flame" size={24} color="#FB7185" />
              <Text style={styles.longCardTitle}>Heater</Text>
            </View>

            <View style={styles.longCardRight}>
              <TouchableOpacity
                style={[styles.toggle, heaterOn && styles.toggleActive]}
                onPress={() => setHeaterOn(!heaterOn)}
              >
                <View
                  style={[
                    styles.toggleKnob,
                    heaterOn && styles.toggleKnobActive,
                  ]}
                />
              </TouchableOpacity>
              <Text style={styles.longCardStatus}>
                {heaterOn ? "Running" : "Standby"}
              </Text>
            </View>
          </View>
        </View>

        {/* LIVE STATS */}
        <Text style={styles.sectionTitle}>LIVE STATISTICS</Text>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { width: cardWidth }]}>
            <Ionicons name="water" size={26} color="#3B9EFF" />
            <Text style={styles.statLabel}>VOLUME</Text>
            <Text style={styles.statValue}>
              {volume}L <Text style={styles.statSubValue}>/ {maxVolume}L</Text>
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, { width: cardWidth }]}>
              <Ionicons name="sync" size={26} color="#F97316" />
              <Text style={styles.statLabel}>LAST SYNC</Text>
              <Text style={styles.statValue}>{lastSync}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0F172A",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  logoContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },

  tankContainer: {
    alignItems: "center",
    marginVertical: 20,
  },

  tankCircle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#020617",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },

  innerTank: {
    flex: 1,
    borderRadius: 130,
    overflow: "hidden",
    backgroundColor: "#1E293B",
    justifyContent: "flex-end",
  },

  waterFill: {
    width: "100%",
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    overflow: "hidden",
  },

  waterGradient: {
    alignItems: "center",
    paddingVertical: 24,
  },

  percentage: {
    fontSize: 56,
    fontWeight: "800",
    color: "#fff",
  },

  levelPill: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },

  levelText: {
    color: "#fff",
    fontSize: 14,
  },

  statusCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1E293B",
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
  },

  statusLeft: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },

  statusIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#064E3B",
    justifyContent: "center",
    alignItems: "center",
  },

  statusTitle: {
    color: "#fff",
    fontWeight: "600",
  },

  statusSubtitle: {
    color: "#94A3B8",
    fontSize: 13,
  },

  details: {
    color: "#3B9EFF",
    fontWeight: "600",
  },

  controlRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 20,
  },

  controlCard: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 18,
    height: 180,
  },

  toggle: {
    width: 46,
    height: 26,
    backgroundColor: "#334155",
    borderRadius: 13,
    padding: 2,
    marginTop: 12,
  },

  toggleActive: {
    backgroundColor: "#3B9EFF",
  },

  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
  },

  toggleKnobActive: {
    transform: [{ translateX: 20 }],
  },

  controlLabel: {
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 12,
  },

  controlValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  historyCard: {
    borderRadius: 16,
    overflow: "hidden",
    height: 180,
  },

  historyGradient: {
    flex: 1,
    padding: 18,
    justifyContent: "space-between",
  },

  historySmall: {
    color: "#E0F2FE",
    fontSize: 13,
  },

  historyBig: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  longControlsStack: {
    marginTop: 20,
  },

  longControlCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E293B",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },

  longCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  longCardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  longCardRight: {
    alignItems: "flex-end",
  },

  longCardStatus: {
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 4,
  },

  sectionTitle: {
    color: "#64748B",
    fontSize: 11,
    letterSpacing: 1.2,
    marginHorizontal: 20,
    marginBottom: 16,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  statCard: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 20,
    height: 150,
  },

  statLabel: {
    color: "#64748B",
    fontSize: 11,
    marginVertical: 12,
  },

  statValue: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
  },

  statSubValue: {
    fontSize: 16,
    color: "#64748B",
  },
});
