import express from "express";
import { FeedFileRepository } from "../repositories/feed";
import { FeedFetchOptions, FeedService } from "../services/feed";

const service = new FeedService(new FeedFileRepository("data.json"));

export const get = async (req: express.Request, res: express.Response) => {
  const feedsFetchOptions: FeedFetchOptions = {};
  if (req.query.searchTerm) {
    feedsFetchOptions.searchTerm = req.query.searchTerm as string;
  }
  if (req.query.shouldSort === "true") {
    if (!req.query.sortColumnName || !req.query.sortAscending) {
      return res.status(400).json({
        message: "Sort parameters must be specified to use the sort function",
      });
    }
    feedsFetchOptions.sort = {
      columnName: req.query.sortColumnName as string,
      ascending: req.query.sortAscending === "true",
    };
  }
  if (req.query.pageSize) {
    feedsFetchOptions.pageSize = parseInt(req.query.pageSize as string);
  }
  if (req.query.currentPage) {
    feedsFetchOptions.currentPage = parseInt(req.query.currentPage as string);
  }
  if (
    isNaN(feedsFetchOptions.pageSize ?? 0) ||
    isNaN(feedsFetchOptions.currentPage ?? 0)
  ) {
    return res.status(400).json({
      message: "Invalid values passed to paging parameters",
    });
  }
  res.json(await service.getFeeds(feedsFetchOptions));
};
