// Supabase Edge Function: send-contact-email
// 通过 SMTP 发送官网"联系我们"表单邮件（替代原 Next.js /api/contact 路由）。
//
// 部署（自托管 Supabase 需启用 edge-runtime 服务）：
//   supabase functions deploy send-contact-email --project-url <SUPABASE_URL>
//   或者使用 supabase link 后：supabase functions deploy send-contact-email
//
// 必需 Secrets（supabase secrets set 或自托管 edge-runtime 环境变量）：
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
//   CONTACT_SENDER_EMAIL, CONTACT_RECEIVER_EMAIL
//
// 前端调用：
//   POST {SUPABASE_URL}/functions/v1/send-contact-email
//   headers: { 'Content-Type': 'application/json', apikey: <anon key> }
//   body: { name, phone, email?, company?, position?, needType, message }
//
// 说明：QQ 企业/个人 SMTP 的 465 端口是隐式 TLS，这里用 Deno.connectTls
// 实现了一个最小 SMTPS 客户端（EHLO / AUTH LOGIN / DATA）。

import { stringToBase64 } from '../_shared/encoding.ts';
import { jsonResponse, preflight } from '../_shared/http.ts';

const NEED_TYPES = new Set(['业务咨询', '技术咨询', '售后服务', '合作咨询', '其他']);
const SMTP_TIMEOUT_MS = 20000;

function fail(message: string, status = 400) {
  return jsonResponse({ ok: false, message }, status);
}

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`缺少环境变量 ${name}`);
  return value;
}

function decodeUtf8(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

function encodeUtf8(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

/** 最小 SMTPS 客户端（隐式 TLS，适合 465 端口） */
class SmtpsClient {
  private conn: Deno.TlsConn | null = null;
  private buffer = '';

  async connect(host: string, port: number) {
    this.conn = await Deno.connectTls({ hostname: host, port });
  }

  private async readMore(): Promise<boolean> {
    if (!this.conn) throw new Error('SMTP 连接已关闭');
    const chunk = new Uint8Array(4096);
    const read = await this.conn.read(chunk);
    if (read === null) return false;
    this.buffer += decodeUtf8(chunk.subarray(0, read));
    return true;
  }

  /** 读取一行回复；多行回复（250-xxx）会一直读到结束行 */
  private async readReply(): Promise<string[]> {
    const lines: string[] = [];
    for (;;) {
      let line = this.extractLine();
      while (line === null) {
        if (!(await this.readMore())) throw new Error(`SMTP 连接中断，已收到: ${lines.join(' / ') || '(空)'}`);
        line = this.extractLine();
      }
      lines.push(line);
      // 多行回复形如 "250-PIPELINING"，最后一行是 "250 OK"
      if (line.length < 4 || line[3] !== '-') break;
    }
    return lines;
  }

  private extractLine(): string | null {
    const index = this.buffer.indexOf('\r\n');
    if (index === -1) return null;
    const line = this.buffer.slice(0, index);
    this.buffer = this.buffer.slice(index + 2);
    return line;
  }

  private async expect(code: string): Promise<string[]> {
    const lines = await this.readReply();
    if (!lines[0]?.startsWith(code)) {
      throw new Error(`SMTP 期望 ${code}，实际返回: ${lines.join(' | ')}`);
    }
    return lines;
  }

  async command(command: string, expectCode: string): Promise<string[]> {
    if (!this.conn) throw new Error('SMTP 连接已关闭');
    const write = encodeUtf8(`${command}\r\n`);
    await this.conn.write(write);
    return this.expect(expectCode);
  }

  async sendRawData(payload: string): Promise<void> {
    if (!this.conn) throw new Error('SMTP 连接已关闭');
    // RFC 5321 dot-stuffing：以点开头的行需要双写点
    const stuffed = payload.replace(/(^|\r\n)\./g, '$1..');
    await this.conn.write(encodeUtf8(`${stuffed}\r\n.\r\n`));
    await this.expect('250');
  }

  close() {
    try {
      this.conn?.close();
    } catch {
      // ignore
    }
    this.conn = null;
  }
}

function withTimeout<T>(promise: Promise<T>, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), SMTP_TIMEOUT_MS);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function encodeHeaderValue(value: string): string {
  // RFC 2047: 非 ASCII 头使用 UTF-8 Base64 编码
  return `=?UTF-8?B?${stringToBase64(value)}?=`;
}

function buildHtmlBody(input: {
  name: string;
  phone: string;
  email: string;
  company: string;
  position: string;
  needType: string;
  message: string;
}): string {
  const escape = (value: string) =>
    value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');

  const rows: Array<[string, string]> = [
    ['姓名', input.name],
    ['联系电话', input.phone],
    ['电子邮箱', input.email || '未填写'],
    ['公司', input.company || '未填写'],
    ['职务', input.position || '未填写'],
    ['需求类型', input.needType],
  ];

  return `
    <div style="font-family: Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif; line-height: 1.7; color: #111827;">
      <h2 style="margin: 0 0 16px;">官网合作咨询</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 720px;">
        ${rows
          .map(
            ([label, value]) => `
        <tr>
          <td style="padding: 8px 0; width: 120px; color: #6b7280;">${label}</td>
          <td style="padding: 8px 0;">${escape(value)}</td>
        </tr>`,
          )
          .join('')}
      </table>
      <div style="margin-top: 20px; padding: 16px; background: #f9fafb; border-radius: 12px; white-space: pre-wrap;">${escape(input.message)}</div>
    </div>
  `;
}

async function sendViaSmtp(input: {
  name: string;
  phone: string;
  email: string;
  company: string;
  position: string;
  needType: string;
  message: string;
}) {
  const host = requireEnv('SMTP_HOST');
  const port = Number(Deno.env.get('SMTP_PORT') || '465');
  const user = requireEnv('SMTP_USER');
  const pass = requireEnv('SMTP_PASS');
  const receiver = Deno.env.get('CONTACT_RECEIVER_EMAIL') || user;
  const from = Deno.env.get('CONTACT_SENDER_EMAIL') || user;

  const client = new SmtpsClient();
  try {
    await withTimeout(client.connect(host, port), 'SMTP 连接超时');
    await withTimeout(client.expect('220'), 'SMTP 服务器无响应');

    await withTimeout(client.command(`EHLO ${host.split('.')[0] || 'supabase'}`, '250'), 'SMTP EHLO 失败');
    await withTimeout(client.command('AUTH LOGIN', '334'), 'SMTP AUTH 失败');
    await withTimeout(client.command(stringToBase64(user), '334'), 'SMTP 用户名验证失败');
    await withTimeout(client.command(stringToBase64(pass), '235'), 'SMTP 密码验证失败');

    await withTimeout(client.command(`MAIL FROM:<${from}>`, '250'), 'SMTP MAIL FROM 失败');
    await withTimeout(client.command(`RCPT TO:<${receiver}>`, '250'), 'SMTP RCPT TO 失败');
    await withTimeout(client.command('DATA', '354'), 'SMTP DATA 失败');

    const subject = `【官网合作咨询】${input.needType} - ${input.name}`;
    const headers = [
      `From: 湖南协力鸿胜机械官网 <${from}>`,
      `To: <${receiver}>`,
      input.email ? `Reply-To: ${input.email}` : null,
      `Subject: ${encodeHeaderValue(subject)}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
      '',
    ]
      .filter((line) => line !== null)
      .join('\r\n');

    const body = stringToBase64(buildHtmlBody(input));
    await withTimeout(client.sendRawData(`${headers}\r\n${body}`), 'SMTP 邮件内容发送失败');

    await withTimeout(client.command('QUIT', '221'), 'SMTP QUIT 失败').catch(() => undefined);
  } finally {
    client.close();
  }
}

Deno.serve(async (request: Request) => {
  const preflightResponse = preflight(request);
  if (preflightResponse) return preflightResponse;

  if (request.method !== 'POST') {
    return fail('仅支持 POST 请求', 405);
  }

  const payload = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!payload) {
    return fail('提交数据不正确');
  }

  const name = String(payload.name ?? '').trim();
  const phone = String(payload.phone ?? '').trim();
  const email = String(payload.email ?? '').trim();
  const company = String(payload.company ?? '').trim();
  const position = String(payload.position ?? '').trim();
  const needType = String(payload.needType ?? '').trim();
  const message = String(payload.message ?? '').trim();

  if (!name) return fail('姓名不能为空');
  if (!phone) return fail('联系电话不能为空');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('邮箱格式不正确');
  if (!NEED_TYPES.has(needType)) return fail('需求类型不正确');
  if (!message) return fail('留言内容不能为空');
  if (message.length > 5000) return fail('留言内容过长');

  try {
    await sendViaSmtp({ name, phone, email, company, position, needType, message });
    return jsonResponse({ ok: true, message: '提交成功' }, 200);
  } catch (error) {
    console.error('contact mail send failed', error);
    const detail = error instanceof Error ? error.message : '';
    return fail(`邮件发送失败，请稍后重试。${detail ? `（${detail}）` : ''}`, 500);
  }
});
