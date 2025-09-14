import {prisma} from './neon.connect.js'

export class ForceLocationService {
  
  // קבלת כל מיקומי הכוחות
  async getAllForceLocations(filters = {}) {
    const { updatedById, fromDate, toDate, limit = 100 } = filters;
    
    const where = {};
    
    if (updatedById) {
      where.updatedById = parseInt(updatedById);
    }
    
    if (fromDate || toDate) {
      where.updateDate = {};
      if (fromDate) where.updateDate.gte = new Date(fromDate);
      if (toDate) where.updateDate.lte = new Date(toDate);
    }
    
    return await prisma.forceLocation.findMany({
      where,
      include: {
        updatedBy: {
          select: {
            id: true,
            username: true,
            role: true
          }
        }
      },
      orderBy: { updateDate: 'desc' },
      take: parseInt(limit)
    });
  }
  

  
  // קבלת מיקום לפי ID
  async getForceLocationById(id) {
    const location = await prisma.forceLocation.findUnique({
      where: { id: parseInt(id) },
      include: {
        updatedBy: {
          select: {
            id: true,
            username: true,
            role: true
          }
        }
      }
    });
    
    if (!location) {
      throw new Error('מיקום כוח לא נמצא');
    }
    
    return location;
  }
  
  // יצירת מיקום חדש
  async createForceLocation(longitudePoint, latitudePoint, updatedById,name) {
    // Validation
    if (!longitudePoint || !latitudePoint) {
      throw new Error('נקודות אורך ורוחב חובה');
    }
    
    if (!updatedById) {
      throw new Error('מזהה מעדכן חסר');
    }
    
    // המרה ל-Int ובדיקה
    const numericUpdatedById = parseInt(updatedById);
    if (isNaN(numericUpdatedById)) {
      throw new Error(`מזהה מעדכן לא תקין: ${updatedById}`);
    }
    
    console.log(`🔍 יוצר מיקום כוח עם: longitude=${longitudePoint}, latitude=${latitudePoint}, updatedById=${numericUpdatedById}`);

    return await prisma.forceLocation.create({
      data: {
        LongitudePoint: longitudePoint.toString(),
        latitudePoint: latitudePoint.toString(),
        updatedById: numericUpdatedById
        ,name:name
      },
      include: {
        updatedBy: {
          select: {
            id: true,
            username: true,
            role: true
          }
        }
      }
    });
  }
  
  // עדכון מיקום
  async updateForceLocation(id, longitudePoint, latitudePoint, updatedById,name) {
    // Validation
    if (!longitudePoint || !latitudePoint) {
      throw new Error('נקודות אורך ורוחב חובה');
    }
    
    const numericUpdatedById = parseInt(updatedById);
    if (isNaN(numericUpdatedById)) {
      throw new Error(`מזהה מעדכן לא תקין: ${updatedById}`);
    }
    
    return await prisma.forceLocation.update({
      where: { id: parseInt(id) },
      data: {
        LongitudePoint: longitudePoint.toString(),
        latitudePoint: latitudePoint.toString(),
        updateDate: new Date(),
        updatedById: numericUpdatedById,
        name:name
      },
      include: {
        updatedBy: {
          select: {
            id: true,
            username: true,
            role: true
          }
        }
      }
    });
  }
  
  // מחיקת מיקום
  async deleteForceLocation(id) {
    await prisma.forceLocation.delete({
      where: { id: parseInt(id) }
    });
    
    return { success: true, message: 'מיקום כוח נמחק בהצלחה' };
  }
  
  // קבלת המיקומים האחרונים
  async getLatestForceLocations(limit = 10) {
    return await prisma.forceLocation.findMany({
      include: {
        updatedBy: {
          select: {
            id: true,
            username: true,
            role: true
          }
        }
      },
      orderBy: { updateDate: 'desc' },
      take: parseInt(limit)
    });
  }
  
  // חיפוש לפי אזור (רדיוס)
  async getForceLocationsByRadius(centerLongitude, centerLatitude, radiusKm = 10) {
    // חישוב פשוט לדוגמה - לייצור תצטרך חישוב גיאוגרפי מדויק יותר
    const longitudeRange = radiusKm * 0.01; // קירוב גס
    const latitudeRange = radiusKm * 0.01;
    
    const minLongitude = parseFloat(centerLongitude) - longitudeRange;
    const maxLongitude = parseFloat(centerLongitude) + longitudeRange;
    const minLatitude = parseFloat(centerLatitude) - latitudeRange;
    const maxLatitude = parseFloat(centerLatitude) + latitudeRange;
    
    return await prisma.forceLocation.findMany({
      where: {
        AND: [
          { LongitudePoint: { gte: minLongitude.toString() } },
          { LongitudePoint: { lte: maxLongitude.toString() } },
          { latitudePoint: { gte: minLatitude.toString() } },
          { latitudePoint: { lte: maxLatitude.toString() } }
        ]
      },
      include: {
        updatedBy: {
          select: {
            id: true,
            username: true,
            role: true
          }
        }
      },
      orderBy: { updateDate: 'desc' }
    });
  }
  
  // קבלת סטטיסטיקות מיקומים
  async getLocationStats() {
    const [total, recent, byUser] = await Promise.all([
      prisma.forceLocation.count(),
      prisma.forceLocation.count({
        where: {
          updateDate: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 שעות
          }
        }
      }),
      prisma.forceLocation.groupBy({
        by: ['updatedById'],
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        }
      })
    ]);
    
    return {
      total,
      recentCount: recent,
      byUser
    };
  }
}