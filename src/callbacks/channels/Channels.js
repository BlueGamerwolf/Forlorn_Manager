module.exports = {
  LOGS: "1427295052740296827",
  WARNINGS: "1427339082941595870",

  isStaffChannel(channelId) {
    return (
      channelId === this.LOGS ||
      channelId === this.WARNINGS
    );
  },

  getChannelType(channelId) {
    switch (channelId) {
      case this.LOGS:
        return "Logs";
      case this.WARNINGS:
        return "Warnings";
      default:
        return "Unknown";
    }
  },
};
