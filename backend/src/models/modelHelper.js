import mongoose from 'mongoose';
import { dbState } from '../database/db.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a dual-mode Model that works with Mongoose OR in-memory fallback.
 */
export function createDualModel(modelName, schemaDef, storeCollectionName) {
  const schema = new mongoose.Schema(schemaDef, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

  let MongooseModel;
  try {
    MongooseModel = mongoose.models[modelName] || mongoose.model(modelName, schema);
  } catch (e) {
    MongooseModel = mongoose.model(modelName, schema);
  }

  const getStore = () => {
    if (!dbState.memoryStore[storeCollectionName]) {
      dbState.memoryStore[storeCollectionName] = [];
    }
    return dbState.memoryStore[storeCollectionName];
  };

  const matchesFilter = (doc, filter = {}) => {
    if (!filter || Object.keys(filter).length === 0) return true;
    for (const [key, val] of Object.entries(filter)) {
      if (key === '_id') {
        const docId = String(doc._id || doc.id);
        const targetId = String(val);
        if (docId !== targetId) return false;
        continue;
      }
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        if (val.$in && Array.isArray(val.$in)) {
          if (!val.$in.map(String).includes(String(doc[key]))) return false;
          continue;
        }
        if (val.$ne !== undefined) {
          if (doc[key] === val.$ne) return false;
          continue;
        }
      }
      if (doc[key] !== val) return false;
    }
    return true;
  };

  const normalize = (doc) => {
    if (!doc) return null;
    const obj = typeof doc.toObject === 'function' ? doc.toObject({ virtuals: true }) : { ...doc };
    if (obj._id && !obj.id) {
      obj.id = String(obj._id);
    }
    return obj;
  };

  return {
    async find(filter = {}) {
      if (!dbState.isInMemory) {
        const docs = await MongooseModel.find(filter).lean();
        return docs.map(d => ({ ...d, id: d.id || String(d._id) }));
      }
      const store = getStore();
      return store.filter(d => matchesFilter(d, filter)).map(d => ({ ...d }));
    },

    async findOne(filter = {}) {
      if (!dbState.isInMemory) {
        const doc = await MongooseModel.findOne(filter);
        return normalize(doc);
      }
      const store = getStore();
      const found = store.find(d => matchesFilter(d, filter));
      return found ? { ...found } : null;
    },

    async findById(id) {
      if (!dbState.isInMemory) {
        const doc = await MongooseModel.findById(id);
        return normalize(doc);
      }
      const store = getStore();
      const strId = String(id);
      const found = store.find(d => String(d._id) === strId || String(d.id) === strId);
      return found ? { ...found } : null;
    },

    async create(data) {
      if (!dbState.isInMemory) {
        const doc = await MongooseModel.create(data);
        return normalize(doc);
      }
      const store = getStore();
      const generatedId = data._id || data.id || uuidv4();
      const newDoc = {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
        _id: generatedId,
        id: generatedId
      };
      store.push(newDoc);
      return { ...newDoc };
    },

    async insertMany(docs) {
      if (!dbState.isInMemory) {
        const created = await MongooseModel.insertMany(docs);
        return created.map(c => normalize(c));
      }
      const store = getStore();
      const created = docs.map(d => {
        const genId = d._id || d.id || uuidv4();
        return {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...d,
          _id: genId,
          id: genId
        };
      });
      store.push(...created);
      return created;
    },

    async findByIdAndUpdate(id, update, options = { new: true }) {
      if (!dbState.isInMemory) {
        const doc = await MongooseModel.findByIdAndUpdate(id, update, options);
        return normalize(doc);
      }
      const store = getStore();
      const strId = String(id);
      const idx = store.findIndex(d => String(d._id) === strId || String(d.id) === strId);
      if (idx === -1) return null;

      const current = store[idx];
      const changes = update.$set ? update.$set : update;
      const incChanges = update.$inc || {};

      const updated = {
        ...current,
        ...changes,
        updatedAt: new Date().toISOString()
      };

      for (const [incKey, incVal] of Object.entries(incChanges)) {
        updated[incKey] = (Number(current[incKey]) || 0) + Number(incVal);
      }

      store[idx] = updated;
      return { ...updated };
    },

    async updateOne(filter, update) {
      if (!dbState.isInMemory) {
        return await MongooseModel.updateOne(filter, update);
      }
      const store = getStore();
      const idx = store.findIndex(d => matchesFilter(d, filter));
      if (idx === -1) return { matchedCount: 0, modifiedCount: 0 };

      const current = store[idx];
      const changes = update.$set ? update.$set : update;
      const incChanges = update.$inc || {};

      const updated = {
        ...current,
        ...changes,
        updatedAt: new Date().toISOString()
      };

      for (const [incKey, incVal] of Object.entries(incChanges)) {
        updated[incKey] = (Number(current[incKey]) || 0) + Number(incVal);
      }

      store[idx] = updated;
      return { matchedCount: 1, modifiedCount: 1 };
    },

    async deleteMany(filter = {}) {
      if (!dbState.isInMemory) {
        return await MongooseModel.deleteMany(filter);
      }
      const store = getStore();
      const before = store.length;
      dbState.memoryStore[storeCollectionName] = store.filter(d => !matchesFilter(d, filter));
      return { deletedCount: before - dbState.memoryStore[storeCollectionName].length };
    },

    async countDocuments(filter = {}) {
      if (!dbState.isInMemory) {
        return await MongooseModel.countDocuments(filter);
      }
      const store = getStore();
      return store.filter(d => matchesFilter(d, filter)).length;
    },

    rawMongoose: MongooseModel
  };
}
