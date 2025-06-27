import { BaseQueryParams } from "src/core/dto/base.query-params.input-dto";
import { CommentsSortBy } from "./comments-sort-by";


//наследуемся от класса BaseQueryParams, где уже есть pageNumber, pageSize и т.п., чтобы не дублировать эти свойства
export class GetCommentsQueryParams extends BaseQueryParams {
  sortBy = CommentsSortBy.CreatedAt;
}
