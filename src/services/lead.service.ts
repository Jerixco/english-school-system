import { prisma } from '@/lib/prisma'
import { LeadStatus } from '@prisma/client'

export interface CreateLeadInput {
  name: string
  email: string
  phone?: string
  source?: string
  notes?: string
}

export interface UpdateLeadInput {
  status?: LeadStatus
  notes?: string
  assignedTo?: string
}

export class LeadService {
  /**
   * Lista os leads cadastrados, com filtro opcional por status.
   */
  async listLeads(options: { status?: LeadStatus } = {}) {
    const where = options.status ? { status: options.status } : {}

    return prisma.lead.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  /**
   * Cria um novo lead no sistema.
   */
  async createLead(data: CreateLeadInput) {
    return prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        source: data.source,
        notes: data.notes,
      },
    })
  }

  /**
   * Atualiza as informações ou status de um lead existente.
   */
  async updateLead(id: string, data: UpdateLeadInput) {
    return prisma.lead.update({
      where: { id },
      data,
    })
  }

  /**
   * Remove um lead do sistema.
   */
  async deleteLead(id: string) {
    return prisma.lead.delete({
      where: { id },
    })
  }
}
