import { BaseQueryParams } from "src/core/dto/base.query-params.input-dto";
import { PostsSortBy } from "./posts-sort-by";

//наследуемся от класса BaseQueryParams, где уже есть pageNumber, pageSize и т.п., чтобы не дублировать эти свойства
export class GetPostsQueryParams extends BaseQueryParams {
  sortBy = PostsSortBy.CreatedAt;
}
