import {prisma} from './neon.connect.js'

export class DashboardService {
  
  // סטטיסטיקות כלליות
  async getGeneralStats() {
    const [
      userCount,
      forceLocationCount,
      intelligenceCount,
      highRiskIntelligence,
      recentForceUpdates,
      recentIntelligence
    ] = await Promise.all([
      prisma.user.count(),
      prisma.forceLocation.count(),
      prisma.intelligence.count(),
      prisma.intelligence.count({ where: { riskLevel: 'גבוה' } }),
      prisma.forceLocation.count({
        where: {
          updateDate: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 שעות
          }
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
      users: userCount,
      forceLocations: forceLocationCount,
      intelligence: intelligenceCount,
      highRiskIntelligence,
      recent: {
        forceUpdates: recentForceUpdates,
        intelligence: recentIntelligence
      }
    };
  }
  
  // פעילות אחרונה
  async getRecentActivity(limit = 20) {
    const [recentForceLocations, recentIntelligence] = await Promise.all([
      prisma.forceLocation.findMany({
        include: {
          updatedBy: {
            select: { username: true, role: true }
          }
        },
        orderBy: { updateDate: 'desc' },
        take: Math.floor(limit / 2)
      }),
      prisma.intelligence.findMany({
        orderBy: { createdDate: 'desc' },
        take: Math.floor(limit / 2)
      })
    ]);
    
    // מיזוג ומיון לפי תאריך
    const activities = [
      ...recentForceLocations.map(loc => ({
        type: 'force_location',
        id: loc.id,
        coordinates: loc.coordinates,
        date: loc.updateDate,
        user: loc.updatedBy.username,
        userRole: loc.updatedBy.role
      })),
      ...recentIntelligence.map(intel => ({
        type: 'intelligence',
        id: intel.id,
        coordinates: intel.coordinates,
        date: intel.createdDate,
        riskLevel: intel.riskLevel,
        description: intel.description
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return activities.slice(0, limit);
  }
}
