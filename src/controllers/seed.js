const seedModel = require("../models/seed");

class SeedController {
    async createSeed({ seed }) {
        const createdSeedId = await seedModel.create(seed);
        return createdSeedId;
    }

    async getSeeds(filters) {
        const seeds = await seedModel.getAll(filters);
        return seeds || [];
    };

    async getSeed({ seedId }) {
        const seed = await seedModel.get(seedId);
        return seed || {};
    };

    async updateSeed({ seedId, seed } = {}) {
        const updatedSeedId = await seedModel.update(
            seedId,
            seed
        );
        return updatedSeedId;
    }

    async deleteSeed({ seedId }) {
        const deletedSeedId = await seedModel.delete(seedId);
        return deletedSeedId;
    }
}

module.exports = SeedController;