import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './comments/domain/comment.entity';
import { CommentsController } from './comments/api/comments.controller';
import { CommentsQueryRepository } from './comments/infrastructure/query/comments.query-repository';
import { PostsController } from './posts/api/posts.controller';
import { PostsQueryRepository } from './posts/infrastructure/query/posts.query-repository';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { PostsService } from './posts/application/posts.service';
import { Post, PostSchema } from './posts/domain/post.entity';
import { Blog, BlogSchema } from './blogs/domain/blog.entity';
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsService } from './blogs/application/blogs.service';
import { BlogsQueryRepository } from './blogs/infrastructure/query/blogs.query-repository';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Post.name, schema: PostSchema },
      { name: Blog.name, schema: BlogSchema }
   ]),
  ],
  controllers: [
    CommentsController, 
    PostsController,
    BlogsController,
  ],
  providers: [
    CommentsQueryRepository,
    PostsService,
    PostsQueryRepository,
    PostsRepository,
    BlogsService,
    BlogsQueryRepository,
    BlogsRepository,
  ],
})
export class BloggersPlatformModule {}
