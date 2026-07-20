import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signupSchema = z.object({
  // Admin fields
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  // Company fields
  companyName: z.string().min(1, 'Company name is required'),
  companyAddress: z.string().optional().default(''),
  companyWebsite: z.string().optional(),
  companyEmail: z.string().email().optional().or(z.literal('')),
  directorName: z.string().optional(),
  certificatePrefix: z.string().min(1).max(6).optional().default('COMP'),
  // Base64 data URLs for logo and signature (optional)
  logoData: z.string().optional(),
  signatureData: z.string().optional(),
});

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.errors,
      });
      return;
    }

    const { email, password } = validation.data;

    const admin = await prisma.admin.findUnique({
      where: { email },
      include: { company: true },
    });
    if (!admin) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name, companyId: admin.companyId },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
    );

    await prisma.activityLog.create({
      data: {
        action: 'login',
        details: `Admin ${admin.email} logged in`,
        adminId: admin.id,
        companyId: admin.companyId,
      },
    });

    res.json({
      success: true,
      data: {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          companyId: admin.companyId,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const validation = signupSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.errors,
      });
      return;
    }

    const data = validation.data;

    // Check if email already exists
    const existingAdmin = await prisma.admin.findUnique({ where: { email: data.email } });
    if (existingAdmin) {
      res.status(409).json({ success: false, message: 'An account with this email already exists' });
      return;
    }

    // Create company
    const company = await prisma.company.create({
      data: {
        name: data.companyName,
        address: data.companyAddress || '',
        website: data.companyWebsite || null,
        email: data.companyEmail || null,
        directorName: data.directorName || null,
        certificatePrefix: data.certificatePrefix?.toUpperCase() || 'COMP',
        logoPath: data.logoData || null,
        signaturePath: data.signatureData || null,
      },
    });

    // Create admin linked to company
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const admin = await prisma.admin.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        companyId: company.id,
      },
    });

    // Issue JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name, companyId: company.id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
    );

    await prisma.activityLog.create({
      data: {
        action: 'signup',
        details: `New company "${company.name}" registered by ${admin.email}`,
        adminId: admin.id,
        companyId: company.id,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          companyId: company.id,
        },
      },
      message: 'Account created successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getMe(req: any, res: Response): Promise<void> {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.id },
      select: { id: true, email: true, name: true, companyId: true, createdAt: true },
    });

    if (!admin) {
      res.status(404).json({ success: false, message: 'Admin not found' });
      return;
    }

    res.json({ success: true, data: admin });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
