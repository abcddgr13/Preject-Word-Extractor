import { db } from "./db";
import {
  wordAnalyses,
  type InsertWordAnalysis,
  type WordAnalysis
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  logAnalysis(analysis: InsertWordAnalysis): Promise<WordAnalysis>;
}

export class DatabaseStorage implements IStorage {
  async logAnalysis(analysis: InsertWordAnalysis): Promise<WordAnalysis> {
    const [log] = await db.insert(wordAnalyses).values(analysis).returning();
    return log;
  }
}

export const storage = new DatabaseStorage();
