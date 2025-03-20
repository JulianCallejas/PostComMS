import express, {Request, Response} from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../../middleware/auth';
import { createLogger } from '../../lib/createLogger';

const router = express.Router();
const prisma = new PrismaClient();
const logger = createLogger('postsservice');

const POSTS_PER_PAGE = 100;
// Create post
router.post(
  '/',
  authenticateToken,
  [body('content').notEmpty()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { content } = req.body;
      const post = await prisma.post.create({
        data: {
          content,
          authorId: req.user.userId
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true
            }
          },
          _count: {
            select: { likes: true }
          }
        }
      });

      res.status(201).json(post);
    } catch (error) {
        logger.error('Post creation error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Update post
router.put(
    '/:postId',
    [body('content').notEmpty()],
    async (req: Request, res: Response) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        const { postId } = req.params;
        const { content } = req.body;
  
        // Check if post exists and belongs to user
        const existingPost = await prisma.post.findFirst({
          where: {
            id: postId,
            authorId: req.user.userId
          }
        });
  
        if (!existingPost) {
          return res.status(404).json({ message: 'Post not found' });
        }
  
        // Update post
        const updatedPost = await prisma.post.update({
          where: {
            id: postId
          },
          data: {
            content
          },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                name: true
              }
            },
            likes: {
                where: {
                  userId: req.user.userId
                },
                select: {
                  id: true
                }
              },
            _count: {
              select: { likes: true }
            }
          }
        });
        const {likes, ...postWithoutLikes} = updatedPost;
        res.json({
            ...postWithoutLikes,
            isLiked: likes.length > 0,
        });
      } catch (error) {
        logger.error('Post update error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  );

// Get all posts
router.get('/', async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const skip = (page - 1) * POSTS_PER_PAGE;
  
      const [posts, totalPosts] = await Promise.all([
        prisma.post.findMany({
          take: POSTS_PER_PAGE,
          skip,
          include: {
            author: {
              select: {
                id: true,
                username: true,
                name: true
              }
            },
            likes: {
              where: {
                userId: req.user.userId
              },
              select: {
                id: true
              }
            },
            _count: {
              select: { likes: true }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }),
        prisma.post.count()
      ]);
  
      // Transform the posts to include isLiked flag
      const postsWithLikeStatus = posts.map(post => 
        {
            const {likes, ...postWithoutLikes} = post;
        return ({
        ...postWithoutLikes,
        isLiked: likes.length > 0,
      })});
  
      res.json({
        posts: postsWithLikeStatus,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalPosts / POSTS_PER_PAGE),
          totalPosts,
          postsPerPage: POSTS_PER_PAGE
        }
      });
    } catch (error) {
      logger.error('Posts fetch error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get my posts with pagination
router.get('/my-posts', async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const skip = (page - 1) * POSTS_PER_PAGE;
  
      const [posts, totalPosts] = await Promise.all([
        prisma.post.findMany({
          where: {
            authorId: req.user.userId
          },
          take: POSTS_PER_PAGE,
          skip,
          include: {
            author: {
              select: {
                id: true,
                username: true,
                name: true
              }
            },
            likes: {
                where: {
                  userId: req.user.userId
                },
                select: {
                  id: true
                }
              },
            _count: {
              select: { likes: true }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }),
        prisma.post.count({
          where: {
            authorId: req.user.userId
          }
        })
      ]);

      // Transform the posts to include isLiked flag
      const postsWithLikeStatus = posts.map(post => 
        {
            const {likes, ...postWithoutLikes} = post;
        return ({
        ...postWithoutLikes,
        isLiked: likes.length > 0,
      })});
 
      res.json({
        posts: postsWithLikeStatus,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalPosts / POSTS_PER_PAGE),
          totalPosts,
          postsPerPage: POSTS_PER_PAGE
        }
      });
    } catch (error) {
      logger.error('My posts fetch error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// Like/Unlike post
router.post('/:postId/like', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: req.user.userId,
          postId
        }
      }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId: req.user.userId,
            postId
          }
        }
      });
      res.json({ message: 'Post unliked' });
    } else {
      await prisma.like.create({
        data: {
          userId: req.user.userId,
          postId
        }
      });
      res.json({ message: 'Post liked' });
    }
  } catch (error) {
    logger.error('Like/Unlike error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;