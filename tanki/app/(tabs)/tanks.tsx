import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  fetchTanksWithLatestReadings,
  formatLastSync,
  TankWithReading,
} from "../../backend/tankApi";

function getTankStatus(waterLevelPercent: number | null | undefined): "active" | "standby" {
  if (!waterLevelPercent || waterLevelPercent <= 20) return "standby";
  return "active";
}

export default function TanksScreen() {
  const [tanks, setTanks] = useState<TankWithReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTanksWithLatestReadings()
      .then((result) => {
        console.log('[tanks.tsx] setTanks with:', JSON.stringify(result));
        setTanks(result);
      })
      .catch((err) => console.log("[tanks.tsx] fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

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

        {loading ? (
          <ActivityIndicator color="#3B9EFF" style={{ marginTop: 40 }} />
        ) : (
          tanks.map((tank) => {
            const reading = tank.latestReading;
            const waterLevel = reading?.water_level_percent ?? 0;
            const status = getTankStatus(waterLevel);

            return (
           
              <View key={tank.id} style={styles.tankCard}>
                {/* Tank Header */}
                <View style={styles.tankHeader}>
                  <View style={styles.tankHeaderLeft}>
                    <Ionicons name="water" size={24} color="#3B9EFF" />
                    <View style={styles.tankInfo}>
                      <Text style={styles.tankName}>
                        {tank.tankname ?? "Unknown Tank"}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      status === "active"
                        ? styles.statusActive
                        : styles.statusStandby,
                    ]}
                  >
                    <Text style={styles.statusText}>{status.toUpperCase()}</Text>
                  </View>
                </View>

                {/* Capacity Bar */}
                <View style={styles.capacitySection}>
                  <View style={styles.capacityHeader}>
                    <Text style={styles.capacityLabel}>CAPACITY LEVEL</Text>
                    <Text style={styles.capacityPercent}>{waterLevel}%</Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        { width: `${waterLevel}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.capacityText}>
                    {reading?.water_level_liters ?? 0}L / {tank.capacity}L
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
                    <Text style={styles.statValue}>
                      {reading ? `${reading.temperature}°C` : "-"}
                    </Text>
                  </View>

                  <View style={styles.statItem}>
                    <Ionicons name="water-outline" size={20} color="#00D9A5" />
                    <Text style={styles.statLabel}>pH Level</Text>
                    <Text style={styles.statValue}>
                      {reading ? reading.ph.toFixed(1) : "-"}
                    </Text>
                  </View>

                  <View style={styles.statItem}>
                    <Ionicons name="sync-outline" size={20} color="#3B9EFF" />
                    <Text style={styles.statLabel}>Last Sync</Text>
                    <Text style={styles.statValue}>
                      {formatLastSync(reading?.created_at)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
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
