import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight, BarChart3, BookCheck, Camera, CheckCircle2, Circle, Dumbbell, FlaskConical,
  HeartPulse, Home, MessageSquare, ShieldCheck, Stethoscope, UserCheck, Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReBelta — реабилитация под контролем врача и ИИ" },
      { name: "description", content: "ReBelta: R&D-проект домашней реабилитации и фитнеса с компьютерным зрением, валидатором безопасности и врачом-реабилитологом." },
      { property: "og:title", content: "ReBelta — реабилитация под контролем врача и ИИ" },
      { property: "og:description", content: "Компьютерное зрение, многоуровневая проверка безопасности ИИ и прямая связь с реабилитологом." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const modes = {
  medical: {
    title: "Режим Medical",
    sub: "Клиническая реабилитация",
    icon: Stethoscope,
    items: [
      "ИИ ранжирует только клинически допустимые упражнения из верифицированного каталога.",
      "Независимый алгоритмический валидатор проверяет список на безопасность и совместимость.",
      "Врач-реабилитолог корректирует и утверждает финальную программу.",
      "Медицинская CV-система оценивает биомеханику в реальном времени, а клинические решения всегда за врачом (Doctor-in-the-Loop).",
    ],
  },
  fitness: {
    title: "Режим Fitness",
    sub: "Общая физическая подготовка",
    icon: Dumbbell,
    items: [
      "Самостоятельный немедицинский режим без участия врача.",
      "Поддержание тонуса, профилактика и общая физическая подготовка.",
      "Автоматический контроль техники движений через камеру.",
      "Персональные подсказки и аналитика прогресса.",
    ],
  },
} as const;

const chain = [
  { icon: BookCheck, t: "Каталог + ИИ-ранжирование", d: "Клинически проверенные упражнения, ранжированные ИИ под пациента." },
  { icon: ShieldCheck, t: "Независимый валидатор", d: "Алгоритмическая проверка безопасности и совместимости." },
  { icon: UserCheck, t: "Решение врача", d: "Реабилитолог утверждает или корректирует программу." },
  { icon: Home, t: "Выполнение дома", d: "CV-контроль техники и отчёт для врача после каждой сессии." },
];

const features = [
  { icon: HeartPulse, t: "Наблюдение реабилитологов", d: "Курс восстановления под дистанционным контролем профильного специалиста." },
  { icon: Camera, t: "Компьютерное зрение", d: "Отслеживание положения тела и углов в суставах через камеру устройства." },
  { icon: MessageSquare, t: "Прямой чат с врачом", d: "Обратная связь по самочувствию и корректировка нагрузок." },
  { icon: BarChart3, t: "Аналитика прогресса", d: "Динамика восстановления, точности техники и регулярности занятий." },
];

function About() {
  const [mode, setMode] = useState<keyof typeof modes>("medical");
  const m = modes[mode];
  return (
    <main>
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto max-w-5xl px-4 py-24 text-center md:py-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.35em] text-primary">ReBelta</p>
          <Badge variant="outline" className="mb-6 gap-2 rounded-full bg-card px-4 py-1.5 text-sm">
            <FlaskConical className="h-4 w-4 text-primary" /> Стадия проекта: R&D и демонстрационный прототип
          </Badge>
          <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
            Персонализированная домашняя реабилитация под контролем <span className="text-brand">врача и искусственного интеллекта</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Инновационный проект, объединяющий компьютерное зрение для анализа движений, многоуровневую проверку безопасности ИИ и прямую связь с врачом-реабилитологом.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/demo">Открыть демо приложения <ArrowRight /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full bg-card">
              <a href="#safety">Как устроена безопасность</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionTitle kicker="Архитектура" title="Два режима — одна платформа" text="Medical и Fitness разрабатываются параллельно на общей технологической основе." />
        <div className="mx-auto mb-8 flex w-fit rounded-full border bg-card p-1 shadow-soft">
          {(Object.keys(modes) as (keyof typeof modes)[]).map((k) => (
            <button key={k} onClick={() => setMode(k)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${mode === k ? (k === "medical" ? "bg-medical text-primary-foreground" : "bg-recovery text-recovery-foreground") : "text-muted-foreground"}`}>
              {modes[k].title}
            </button>
          ))}
        </div>
        <Card key={mode} className={`grid gap-8 rounded-3xl p-8 shadow-soft md:grid-cols-[1fr_2fr] animate-in fade-in duration-500 ${mode === "fitness" ? "mode-fitness" : ""}`}>
          <div className="rounded-2xl bg-primary-soft p-6">
            <m.icon className="h-10 w-10 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">{m.title}</h3>
            <p className="text-muted-foreground">{m.sub}</p>
          </div>
          <ul className="space-y-4">
            {m.items.map((i) => (
              <li key={i} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span>{i}</span></li>
            ))}
          </ul>
        </Card>
      </section>

      <section id="safety" className="scroll-mt-20 bg-card py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle kicker="Безопасность" title="Цепочка безопасности в режиме Medical" text="Ни одно упражнение не попадает к пациенту без трёх уровней проверки." />
          <div className="grid gap-4 md:grid-cols-4">
            {chain.map((s, i) => (
              <div key={s.t} className="relative">
                <Card className="h-full rounded-2xl p-6 shadow-soft">
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-medical-soft text-medical"><s.icon className="h-5 w-5" /></span>
                    <span className="font-display text-3xl font-semibold text-muted">0{i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{s.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
                </Card>
                {i < 3 && <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-recovery md:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionTitle kicker="Возможности" title="Что умеет приложение" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.t} className="rounded-2xl p-6 shadow-soft transition-transform hover:-translate-y-1">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-recovery-soft text-recovery"><f.icon className="h-5 w-5" /></span>
              <h3 className="mt-4 text-base font-semibold">{f.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-24">
        <SectionTitle kicker="Прозрачность" title="Статус и дорожная карта" />
        <Card className="rounded-3xl p-8 shadow-soft">
          <ol className="space-y-8 border-l-2 pl-6">
            <li className="relative">
              <span className="absolute -left-[33px] grid h-4 w-4 place-items-center rounded-full bg-recovery ring-4 ring-recovery-soft" />
              <Badge className="bg-recovery text-recovery-foreground">Текущий этап · активно</Badge>
              <p className="mt-2">Проектная документация и демонстрационное приложение с моделями отслеживания положения тела пациента.</p>
            </li>
            {["Интеграция с партнёрской клиникой", "Клинические испытания", "Государственная регистрация", "Пациентский запуск"].map((s) => (
              <li key={s} className="relative text-muted-foreground">
                <Circle className="absolute -left-[33px] h-4 w-4 bg-card text-border" />
                <span className="text-xs uppercase tracking-wide">В планах</span>
                <p className="text-foreground">{s}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex gap-3 rounded-2xl bg-medical-soft p-4 text-sm">
            <Workflow className="h-5 w-5 shrink-0 text-medical" />
            Параллельная разработка режимов Medical и Fitness сфокусирована на качестве и безопасности и не привязана к фиксированной дате коммерческого релиза.
          </div>
        </Card>
      </section>
    </main>
  );
}

function SectionTitle({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-medical">{kicker}</p>
      <h2 className="mt-2 text-2xl font-semibold md:text-3xl">{title}</h2>
      {text && <p className="mt-3 text-muted-foreground">{text}</p>}
    </div>
  );
}
