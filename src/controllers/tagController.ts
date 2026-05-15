import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

// Validation schema
const tagSchema = z.object({
  name: z.string().min(1, 'Tag name is required').max(100, 'Tag name must not exceed 100 characters'),
});

// Get all tags
export async function getAllTags(req: Request, res: Response, next: NextFunction) {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    res.status(200).json({
      success: true,
      data: tags,
    });
  } catch (error) {
    next(error);
  }
}

// Create tag
export async function createTag(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedData = tagSchema.parse(req.body);

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { name: validatedData.name },
    });

    if (existingTag) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Tag already exists',
          code: 'TAG_EXISTS',
        },
      });
    }

    const tag = await prisma.tag.create({
      data: {
        name: validatedData.name,
      },
    });

    res.status(201).json({
      success: true,
      data: tag,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation error',
          code: 'VALIDATION_ERROR',
          details: error.errors,
        },
      });
    }
    next(error);
  }
}

// Delete tag
export async function deleteTag(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!existingTag) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Tag not found',
          code: 'TAG_NOT_FOUND',
        },
      });
    }

    await prisma.tag.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      data: { message: 'Tag deleted successfully' },
    });
  } catch (error) {
    next(error);
  }
}