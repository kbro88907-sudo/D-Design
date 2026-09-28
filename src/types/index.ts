export type ServiceCategory =
  | 'social_media'
  | 'menu_design'
  | 'poster_design'
  | 'motion_graphics'
  | 'ebook_summaries'
  | 'barcode_design'
  | 'reels_editing'
  | 'brand_identity'
  | 'packaging_templates'
  | 'wedding_invitations'
  | 'custom_requests';

export interface ServiceItem {
  id: string;
  category: ServiceCategory;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  imageUrl: string;
  startingPrice: number;
  deliveryDays: string;
  features: string[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  serviceCategory: ServiceCategory;
  imageUrl: string;
  additionalImages?: string[];
  clientName: string;
  description: string;
  tags: string[];
  toolsUsed: string[];
  year: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  badge?: string;
  originalPrice: number;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  orderIndex: number;
  isActive: boolean;
}

export interface TemporaryOffer {
  id: string;
  title: string;
  targetType: 'package' | 'service' | 'general';
  targetId?: string;
  discountPercentage?: number;
  specialPrice?: number;
  startDate: string;
  endDate: string; // ISO date string
  isActive: boolean;
  bannerBadgeText: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  avatarUrl: string;
  rating: number;
  comment: string;
  projectType: string;
  date: string;
}

export interface UsagePolicy {
  id: string;
  key: 'revisions' | 'payments' | 'deadlines' | 'intellectual_property' | 'refunds' | 'privacy' | string;
  title: string;
  icon: string;
  summary: string;
  points: string[];
}

export interface PromptItem {
  id: string;
  title: string;
  category: string;
  promptText: string;
  arabicGuide: string;
  tags: string[];
  recommendedModel: string;
  aspectRatio: string;
  createdAt: string;
}

export type UserRole = 'admin' | 'designer';

export interface DesignerWorker {
  id: string;
  name: string;
  phone: string;
  email?: string;
  password?: string;
  isActive: boolean;
  specialties: string[];
  completedTasksCount: number;
  createdAt: string;
}

export type TaskStatus = 'new' | 'in_progress' | 'delivered' | 'completed' | 'cancelled';

export interface ClientTaskOrder {
  id: string;
  orderNumber: string;
  clientName: string;
  clientPhone: string;
  serviceCategory: string;
  packageId?: string;
  title: string;
  details: string;
  budget?: number;
  deadline: string;
  assignedDesignerId?: string;
  assignedDesignerName?: string;
  status: TaskStatus;
  attachmentUrls?: string[];
  deliverableUrl?: string;
  designerNotes?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactSettings {
  primaryPhone: string;
  whatsappNumber: string;
  whatsappMessage: string;
  email: string;
  workingHours: string;
  location: string;
}

export interface AppDatabaseState {
  services: ServiceItem[];
  portfolio: PortfolioProject[];
  packages: PricingPackage[];
  offers: TemporaryOffer[];
  announcements: Announcement[];
  testimonials: Testimonial[];
  policies: UsagePolicy[];
  prompts: PromptItem[];
  designers: DesignerWorker[];
  tasks: ClientTaskOrder[];
  contact: ContactSettings;
}
