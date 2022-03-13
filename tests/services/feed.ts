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
    const feedsRes = await feedService.getFeeds();
    expect(feedsRes.currentPage).to.equal(1);
    expect(feedsRes.pageSize).to.equal(50);
    expect(feedsRes.resultSize).to.equal(3);
    expect(feedsRes.totalSize).to.equal(3);
    const feeds = feedsRes.feeds;
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

    const feedsSearch1Res = await feedService.getFeeds({
      searchTerm: "lord of the Rings",
    });

    expect(feedsSearch1Res.currentPage).to.equal(1);
    expect(feedsSearch1Res.pageSize).to.equal(50);
    expect(feedsSearch1Res.resultSize).to.equal(2);
    expect(feedsSearch1Res.totalSize).to.equal(2);

    const feedsSearch1 = feedsSearch1Res.feeds;
    expect(feedsSearch1).to.have.length(2);
    expect(feedsSearch1[0].name).to.equal("Lord of the Rings");
    expect(feedsSearch1[1].name).to.equal("LotR TV series");

    const feedsSearch2Res = await feedService.getFeeds({
      searchTerm: '"lord of the Rings"',
    });

    expect(feedsSearch2Res.currentPage).to.equal(1);
    expect(feedsSearch2Res.pageSize).to.equal(50);
    expect(feedsSearch2Res.resultSize).to.equal(1);
    expect(feedsSearch2Res.totalSize).to.equal(1);

    const feedsSearch2 = feedsSearch2Res.feeds;
    expect(feedsSearch2).to.have.length(1);
    expect(feedsSearch2[0].name).to.equal("LotR TV series");

    const feedsSearch3Res = await feedService.getFeeds({
      searchTerm: 'lord "of the Rings"',
    });
    expect(feedsSearch3Res).to.deep.equal(feedsSearch1Res);

    const feedsSearch4Res = await feedService.getFeeds({
      searchTerm: "rings lotr",
    });
    expect(feedsSearch4Res).to.deep.equal(feedsSearch2Res);
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
    const feedsNameSortRes = await feedService.getFeeds({
      sort: {
        columnName: "name",
        ascending: false,
      },
    });

    expect(feedsNameSortRes.currentPage).to.equal(1);
    expect(feedsNameSortRes.pageSize).to.equal(50);
    expect(feedsNameSortRes.resultSize).to.equal(3);
    expect(feedsNameSortRes.totalSize).to.equal(3);

    const feedsNameSort = feedsNameSortRes.feeds;
    expect(feedsNameSort).to.have.length(3);
    expect(feedsNameSort[0].name).to.equal("LotR TV series");
    expect(feedsNameSort[1].name).to.equal("Lord of the Rings");
    expect(feedsNameSort[2].name).to.equal("Harry Potter");

    const feedsDateSortRes = await feedService.getFeeds({
      sort: {
        columnName: "dateLastEdited",
        ascending: false,
      },
    });

    expect(feedsDateSortRes.currentPage).to.equal(1);
    expect(feedsDateSortRes.pageSize).to.equal(50);
    expect(feedsDateSortRes.resultSize).to.equal(3);
    expect(feedsDateSortRes.totalSize).to.equal(3);

    const feedsDateSort = feedsDateSortRes.feeds;
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

    const feedsFirstPageRes = await feedService.getFeeds({
      currentPage: 1,
    });

    expect(feedsFirstPageRes.currentPage).to.equal(1);
    expect(feedsFirstPageRes.pageSize).to.equal(50);
    expect(feedsFirstPageRes.resultSize).to.equal(50);
    expect(feedsFirstPageRes.totalSize).to.equal(120);

    const feedsFirstPage = feedsFirstPageRes.feeds;
    expect(feedsFirstPage).to.have.length(50);
    expect(feedsFirstPage[0].name).to.equal("Test Name 1");
    expect(feedsFirstPage[49].name).to.equal("Test Name 50");

    const feedsSecondPageRes = await feedService.getFeeds({
      currentPage: 2,
    });

    expect(feedsSecondPageRes.currentPage).to.equal(2);
    expect(feedsSecondPageRes.pageSize).to.equal(50);
    expect(feedsSecondPageRes.resultSize).to.equal(50);
    expect(feedsSecondPageRes.totalSize).to.equal(120);

    const feedsSecondPage = feedsSecondPageRes.feeds;
    expect(feedsSecondPage).to.have.length(50);
    expect(feedsSecondPage[0].name).to.equal("Test Name 51");
    expect(feedsSecondPage[49].name).to.equal("Test Name 100");

    const feedsThirdPageRes = await feedService.getFeeds({
      currentPage: 3,
    });

    expect(feedsThirdPageRes.currentPage).to.equal(3);
    expect(feedsThirdPageRes.pageSize).to.equal(50);
    expect(feedsThirdPageRes.resultSize).to.equal(20);
    expect(feedsThirdPageRes.totalSize).to.equal(120);

    const feedsThirdPage = feedsThirdPageRes.feeds;
    expect(feedsThirdPage).to.have.length(20);
    expect(feedsThirdPage[0].name).to.equal("Test Name 101");
    expect(feedsThirdPage[19].name).to.equal("Test Name 120");
  });
});
