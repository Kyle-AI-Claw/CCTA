import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { CollectionStats } from '../types';

// Get collection statistics
export async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;

    // Get total coins count
    const totalCoins = await prisma.coin.count({
      where: { userId },
    });

    // Get coins by country
    const coinsByCountry = await prisma.coin.groupBy({
      by: ['country'],
      where: { userId },
      _count: { country: true },
    });

    // Get coins by year
    const coinsByYear = await prisma.coin.groupBy({
      by: ['year'],
      where: { userId },
      _count: { year: true },
    });

    // Get coins by metal
    const coinsByMetal = await prisma.coin.groupBy({
      by: ['metal'],
      where: { userId },
      _count: { metal: true },
    });

    // Get coins by grade
    const coinsByGrade = await prisma.coin.groupBy({
      by: ['grade'],
      where: { userId },
      _count: { grade: true },
    });

    const stats: CollectionStats = {
      totalCoins,
      byCountry: coinsByCountry.reduce((acc, item) => {
        if (item.country) {
          acc[item.country] = item._count.country;
        }
        return acc;
      }, {} as Record<string, number>),
      byYear: coinsByYear.reduce((acc, item) => {
        if (item.year) {
          acc[item.year.toString()] = item._count.year;
        }
        return acc;
      }, {} as Record<string, number>),
      byMetal: coinsByMetal.reduce((acc, item) => {
        if (item.metal) {
          acc[item.metal] = item._count.metal;
        }
        return acc;
      }, {} as Record<string, number>),
      byGrade: coinsByGrade.reduce((acc, item) => {
        if (item.grade) {
          acc[item.grade] = item._count.grade;
        }
        return acc;
      }, {} as Record<string, number>),
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}