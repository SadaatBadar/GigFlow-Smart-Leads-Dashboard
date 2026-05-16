import mongoose from 'mongoose';
import { Response, NextFunction } from 'express';
import { Parser } from 'json2csv';
import Lead from '../models/Lead';
import { AuthRequest, LeadFilters, LeadStatus, LeadSource } from '../types';
import { createError } from '../middleware/errorHandler';

const LIMIT = 10;

export const getLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sort = 'latest',
      page = '1',
    } = req.query as Record<string, string>;

    const filters: Record<string, unknown> = {};

    if (status && ['New', 'Contacted', 'Qualified', 'Lost'].includes(status)) {
      filters.status = status as LeadStatus;
    }

    if (source && ['Website', 'Instagram', 'Referral'].includes(source)) {
      filters.source = source as LeadSource;
    }

    if (search && search.trim()) {
      filters.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Sales users only see their own leads
    if (req.user?.role === 'sales') {
      filters.createdBy = req.user.id;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const skip = (pageNum - 1) * LIMIT;
    const sortOrder = sort === 'oldest' ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(filters)
        .populate('createdBy', 'name email')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(LIMIT)
        .lean(),
      Lead.countDocuments(filters),
    ]);

    const totalPages = Math.ceil(total / LIMIT);

    res.status(200).json({
      success: true,
      data: leads,
      meta: {
        total,
        page: pageNum,
        limit: LIMIT,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');

    if (!lead) return next(createError('Lead not found', 404));

    if (
      req.user?.role === 'sales' &&
      lead.createdBy.toString() !== req.user.id
    ) {
      return next(createError('Not authorized to view this lead', 403));
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

export const createLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.create({ ...req.body, createdBy: req.user?.id });
    res.status(201).json({ success: true, message: 'Lead created', data: lead });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return next(createError('Lead not found', 404));

    if (
      req.user?.role === 'sales' &&
      lead.createdBy.toString() !== req.user.id
    ) {
      return next(createError('Not authorized to update this lead', 403));
    }

    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email');

    res.status(200).json({ success: true, message: 'Lead updated', data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return next(createError('Lead not found', 404));

    await lead.deleteOne();
    res.status(200).json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    next(error);
  }
};

export const exportLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filters: Record<string, unknown> = {};
    if (req.user?.role === 'sales') filters.createdBy = req.user.id;

    const leads = await Lead.find(filters)
      .populate('createdBy', 'name')
      .lean();

    const fields = [
      { label: 'Name', value: 'name' },
      { label: 'Email', value: 'email' },
      { label: 'Status', value: 'status' },
      { label: 'Source', value: 'source' },
      { label: 'Notes', value: 'notes' },
      { label: 'Created At', value: 'createdAt' },
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(leads);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

export const getStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
  const matchStage: Record<string, unknown> =
  req.user?.role === 'sales'
    ? { createdBy: new mongoose.Types.ObjectId(req.user.id) }
    : {};
    const [statusStats, sourceStats, total] = await Promise.all([
      Lead.aggregate([
        { $match: baseFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $match: baseFilter },
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      Lead.countDocuments(baseFilter),
    ]);

    res.status(200).json({
      success: true,
      data: { total, statusStats, sourceStats },
    });
  } catch (error) {
    next(error);
  }
};
