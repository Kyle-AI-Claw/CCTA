import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { Coin } from '../types';
import { z } from 'zod';

// Validation schema for creating a coin
const createCoinSchema = z.object({
  coin: z.object({
    name: z.string().optional(),
    denomination: z.string().optional(),
    year: z.number().int().optional(),
    mintMark: z.string().optional(),
    country: z.string().optional(),
    metal: z.string().optional(),
    grade: z.string().optional(),
    purchasedDate: z.string().optional(),
    purchasePrice: z.number().optional(),
    notes: z.string().optional(),
    description: z.string().optional(),
  }),
});

// Validation schema for updating a coin
const updateCoinSchema = z.object({
  coin: z.object({
    name: z.string().optional(),
    denomination: z.string().optional(),
    year: z.number().int().optional(),
    mintMark: z.string().optional(),
    country: z.string().optional(),
    metal: z.string().optional(),
    grade: z.string().optional(),
    purchasedDate: z.string().optional(),
    purchasePrice: z.number().optional(),
    notes: z.string().optional(),
    description: z.string().optional(),
    frontImagePath: z.string().optional(),
    backImagePath: z.string().optional(),
  }),
});

// Get all coins with pagination and filtering
export async function getAllCoins(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      tags,
      country,
      year,
      denomination,
      metal,
      grade,
      sort = 'createdAt',
      order = 'desc',
    } = req.query;

    // Build query
    const where: any = {};

    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { denomination: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    // Add filters
    if (country) {
      where.country = country as string;
    }

    if (year) {
      where.year = Number(year);
    }

    if (denomination) {
      where.denomination = denomination as string;
    }

    if (metal) {
      where.metal = metal as string;
    }

    if (grade) {
      where.grade = grade as string;
    }

    // Get total count
    const total = await prisma.coin.count({ where });

    // Get coins with pagination
    const coins = await prisma.coin.findMany({
      where,
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: {
        [sort as string]: order as 'asc' | 'desc',
      },
      include: {
        _count: {
          select: {
            tags: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        coins: coins as unknown as Coin[],
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// Get single coin
export async function getCoinById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const coin = await prisma.coin.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            tags: true,
          },
        },
      },
    });

    if (!coin) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Coin not found',
          code: 'COIN_NOT_FOUND',
        },
      });
    }

    res.status(200).json({
      success: true,
      data: coin as unknown as Coin,
    });
  } catch (error) {
    next(error);
  }
}

// Create new coin
export async function createCoin(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedData = createCoinSchema.parse(req.body);

    // Handle image uploads
    const files = req.files as Express.Multer.File[] | undefined;
    const frontImage = files?.find((f) => f.fieldname === 'frontImage');
    const backImage = files?.find((f) => f.fieldname === 'backImage');

    // Create coin with optional images
    const coin = await prisma.coin.create({
      data: {
        userId: (req as any).user?.id,
        ...validatedData.coin,
        frontImagePath: frontImage?.path,
        backImagePath: backImage?.path,
      },
    });

    res.status(201).json({
      success: true,
      data: coin as unknown as Coin,
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

// Update coin
export async function updateCoin(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const validatedData = updateCoinSchema.parse(req.body);

    // Check if coin exists
    const existingCoin = await prisma.coin.findUnique({
      where: { id },
    });

    if (!existingCoin) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Coin not found',
          code: 'COIN_NOT_FOUND',
        },
      });
    }

    // Update coin with optional new images
    const updateData: any = { ...validatedData.coin };
    const multerFiles = req.files as Express.Multer.File[] | undefined;
    if (multerFiles && multerFiles.find((f) => f.fieldname === 'frontImage')?.path) {
      updateData.frontImagePath = multerFiles.find((f) => f.fieldname === 'frontImage')?.path;
    }
    if (multerFiles && multerFiles.find((f) => f.fieldname === 'backImage')?.path) {
      updateData.backImagePath = multerFiles.find((f) => f.fieldname === 'backImage')?.path;
    }

    const coin = await prisma.coin.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      data: coin as unknown as Coin,
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

// Delete coin
export async function deleteCoin(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    // Check if coin exists
    const coin = await prisma.coin.findUnique({
      where: { id },
    });

    if (!coin) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Coin not found',
          code: 'COIN_NOT_FOUND',
        },
      });
    }

    await prisma.coin.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      data: { message: 'Coin deleted successfully' },
    });
  } catch (error) {
    next(error);
  }
}
