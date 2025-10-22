module.exports = {
  CLAN_LEADER: "1411391077721837579",
  CLAN_CO_LEADER: "1411391114593964172",
  CLAN_ADMIN: "1411393015079108629",
  CLAN_MEMBER: "1411391337512698007",

  TESTERS: "1421972209546821712",
  CONTENDER: "1419513465764057178",
  PASSED_ROLE: "1411391337512698007",
  FAILED_ROLE: "1411517952481689640",

  SCOREBOARD_MANAGER: "1430208526936182875",
  ROLE_TO_MUTE: "1411517952481689640",
  ROLE_EXEMPT_TESTER: "1421972209546821712",

  INTRUDER: "1411517952481689640",

  isClanLeader(member) {
    return member.roles.cache.has(this.CLAN_LEADER);
  },

  isCoLeader(member) {
    return member.roles.cache.has(this.CLAN_CO_LEADER);
  },

  isAdmin(member) {
    return member.roles.cache.has(this.CLAN_ADMIN);
  },

  isTester(member) {
    return member.roles.cache.has(this.TESTERS);
  },

  isMember(member) {
    return member.roles.cache.has(this.CLAN_MEMBER);
  },

  isContender(member) {
    return member.roles.cache.has(this.CONTENDER);
  },

  isIntruder(member) {
    return member.roles.cache.has(this.INTRUDER);
  },

  hasScoreboardAccess(member) {
    return (
      member.roles.cache.has(this.SCOREBOARD_MANAGER) ||
      member.roles.cache.has(this.CLAN_ADMIN) ||
      member.roles.cache.has(this.CLAN_CO_LEADER) ||
      member.roles.cache.has(this.CLAN_LEADER)
    );
  },

  isClanStaff(member) {
    return (
      member.roles.cache.has(this.CLAN_ADMIN) ||
      member.roles.cache.has(this.CLAN_CO_LEADER) ||
      member.roles.cache.has(this.CLAN_LEADER)
    );
  },
};
