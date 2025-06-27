import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { ApiParam } from "@nestjs/swagger";
import { BlogsQueryRepository } from "../infrastructure/query/blogs.query-repository";
import { BlogsService } from "../application/blogs.service";
import { PostsQueryRepository } from "../../posts/infrastructure/query/posts.query-repository";
import { PostsService } from "../../posts/application/posts.service";
import { CreateBlogInputDto } from "./input-dto/blogs.input-dto";
import { BlogViewDto } from "./view-dto/blogs.view-dto";
import { CreatePostInBlogInputDto } from "./input-dto/post-in-blog.input-dto";
import { PostViewDto } from "../../posts/api/view-dto/posts.view-dto";
import { UpdateBlogDto } from "../dto/update-blog.dto";
import { GetBlogsQueryParams } from "./input-dto/get-blogs-query-params.input-dto";
import { PaginatedViewDto } from "src/core/dto/base.paginated.view-dto";
import { GetPostsQueryParams } from "../../posts/api/input-dto/get-posts-query-params.input-dto";

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private blogsService: BlogsService,
    private postsQueryRepository: PostsQueryRepository,
    private postsService: PostsService,
  ) {}
 
  @Get()
  async getAll(@Query() query: GetBlogsQueryParams): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.getAll( query );
  }
 
  @ApiParam({ name: 'id' }) //для сваггера
  @Get(':id')
  async getBlog(@Param('id') id: string): Promise<BlogViewDto> {
    return this.blogsQueryRepository.getByIdMapToViewOrNotFoundFail( id );
  }
  
  @ApiParam({ name: 'blogId' }) //для сваггера
  @Get(':blogId/posts')
  async getPostComments(@Param('blogId') blogId: string, @Query() query: GetPostsQueryParams): Promise<PaginatedViewDto<PostViewDto[]>> {
    const blog = await this.blogsQueryRepository.getByIdOrNotFoundFail( blogId );
    return this.postsQueryRepository.getPostsInBlog( query, blogId );
  }

  @Post()
  async createBlog(@Body() body: CreateBlogInputDto): Promise<BlogViewDto> {
    const blogId = await this.blogsService.createBlog( body ); 
    return this.blogsQueryRepository.getByIdMapToViewOrNotFoundFail(blogId);
  }

  @ApiParam({ name: 'blogId' }) //для сваггера
  @Post(':blogId/posts')
  async createPostInBlog(@Param('blogId') blogId: string, @Body() body: CreatePostInBlogInputDto): Promise<PostViewDto> {
    const blog = await this.blogsQueryRepository.getByIdOrNotFoundFail( blogId );
    const postId = await this.postsService.createPost({ ...body, blogId: blog._id.toString()}, blog);
 
    return this.postsQueryRepository.getByIdOrNotFoundFail(postId);
  }
  
  @ApiParam({ name: 'id' }) //для сваггера
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(@Param('id') id: string, @Body() body: UpdateBlogDto): Promise<void> {
    return this.blogsService.updateBlog( id, body );
  }
 
  @ApiParam({ name: 'id' }) //для сваггера
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: string): Promise<void> {
    return this.blogsService.deleteBlog( id );
  }
}
