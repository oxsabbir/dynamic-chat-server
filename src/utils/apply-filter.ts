import { Query } from "mongoose";

interface UserQuery {
  page?: number;
  limit?: number;
  sort?: string;
  field?: string;
  query?: string;
  custom?: any;
  [key: string]: any;
}

class ApplyFilter<T> {
  private userQuery: UserQuery;
  private dataQuery: Query<T[], T>;

  constructor(userQuery: UserQuery, dataQuery: Query<T[], T>) {
    this.userQuery = userQuery;
    this.dataQuery = dataQuery;
  }

  filter(): this {
    const queryObj = { ...this.userQuery };
    const optField = ["page", "limit", "sort", "field", "query", "custom"];

    optField.forEach((item) => delete queryObj[item]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\blt|lte|gt|gte/g, (matches) => `$${matches}`);

    this.dataQuery = this.dataQuery.find(JSON.parse(queryStr));
    return this;
  }

  query(pathName: string): this {
    if (this.userQuery.query) {
      const searchQuery = this.userQuery.query;
      let escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      this.dataQuery.find({
        [pathName]: { $regex: escapedQuery, $options: "i" },
      });
    }
    return this;
  }

  page(number?: number): this {
    let perPage: number;
    if (this.userQuery?.limit) {
      perPage = +this.userQuery.limit;
    } else if (number) {
      perPage = number;
    } else {
      perPage = 12;
    }

    const skip = (this.userQuery.page || 1) * perPage - perPage;
    this.dataQuery.limit(perPage).skip(skip);
    return this;
  }

  sort(): this {
    if (this.userQuery.sort) {
      const sortValue = this.userQuery.sort.split(",").join(" ");
      this.dataQuery.sort(sortValue);
    }
    return this;
  }

  limitField(): this {
    if (this.userQuery.field) {
      const fieldData = this.userQuery.field.split(",").join(" ");
      this.dataQuery.select(fieldData);
    }
    return this;
  }
}

export default ApplyFilter;
