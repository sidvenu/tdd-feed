import { Feed } from "../model/feed";
import { FeedRepository } from "../repositories/feed";
import { getCurrentUnixTimestamp } from "../util/misc";
import { getSearchRegexFromSearchTerm } from "../util/search";

export type FeedFetchOptions = {
  searchTerm?: string;
  sort?: {
    columnName: "name" | "image" | "description" | "dateLastEdited";
    ascending: boolean;
  };
  currentPage?: number;
  pageSize?: number;
};

export type FeedFetchResult = {
  totalSize: number;
  resultSize: number;
  currentPage: number;
  pageSize: number;
  feeds: Feed[];
};

/**
 * Service to filter, sort and paginate a list of feeds from a repository
 */
export class FeedService {
  private feeds: Feed[] = [];
  private feedsInitialized: Promise<void>;
  private feedsSearchCache: {
    [key: string]: { cache: Feed[]; updatedAt: number; accessedAt: number };
  } = {};
  private maxUpdateWaitTimeSeconds = 60;
  private oldFeedsAccessTimeSeconds = 2 * 60;

  /**
   * Constructs a FeedsService and immediately starts fetching the list of
   * all feeds from the given repository
   *
   * @param {FeedRepository} repository the data source to get the feeds from
   */
  constructor(repository: FeedRepository) {
    this.feedsInitialized = (async () => {
      this.feeds = await repository.getFeeds();
    })();
  }

  /**
   * Removes cached feeds where the last acccess time has passed the criteria
   * for being 'old'.
   */
  private cleanupOldFeedsSearchCache() {
    const currentTs = getCurrentUnixTimestamp();
    Object.entries(this.feedsSearchCache).forEach(([k, v]) => {
      if (v.accessedAt + this.oldFeedsAccessTimeSeconds < currentTs) {
        delete this.feedsSearchCache[k];
      }
    });
  }

  /**
   * Returns metadata with the list of feeds with the option to filter, sort and paginate it.
   *
   * @param {FeedFetchOptions} param0 the options to use to filter, sort and paginate the feeds
   * @return {Promise<FeedFetchResult>} metadata about the filters and the list of feeds that match the options passed
   */
  async getFeeds(
    {
      searchTerm = "",
      sort = undefined,
      currentPage = 1,
      pageSize = 50,
    }: FeedFetchOptions = {
      searchTerm: "",
      sort: undefined,
      currentPage: 1,
      pageSize: 50,
    }
  ): Promise<FeedFetchResult> {
    await this.feedsInitialized;
    this.cleanupOldFeedsSearchCache();
    let feedsRes = this.feeds;

    if (
      this.feedsSearchCache[searchTerm] &&
      this.feedsSearchCache[searchTerm].updatedAt >=
        getCurrentUnixTimestamp() - this.maxUpdateWaitTimeSeconds
    ) {
      feedsRes = this.feedsSearchCache[searchTerm].cache;
      this.feedsSearchCache[searchTerm].accessedAt = getCurrentUnixTimestamp();
    } else {
      let { searchRegex, exactMatchStrings } =
        getSearchRegexFromSearchTerm(searchTerm);

      exactMatchStrings = exactMatchStrings.sort((a, b) => b.length - a.length);
      exactMatchStrings.forEach((s) => {
        feedsRes = feedsRes.filter((feed) => {
          return feed.name.includes(s) || feed.description.includes(s);
        });
      });

      feedsRes = feedsRes.filter((feed) => {
        return (
          searchRegex.test(feed.name) || searchRegex.test(feed.description)
        );
      });

      this.feedsSearchCache[searchTerm] = {
        cache: feedsRes,
        accessedAt: getCurrentUnixTimestamp(),
        updatedAt: getCurrentUnixTimestamp(),
      };
    }

    if (sort) {
      const compareFuncFactor = sort.ascending ? 1 : -1;
      feedsRes = feedsRes.sort((a, b) => {
        return (
          a[sort.columnName].localeCompare(b[sort.columnName]) *
          compareFuncFactor
        );
      });
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize - 1;

    const totalSize = feedsRes.length;

    feedsRes = feedsRes.slice(startIndex, endIndex + 1);

    const resultSize = feedsRes.length;

    return { feeds: feedsRes, totalSize, resultSize, currentPage, pageSize };
  }
}
