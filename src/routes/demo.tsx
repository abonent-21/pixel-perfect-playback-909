import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Activity, BarChart3, Camera, CheckCircle2, Dumbbell, MessageSquare, Pause, Play, Send, ShieldCheck, Smile, Stethoscope, Sparkles,
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { toast } from "sonner";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Демо приложения — РеаКинетика" },
      { name: "description", content: "Интерактивный прототип кабинета пациента: упражнения с CV-анализом, графики прогресса и чат с реабилитологом." },
      { property: "og:title", content: "Демо приложения — РеаКинетика" },
      { property: "og:description", content: "Покликайте прототип: CV-тренажёр, прогресс и чат с врачом." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Demo,
});

type Tab = "ex" | "progress" | "chat";

function Demo() {
  const [medical, setMedical] = useState(true);
  const [tab, setTab] = useState<Tab>("ex");
  const tabs = [
    { id: "ex" as const, label: "Мои упражнения", icon: Dumbbell },
    { id: "progress" as const, label: "Мой прогресс", icon: BarChart3 },
    ...(medical ? [{ id: "chat" as const, label: "Чат с реабилитологом", icon: MessageSquare }] : []),
  ];
  const active = !medical && tab === "chat" ? "ex" : tab;

  return (
    <main className={`mx-auto max-w-7xl px-4 py-8 ${medical ? "" : "mode-fitness"}`}>
      <Card className="mb-6 flex flex-col gap-4 rounded-3xl p-5 shadow-soft md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground transition-colors">
            {medical ? <Stethoscope /> : <Activity />}
          </span>
          <div>
            <p className="font-display font-semibold">{medical ? "Medical · Под контролем врача" : "Fitness · Самостоятельный"}</p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {medical ? "Программа утверждена врачом И. В. Смирновым • Валидатор: Пройдено" : "Немедицинский режим • Автоконтроль техники активен"}
            </p>
          </div>
        </div>
        <label className="flex items-center gap-3 rounded-full bg-muted px-4 py-2 text-sm font-medium">
          <span className={!medical ? "text-primary" : "text-muted-foreground"}>Fitness</span>
          <Switch checked={medical} onCheckedChange={setMedical} />
          <span className={medical ? "text-primary" : "text-muted-foreground"}>Medical</span>
        </label>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors ${active === t.id ? "bg-primary text-primary-foreground shadow-soft" : "bg-card text-muted-foreground hover:text-foreground"}`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </nav>
        <div key={active + String(medical)} className="animate-in fade-in duration-300">
          {active === "ex" && <Exercises medical={medical} />}
          {active === "progress" && <Progress />}
          {active === "chat" && <Chat />}
        </div>
      </div>
    </main>
  );
}

const exercises = [
  { name: "Сгибание коленного сустава сидя", sets: 3, reps: 12, joint: "Колено" },
  { name: "Отведение плеча в плоскости лопатки", sets: 3, reps: 10, joint: "Плечо" },
  { name: "Удержание баланса", sets: 2, reps: "30 с", joint: "Баланс" },
];

function Exercises({ medical }: { medical: boolean }) {
  const [sel, setSel] = useState(0);
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Комплекс на сегодня</h2>
        {exercises.map((e, i) => (
          <button key={e.name} onClick={() => setSel(i)} className={`w-full rounded-2xl border bg-card p-4 text-left transition-all ${sel === i ? "border-primary shadow-soft" : ""}`}>
            <p className="font-medium">{e.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{e.sets} подхода × {e.reps}</p>
            <Badge variant="secondary" className="mt-3 gap-1 bg-primary-soft text-primary">
              <CheckCircle2 className="h-3 w-3" /> {medical ? "Утверждено врачом" : "Рекомендовано ИИ"}
            </Badge>
          </button>
        ))}
      </div>
      <CvTrainer title={exercises[sel]?.name ?? ""} />
    </div>
  );
}

function CvTrainer({ title }: { title: string }) {
  const [playing, setPlaying] = useState(true);
  const [t, setT] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    if (!playing) return;
    const start = performance.now() - t * 1000;
    const loop = (now: number) => { setT((now - start) / 1000); raf.current = requestAnimationFrame(loop); };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const phase = (Math.sin(t * 1.6) + 1) / 2;
  const angle = Math.round(90 + phase * 70);
  const accuracy = 92 + Math.round(Math.sin(t * 0.7) * 2 + 2);
  const smooth = 86 + Math.round(Math.cos(t * 0.5) * 4);
  // seated figure, lower leg swings
  const hip = { x: 150, y: 170 }, knee = { x: 215, y: 175 };
  const a = ((angle - 90) * Math.PI) / 180;
  const ankle = { x: knee.x + Math.sin(a) * 70, y: knee.y + Math.cos(a) * 70 };
  const pts = { head: { x: 140, y: 55 }, neck: { x: 142, y: 85 }, sh: { x: 142, y: 95 }, el: { x: 170, y: 130 }, wr: { x: 195, y: 160 }, hip, knee, ankle };
  const lines: [keyof typeof pts, keyof typeof pts][] = [["neck", "sh"], ["sh", "el"], ["el", "wr"], ["sh", "hip"], ["hip", "knee"], ["knee", "ankle"]];

  return (
    <Card className="overflow-hidden rounded-3xl shadow-soft">
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold"><Camera className="h-4 w-4 text-primary" /> Демо тренажёра с CV-анализом</p>
          <p className="text-xs text-muted-foreground">{title}</p>
        </div>
        <Button size="sm" variant="outline" className="rounded-full" onClick={() => setPlaying((p) => !p)}>
          {playing ? <Pause /> : <Play />} {playing ? "Пауза" : "Старт"}
        </Button>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden bg-cv-bg">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full"><div className="animate-scan h-px w-full bg-cv-line/40" /></div>
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-background/10 px-2.5 py-1 text-xs text-cv-joint">
          <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" /> LIVE · 30 fps
        </span>
        <svg viewBox="0 0 320 260" className="h-full w-full">
          <rect x="95" y="175" width="90" height="10" rx="4" className="fill-cv-joint/15" />
          <rect x="100" y="185" width="8" height="60" className="fill-cv-joint/15" />
          <circle cx={pts.head.x} cy={pts.head.y} r="20" className="fill-cv-joint/10 stroke-cv-line" strokeWidth="2" />
          {lines.map(([p, q]) => (
            <line key={p + q} x1={pts[p].x} y1={pts[p].y} x2={pts[q].x} y2={pts[q].y} className="stroke-cv-line" strokeWidth="4" strokeLinecap="round" />
          ))}
          {Object.entries(pts).filter(([k]) => k !== "head").map(([k, p]) => (
            <circle key={k} cx={p.x} cy={p.y} r="5" className="fill-cv-joint stroke-cv-line" strokeWidth="2" />
          ))}
          <path d={`M ${knee.x - 25} ${knee.y - 2} A 25 25 0 0 1 ${knee.x + Math.sin(a) * 25} ${knee.y + Math.cos(a) * 25}`} className="fill-none stroke-cv-joint" strokeDasharray="3 3" />
          <text x={knee.x + 12} y={knee.y - 10} className="fill-cv-joint text-[12px] font-semibold">{angle}°</text>
        </svg>
        <div className="absolute right-3 top-3 space-y-2">
          <Metric label="Угол сгибания" value={`${angle}°`} />
          <Metric label="Плавность" value={`${smooth}%`} />
          <Metric label="Точность техники" value={`${accuracy}%`} />
        </div>
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-2xl bg-background/90 p-3 text-sm backdrop-blur">
          <Sparkles className="h-4 w-4 shrink-0 text-primary" /> Держите спину ровно, темп оптимальный
        </div>
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-32 rounded-xl bg-background/10 px-3 py-2 text-cv-joint backdrop-blur">
      <p className="text-[10px] uppercase tracking-wide opacity-70">{label}</p>
      <p className="font-display text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

const weeks = ["Нед 1", "Нед 2", "Нед 3", "Нед 4", "Нед 5", "Нед 6"];
const accData = weeks.map((w, i) => ({ w, v: [78, 82, 85, 88, 91, 94][i] }));
const romData = weeks.map((w, i) => ({ w, v: [95, 104, 112, 121, 130, 138][i] }));
const planData = weeks.map((w, i) => ({ w, done: [5, 6, 6, 7, 6, 7][i], plan: 7 }));
const cfg: ChartConfig = { v: { label: "Значение", color: "var(--chart-1)" }, done: { label: "Выполнено", color: "var(--chart-1)" }, plan: { label: "План", color: "var(--chart-3)" } };

function Progress() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={CheckCircle2} label="Завершённых сессий" value="37" />
        <Stat icon={Camera} label="Средняя точность (CV)" value="89%" />
        <Stat icon={Smile} label="Комфорт / боль" value="2 / 10" hint="Низкий болевой синдром" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Динамика точности выполнения техники (%)">
          <ChartContainer config={cfg} className="h-56 w-full">
            <AreaChart data={accData}>
              <CartesianGrid vertical={false} /><XAxis dataKey="w" tickLine={false} axisLine={false} /><YAxis domain={[70, 100]} width={30} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area dataKey="v" type="monotone" stroke="var(--color-v)" fill="var(--color-v)" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ChartContainer>
        </ChartCard>
        <ChartCard title="Амплитуда движения по неделям (°)">
          <ChartContainer config={cfg} className="h-56 w-full">
            <LineChart data={romData}>
              <CartesianGrid vertical={false} /><XAxis dataKey="w" tickLine={false} axisLine={false} /><YAxis width={30} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line dataKey="v" type="monotone" stroke="var(--color-v)" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ChartContainer>
        </ChartCard>
        <ChartCard title="Выполнение плана реабилитации (сессий в неделю)" wide>
          <ChartContainer config={cfg} className="h-56 w-full">
            <BarChart data={planData}>
              <CartesianGrid vertical={false} /><XAxis dataKey="w" tickLine={false} axisLine={false} /><YAxis width={30} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="plan" fill="var(--color-plan)" fillOpacity={0.35} radius={8} />
              <Bar dataKey="done" fill="var(--color-done)" radius={8} />
            </BarChart>
          </ChartContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, hint }: { icon: typeof Camera; label: string; value: string; hint?: string }) {
  return (
    <Card className="rounded-2xl p-5 shadow-soft">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-3 font-display text-2xl font-semibold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
      {hint && <p className="mt-1 text-xs text-primary">{hint}</p>}
    </Card>
  );
}

function ChartCard({ title, children, wide }: { title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <Card className={`rounded-2xl p-5 shadow-soft ${wide ? "xl:col-span-2" : ""}`}>
      <p className="mb-4 text-sm font-semibold">{title}</p>
      {children}
    </Card>
  );
}

type Msg = { from: "doc" | "me"; text: string; time: string };
const initial: Msg[] = [
  { from: "me", text: "Добрый день! Вчера прошёл все три упражнения, к концу колено немного устало.", time: "09:12" },
  { from: "doc", text: "Здравствуйте! Посмотрел отчёт CV-модели. Вижу по графику, что амплитуда улучшилась на 12%, но на последнем подходе падает точность — снизил количество повторений на завтра.", time: "10:04" },
  { from: "doc", text: "Если появится боль выше 4/10 — остановитесь и напишите мне.", time: "10:05" },
];

function Chat() {
  const [msgs, setMsgs] = useState(initial);
  const [text, setText] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [msgs]);
  const now = () => new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  const send = (t: string) => {
    if (!t.trim()) return;
    setMsgs((m) => [...m, { from: "me", text: t, time: now() }]);
    setText("");
    setTimeout(() => setMsgs((m) => [...m, { from: "doc", text: "Спасибо, получил. Учту при корректировке программы.", time: now() }]), 1200);
  };
  return (
    <Card className="flex h-[620px] flex-col overflow-hidden rounded-3xl shadow-soft">
      <div className="flex items-center gap-3 border-b p-4">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft font-semibold text-primary">ИС</span>
        <div>
          <p className="font-semibold">И. В. Смирнов</p>
          <p className="text-xs text-muted-foreground">Врач-реабилитолог · в сети</p>
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto bg-muted/40 p-4">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-end" : ""} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.from === "me" ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-card shadow-soft"}`}>
              {m.text}
              <p className="mt-1 text-right text-[10px] opacity-60">{m.time}</p>
            </div>
          </div>
        ))}
        <div ref={end} />
      </div>
      <div className="space-y-3 border-t p-4">
        <Button variant="outline" size="sm" className="rounded-full" onClick={() => { send("Самочувствие после тренировки: хорошее, боль 2/10, усталость умеренная."); toast.success("Самочувствие отправлено врачу"); }}>
          <Smile /> Отправить самочувствие после тренировки
        </Button>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); send(text); }}>
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Напишите сообщение врачу…" className="rounded-full" />
          <Button type="submit" size="icon" className="rounded-full"><Send /></Button>
        </form>
      </div>
    </Card>
  );
}
