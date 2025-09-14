import {prisma} from './neon.connect.js'

export class IntelligenceService {
  
  // קבלת כל נתוני המודיעין
  async getAllIntelligence(filters = {}) {
    const { riskLevel, fromDate, toDate, limit = 100 } = filters;
    
    const where = {};
    
    if (riskLevel) {
      where.riskLevel = riskLevel;
    }
    
    if (fromDate || toDate) {
      where.createdDate = {};
      if (fromDate) where.createdDate.gte = new Date(fromDate);
      if (toDate) where.createdDate.lte = new Date(toDate);
    }
    
    return await prisma.intelligence.findMany({
      where,
      orderBy: { createdDate: 'desc' },
      take: parseInt(limit)
    });
  }
  
  // קבלת נתון מודיעין לפי ID
  async getIntelligenceById(id) {
    const intelligence = await prisma.intelligence.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!intelligence) {
  throw new Error('Intelligence record not found');
    }
    
    return intelligence;
  }
  
  // יצירת נתון מודיעין חדש
  async createIntelligence(longitudePoint, latitudePoint, riskLevel, description, name) {
    // Validation
    if (!longitudePoint || !latitudePoint) {
  throw new Error('Longitude and latitude points are required');
    }
    
    if (!riskLevel || !description) {
  throw new Error('Risk level and description are required');
    }
    
    // Validation לרמת סיכון
    const validRiskLevels = ['low', 'medium', 'height', '1', '2', '3', '4', '5'];
    if (!validRiskLevels.includes(riskLevel)) {
  throw new Error(`Invalid risk level. Valid levels: ${validRiskLevels.join(', ')}`);
    }
    
    console.log(`🎯 יוצר נתון מודיעין עם: longitude=${longitudePoint}, latitude=${latitudePoint}, risk=${riskLevel} name=${name
    }`);

    return await prisma.intelligence.create({
      data: {
        LongitudePoint: longitudePoint.toString(),
        latitudePoint: latitudePoint.toString(),
        riskLevel,
        description,
        name
      }
    });
  }
  
  // עדכון נתון מודיעין
  async updateIntelligence(id, longitudePoint, latitudePoint, riskLevel, description) {
    // Validation
    if (!longitudePoint || !latitudePoint) {
  throw new Error('Longitude and latitude points are required');
    }
    
    if (!riskLevel || !description) {
  throw new Error('Risk level and description are required');
    }
    
    const validRiskLevels = ['נמוך', 'בינוני', 'גבוה', '1', '2', '3', '4', '5'];
    if (!validRiskLevels.includes(riskLevel)) {
  throw new Error(`Invalid risk level. Valid levels: ${validRiskLevels.join(', ')}`);
    }
    
    return await prisma.intelligence.update({
      where: { id: parseInt(id) },
      data: {
        LongitudePoint: longitudePoint.toString(),
        latitudePoint: latitudePoint.toString(),
        riskLevel,
        description
      }
    });
  }
  
  // מחיקת נתון מודיעין
  async deleteIntelligence(id) {
    await prisma.intelligence.delete({
      where: { id: parseInt(id) }
    });
    
  return { success: true, message: 'Intelligence record deleted successfully' };
  }
  
  // קבלת מודיעין לפי רמת סיכון
  async getIntelligenceByRiskLevel(riskLevel) {
    return await prisma.intelligence.findMany({
      where: { riskLevel },
      orderBy: { createdDate: 'desc' }
    });
  }
  
  // חיפוש מודיעין באזור מסוים
  async getIntelligenceByRadius(centerLongitude, centerLatitude, radiusKm = 10) {
    // חישוב פשוט לדוגמה - לייצור תצטרך חישוב גיאוגרפי מדויק יותר
    const longitudeRange = radiusKm * 0.01; // קירוב גס
    const latitudeRange = radiusKm * 0.01;
    
    const minLongitude = parseFloat(centerLongitude) - longitudeRange;
    const maxLongitude = parseFloat(centerLongitude) + longitudeRange;
    const minLatitude = parseFloat(centerLatitude) - latitudeRange;
    const maxLatitude = parseFloat(centerLatitude) + latitudeRange;
    
    return await prisma.intelligence.findMany({
      where: {
        AND: [
          { LongitudePoint: { gte: minLongitude.toString() } },
          { LongitudePoint: { lte: maxLongitude.toString() } },
          { latitudePoint: { gte: minLatitude.toString() } },
          { latitudePoint: { lte: maxLatitude.toString() } }
        ]
      },
      orderBy: { createdDate: 'desc' }
    });
  }
  
  // מודיעין דחוף - רק רמת סיכון גבוהה
  async getUrgentIntelligence() {
    return await prisma.intelligence.findMany({
      where: {
        OR: [
          { riskLevel: 'גבוה' },
          { riskLevel: '4' },
          { riskLevel: '5' }
        ]
      },
      orderBy: { createdDate: 'desc' }
    });
  }
  
  // קבלת סטטיסטיקות מודיעין
  async getIntelligenceStats() {
    const [total, highRisk, mediumRisk, lowRisk, recent] = await Promise.all([
      prisma.intelligence.count(),
      prisma.intelligence.count({ 
        where: { 
          OR: [
            { riskLevel: 'גבוה' },
            { riskLevel: '4' },
            { riskLevel: '5' }
          ]
        } 
      }),
      prisma.intelligence.count({ 
        where: { 
          OR: [
            { riskLevel: 'בינוני' },
            { riskLevel: '3' }
          ]
        } 
      }),
      prisma.intelligence.count({ 
        where: { 
          OR: [
            { riskLevel: 'נמוך' },
            { riskLevel: '1' },
            { riskLevel: '2' }
          ]
        } 
      }),
      prisma.intelligence.count({
        where: {
          createdDate: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 שעות
          }
        }
      })
    ]);
    
    return {
      total,
      byRiskLevel: {
        high: highRisk,
        medium: mediumRisk,
        low: lowRisk
      },
      recentCount: recent
    };
  }
  
  // חיפוש לפי טקסט בתיאור
  async searchIntelligenceByDescription(searchTerm) {
    return await prisma.intelligence.findMany({
      where: {
        description: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      },
      orderBy: { createdDate: 'desc' }
    });
  }
}