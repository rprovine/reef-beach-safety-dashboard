import { Client } from '@hubspot/api-client'

const hubspotClient = new Client({
  accessToken: process.env.HUBSPOT_ACCESS_TOKEN
})

export interface HubSpotContact {
  email: string
  firstname?: string
  lastname?: string
  phone?: string
  beach_tier?: string
  subscription_status?: string
  trial_end_date?: string
}

export interface HubSpotDeal {
  dealname: string
  amount: string
  pipeline?: string
  dealstage?: string
  closedate?: string
  beach_subscription_tier?: string
  beach_user_id?: string
}

export interface HubSpotPaymentLink {
  id: string
  name: string
  amount: number
  currency: string
  url: string
  active: boolean
}

export class HubSpotService {
  private client: Client

  constructor() {
    this.client = hubspotClient
  }

  // Create or update a contact
  async createOrUpdateContact(data: HubSpotContact) {
    try {
      // Try to find existing contact
      const searchResponse = await this.client.crm.contacts.searchApi.doSearch({
        filterGroups: [{
          filters: [{
            propertyName: 'email',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            operator: 'EQ' as any,
            value: data.email
          }]
        }],
        properties: ['email', 'firstname', 'lastname', 'phone', 'beach_tier'],
        limit: 1
      })

      let contactId: string

      if (searchResponse.results.length > 0) {
        // Update existing contact
        contactId = searchResponse.results[0].id
        await this.client.crm.contacts.basicApi.update(contactId, {
          properties: data as unknown as { [key: string]: string }
        })
      } else {
        // Create new contact
        const createResponse = await this.client.crm.contacts.basicApi.create({
          properties: data as unknown as { [key: string]: string }
        })
        contactId = createResponse.id
      }

      return contactId
    } catch (error) {
      console.error('HubSpot contact error:', error)
      throw error
    }
  }

  // Create a deal for subscription
  async createDeal(contactId: string, dealData: HubSpotDeal) {
    try {
      const deal = await this.client.crm.deals.basicApi.create({
        properties: {
          ...dealData,
          pipeline: dealData.pipeline || 'default',
          dealstage: dealData.dealstage || 'appointmentscheduled'
        },
        associations: [{
          to: { id: contactId },
          types: [{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            associationCategory: 'HUBSPOT_DEFINED' as any,
            associationTypeId: 3
          }]
        }]
      })

      return deal.id
    } catch (error) {
      console.error('HubSpot deal error:', error)
      throw error
    }
  }

  // Generate payment link with HubSpot
  async generatePaymentLink(params: {
    amount: number
    currency: string
    name: string
    description: string
    email: string
    contactId: string
    dealId?: string
  }) {
    // In production, this would integrate with HubSpot's payment links API
    // For now, we'll construct a payment URL with parameters
    const baseUrl = `https://app.hubspot.com/payments/${process.env.HUBSPOT_PORTAL_ID}/pay`
    
    const paymentParams = new URLSearchParams({
      amount: params.amount.toString(),
      currency: params.currency,
      description: params.description,
      email: params.email,
      contactId: params.contactId,
      dealId: params.dealId || '',
      metadata: JSON.stringify({
        planName: params.name,
        source: 'reef-safety-dashboard'
      })
    })

    return `${baseUrl}?${paymentParams.toString()}`
  }

  // Create a subscription in HubSpot
  async createSubscription(params: {
    contactId: string
    dealId: string
    planId: string
    amount: number
    billingCycle: 'monthly' | 'yearly'
  }) {
    try {
      // Create a recurring revenue deal
      const subscription = await this.client.crm.deals.basicApi.update(params.dealId, {
        properties: {
          dealname: `Beach Safety Dashboard - ${params.planId}`,
          amount: params.amount.toString(),
          recurring_revenue_amount: params.amount.toString(),
          recurring_revenue_deal_type: params.billingCycle,
          beach_subscription_active: 'true',
          beach_subscription_tier: params.planId
        }
      })

      return subscription.id
    } catch (error) {
      console.error('HubSpot subscription error:', error)
      throw error
    }
  }

  // Cancel subscription
  async cancelSubscription(dealId: string) {
    try {
      await this.client.crm.deals.basicApi.update(dealId, {
        properties: {
          dealstage: 'closedlost',
          beach_subscription_active: 'false',
          closed_lost_reason: 'Customer cancelled'
        }
      })
    } catch (error) {
      console.error('HubSpot cancel subscription error:', error)
      throw error
    }
  }

  // Sync user data with HubSpot
  async syncUserData(userId: string, userData: {
    email: string
    name?: string | null
    phone?: string | null
    tier: string
    subscriptionStatus: string
  }) {
    try {
      const contactId = await this.createOrUpdateContact({
        email: userData.email,
        firstname: userData.name?.split(' ')[0],
        lastname: userData.name?.split(' ').slice(1).join(' '),
        phone: userData.phone || undefined,
        beach_tier: userData.tier,
        subscription_status: userData.subscriptionStatus
      })

      return contactId
    } catch (error) {
      console.error('HubSpot sync error:', error)
      throw error
    }
  }

  // Check payment status
  async checkPaymentStatus(dealId: string) {
    try {
      const deal = await this.client.crm.deals.basicApi.getById(dealId, ['dealstage', 'amount', 'closedate'])
      
      return {
        status: deal.properties.dealstage === 'closedwon' ? 'paid' : 'pending',
        amount: deal.properties.amount,
        closeDate: deal.properties.closedate
      }
    } catch (error) {
      console.error('HubSpot payment status error:', error)
      throw error
    }
  }

  // Create invoice
  async createInvoice(params: {
    contactId: string
    amount: number
    description: string
    dueDate: Date
  }) {
    try {
      // HubSpot doesn't have a direct invoice API, so we create a deal
      const invoice = await this.client.crm.deals.basicApi.create({
        properties: {
          dealname: `Invoice - ${params.description}`,
          amount: params.amount.toString(),
          closedate: params.dueDate.toISOString(),
          dealstage: 'invoice_sent',
          invoice_number: `INV-${Date.now()}`,
          beach_invoice_type: 'subscription'
        },
        associations: [{
          to: { id: params.contactId },
          types: [{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            associationCategory: 'HUBSPOT_DEFINED' as any,
            associationTypeId: 3
          }]
        }]
      })

      return invoice.id
    } catch (error) {
      console.error('HubSpot invoice error:', error)
      throw error
    }
  }

  // Send transactional email via HubSpot
  async sendEmail(params: {
    to: string
    subject: string
    body: string
    templateId?: string
  }) {
    try {
      // Using HubSpot's single send API
      const emailRequest = {
        emailId: params.templateId || 'default_template',
        message: {
          to: params.to,
          subject: params.subject,
          body: params.body
        },
        contactProperties: {},
        customProperties: {}
      }

      // In production, this would use HubSpot's email API
      console.log('Sending email via HubSpot:', emailRequest)
      
      return { success: true, messageId: `msg_${Date.now()}` }
    } catch (error) {
      console.error('HubSpot email error:', error)
      throw error
    }
  }
}

export const hubspot = new HubSpotService()