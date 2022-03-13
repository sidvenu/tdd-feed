import { expect } from "chai";
import { Feed } from "../../src/model/feed";
import { FeedRepository } from "../../src/repositories/feed";

import { FeedService } from "../../src/services/feed";

/**
 * A FeedRepository that holds a list of feeds in memory, and returns the exact list
 * when getFeeds is called
 */
class FeedTestRepository implements FeedRepository {
  private feeds: Feed[];

  /**
   * Constructs a FeedTestRepository that holds the given array of feeds in memory
   *
   * @param {Feed[]} feeds the list of feeds to store
   */
  constructor(feeds: Feed[]) {
    this.feeds = feeds;
  }

  /**
   * Gets the list of feeds stored in memory
   *
   * @return {Promise<Feed[]>} the list of feeds stored in memory
   */
  async getFeeds(): Promise<Feed[]> {
    return this.feeds;
  }
}

describe("Service - Feed", () => {
  it("Get Feeds", async () => {
    const feedService = new FeedService(
      new FeedTestRepository([
        {
          name: "test1",
          image: "Image - 1",
          description: "Test Image 1",
          dateLastEdited: "2018-07-27T05:58:52.006Z",
        },
        {
          name: "test2",
          image: "Image - 2",
          description: "Test Image 2",
          dateLastEdited: "2019-07-27T05:58:52.006Z",
        },
        {
          name: "test3",
          image: "Image - 3",
          description: "Test Image 3",
          dateLastEdited: "2020-07-27T05:58:52.006Z",
        },
      ])
    );
    const feeds = await feedService.getFeeds();
    expect(feeds).to.have.length(3);
    expect(feeds[2].name).to.equal("test3");
  });
  it("Filter Feeds", async () => {
    const feedService = new FeedService(
      new FeedTestRepository([
        {
          name: "Lord of the Rings",
          image: "Image - 1",
          description: "Test Image 1",
          dateLastEdited: "2018-07-27T05:58:52.006Z",
        },
        {
          name: "Harry Potter",
          image: "Image - 2",
          description:
            "Harry Potter is one of the world's most popular movie series ever",
          dateLastEdited: "2019-07-27T05:58:52.006Z",
        },
        {
          name: "LotR TV series",
          image: "Image - 3",
          description:
            "I loved the lord of the Rings movies. I hope to see LotR TV Series as it releases.",
          dateLastEdited: "2020-07-27T05:58:52.006Z",
        },
      ])
    );

    const feedsSearch1 = await feedService.getFeeds({
      searchTerm: "lord of the Rings",
    });
    expect(feedsSearch1).to.have.length(2);
    expect(feedsSearch1[0].name).to.equal("Lord of the Rings");
    expect(feedsSearch1[1].name).to.equal("LotR TV series");

    const feedsSearch2 = await feedService.getFeeds({
      searchTerm: '"lord of the Rings"',
    });
    expect(feedsSearch2).to.have.length(1);
    expect(feedsSearch2[0].name).to.equal("LotR TV series");

    const feedsSearch3 = await feedService.getFeeds({
      searchTerm: 'lord "of the Rings"',
    });
    expect(feedsSearch3).to.deep.equal(feedsSearch1);

    const feedsSearch4 = await feedService.getFeeds({
      searchTerm: "rings lotr",
    });
    expect(feedsSearch4).to.deep.equal(feedsSearch2);
  });
  it("Sort Feeds", async () => {
    const feedService = new FeedService(
      new FeedTestRepository([
        {
          name: "Lord of the Rings",
          image: "Image - 1",
          description: "Test Image 1",
          dateLastEdited: "2018-07-27T05:58:52.006Z",
        },
        {
          name: "Harry Potter",
          image: "Image - 2",
          description:
            "Harry Potter is one of the world's most popular movie series ever",
          dateLastEdited: "2019-07-27T05:58:52.006Z",
        },
        {
          name: "LotR TV series",
          image: "Image - 3",
          description:
            "I loved the lord of the rings movies. I hope to see LotR TV Series as it releases.",
          dateLastEdited: "2020-07-27T05:58:52.006Z",
        },
      ])
    );
    const feedsNameSort = await feedService.getFeeds({
      sort: {
        columnName: "name",
        ascending: false,
      },
    });
    expect(feedsNameSort).to.have.length(3);
    expect(feedsNameSort[0].name).to.equal("LotR TV series");
    expect(feedsNameSort[1].name).to.equal("Lord of the Rings");
    expect(feedsNameSort[2].name).to.equal("Harry Potter");

    const feedsDateSort = await feedService.getFeeds({
      sort: {
        columnName: "dateLastEdited",
        ascending: false,
      },
    });
    expect(feedsDateSort).to.have.length(3);
    expect(feedsDateSort[0].name).to.equal("LotR TV series");
    expect(feedsDateSort[1].name).to.equal("Harry Potter");
    expect(feedsDateSort[2].name).to.equal("Lord of the Rings");
  });
  it("Pagination of Feeds", async () => {
    const fakeData = new Array(120).fill({}).map((_, i) => {
      const pos = i + 1;
      const unixTimestamp = 1600000000 + Math.random() * 40000000;
      return {
        name: `Test Name ${pos}`,
        image: `Test Image ${pos}`,
        description: `Test Description ${pos}`,
        dateLastEdited: new Date(unixTimestamp * 1000).toISOString(),
      };
    });
    const feedService = new FeedService(new FeedTestRepository(fakeData));

    const feedsFirstPage = await feedService.getFeeds({
      currentPage: 1,
    });
    expect(feedsFirstPage).to.have.length(50);
    expect(feedsFirstPage[0].name).to.equal("Test Name 1");
    expect(feedsFirstPage[49].name).to.equal("Test Name 50");

    const feedsSecondPage = await feedService.getFeeds({
      currentPage: 2,
    });
    expect(feedsSecondPage).to.have.length(50);
    expect(feedsSecondPage[0].name).to.equal("Test Name 51");
    expect(feedsSecondPage[49].name).to.equal("Test Name 100");

    const feedsThirdPage = await feedService.getFeeds({
      currentPage: 3,
    });
    expect(feedsThirdPage).to.have.length(20);
    expect(feedsThirdPage[0].name).to.equal("Test Name 101");
    expect(feedsThirdPage[19].name).to.equal("Test Name 120");
  });
});
