import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Mock data for tank statistics over time
const TANK_STATS = [
  {
    id: "1",
    name: "Main Water Tank",
    color: "#3B9EFF",
    performance: {
      uptime: "99.8%",
      avgFillRate: "250L/hr",
      totalUsage: "12,450L",
      efficiency: "95%",
    },
    timeSeriesData: [
      { time: "00:00", level: 85, temp: 23, usage: 180 },
      { time: "04:00", level: 78, temp: 22, usage: 220 },
      { time: "08:00", level: 65, temp: 24, usage: 380 },
      { time: "12:00", level: 70, temp: 25, usage: 290 },
      { time: "16:00", level: 72, temp: 24, usage: 260 },
      { time: "20:00", level: 75, temp: 24, usage: 240 },
    ],
  },
  {
    id: "2",
    name: "Backup Tank",
    color: "#F97316",
    performance: {
      uptime: "98.5%",
      avgFillRate: "120L/hr",
      totalUsage: "5,230L",
      efficiency: "92%",
    },
    timeSeriesData: [
      { time: "00:00", level: 60, temp: 21, usage: 90 },
      { time: "04:00", level: 55, temp: 21, usage: 110 },
      { time: "08:00", level: 40, temp: 22, usage: 180 },
      { time: "12:00", level: 38, temp: 23, usage: 150 },
      { time: "16:00", level: 42, temp: 22, usage: 130 },
      { time: "20:00", level: 45, temp: 22, usage: 120 },
    ],
  },
  {
    id: "3",
    name: "Emergency Reserve",
    color: "#00D9A5",
    performance: {
      uptime: "100%",
      avgFillRate: "80L/hr",
      totalUsage: "1,850L",
      efficiency: "98%",
    },
    timeSeriesData: [
      { time: "00:00", level: 90, temp: 20, usage: 20 },
      { time: "04:00", level: 90, temp: 20, usage: 15 },
      { time: "08:00", level: 89, temp: 20, usage: 25 },
      { time: "12:00", level: 89, temp: 21, usage: 30 },
      { time: "16:00", level: 90, temp: 20, usage: 18 },
      { time: "20:00", level: 90, temp: 20, usage: 22 },
    ],
  },
];

export default function StatisticsScreen() {
  const [selectedTank, setSelectedTank] = useState(TANK_STATS[0]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Ionicons name="stats-chart" size={24} color="#3B9EFF" />
            </View>
            <Text style={styles.title}>Statistics</Text>
          </View>
        </View>

        {/* TANK SELECTOR */}
        <Text style={styles.sectionTitle}>SELECT TANK</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tankSelector}
          contentContainerStyle={styles.tankSelectorContent}
        >
          {TANK_STATS.map((tank) => (
            <TouchableOpacity
              key={tank.id}
              style={[
                styles.tankButton,
                selectedTank.id === tank.id && styles.tankButtonActive,
              ]}
              onPress={() => setSelectedTank(tank)}
            >
              <View style={[styles.tankDot, { backgroundColor: tank.color }]} />
              <Text
                style={[
                  styles.tankButtonText,
                  selectedTank.id === tank.id && styles.tankButtonTextActive,
                ]}
              >
                {tank.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* PERFORMANCE METRICS */}
        <Text style={styles.sectionTitle}>PERFORMANCE METRICS</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Ionicons name="time-outline" size={24} color="#00D9A5" />
            <Text style={styles.metricLabel}>Uptime</Text>
            <Text style={styles.metricValue}>
              {selectedTank.performance.uptime}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Ionicons name="speedometer-outline" size={24} color="#3B9EFF" />
            <Text style={styles.metricLabel}>Avg Fill Rate</Text>
            <Text style={styles.metricValue}>
              {selectedTank.performance.avgFillRate}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Ionicons name="water-outline" size={24} color="#F97316" />
            <Text style={styles.metricLabel}>Total Usage</Text>
            <Text style={styles.metricValue}>
              {selectedTank.performance.totalUsage}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color="#00D9A5"
            />
            <Text style={styles.metricLabel}>Efficiency</Text>
            <Text style={styles.metricValue}>
              {selectedTank.performance.efficiency}
            </Text>
          </View>
        </View>

        {/* WATER LEVEL OVER TIME */}
        <Text style={styles.sectionTitle}>WATER LEVEL (24 HOURS)</Text>
        <View style={styles.chartCard}>
          <View style={styles.chart}>
            {selectedTank.timeSeriesData.map((data, index) => {
              const height = (data.level / 100) * 120;
              return (
                <View key={index} style={styles.chartColumn}>
                  <View style={styles.chartBarContainer}>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: height,
                          backgroundColor: selectedTank.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.chartLabel}>{data.time}</Text>
                  <Text style={styles.chartValue}>{data.level}%</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* TEMPERATURE OVER TIME */}
        <Text style={styles.sectionTitle}>TEMPERATURE (24 HOURS)</Text>
        <View style={styles.chartCard}>
          <View style={styles.chart}>
            {selectedTank.timeSeriesData.map((data, index) => {
              const maxTemp = 30;
              const minTemp = 15;
              const normalizedTemp =
                ((data.temp - minTemp) / (maxTemp - minTemp)) * 120;
              return (
                <View key={index} style={styles.chartColumn}>
                  <View style={styles.chartBarContainer}>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: normalizedTemp,
                          backgroundColor: "#F97316",
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.chartLabel}>{data.time}</Text>
                  <Text style={styles.chartValue}>{data.temp}°C</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* USAGE OVER TIME */}
        <Text style={styles.sectionTitle}>WATER USAGE (24 HOURS)</Text>
        <View style={styles.chartCard}>
          <View style={styles.chart}>
            {selectedTank.timeSeriesData.map((data, index) => {
              const maxUsage = 400;
              const height = (data.usage / maxUsage) * 120;
              return (
                <View key={index} style={styles.chartColumn}>
                  <View style={styles.chartBarContainer}>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: height,
                          backgroundColor: "#00D9A5",
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.chartLabel}>{data.time}</Text>
                  <Text style={styles.chartValue}>{data.usage}L</Text>
                </View>
              );
            })}
          </View>
        </View>
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
    marginTop: 20,
    marginBottom: 12,
  },

  tankSelector: {
    marginBottom: 8,
  },

  tankSelectorContent: {
    paddingHorizontal: 20,
    gap: 12,
  },

  tankButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },

  tankButtonActive: {
    borderColor: "#3B9EFF",
    backgroundColor: "#1E293B",
  },

  tankDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  tankButtonText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "600",
  },

  tankButtonTextActive: {
    color: "#fff",
  },

  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
  },

  metricCard: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },

  metricLabel: {
    color: "#64748B",
    fontSize: 11,
    textAlign: "center",
  },

  metricValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  chartCard: {
    backgroundColor: "#1E293B",
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
  },

  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 160,
  },

  chartColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  chartBarContainer: {
    width: "100%",
    height: 120,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  chartBar: {
    width: "70%",
    borderRadius: 4,
  },

  chartLabel: {
    color: "#64748B",
    fontSize: 9,
    marginTop: 6,
  },

  chartValue: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
});
