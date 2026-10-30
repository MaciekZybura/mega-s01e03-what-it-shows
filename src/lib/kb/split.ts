// What #4471 really holds. The desk's own view (causes.ts: groupByCause) tells parser from hint and
// counts every report where it is filed. desk-notes.json names the reports the desk read as a
// one-day move: they stay in the parser count, as the desk counts them, and get a row of their own.
// Words on the page, numbers from here.
import { groupByCause, readAs, type CauseGroup, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = CauseGroup['cause'] | 'one-day-move';

export type ProblemGroup = {
  problem: Problem;
  reports: Report[];
  // Which cause these reports are counted under when it is not their own row.
  within: Problem | null;
  tenants: string[];
  channels: Record<string, number>;
  taggedAs: Record<string, number>;
  firstSeen: string;
  lastSeen: string;
};

const count = (rs: Report[], key: (r: Report) => string) =>
  rs.reduce<Record<string, number>>((n, r) => ({ ...n, [key(r)]: (n[key(r)] ?? 0) + 1 }), {});

function describe(problem: Problem, rs: Report[], within: Problem | null): ProblemGroup {
  const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
  return {
    problem,
    reports: rs,
    within,
    tenants: [...new Set(rs.map((r) => r.tenant))].sort(),
    channels: count(rs, (r) => r.channel),
    taggedAs: count(rs, (r) => r.meta.intakeTag),
    firstSeen: days[0],
    lastSeen: days[days.length - 1],
  };
}

export function splitTicket(
  merged: Report[],
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): ProblemGroup[] {
  const causes = groupByCause(merged, tenantOf);
  const rows = causes.map((g) => describe(g.cause, g.reports, null));
  // The one-day moves: counted inside the cause the desk filed them under, listed on their own.
  const host = causes.find((g) => readAs(g, oneDayMove) > 0);
  if (host) rows.push(describe('one-day-move', host.reports.filter((r) => oneDayMove.includes(r.id)), host.cause));
  return rows;
}
