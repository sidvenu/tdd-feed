import { Feed } from "../model/feed";
import { FeedRepository } from "../repositories/feed";

export type FeedFetchOptions = {
  searchTerm?: string;
  sort?: { columnName: string; ascending: boolean };
  currentPage?: number;
  pageSize?: number;
};

/**
 * Service to filter, sort and paginate a list of feeds from a repository
 */
export class FeedService {
  private feeds: Feed[] = [];
  private feedsInitialized: Promise<void>;

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
   * Returns the list of feeds with the option to filter, sort and paginate it.
   *
   * @param {FeedFetchOptions} param0 the options to use to filter, sort and paginate the feeds
   * @return {Promise<Feed>[]} list of feeds that match the options passed
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
  ): Promise<Feed[]> {
    await this.feedsInitialized;
    // TODO: filter feeds using the searchTerm, sort it using sortCols and paginate using currentPage and pageSize
    return [];
  }
}
