import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { serverStore } from '@/lib/serverStore';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

// Validate file signatures (Magic Bytes)
function validateMagicBytes(buffer: Buffer, ext: string): boolean {
  if (buffer.length < 4) return false;

  // PDF magic bytes: %PDF (25 50 44 46)
  if (ext === '.pdf') {
    return buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
  }

  // PPTX / modern Office XML (ZIP format): PK\x03\x04 (50 4B 03 04)
  if (ext === '.pptx') {
    return buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04;
  }

  // Legacy PPT (OLE2 Compound Document): D0 CF 11 E0
  if (ext === '.ppt') {
    return buffer[0] === 0xD0 && buffer[1] === 0xCF && buffer[2] === 0x11 && buffer[3] === 0xE0;
  }

  return false;
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rate = checkRateLimit(`team-sub-${clientIp}`, 10, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Too many upload attempts. Please wait a minute.' }, { status: 429 });
    }

    const formData = await request.formData();
    const teamId = (formData.get('teamId') as string || '').trim();
    const accessToken = (
      (formData.get('accessToken') as string) || 
      request.headers.get('x-team-token') || 
      ''
    ).trim();
    const file = formData.get('file') as File | null;

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Team Access Passcode is required to upload submissions.' }, { status: 401 });
    }

    // 1. Verify Team Authorization
    const team = await serverStore.getTeam(teamId);
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const cleanToken = accessToken.toLowerCase();
    if (cleanToken !== team.access_token.toLowerCase() && cleanToken !== team.leader_email.toLowerCase()) {
      return NextResponse.json({ error: 'Unauthorized. Invalid Team Passcode.' }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: 'Please select a PDF, PPT, or PPTX presentation file to upload' }, { status: 400 });
    }

    const config = await serverStore.getConfig();

    // 2. File Type & Extension Validation
    const originalFilename = path.basename(file.name).replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileExt = path.extname(originalFilename).toLowerCase();
    const allowedExtensions = ['.pdf', '.ppt', '.pptx'];

    if (!allowedExtensions.includes(fileExt)) {
      return NextResponse.json({ 
        error: `Invalid file format "${fileExt}". Only official presentation files (.pdf, .ppt, .pptx) are accepted.` 
      }, { status: 400 });
    }

    // 3. File Size Validation
    const maxBytes = (config.maxFileSizeMb || 25) * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json({ 
        error: `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the maximum allowed limit of ${config.maxFileSizeMb} MB.` 
      }, { status: 400 });
    }

    const arrayBuf = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);

    // 4. File Magic Bytes Verification
    if (!validateMagicBytes(buffer, fileExt)) {
      return NextResponse.json({ 
        error: 'Security Error: File content does not match genuine PDF/PowerPoint presentation format.' 
      }, { status: 400 });
    }

    const cleanTeamSlug = team.registration_id.replace(/[^a-zA-Z0-9_-]/g, '_');
    const timestamp = Date.now();
    const safeSavedName = `${cleanTeamSlug}_Round1_${timestamp}${fileExt}`;
    let publicUrl = '';

    // 5. Upload to Supabase Storage (Production Storage)
    let uploadedToCloud = false;
    if (isSupabaseConfigured() && supabase) {
      try {
        const mimeType = fileExt === '.pdf' 
          ? 'application/pdf' 
          : fileExt === '.pptx' 
            ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation' 
            : 'application/vnd.ms-powerpoint';

        const { error: uploadErr } = await supabase.storage
          .from('submissions')
          .upload(`round_1/${safeSavedName}`, buffer, {
            contentType: mimeType,
            upsert: true
          });

        if (!uploadErr) {
          const { data: pubData } = supabase.storage
            .from('submissions')
            .getPublicUrl(`round_1/${safeSavedName}`);
          
          if (pubData?.publicUrl) {
            publicUrl = pubData.publicUrl;
            uploadedToCloud = true;
          }
        } else {
          console.warn('Supabase storage upload fallback to local:', uploadErr.message);
        }
      } catch (sbErr) {
        console.warn('Supabase storage upload error, falling back to local:', sbErr);
      }
    }

    // Fallback to local storage if cloud storage was not used
    if (!uploadedToCloud) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'submissions');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, safeSavedName);
      fs.writeFileSync(filePath, buffer);
      publicUrl = `/uploads/submissions/${safeSavedName}`;
    }

    // 6. Save Submission Record
    const mimeType = file.type || (fileExt === '.pdf' ? 'application/pdf' : 'application/vnd.ms-powerpoint');
    const result = await serverStore.submitRound1File(team.id, {
      originalFilename,
      fileSize: file.size,
      fileType: mimeType,
      fileUrl: publicUrl
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Submission failed' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Round 1 presentation successfully uploaded and registered for jury evaluation.',
      submission: result.submission
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Upload processing error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
