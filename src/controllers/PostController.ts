import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Post } from "../entities/Post";
import { redisClient } from "../config/cache";

const CACHE_LIFE_TIME = 60;

export class PostController {
  private _repo: Repository<Post>;

  constructor() {
    this._repo = AppDataSource.getRepository(Post);
  }

  async save(post: Post): Promise<Post> {
    const savedPost = await this._repo.save(post);
    const user = savedPost.user.clear();
    savedPost.user = user;
    return savedPost;
  }

  async findAllByUserId(
    userId: number,
    page: string | null,
    perPage: string | null
  ): Promise<Post[]> {
    let pageValue = Number(page) || 1;
    let perPageValue = Number(perPage) || 50;

    const cacheKey = `byUserId_${userId}_${page}_${perPage}`;
    const cachedPosts = await redisClient.get(cacheKey);

    if (cachedPosts) {
      return JSON.parse(cachedPosts);
    }

    const posts = await this._repo.find({
      where: {
        user: {
          id: userId,
        },
      },
      skip: pageValue - 1 * perPageValue,
      take: perPageValue,
    });

    redisClient.set(cacheKey, JSON.stringify(posts), {
      EX: CACHE_LIFE_TIME,
    });

    return posts;
  }

  async findById(id: number): Promise<Post> {
    const post = await this._repo.findOne({
      where: {
        id,
      },
      relations: ["user"],
    });
    return post;
  }

  async delete(id: number) {
    await this._repo.delete(id);
  }
}
