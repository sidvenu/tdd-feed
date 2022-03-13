import { promises as fs } from "fs";
import { Feed } from "../model/feed";

export interface FeedRepository {
  getFeeds(): Promise<Feed[]>;
}

/**
 * Implement a repository that sources the feeds data from a given file
 */
export class FeedFileRepository implements FeedRepository {
  private readonly fileName: string;

  /**
   * Constructs an instance of FeedFileRepository with the given fileName
   *
   * @param {string} fileName the file to read the feeds data from
   */
  constructor(fileName: string) {
    this.fileName = fileName;
  }

  /**
   * Gets a list of feeds available in the repository
   *
   * @return {Promise<Feed[]>} the list of feeds
   */
  async getFeeds(): Promise<Feed[]> {
    return JSON.parse((await fs.readFile(this.fileName)).toString());
  }
}
