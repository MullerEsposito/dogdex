import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

export default function TabsPanel() {
  return (
    <View style={styles.tabsWrapper}>
      <View style={styles.tabsContainer}>
        <View style={styles.tabItem}>
          <Text style={[styles.tabText, styles.tabTextActive]}>SCANNING</Text>
          <View style={styles.tabIndicatorContainer}>
            <View style={styles.tabIndicator} />
          </View>
        </View>
        <View style={[styles.tabItem, styles.tabItemCenter]}>
          <Text style={styles.tabText}>DOGDEX</Text>
        </View>
        <View style={styles.tabItem}>
          <Text style={styles.tabText}>MAP</Text>
        </View>
      </View>
    </View>
  );
}
