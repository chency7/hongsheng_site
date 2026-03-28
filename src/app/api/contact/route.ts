import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, '姓名不能为空'),
  phone: z.string().trim().min(1, '联系电话不能为空'),
  email: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || '')
    .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), '邮箱格式不正确'),
  needType: z.enum(['业务咨询', '技术咨询', '售后服务', '合作咨询', '其他']),
  message: z.string().trim().min(1, '留言内容不能为空'),
});

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || '465');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: parsed.error.issues[0]?.message || '提交数据不正确',
      },
      { status: 400 }
    );
  }

  const transporter = createTransporter();

  if (!transporter) {
    return NextResponse.json(
      {
        ok: false,
        message: '邮件服务尚未配置，请先设置 SMTP 环境变量。',
      },
      { status: 500 }
    );
  }

  const { name, phone, email, needType, message } = parsed.data;
  const receiver = process.env.CONTACT_RECEIVER_EMAIL || '1611804875@qq.com';
  const from = process.env.CONTACT_SENDER_EMAIL || process.env.SMTP_USER || receiver;

  try {
    await transporter.sendMail({
      from,
      to: receiver,
      replyTo: email || undefined,
      subject: `【官网合作咨询】${needType} - ${name}`,
      text: [
        `姓名：${name}`,
        `联系电话：${phone}`,
        `电子邮箱：${email || '未填写'}`,
        `需求类型：${needType}`,
        '',
        '留言内容：',
        message,
      ].join('\n'),
      html: `
        <div style="font-family: Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif; line-height: 1.7; color: #111827;">
          <h2 style="margin: 0 0 16px;">官网合作咨询</h2>
          <table style="border-collapse: collapse; width: 100%; max-width: 720px;">
            <tr>
              <td style="padding: 8px 0; width: 120px; color: #6b7280;">姓名</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">联系电话</td>
              <td style="padding: 8px 0;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">电子邮箱</td>
              <td style="padding: 8px 0;">${email || '未填写'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">需求类型</td>
              <td style="padding: 8px 0;">${needType}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #f9fafb; border-radius: 12px; white-space: pre-wrap;">${message}</div>
        </div>
      `,
    });

    return NextResponse.json({
      ok: true,
      message: '提交成功',
    });
  } catch (error) {
    console.error('contact mail send failed', error);

    return NextResponse.json(
      {
        ok: false,
        message: '邮件发送失败，请稍后重试。',
      },
      { status: 500 }
    );
  }
}
