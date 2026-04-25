import { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import axios from 'axios';
import { BASE_URL } from '../services/api';

const API_URL = BASE_URL;

interface VersionConfig {
  latestVersion: string;
  minRequiredVersion: string;
  storeUrl: string;
  releaseNotes?: string;
  forceUpdate?: boolean;
}

export function useUpdateCheck() {
  const [updateInfo, setUpdateInfo] = useState<VersionConfig | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isForceUpdate, setIsForceUpdate] = useState(false);

  const currentVersion = Constants.expoConfig?.version || '0.0.0';

  const compareVersions = (v1: string, v2: string) => {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < 3; i++) {
      if (parts1[i] > (parts2[i] || 0)) return 1;
      if (parts1[i] < (parts2[i] || 0)) return -1;
    }
    return 0;
  };

  const checkUpdate = async () => {
    try {
      const response = await axios.get(`${API_URL}/config/version`);
      if (response.data.success) {
        const config: VersionConfig = response.data.data;
        
        const hasNewVersion = compareVersions(config.latestVersion, currentVersion) > 0;
        const needsForceUpdate = compareVersions(config.minRequiredVersion, currentVersion) > 0;

        if (hasNewVersion || needsForceUpdate) {
          setUpdateInfo(config);
          setIsForceUpdate(needsForceUpdate);
          setShowModal(true);
        }
      }
    } catch (error) {
      console.warn('Update check failed:', error);
    }
  };

  useEffect(() => {
    checkUpdate();
  }, []);

  const handleUpdate = () => {
    if (updateInfo?.storeUrl) {
      Linking.openURL(updateInfo.storeUrl);
    }
  };

  const handleDismiss = () => {
    if (!isForceUpdate) {
      setShowModal(false);
    }
  };

  return {
    showModal,
    isForceUpdate,
    updateInfo,
    handleUpdate,
    handleDismiss,
    currentVersion
  };
}
