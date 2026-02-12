import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

// Mock data for registered tanks
const TANKS_DATA = [
  {
    id: "1",
    name: "Main Water Tank",
    location: "Rooftop - Building A",
    currentLevel: 75,
    currentLiters: 3750,
    maxCapacity: 5000,
    temperature: 24,
    clarity: "Clear",
    status: "active",
    lastSync: "2 min ago",
    performance: {
      uptime: "99.8%",
      avgFillRate: "250L/hr",
      totalUsage: "12,450L",
      efficiency: "95%",
    },
    timeSeriesData: [
      { time: "00:00", level: 85 },
      { time: "04:00", level: 78 },
      { time: "08:00", level: 65 },
      { time: "12:00", level: 70 },
      { time: "16:00", level: 72 },
      { time: "20:00", level: 75 },
    ],
  },
  {
    id: "2",
    name: "Backup Tank",
    location: "Ground Floor",
    currentLevel: 45,
    currentLiters: 900,
    maxCapacity: 2000,
    temperature: 22,
    clarity: "Clear",
    status: "active",
    lastSync: "5 min ago",
    performance: {
      uptime: "98.5%",
      avgFillRate: "120L/hr",
      totalUsage: "5,230L",
      efficiency: "92%",
    },
    timeSeriesData: [
      { time: "00:00", level: 60 },
      { time: "04:00", level: 55 },
      { time: "08:00", level: 40 },
      { time: "12:00", level: 38 },
      { time: "16:00", level: 42 },
      { time: "20:00", level: 45 },
    ],
  },
  {
    id: "3",
    name: "Emergency Reserve",
    location: "Basement",
    currentLevel: 90,
    currentLiters: 2700,
    maxCapacity: 3000,
    temperature: 20,
    clarity: "Clear",
    status: "standby",
    lastSync: "1 min ago",
    performance: {
      uptime: "100%",
      avgFillRate: "80L/hr",
      totalUsage: "1,850L",
      efficiency: "98%",
    },
    timeSeriesData: [
      { time: "00:00", level: 90 },
      { time: "04:00", level: 90 },
      { time: "08:00", level: 89 },
      { time: "12:00", level: 89 },
      { time: "16:00", level: 90 },
      { time: "20:00", level: 90 },
    ],
  },
];

export default function TanksScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Ionicons name="settings-outline" size={24} color="#3B9EFF" />
            </View>
            <Text style={styles.title}>Tank Settings</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>REGISTERED TANKS</Text>

        {/* TANKS LIST */}
        {TANKS_DATA.map((tank) => (
          <View key={tank.id} style={styles.tankCard}>
            {/* Tank Header */}
            <View style={styles.tankHeader}>
              <View style={styles.tankHeaderLeft}>
                <Ionicons name="water" size={24} color="#3B9EFF" />
                <View style={styles.tankInfo}>
                  <Text style={styles.tankName}>{tank.name}</Text>
                  <Text style={styles.tankLocation}>{tank.location}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  tank.status === "active"
                    ? styles.statusActive
                    : styles.statusStandby,
                ]}
              >
                <Text style={styles.statusText}>
                  {tank.status.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Capacity Bar */}
            <View style={styles.capacitySection}>
              <View style={styles.capacityHeader}>
                <Text style={styles.capacityLabel}>CAPACITY LEVEL</Text>
                <Text style={styles.capacityPercent}>{tank.currentLevel}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${tank.currentLevel}%` },
                  ]}
                />
              </View>
              <Text style={styles.capacityText}>
                {tank.currentLiters}L / {tank.maxCapacity}L
              </Text>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Ionicons
                  name="thermometer-outline"
                  size={20}
                  color="#F97316"
                />
                <Text style={styles.statLabel}>Temperature</Text>
                <Text style={styles.statValue}>{tank.temperature}°C</Text>
              </View>

              <View style={styles.statItem}>
                <Ionicons name="water-outline" size={20} color="#00D9A5" />
                <Text style={styles.statLabel}>Water Clarity</Text>
                <Text style={styles.statValue}>{tank.clarity}</Text>
              </View>

              <View style={styles.statItem}>
                <Ionicons name="sync-outline" size={20} color="#3B9EFF" />
                <Text style={styles.statLabel}>Last Sync</Text>
                <Text style={styles.statValue}>{tank.lastSync}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

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

  sectionTitle: {
    color: "#64748B",
    fontSize: 11,
    letterSpacing: 1.2,
    marginHorizontal: 20,
    marginBottom: 16,
  },

  tankCard: {
    backgroundColor: "#1E293B",
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
  },

  tankHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  tankHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  tankInfo: {
    flex: 1,
  },

  tankName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },

  tankLocation: {
    color: "#94A3B8",
    fontSize: 13,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  statusActive: {
    backgroundColor: "#064E3B",
  },

  statusStandby: {
    backgroundColor: "#334155",
  },

  statusText: {
    color: "#00D9A5",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  capacitySection: {
    marginBottom: 20,
  },

  capacityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  capacityLabel: {
    color: "#64748B",
    fontSize: 11,
    letterSpacing: 1,
  },

  capacityPercent: {
    color: "#3B9EFF",
    fontSize: 16,
    fontWeight: "700",
  },

  progressBarContainer: {
    height: 8,
    backgroundColor: "#0F172A",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },

  progressBar: {
    height: "100%",
    backgroundColor: "#3B9EFF",
    borderRadius: 4,
  },

  capacityText: {
    color: "#94A3B8",
    fontSize: 13,
  },

  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },

  statItem: {
    flex: 1,
    backgroundColor: "#0F172A",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },

  statLabel: {
    color: "#64748B",
    fontSize: 10,
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
  },

  statValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
