export const convertIsoTimeToUnix = (isoString: string): number => {
  return new Date(isoString).getTime();
};

// Get current time in UTC
export const getCurrentUTCTime = (): number => {
  return new Date().getTime();
};

// Format timestamp for debugging (in Singapore time)
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString("en-SG", {
    timeZone: "Asia/Singapore",
    hour12: false,
  });
};
