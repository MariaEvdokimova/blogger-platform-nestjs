import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { PostsQueryRepository } from "../infrastructure/query/posts.query-repository";
import { ApiParam } from "@nestjs/swagger";
import { PostsService } from "../application/posts.service";
import { CreatePostInputDto } from "./input-dto/posts.input-dto";
import { PostViewDto } from "./view-dto/posts.view-dto";
import { BlogsQueryRepository } from "../../blogs/infrastructure/query/blogs.query-repository";
import { UpdatePostDomainDto } from "../dto/update-post.dto";
import { GetPostsQueryParams } from "./input-dto/get-posts-query-params.input-dto";
import { PaginatedViewDto } from "src/core/dto/base.paginated.view-dto";
import { CommentViewDto } from "../../comments/api/view-dto/comments.view-dto";
import { CommentsQueryRepository } from "../../comments/infrastructure/query/comments.query-repository";
import { GetCommentsQueryParams } from "../../comments/api/input-dto/get-comments-query-params.input-dto";

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postsService: PostsService,
    private blogsQueryRepository: BlogsQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}
 
  @Get()
  async getAll(@Query() query: GetPostsQueryParams): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.postsQueryRepository.getAll( query );
  }
 
  @ApiParam({ name: 'id' }) //для сваггера
  @Get(':id')
  async getPost(@Param('id') id: string): Promise<PostViewDto> {
    return this.postsQueryRepository.getByIdOrNotFoundFail( id );
  }
  
  @ApiParam({ name: 'postId' }) //для сваггера
  @Get(':postId/comments')
  async getPostComments(@Param('postId') postId: string, @Query() query: GetCommentsQueryParams): Promise<PaginatedViewDto<CommentViewDto[]>> {
    const post = await this.postsQueryRepository.getByIdOrNotFoundFail( postId );
    return this.commentsQueryRepository.getCommentsInPost( query, postId );
  }

  @Post()
  async createPost(@Body() body: CreatePostInputDto): Promise<PostViewDto> {
    const blog = await this.blogsQueryRepository.getByIdOrNotFoundFail( body.blogId );
    const postId = await this.postsService.createPost(body, blog);
 
    return this.postsQueryRepository.getByIdOrNotFoundFail(postId);
  }

  @ApiParam({ name: 'id' }) //для сваггера
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(@Param('id') id: string, @Body() body: UpdatePostDomainDto): Promise<void> {
    return this.postsService.updatePost( id, body );
  }
 
  @ApiParam({ name: 'id' }) //для сваггера
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string): Promise<void> {
    return this.postsService.deletePost( id );
  }
}
