import {
  AppDatabaseState,
  ClientTaskOrder,
  DesignerWorker,
  PricingPackage,
  PromptItem,
  PortfolioProject,
  ServiceItem,
  TemporaryOffer,
  Announcement,
  Testimonial,
  UsagePolicy,
  ContactSettings,
  TaskStatus,
} from '../types';
import { INITIAL_DATA } from '../data/initialData';
import { db, handleFirestoreError, OperationType } from './firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

const STORAGE_KEY = 'freelance_designer_studio_v2';
const AUTH_KEY = 'freelance_designer_auth_session';

function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Partial<T> {
  const clean: any = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) {
      clean[k] = v;
    }
  }
  return clean;
}

export interface AuthSession {
  role: 'guest' | 'admin' | 'designer';
  designerId?: string;
  name?: string;
  phone?: string;
  email?: string;
}

type Listener = (state: AppDatabaseState) => void;
const listeners: Set<Listener> = new Set();

export const subscribeToDatabase = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = (state: AppDatabaseState) => {
  listeners.forEach((listener) => {
    try {
      listener(state);
    } catch (err) {
      console.error('Error in storage listener:', err);
    }
  });
};

export const getDatabaseState = (): AppDatabaseState => {
  if (typeof window === 'undefined') return INITIAL_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
      return INITIAL_DATA;
    }
    const parsed = JSON.parse(raw) as AppDatabaseState;
    // merge in case new keys exist
    return {
      ...INITIAL_DATA,
      ...parsed,
      contact: { ...INITIAL_DATA.contact, ...parsed.contact },
    };
  } catch (e) {
    console.error('Failed to read from localStorage:', e);
    return INITIAL_DATA;
  }
};

export const saveDatabaseState = (state: AppDatabaseState): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    notifyListeners(state);
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

export const resetToInitialData = (): AppDatabaseState => {
  saveDatabaseState(INITIAL_DATA);
  return INITIAL_DATA;
};

// ---------------- AUTH SESSION ----------------

export const getAuthSession = (): AuthSession => {
  if (typeof window === 'undefined') return { role: 'guest' };
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return { role: 'guest' };
    return JSON.parse(raw);
  } catch {
    return { role: 'guest' };
  }
};

export const setAuthSession = (session: AuthSession): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
};

export const clearAuthSession = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
};

// ---------------- CRUD HELPERS ----------------

// Packages
export const addPackage = (pkg: Omit<PricingPackage, 'id'>): PricingPackage => {
  const state = getDatabaseState();
  const newPackage: PricingPackage = {
    ...pkg,
    id: 'pkg-' + Date.now(),
  };
  state.packages.push(newPackage);
  saveDatabaseState(state);
  return newPackage;
};

export const updatePackage = (id: string, updates: Partial<PricingPackage>): void => {
  const state = getDatabaseState();
  state.packages = state.packages.map((p) => (p.id === id ? { ...p, ...updates } : p));
  saveDatabaseState(state);
};

export const deletePackage = (id: string): void => {
  const state = getDatabaseState();
  state.packages = state.packages.filter((p) => p.id !== id);
  saveDatabaseState(state);
};

// Offers
export const addOffer = (offer: Omit<TemporaryOffer, 'id'>): TemporaryOffer => {
  const state = getDatabaseState();
  const newOffer: TemporaryOffer = {
    ...offer,
    id: 'off-' + Date.now(),
  };
  state.offers.push(newOffer);
  saveDatabaseState(state);
  return newOffer;
};

export const updateOffer = (id: string, updates: Partial<TemporaryOffer>): void => {
  const state = getDatabaseState();
  state.offers = state.offers.map((o) => (o.id === id ? { ...o, ...updates } : o));
  saveDatabaseState(state);
};

export const deleteOffer = (id: string): void => {
  const state = getDatabaseState();
  state.offers = state.offers.filter((o) => o.id !== id);
  saveDatabaseState(state);
};

// Announcements
export const addAnnouncement = (ann: Omit<Announcement, 'id' | 'createdAt'>): Announcement => {
  const state = getDatabaseState();
  const newAnn: Announcement = {
    ...ann,
    id: 'ann-' + Date.now(),
    createdAt: new Date().toISOString(),
  };
  state.announcements.unshift(newAnn);
  saveDatabaseState(state);
  return newAnn;
};

export const updateAnnouncement = (id: string, updates: Partial<Announcement>): void => {
  const state = getDatabaseState();
  state.announcements = state.announcements.map((a) => (a.id === id ? { ...a, ...updates } : a));
  saveDatabaseState(state);
};

export const deleteAnnouncement = (id: string): void => {
  const state = getDatabaseState();
  state.announcements = state.announcements.filter((a) => a.id !== id);
  saveDatabaseState(state);
};

// Content (Services, Portfolio, Testimonials, Policies, Contact)
export const updateService = (id: string, updates: Partial<ServiceItem>): void => {
  const state = getDatabaseState();
  state.services = state.services.map((s) => (s.id === id ? { ...s, ...updates } : s));
  saveDatabaseState(state);
};

export const addPortfolioProject = (proj: Omit<PortfolioProject, 'id'>): PortfolioProject => {
  const state = getDatabaseState();
  const newProj: PortfolioProject = {
    ...proj,
    id: 'port-' + Date.now(),
  };
  state.portfolio.unshift(newProj);
  saveDatabaseState(state);
  return newProj;
};

export const updatePortfolioProject = (id: string, updates: Partial<PortfolioProject>): void => {
  const state = getDatabaseState();
  state.portfolio = state.portfolio.map((p) => (p.id === id ? { ...p, ...updates } : p));
  saveDatabaseState(state);
};

export const deletePortfolioProject = (id: string): void => {
  const state = getDatabaseState();
  state.portfolio = state.portfolio.filter((p) => p.id !== id);
  saveDatabaseState(state);
};

export const addTestimonial = (test: Omit<Testimonial, 'id' | 'date'>): Testimonial => {
  const state = getDatabaseState();
  const newTest: Testimonial = {
    ...test,
    id: 'test-' + Date.now(),
    date: 'مؤخراً',
  };
  state.testimonials.unshift(newTest);
  saveDatabaseState(state);
  return newTest;
};

export const deleteTestimonial = (id: string): void => {
  const state = getDatabaseState();
  state.testimonials = state.testimonials.filter((t) => t.id !== id);
  saveDatabaseState(state);
};

export const updatePolicy = (id: string, updates: Partial<UsagePolicy>): void => {
  const state = getDatabaseState();
  state.policies = state.policies.map((p) => (p.id === id ? { ...p, ...updates } : p));
  saveDatabaseState(state);
};

export const updateContactSettings = (updates: Partial<ContactSettings>): void => {
  const state = getDatabaseState();
  state.contact = { ...state.contact, ...updates };
  saveDatabaseState(state);
};

// Prompts
export const addPrompt = (prompt: Omit<PromptItem, 'id' | 'createdAt'>): PromptItem => {
  const state = getDatabaseState();
  const newPrompt: PromptItem = {
    ...prompt,
    id: 'prm-' + Date.now(),
    createdAt: new Date().toISOString().split('T')[0],
  };
  state.prompts.unshift(newPrompt);
  saveDatabaseState(state);
  return newPrompt;
};

export const updatePrompt = (id: string, updates: Partial<PromptItem>): void => {
  const state = getDatabaseState();
  state.prompts = state.prompts.map((p) => (p.id === id ? { ...p, ...updates } : p));
  saveDatabaseState(state);
};

export const deletePrompt = (id: string): void => {
  const state = getDatabaseState();
  state.prompts = state.prompts.filter((p) => p.id !== id);
  saveDatabaseState(state);
};

// Designers / Workers
export const addDesigner = (designer: Omit<DesignerWorker, 'id' | 'createdAt' | 'completedTasksCount'>): DesignerWorker => {
  const state = getDatabaseState();
  const newDesigner: DesignerWorker = {
    ...designer,
    id: 'dsg-' + Date.now(),
    completedTasksCount: 0,
    createdAt: new Date().toISOString().split('T')[0],
  };
  state.designers.push(newDesigner);
  saveDatabaseState(state);
  return newDesigner;
};

export const updateDesigner = (id: string, updates: Partial<DesignerWorker>): void => {
  const state = getDatabaseState();
  state.designers = state.designers.map((d) => (d.id === id ? { ...d, ...updates } : d));
  saveDatabaseState(state);
};

export const deleteDesigner = (id: string): void => {
  const state = getDatabaseState();
  state.designers = state.designers.filter((d) => d.id !== id);
  // Unassign tasks from this designer
  state.tasks = state.tasks.map((t) =>
    t.assignedDesignerId === id ? { ...t, assignedDesignerId: undefined, assignedDesignerName: undefined } : t
  );
  saveDatabaseState(state);
};

// Tasks & Client Orders
export const createClientQuickOrder = (data: {
  clientName: string;
  clientPhone: string;
  serviceCategory: string;
  packageId?: string;
  title?: string;
  details: string;
  budget?: number;
}): ClientTaskOrder => {
  const state = getDatabaseState();
  const orderCount = state.tasks.length + 101;
  const newOrder: ClientTaskOrder = {
    id: 'tsk-' + Date.now(),
    orderNumber: `ORD-${new Date().getFullYear()}-${orderCount}`,
    clientName: data.clientName,
    clientPhone: data.clientPhone,
    serviceCategory: data.serviceCategory,
    packageId: data.packageId,
    title: data.title || `طلب خدمة: ${data.serviceCategory}`,
    details: data.details,
    budget: data.budget,
    deadline: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  state.tasks.unshift(newOrder);
  saveDatabaseState(state);

  // Sync to Firestore
  try {
    setDoc(doc(db, 'tasks', newOrder.id), sanitizeForFirestore(newOrder)).catch((err) => {
      handleFirestoreError(err, OperationType.CREATE, `tasks/${newOrder.id}`);
    });
  } catch (err) {
    console.error('Error initiating Firestore write:', err);
  }

  return newOrder;
};

export const createAdminTask = (task: Omit<ClientTaskOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): ClientTaskOrder => {
  const state = getDatabaseState();
  const orderCount = state.tasks.length + 101;
  const newTask: ClientTaskOrder = {
    ...task,
    id: 'tsk-' + Date.now(),
    orderNumber: `ORD-${new Date().getFullYear()}-${orderCount}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  state.tasks.unshift(newTask);
  saveDatabaseState(state);

  // Sync to Firestore
  try {
    setDoc(doc(db, 'tasks', newTask.id), sanitizeForFirestore(newTask)).catch((err) => {
      handleFirestoreError(err, OperationType.CREATE, `tasks/${newTask.id}`);
    });
  } catch (err) {
    console.error('Error initiating Firestore task write:', err);
  }

  return newTask;
};

export const updateTaskStatus = (
  taskId: string,
  newStatus: TaskStatus,
  options?: { deliverableUrl?: string; designerNotes?: string; adminNotes?: string }
): void => {
  const state = getDatabaseState();
  let updatedTask: ClientTaskOrder | undefined;

  state.tasks = state.tasks.map((t) => {
    if (t.id !== taskId) return t;
    const updated: ClientTaskOrder = {
      ...t,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      ...(options?.deliverableUrl ? { deliverableUrl: options.deliverableUrl } : {}),
      ...(options?.designerNotes ? { designerNotes: options.designerNotes } : {}),
      ...(options?.adminNotes ? { adminNotes: options.adminNotes } : {}),
    };
    updatedTask = updated;
    return updated;
  });

  // If completed, increment designer's completedTasksCount
  if (newStatus === 'completed') {
    const task = state.tasks.find((t) => t.id === taskId);
    if (task?.assignedDesignerId) {
      state.designers = state.designers.map((d) =>
        d.id === task.assignedDesignerId ? { ...d, completedTasksCount: d.completedTasksCount + 1 } : d
      );
    }
  }

  saveDatabaseState(state);

  // Sync update to Firestore
  if (updatedTask) {
    try {
      const updates = sanitizeForFirestore({
        status: newStatus,
        updatedAt: updatedTask.updatedAt,
        ...(options?.deliverableUrl ? { deliverableUrl: options.deliverableUrl } : {}),
        ...(options?.designerNotes ? { designerNotes: options.designerNotes } : {}),
        ...(options?.adminNotes ? { adminNotes: options.adminNotes } : {}),
      });
      updateDoc(doc(db, 'tasks', taskId), updates).catch((err) => {
        handleFirestoreError(err, OperationType.UPDATE, `tasks/${taskId}`);
      });
    } catch (err) {
      console.error('Error updating Firestore task:', err);
    }
  }
};

export const assignTaskDesigner = (taskId: string, designerId: string): void => {
  const state = getDatabaseState();
  const designer = state.designers.find((d) => d.id === designerId);
  const now = new Date().toISOString();

  state.tasks = state.tasks.map((t) =>
    t.id === taskId
      ? {
          ...t,
          assignedDesignerId: designerId,
          assignedDesignerName: designer ? designer.name : 'غير محدد',
          status: t.status === 'new' ? 'in_progress' : t.status,
          updatedAt: now,
        }
      : t
  );
  saveDatabaseState(state);

  // Sync assignment to Firestore
  try {
    const updates = sanitizeForFirestore({
      assignedDesignerId: designerId,
      assignedDesignerName: designer ? designer.name : 'غير محدد',
      updatedAt: now,
    });
    updateDoc(doc(db, 'tasks', taskId), updates).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `tasks/${taskId}`);
    });
  } catch (err) {
    console.error('Error assigning designer in Firestore:', err);
  }
};

export const deleteTask = (taskId: string): void => {
  const state = getDatabaseState();
  state.tasks = state.tasks.filter((t) => t.id !== taskId);
  saveDatabaseState(state);

  // Delete from Firestore
  try {
    deleteDoc(doc(db, 'tasks', taskId)).catch((err) => {
      handleFirestoreError(err, OperationType.DELETE, `tasks/${taskId}`);
    });
  } catch (err) {
    console.error('Error deleting task in Firestore:', err);
  }
};

// ---------------- FIRESTORE REAL-TIME SYNCHRONIZATION ----------------
if (typeof window !== 'undefined') {
  try {
    const tasksCollectionRef = collection(db, 'tasks');
    onSnapshot(
      tasksCollectionRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const liveTasks: ClientTaskOrder[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as ClientTaskOrder;
            if (data && data.id) {
              liveTasks.push(data);
            }
          });

          if (liveTasks.length > 0) {
            const currentState = getDatabaseState();
            const taskMap = new Map<string, ClientTaskOrder>();
            // Keep local fallback tasks
            currentState.tasks.forEach((t) => taskMap.set(t.id, t));
            // Layer on Firestore live tasks
            liveTasks.forEach((t) => taskMap.set(t.id, t));

            const merged = Array.from(taskMap.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            currentState.tasks = merged;
            saveDatabaseState(currentState);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'tasks');
      }
    );
  } catch (e) {
    console.warn('Real-time tasks sync could not be initialized:', e);
  }
}

// ---------------- SMART PROMPT AUTO-FORMATTER ----------------

export interface FormattedPromptResult {
  formattedEnglish: string;
  structuredArabic: {
    subject: string;
    artStyle: string;
    lighting: string;
    cameraAndComposition: string;
    aspectRatio: string;
    technicalFlags: string;
  };
  warnings: string[];
  score: number; // 0 - 100
}

/**
 * Intelligent prompt structuring & validation algorithm
 * Parses raw prompts, formats into clean sections, and checks for missing essentials
 */
export const autoFormatPrompt = (rawInput: string): FormattedPromptResult => {
  const warnings: string[] = [];
  const text = rawInput.trim();

  // Check aspect ratio
  const arMatch = text.match(/--ar\s+([0-9]+:[0-9]+)/i);
  let aspectRatio = arMatch ? arMatch[1] : '';
  if (!aspectRatio) {
    if (text.toLowerCase().includes('portrait')) aspectRatio = '3:4';
    else if (text.toLowerCase().includes('landscape') || text.toLowerCase().includes('wallpaper')) aspectRatio = '16:9';
    else if (text.toLowerCase().includes('square') || text.toLowerCase().includes('instagram post')) aspectRatio = '1:1';
    else if (text.toLowerCase().includes('reel') || text.toLowerCase().includes('story')) aspectRatio = '9:16';
    else {
      aspectRatio = '16:9';
      warnings.push('لم يتم تحديد نسبة الأبعاد (--ar) في النص الأصلي؛ تم تعيين 16:9 كقيمة قياسية موصى بها.');
    }
  }

  // Check lighting
  const lightingKeywords = ['lighting', 'light', 'moody', 'cinematic', 'volumetric', 'rim light', 'soft glow', 'golden hour', 'studio lighting', 'إضاءة', 'نور'];
  const hasLighting = lightingKeywords.some((k) => text.toLowerCase().includes(k.toLowerCase()));
  if (!hasLighting) {
    warnings.push('ينقص البرومت توصيف أسلوب الإضاءة (مثل: cinematic rim lighting أو soft studio lighting) لإعطاء عمق للمشهد.');
  }

  // Check style / medium
  const styleKeywords = ['vector', 'photo', 'photorealistic', '3d', 'render', 'illustration', 'octane', 'unreal engine', 'minimalist', 'oil painting', 'watercolor', 'تصوير', 'فيكتور', 'رسم'];
  const hasStyle = styleKeywords.some((k) => text.toLowerCase().includes(k.toLowerCase()));
  if (!hasStyle) {
    warnings.push('لم يتم تحديد الأسلوب الفني بدقة (مثال: Photorealistic / 3D Octane Render / Flat Vector).');
  }

  // Check length
  const wordCount = text.split(/\s+/).length;
  if (wordCount < 6) {
    warnings.push('البرومت قصير جداً (أقل من 6 كلمات)، يُفضل إضافة تفاصيل محددة عن الخلفية والملمس والألوان.');
  }

  // Build structured pieces
  const subject = text.replace(/--[a-z0-9\s:]+/gi, '').trim();
  const artStyle = hasStyle ? 'نمط احترافي محدد من البرومت' : 'Photorealistic Commercial Style';
  const lighting = hasLighting ? 'إضاءة محددة داخل النص' : 'Studio Rim Lighting & Ambient Soft Glow';
  const cameraAndComposition = text.toLowerCase().includes('shot') || text.toLowerCase().includes('angle') || text.toLowerCase().includes('close-up')
    ? 'زاوية مخصصة محددة في البرومت'
    : 'Hero Centered Framing, Shallow Depth of Field';
  const technicalFlags = text.includes('--v') ? text.match(/--v\s+[0-9.]+/i)?.[0] || '--v 6.1' : '--v 6.1 --style raw';

  // Construct polished final english prompt
  let cleanPrompt = text;
  if (!cleanPrompt.includes('--ar')) {
    cleanPrompt += ` --ar ${aspectRatio}`;
  }
  if (!cleanPrompt.includes('--v')) {
    cleanPrompt += ' --v 6.1';
  }
  if (!cleanPrompt.includes('8k') && !cleanPrompt.includes('photorealistic') && hasStyle) {
    cleanPrompt = cleanPrompt.replace(/--ar/, 'photorealistic 8k, award winning composition --ar');
  }

  const score = Math.max(30, 100 - warnings.length * 20);

  return {
    formattedEnglish: cleanPrompt,
    structuredArabic: {
      subject,
      artStyle,
      lighting,
      cameraAndComposition,
      aspectRatio,
      technicalFlags,
    },
    warnings,
    score,
  };
};
