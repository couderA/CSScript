class Stats {
  constructor(class_slug) {
    this.class = class_slug;
    this.killsAs = 0;
    this.deathsAs = 0;
    this.destroyedAs = 0;
    this.lostAs = 0;
  }
  addKillsAs() {
    this.killsAs = this.killsAs + 1
  }
  addDeathsAs() {
    this.deathsAs = this.deathsAs + 1
  }
  addDestroyedAs() {
    this.destroyedAs = this.destroyedAs + 1
  }
  addLostAs() {
    this.lostAs = this.lostAs + 1
  }

  incrementStats(stats) {
    switch (stats) {
      case "kill":
        this.addKillsAs()
        break;
      case "death":
        this.addDeathsAs()
        break;
      case "destroyed":
        this.addDestroyedAs()
          break;
      case "lost":
        this.addLostAs()
        break;
      default:
        break;
    }
  }
}

module.exports = Stats;
