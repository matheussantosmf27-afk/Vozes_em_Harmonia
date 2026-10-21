import type { IllustrationName } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Ilustrações didáticas em SVG, desenhadas com as cores do tema (funcionam no
 * modo escuro). Cada uma tem descrição para leitores de tela.
 */

type Props = { className?: string };

function Svg({ label, children, className, viewBox = "0 0 320 200" }: { label: string; children: React.ReactNode; className?: string; viewBox?: string }) {
  return (
    <svg viewBox={viewBox} role="img" aria-label={label} className={cn("h-auto w-full", className)} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <title>{label}</title>
      {children}
    </svg>
  );
}

function T({ x, y, children, anchor = "middle", size = 11, className = "fill-foreground", weight }: { x: number; y: number; children: React.ReactNode; anchor?: "start" | "middle" | "end"; size?: number; className?: string; weight?: number }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} className={className} stroke="none">
      {children}
    </text>
  );
}

function Music({ x, y, size = 28, children, className = "fill-foreground", anchor = "middle" }: { x: number; y: number; size?: number; children: React.ReactNode; className?: string; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} fontSize={size} textAnchor={anchor} className={cn("font-music", className)} stroke="none">
      {children}
    </text>
  );
}

function Arrow({ x1, y1, x2, y2, className = "stroke-primary" }: { x1: number; y1: number; x2: number; y2: number; className?: string }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 7;
  const p1 = `${x2 - h * Math.cos(a - 0.45)},${y2 - h * Math.sin(a - 0.45)}`;
  const p2 = `${x2 - h * Math.cos(a + 0.45)},${y2 - h * Math.sin(a + 0.45)}`;
  return (
    <g className={className} strokeWidth={2}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <polyline points={`${p1} ${x2},${y2} ${p2}`} />
    </g>
  );
}

function Check({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={9} className="fill-success" />
      <polyline points={`${x - 4},${y} ${x - 1},${y + 3} ${x + 4},${y - 3}`} className="stroke-white" strokeWidth={2} />
    </g>
  );
}

function Cross({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={9} className="fill-destructive" />
      <path d={`M${x - 3.5} ${y - 3.5} L${x + 3.5} ${y + 3.5} M${x + 3.5} ${y - 3.5} L${x - 3.5} ${y + 3.5}`} className="stroke-white" strokeWidth={2} />
    </g>
  );
}

/** Pentagrama de 5 linhas. */
function StaffLines({ x, y, w, gap = 10, className = "stroke-muted-foreground" }: { x: number; y: number; w: number; gap?: number; className?: string }) {
  return (
    <g className={className} strokeWidth={1.2}>
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={x} x2={x + w} y1={y + i * gap} y2={y + i * gap} />
      ))}
    </g>
  );
}

function NoteHead({ x, y, className = "fill-foreground", stem = true }: { x: number; y: number; className?: string; stem?: boolean }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={6} ry={4.4} transform={`rotate(-20 ${x} ${y})`} className={className} />
      {stem && <line x1={x + 5.5} y1={y - 1} x2={x + 5.5} y2={y - 30} className="stroke-foreground" strokeWidth={1.4} />}
    </g>
  );
}

/** Teclado simples: `keys` brancas a partir de Dó. Retorna a posição x da tecla branca i. */
function MiniKeys({ x, y, n, w = 28, h = 90, highlight = {} }: { x: number; y: number; n: number; w?: number; h?: number; highlight?: Record<number, string> }) {
  const blackAfter = [0, 1, 3, 4, 5]; // dó, ré, fá, sol, lá têm preta à direita
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x={x + i * w} y={y} width={w} height={h} rx={3} className={cn("stroke-muted-foreground", highlight[i] ?? "fill-card")} strokeWidth={1.2} />
      ))}
      {Array.from({ length: n - 1 }, (_, i) =>
        blackAfter.includes(i % 7) ? <rect key={`b${i}`} x={x + (i + 1) * w - w * 0.3} y={y} width={w * 0.6} height={h * 0.6} rx={2} className="fill-foreground" /> : null,
      )}
    </g>
  );
}

/* --------------------------------------------------------------------------
 * Técnica vocal
 * ------------------------------------------------------------------------ */

function PosturaComparada({ className }: Props) {
  return (
    <Svg className={className} label="Comparação de posturas: à esquerda, postura tensa com cabeça projetada para frente, ombros erguidos e joelhos travados; à direita, postura alinhada com orelha, ombro, quadril e tornozelo na mesma linha.">
      <line x1={160} y1={10} x2={160} y2={190} className="stroke-border" strokeWidth={1} />
      {/* tensa */}
      <g className="stroke-foreground" strokeWidth={3}>
        <circle cx={66} cy={40} r={12} className="fill-card" />
        <path d="M58 52 Q50 58 48 68" />
        <path d="M48 68 Q40 96 48 122" />
        <path d="M48 122 L42 158 L44 182" />
        <path d="M48 122 L52 158 L56 182" />
        <path d="M46 70 Q62 88 64 108" />
      </g>
      <path d="M36 62 L44 56 M58 52 L66 47" className="stroke-destructive" strokeWidth={2.5} />
      <Cross x={18} y={18} />
      <T x={88} y={42} anchor="start" size={9.5} className="fill-destructive">cabeça à frente</T>
      <T x={88} y={68} anchor="start" size={9.5} className="fill-destructive">ombros sobem</T>
      <T x={88} y={160} anchor="start" size={9.5} className="fill-destructive">joelhos travados</T>
      <T x={60} y={198} weight={600}>Tensa</T>
      {/* alinhada */}
      <line x1={214} y1={6} x2={214} y2={190} className="stroke-gold" strokeWidth={1.5} strokeDasharray="5 4" />
      <g className="stroke-foreground" strokeWidth={3}>
        <circle cx={216} cy={40} r={12} className="fill-card" />
        <path d="M215 53 L214 70" />
        <path d="M214 70 Q218 96 214 122" />
        <path d="M214 122 Q212 154 212 182" />
        <path d="M214 122 Q220 154 218 182" />
        <path d="M214 72 Q222 92 220 112" />
      </g>
      <Check x={302} y={18} />
      <T x={240} y={42} anchor="start" size={9.5} className="fill-success">cabeça alta</T>
      <T x={240} y={72} anchor="start" size={9.5} className="fill-success">ombros soltos</T>
      <T x={240} y={160} anchor="start" size={9.5} className="fill-success">joelhos livres</T>
      <T x={224} y={12} anchor="start" size={9} className="fill-gold">fio imaginário</T>
      <T x={216} y={198} weight={600}>Alinhada</T>
    </Svg>
  );
}

function PosturaSentada({ className }: Props) {
  return (
    <Svg className={className} label="Pessoa sentada na parte da frente da cadeira, pés apoiados no chão e coluna sem encostar no encosto.">
      <g className="stroke-muted-foreground" strokeWidth={3}>
        <path d="M110 120 L210 120" />
        <path d="M206 120 L206 40" />
        <path d="M118 120 L118 186 M202 120 L202 186" />
      </g>
      <g className="stroke-foreground" strokeWidth={3}>
        <circle cx={142} cy={34} r={13} className="fill-card" />
        <path d="M142 48 L142 112" />
        <path d="M142 112 L96 116 L94 184" />
        <path d="M142 66 Q132 88 112 100" />
      </g>
      <path d="M150 46 L190 46" className="stroke-gold" strokeWidth={1.5} strokeDasharray="4 4" />
      <T x={212} y={70} anchor="start" size={10} className="fill-success">espaço entre costas</T>
      <T x={212} y={83} anchor="start" size={10} className="fill-success">e encosto</T>
      <T x={30} y={196} anchor="start" size={10} className="fill-success">pés no chão</T>
      <T x={150} y={136} anchor="start" size={10} className="fill-muted-foreground">frente da cadeira</T>
      <Check x={300} y={24} />
    </Svg>
  );
}

function Respiracao({ className }: Props) {
  return (
    <Svg className={className} label="Na inspiração, as costelas se abrem para os lados, o diafragma desce e a barriga se expande; os ombros ficam parados.">
      <path d="M110 30 Q90 40 88 80 L92 150 Q120 176 160 176 Q200 176 228 150 L232 80 Q230 40 210 30" className="stroke-foreground fill-card" strokeWidth={2.5} />
      <path d="M128 50 Q104 70 108 118 Q134 122 154 112 L154 56 Q144 44 128 50 Z" className="fill-primary/15 stroke-primary" strokeWidth={2} />
      <path d="M192 50 Q216 70 212 118 Q186 122 166 112 L166 56 Q176 44 192 50 Z" className="fill-primary/15 stroke-primary" strokeWidth={2} />
      <path d="M104 126 Q160 102 216 126" className="stroke-gold" strokeWidth={3} />
      <Arrow x1={160} y1={118} x2={160} y2={140} className="stroke-gold" />
      <Arrow x1={92} y1={92} x2={66} y2={92} />
      <Arrow x1={228} y1={92} x2={254} y2={92} />
      <T x={58} y={84} anchor="end" size={10}>costelas</T>
      <T x={58} y={97} anchor="end" size={10}>se abrem</T>
      <T x={262} y={84} anchor="start" size={10}>costelas</T>
      <T x={262} y={97} anchor="start" size={10}>se abrem</T>
      <T x={160} y={160} size={10} className="fill-gold">diafragma desce</T>
      <g className="stroke-success" strokeWidth={2}>
        <line x1={96} y1={22} x2={124} y2={22} />
        <line x1={196} y1={22} x2={224} y2={22} />
      </g>
      <T x={160} y={16} size={10} className="fill-success">ombros parados</T>
      <T x={160} y={196} size={10} className="fill-muted-foreground">inspiração baixa e silenciosa</T>
    </Svg>
  );
}

function AparelhoVocal({ className }: Props) {
  return (
    <Svg className={className} label="Perfil da cabeça mostrando o caminho do som: o ar sobe dos pulmões, as pregas vocais na laringe vibram e criam o som, e a faringe, a boca e o nariz dão cor ao som.">
      <path d="M100 20 Q160 6 196 40 Q212 60 214 82 L230 96 L214 104 Q218 120 210 132 Q200 140 186 140 L172 146 L172 196 L120 196 L122 150 Q92 130 88 90 Q86 44 100 20 Z" className="stroke-foreground fill-card" strokeWidth={2.5} />
      <path d="M160 70 Q190 66 210 80" className="fill-primary/10 stroke-primary" strokeWidth={2} />
      <path d="M150 100 Q182 96 206 106 Q190 120 160 116 Z" className="fill-primary/15 stroke-primary" strokeWidth={2} />
      <path d="M146 100 L146 150" className="stroke-primary" strokeWidth={2} />
      <path d="M134 100 L134 150" className="stroke-primary" strokeWidth={2} />
      <rect x={130} y={150} width={20} height={14} rx={4} className="fill-gold/30 stroke-gold" strokeWidth={2} />
      <path d="M134 157 L146 157" className="stroke-gold" strokeWidth={2.5} />
      <Arrow x1={140} y1={196} x2={140} y2={170} className="stroke-muted-foreground" />
      <T x={236} y={70} anchor="start" size={10}>nariz</T>
      <T x={236} y={116} anchor="start" size={10}>boca</T>
      <T x={6} y={110} anchor="start" size={10}>faringe</T>
      <line x1={46} y1={114} x2={132} y2={122} className="stroke-muted-foreground" strokeDasharray="2 3" />
      <T x={6} y={168} anchor="start" size={10} className="fill-gold" weight={600}>pregas vocais</T>
      <T x={6} y={181} anchor="start" size={10} className="fill-gold">(o som nasce)</T>
      <line x1={76} y1={164} x2={128} y2={158} className="stroke-gold" strokeDasharray="2 3" />
      <T x={196} y={188} anchor="start" size={10} className="fill-muted-foreground">ar dos pulmões</T>
    </Svg>
  );
}

function Ressonancia({ className }: Props) {
  return (
    <Svg className={className} label="Espaços de ressonância: o som produzido nas pregas vocais ganha corpo na faringe, na boca e na região do nariz e das maçãs do rosto.">
      <path d="M90 24 Q150 8 186 40 Q202 62 204 84 L220 98 L204 106 Q208 122 200 134 Q190 142 176 142 L162 148 L162 196 L110 196 L112 152 Q82 132 78 92 Q76 46 90 24 Z" className="stroke-foreground fill-card" strokeWidth={2.5} />
      <ellipse cx={176} cy={74} rx={22} ry={12} className="fill-gold/25 stroke-gold" strokeWidth={2} />
      <ellipse cx={170} cy={108} rx={26} ry={12} className="fill-primary/20 stroke-primary" strokeWidth={2} />
      <ellipse cx={128} cy={130} rx={12} ry={26} className="fill-primary/10 stroke-primary" strokeWidth={2} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${232 + i * 14} ${88 - i * 6} Q${240 + i * 14} 100 ${232 + i * 14} ${112 + i * 6}`} className="stroke-gold" strokeWidth={2} />
      ))}
      <T x={176} y={50} size={10} className="fill-gold">máscara (nariz e maçãs)</T>
      <T x={250} y={140} size={10}>boca</T>
      <line x1={238} y1={136} x2={196} y2={112} className="stroke-muted-foreground" strokeDasharray="2 3" />
      <T x={60} y={136} anchor="end" size={10}>faringe</T>
      <line x1={64} y1={132} x2={114} y2={132} className="stroke-muted-foreground" strokeDasharray="2 3" />
      <T x={250} y={184} size={10} className="fill-muted-foreground">mesmo ar,</T>
      <T x={250} y={197} size={10} className="fill-muted-foreground">mais corpo no som</T>
    </Svg>
  );
}

function Vogais({ className }: Props) {
  const shapes: { v: string; rx: number; ry: number; lips?: boolean; tip: string }[] = [
    { v: "A", rx: 18, ry: 22, tip: "boca alta" },
    { v: "É", rx: 22, ry: 15, tip: "média" },
    { v: "I", rx: 24, ry: 8, tip: "sorriso leve" },
    { v: "Ó", rx: 15, ry: 18, lips: true, tip: "redonda" },
    { v: "U", rx: 9, ry: 10, lips: true, tip: "lábios à frente" },
  ];
  return (
    <Svg className={className} label="Formatos de boca das vogais: A com boca alta, É média, I com sorriso leve, Ó redonda e U com lábios para frente. A mandíbula fica solta em todas.">
      {shapes.map((s, i) => {
        const cx = 36 + i * 62;
        return (
          <g key={s.v}>
            <circle cx={cx} cy={84} r={30} className="fill-card stroke-muted-foreground" strokeWidth={1.5} />
            <ellipse cx={cx} cy={92} rx={s.rx * 0.8} ry={s.ry * 0.8} className="fill-foreground/80" />
            {s.lips && <ellipse cx={cx} cy={92} rx={s.rx * 0.8 + 4} ry={s.ry * 0.8 + 4} className="stroke-gold" strokeWidth={2.5} />}
            <circle cx={cx - 10} cy={70} r={2.2} className="fill-foreground" />
            <circle cx={cx + 10} cy={70} r={2.2} className="fill-foreground" />
            <T x={cx} y={146} size={20} weight={700} className="fill-primary">{s.v}</T>
            <T x={cx} y={164} size={9.5} className="fill-muted-foreground">{s.tip}</T>
          </g>
        );
      })}
      <T x={160} y={190} size={10.5}>mandíbula solta em todas; o que muda é língua e lábios</T>
    </Svg>
  );
}

function Mandibula({ className }: Props) {
  return (
    <Svg className={className} label="Mandíbula travada, com dentes apertados e tensão nas bochechas, ao lado da mandíbula solta, caindo levemente para baixo e para trás.">
      {[
        { x: 80, ok: false, label: "Travada" },
        { x: 240, ok: true, label: "Solta" },
      ].map((f) => (
        <g key={f.label}>
          <path d={`M${f.x - 40} 60 Q${f.x - 42} 20 ${f.x} 18 Q${f.x + 42} 20 ${f.x + 40} 60`} className="stroke-foreground fill-card" strokeWidth={2.5} />
          <path
            d={f.ok ? `M${f.x - 40} 60 Q${f.x - 36} 120 ${f.x} 136 Q${f.x + 36} 120 ${f.x + 40} 60` : `M${f.x - 40} 60 Q${f.x - 38} 104 ${f.x} 112 Q${f.x + 38} 104 ${f.x + 40} 60`}
            className="stroke-foreground fill-card"
            strokeWidth={2.5}
          />
          <circle cx={f.x - 14} cy={50} r={3} className="fill-foreground" />
          <circle cx={f.x + 14} cy={50} r={3} className="fill-foreground" />
          {f.ok ? <ellipse cx={f.x} cy={100} rx={11} ry={15} className="fill-foreground/80" /> : <line x1={f.x - 12} y1={88} x2={f.x + 12} y2={88} className="stroke-foreground" strokeWidth={3} />}
          {f.ok ? <Arrow x1={f.x + 52} y1={88} x2={f.x + 52} y2={120} className="stroke-success" /> : (
            <g className="stroke-destructive" strokeWidth={2}>
              <path d={`M${f.x - 46} 76 l-8 -4 M${f.x - 46} 84 l-9 0 M${f.x + 46} 76 l8 -4 M${f.x + 46} 84 l9 0`} />
            </g>
          )}
          {f.ok ? <Check x={f.x + 46} y={26} /> : <Cross x={f.x + 46} y={26} />}
          <T x={f.x} y={164} weight={600}>{f.label}</T>
          <T x={f.x} y={180} size={10} className={f.ok ? "fill-success" : "fill-destructive"}>{f.ok ? "cai por gravidade, sem empurrar" : "dentes apertados, som preso"}</T>
        </g>
      ))}
    </Svg>
  );
}

function Registros({ className }: Props) {
  const zones = [
    { y: 26, h: 46, label: "Voz de cabeça", sub: "agudos, vibra na cabeça", cls: "fill-primary/15" },
    { y: 72, h: 46, label: "Voz mista", sub: "a passagem, mistura", cls: "fill-gold/25" },
    { y: 118, h: 46, label: "Voz de peito", sub: "graves, vibra no peito", cls: "fill-primary/30" },
  ];
  return (
    <Svg className={className} label="Escada de notas dividida em três regiões: voz de peito nos graves, voz mista na passagem e voz de cabeça nos agudos. A meta é transitar sem quebras.">
      {zones.map((z) => (
        <g key={z.label}>
          <rect x={40} y={z.y} width={130} height={z.h} className={z.cls} />
          <T x={186} y={z.y + 22} anchor="start" weight={600}>{z.label}</T>
          <T x={186} y={z.y + 36} anchor="start" size={10} className="fill-muted-foreground">{z.sub}</T>
        </g>
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={50 + i * 12} y={150 - i * 14} width={12} height={8} rx={2} className="fill-foreground" />
      ))}
      <Arrow x1={30} y1={160} x2={30} y2={30} className="stroke-muted-foreground" />
      <T x={22} y={24} size={10} className="fill-muted-foreground">agudo</T>
      <T x={22} y={180} size={10} className="fill-muted-foreground">grave</T>
      <T x={104} y={190} size={10.5}>sem “quebra” na passagem</T>
    </Svg>
  );
}

function ExtensaoTessitura({ className }: Props) {
  return (
    <Svg className={className} label="Barra de notas do grave ao agudo: a extensão é tudo o que você alcança; a tessitura é a região central confortável onde a voz soa bem por mais tempo.">
      <rect x={20} y={70} width={280} height={30} rx={15} className="fill-muted stroke-muted-foreground" strokeWidth={1.5} />
      <rect x={90} y={70} width={140} height={30} rx={8} className="fill-success/30 stroke-success" strokeWidth={2} />
      <path d="M20 120 L20 128 L300 128 L300 120" className="stroke-foreground" strokeWidth={1.5} />
      <T x={160} y={146} weight={600}>Extensão: todas as notas que você alcança</T>
      <path d="M90 60 L90 52 L230 52 L230 60" className="stroke-success" strokeWidth={1.5} />
      <T x={160} y={44} weight={600} className="fill-success">Tessitura: onde a voz fica confortável</T>
      <T x={20} y={170} anchor="start" size={10} className="fill-muted-foreground">grave</T>
      <T x={300} y={170} anchor="end" size={10} className="fill-muted-foreground">agudo</T>
      <T x={55} y={90} size={9.5} className="fill-muted-foreground">esforço</T>
      <T x={265} y={90} size={9.5} className="fill-muted-foreground">esforço</T>
      <T x={160} y={190} size={10}>escolha tons e vozes pela tessitura, não pelo extremo</T>
    </Svg>
  );
}

function Aquecimento({ className }: Props) {
  const steps = ["Corpo", "Ar", "Lábios", "Hum", "Sirene", "Vogais"];
  return (
    <Svg className={className} label="Sequência do aquecimento: corpo, respiração, vibração de lábios, hum, sirene e vogais, do mais leve para o mais exigente.">
      <T x={160} y={16} size={10.5}>do mais leve para o mais exigente (5 a 10 min)</T>
      {steps.map((s, i) => {
        const x = 34 + i * 51;
        const h = 24 + i * 15;
        return (
          <g key={s}>
            <rect x={x - 18} y={160 - h} width={36} height={h} rx={6} className={i < 2 ? "fill-primary/15 stroke-primary" : i < 4 ? "fill-gold/25 stroke-gold" : "fill-success/25 stroke-success"} strokeWidth={1.5} />
            <T x={x} y={153 - h} size={12} weight={700} className="fill-primary">{i + 1}</T>
            <T x={x} y={176} size={10}>{s}</T>
          </g>
        );
      })}
      <Arrow x1={16} y1={192} x2={304} y2={192} className="stroke-muted-foreground" />
    </Svg>
  );
}

function Hidratacao({ className }: Props) {
  return (
    <Svg className={className} label="Hábitos que cuidam da voz: beber água ao longo do dia, respirar ar úmido, descansar a voz e dormir bem.">
      <g>
        <path d="M30 60 L42 150 L82 150 L94 60 Z" className="fill-primary/15 stroke-primary" strokeWidth={2} />
        <path d="M36 90 L88 90" className="stroke-primary" strokeWidth={1.5} />
        <T x={62} y={172}>Água</T>
        <T x={62} y={186} size={9.5} className="fill-muted-foreground">aos goles, o dia todo</T>
      </g>
      <g>
        <path d="M128 150 L128 110 Q128 96 142 96 L172 96 Q186 96 186 110 L186 150 Z" className="fill-card stroke-foreground" strokeWidth={2} />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${142 + i * 15} 88 Q${136 + i * 15} 74 ${142 + i * 15} 60 Q${148 + i * 15} 48 ${142 + i * 15} 36`} className="stroke-muted-foreground" strokeWidth={2} />
        ))}
        <T x={157} y={172}>Vapor</T>
        <T x={157} y={186} size={9.5} className="fill-muted-foreground">ar úmido ajuda</T>
      </g>
      <g>
        <circle cx={252} cy={106} r={32} className="fill-gold/40 stroke-gold" strokeWidth={2} />
        <circle cx={268} cy={94} r={28} className="fill-card" />
        <T x={252} y={172}>Descanso</T>
        <T x={252} y={186} size={9.5} className="fill-muted-foreground">voz e sono em dia</T>
      </g>
    </Svg>
  );
}

function FraseRespiracao({ className }: Props) {
  const words = ["Uma", "só", "voz,", "um", "só", "louvor"];
  return (
    <Svg className={className} label="Frase cantada com marcas de respiração: respire antes de começar e no fim da frase, nunca no meio de uma palavra; o arco mostra a frase inteira em um só fôlego.">
      <path d="M40 80 Q160 20 280 80" className="stroke-primary" strokeWidth={2.5} />
      {words.map((w, i) => (
        <T key={i} x={52 + i * 44} y={110} size={14} weight={500}>
          {w}
        </T>
      ))}
      <T x={26} y={92} size={20} weight={700} className="fill-gold">’</T>
      <T x={300} y={92} size={20} weight={700} className="fill-gold">’</T>
      <T x={26} y={140} size={10} className="fill-gold">respire</T>
      <T x={300} y={140} size={10} className="fill-gold">respire</T>
      <T x={160} y={40} size={10.5} className="fill-primary">uma frase, um fôlego</T>
      <T x={160} y={176} size={10.5}>planeje onde respirar antes de cantar</T>
    </Svg>
  );
}

function Dinamica({ className }: Props) {
  const marks = ["pp", "p", "mp", "mf", "f", "ff"];
  return (
    <Svg className={className} label="Dinâmica: do pianíssimo (pp, bem suave) ao fortíssimo (ff, bem forte), com o sinal de crescendo entre eles.">
      <path d="M30 70 L290 50 M30 70 L290 90" className="stroke-primary" strokeWidth={2.5} />
      {marks.map((m, i) => (
        <T key={m} x={36 + i * 50} y={130} size={18 + i * 2} weight={700} className="fill-foreground font-serif italic">
          {m}
        </T>
      ))}
      <T x={36} y={156} size={9.5} className="fill-muted-foreground">bem suave</T>
      <T x={286} y={156} size={9.5} className="fill-muted-foreground">bem forte</T>
      <T x={160} y={30} size={10.5}>crescendo: o som cresce aos poucos</T>
      <T x={160} y={186} size={10}>suave não é fraco: o apoio de ar continua</T>
    </Svg>
  );
}

/* --------------------------------------------------------------------------
 * Leitura e ritmo
 * ------------------------------------------------------------------------ */

function Pauta({ className }: Props) {
  return (
    <Svg className={className} label="Pentagrama: cinco linhas e quatro espaços, contados de baixo para cima. Quanto mais alta a posição, mais aguda a nota.">
      <StaffLines x={60} y={50} w={200} gap={20} className="stroke-foreground" />
      {[1, 2, 3, 4, 5].map((n) => (
        <T key={n} x={48} y={134 - (n - 1) * 20} size={11} weight={600} className="fill-primary">{n}</T>
      ))}
      {[1, 2, 3, 4].map((n) => (
        <T key={n} x={276} y={124 - (n - 1) * 20} size={11} weight={600} className="fill-gold">{n}</T>
      ))}
      <T x={36} y={30} size={10} className="fill-primary">linhas</T>
      <T x={290} y={30} size={10} className="fill-gold">espaços</T>
      <NoteHead x={110} y={130} stem={false} />
      <NoteHead x={160} y={100} stem={false} />
      <NoteHead x={210} y={60} stem={false} />
      <Arrow x1={110} y1={160} x2={226} y2={160} className="stroke-muted-foreground" />
      <T x={168} y={182} size={10.5}>mais alto na pauta = mais agudo</T>
    </Svg>
  );
}

function Claves({ className }: Props) {
  return (
    <Svg className={className} label="Clave de Sol começa na segunda linha e marca a nota Sol; clave de Fá começa na quarta linha e marca a nota Fá. Vozes agudas leem em clave de Sol e vozes graves em clave de Fá.">
      <T x={85} y={18} weight={600}>Clave de Sol</T>
      <StaffLines x={20} y={56} w={130} gap={12} className="stroke-foreground" />
      <Music x={40} y={110} size={54}>𝄞</Music>
      <NoteHead x={110} y={92} stem={false} className="fill-gold" />
      <T x={85} y={140} size={10}>2ª linha = Sol</T>
      <T x={85} y={154} size={9.5} className="fill-muted-foreground">sopranos, contraltos, tenores*</T>
      <T x={235} y={18} weight={600}>Clave de Fá</T>
      <StaffLines x={170} y={56} w={130} gap={12} className="stroke-foreground" />
      <Music x={190} y={92} size={42}>𝄢</Music>
      <NoteHead x={260} y={68} stem={false} className="fill-gold" />
      <T x={235} y={140} size={10}>4ª linha = Fá</T>
      <T x={235} y={154} size={9.5} className="fill-muted-foreground">barítonos e baixos</T>
      <T x={160} y={188} size={9.5} className="fill-muted-foreground">* o tenor lê em Sol, soando uma oitava abaixo</T>
    </Svg>
  );
}

function LinhasSuplementares({ className }: Props) {
  return (
    <Svg className={className} label="Linhas suplementares: pequenas linhas acima ou abaixo da pauta para notas mais agudas ou mais graves. O Dó central fica numa linha suplementar abaixo da clave de Sol.">
      <StaffLines x={70} y={50} w={180} gap={12} className="stroke-foreground" />
      <Music x={92} y={104} size={58}>𝄞</Music>
      <line x1={142} x2={166} y1={110} y2={110} className="stroke-foreground" strokeWidth={1.4} />
      <NoteHead x={154} y={110} className="fill-gold" stem={false} />
      <line x1={202} x2={226} y1={38} y2={38} className="stroke-foreground" strokeWidth={1.4} />
      <NoteHead x={214} y={38} className="fill-primary" stem={false} />
      <T x={154} y={136} size={10.5} className="fill-gold" weight={600}>Dó central (Dó4)</T>
      <T x={214} y={22} size={10.5} className="fill-primary" weight={600}>Lá5</T>
      <T x={160} y={176} size={10.5}>linhas extras ampliam a pauta para cima e para baixo</T>
    </Svg>
  );
}

function FigurasRitmicas({ className }: Props) {
  const rows: { glyph: string; name: string; beats: string; n: number }[] = [
    { glyph: "𝅝", name: "Semibreve", beats: "4 tempos", n: 1 },
    { glyph: "𝅗𝅥", name: "Mínima", beats: "2 tempos", n: 2 },
    { glyph: "♩", name: "Semínima", beats: "1 tempo", n: 4 },
    { glyph: "♪", name: "Colcheia", beats: "½ tempo", n: 8 },
  ];
  return (
    <Svg className={className} label="Árvore das figuras rítmicas: uma semibreve vale quatro tempos e equivale a duas mínimas, quatro semínimas ou oito colcheias." viewBox="0 0 320 210">
      {rows.map((r, i) => {
        const y = 36 + i * 46;
        const w = 200 / r.n;
        return (
          <g key={r.name}>
            <T x={14} y={y + 4} anchor="start" size={11} weight={600}>{r.name}</T>
            <T x={14} y={y + 18} anchor="start" size={9.5} className="fill-muted-foreground">{r.beats}</T>
            {Array.from({ length: r.n }, (_, k) => (
              <g key={k}>
                <rect x={104 + k * w + 2} y={y - 16} width={w - 4} height={32} rx={6} className={i % 2 ? "fill-gold/20" : "fill-primary/12"} />
                <Music x={104 + k * w + w / 2} y={y + 10} size={22}>{r.glyph}</Music>
              </g>
            ))}
          </g>
        );
      })}
    </Svg>
  );
}

function Compasso({ className }: Props) {
  return (
    <Svg className={className} label="Compasso quaternário (4 por 4): quatro tempos por compasso, com o primeiro tempo forte. Compasso ternário (3 por 4): três tempos, o primeiro forte.">
      {[
        { y: 40, top: "4", beats: [true, false, true, false], label: "4/4 — forte, fraco, meio-forte, fraco" },
        { y: 120, top: "3", beats: [true, false, false], label: "3/4 — forte, fraco, fraco (valsa)" },
      ].map((c) => (
        <g key={c.top}>
          <StaffLines x={20} y={c.y} w={280} gap={7} className="stroke-muted-foreground" />
          <T x={36} y={c.y + 13} size={15} weight={800}>{c.top}</T>
          <T x={36} y={c.y + 28} size={15} weight={800}>4</T>
          {c.beats.map((strong, i) => {
            const x = 80 + i * (220 / c.beats.length);
            return (
              <g key={i}>
                <circle cx={x} cy={c.y + 14} r={strong && i === 0 ? 11 : strong ? 8 : 6} className={i === 0 ? "fill-gold" : strong ? "fill-primary/60" : "fill-primary/25"} />
                <T x={x} y={c.y + 48} size={11} weight={600}>{i + 1}</T>
              </g>
            );
          })}
          <line x1={300} x2={300} y1={c.y} y2={c.y + 28} className="stroke-foreground" strokeWidth={1.5} />
          <T x={160} y={c.y + 64} size={10} className="fill-muted-foreground">{c.label}</T>
        </g>
      ))}
    </Svg>
  );
}

function Pulso({ className }: Props) {
  return (
    <Svg className={className} label="O pulso é uma batida regular, como o coração ou o metrônomo; as notas se encaixam nessa batida constante.">
      <path d="M20 100 L60 100 L70 70 L82 130 L92 100 L140 100 L150 70 L162 130 L172 100 L220 100 L230 70 L242 130 L252 100 L300 100" className="stroke-destructive" strokeWidth={2.5} />
      {[76, 156, 236].map((x) => (
        <circle key={x} cx={x} cy={150} r={8} className="fill-primary" />
      ))}
      <T x={160} y={40} size={11} weight={600}>Pulso: batida regular, que não acelera nem atrasa</T>
      <T x={160} y={182} size={10} className="fill-muted-foreground">bata o pé, conte em voz alta, use o metrônomo</T>
    </Svg>
  );
}

function PartituraVocal({ className }: Props) {
  const parts = ["Soprano", "Contralto", "Tenor", "Baixo"];
  return (
    <Svg className={className} label="Partitura vocal a quatro vozes: cada pauta mostra uma voz (soprano, contralto, tenor e baixo), a letra fica abaixo das notas e os números de compasso ajudam a se localizar." viewBox="0 0 320 220">
      <path d="M40 16 Q32 16 32 24 L32 196 Q32 204 40 204" className="stroke-foreground" strokeWidth={3} />
      {parts.map((p, i) => {
        const y = 22 + i * 48;
        return (
          <g key={p}>
            <StaffLines x={44} y={y} w={262} gap={6} className="stroke-muted-foreground" />
            <T x={308} y={y - 3} anchor="end" size={9} weight={600} className={["fill-voice-1", "fill-voice-2", "fill-voice-3", "fill-voice-4"][i]}>{p}</T>
            {[0, 1, 2, 3].map((k) => (
              <ellipse key={k} cx={84 + k * 56} cy={y + 12 - ((i + k) % 3) * 3} rx={4.5} ry={3.4} className="fill-foreground" />
            ))}
            {i === 0 && (
              <g>
                <T x={84} y={y + 36} size={9.5}>U-</T>
                <T x={140} y={y + 36} size={9.5}>ma</T>
                <T x={196} y={y + 36} size={9.5}>só</T>
                <T x={252} y={y + 36} size={9.5}>voz</T>
              </g>
            )}
          </g>
        );
      })}
      <T x={50} y={12} anchor="start" size={9} className="fill-gold" weight={600}>compasso 1</T>
      <line x1={174} x2={174} y1={22} y2={190} className="stroke-muted-foreground" strokeDasharray="3 3" />
      <T x={160} y={216} size={10}>siga a sua pauta, mas olhe as outras para se localizar</T>
    </Svg>
  );
}

/* --------------------------------------------------------------------------
 * Afinação, percepção e conjunto
 * ------------------------------------------------------------------------ */

function wave(x0: number, y0: number, w: number, amp: number, periods: number, phase = 0) {
  let d = `M${x0} ${y0}`;
  for (let i = 0; i <= 120; i++) {
    const t = i / 120;
    d += ` L${(x0 + t * w).toFixed(1)} ${(y0 + Math.sin(phase + t * periods * Math.PI * 2) * amp).toFixed(1)}`;
  }
  return d;
}

function OndaAfinada({ className }: Props) {
  return (
    <Svg className={className} label="Duas ondas sonoras idênticas e sobrepostas: quando duas vozes cantam a mesma nota afinadas, o som soa como um só, estável.">
      <path d={wave(20, 90, 280, 36, 6)} className="stroke-primary" strokeWidth={5} opacity={0.35} />
      <path d={wave(20, 90, 280, 36, 6)} className="stroke-gold" strokeWidth={2} />
      <Check x={300} y={30} />
      <T x={160} y={160} size={11} weight={600}>Afinado: as ondas coincidem</T>
      <T x={160} y={176} size={10} className="fill-muted-foreground">o som fica limpo e estável, “um só”</T>
    </Svg>
  );
}

function OndaDesafinada({ className }: Props) {
  let env = "M20 90";
  for (let i = 0; i <= 160; i++) {
    const t = i / 160;
    const a = 36 * Math.abs(Math.cos(t * Math.PI * 2));
    env += ` L${(20 + t * 280).toFixed(1)} ${(90 + Math.sin(t * 22 * Math.PI * 2) * a).toFixed(1)}`;
  }
  return (
    <Svg className={className} label="Duas ondas com frequências um pouco diferentes geram batimentos: o volume oscila, como um “uá-uá”. Esse balanço é o sinal de desafinação.">
      <path d={env} className="stroke-destructive" strokeWidth={1.8} />
      <path d="M20 54 Q90 90 160 54 Q230 18 300 54" className="stroke-muted-foreground" strokeWidth={1.5} strokeDasharray="4 4" />
      <Cross x={300} y={24} />
      <T x={160} y={160} size={11} weight={600}>Desafinado: o som “balança” (batimento)</T>
      <T x={160} y={176} size={10} className="fill-muted-foreground">quanto mais lento o balanço, mais perto da afinação</T>
    </Svg>
  );
}

function Unissono({ className }: Props) {
  return (
    <Svg className={className} label="Uníssono: várias vozes cantando a mesma melodia com a mesma altura, ritmo, vogal e respiração se juntam num único som.">
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <circle cx={30} cy={40 + i * 36} r={10} className={["fill-voice-1", "fill-voice-2", "fill-voice-3", "fill-voice-4"][i]} />
          <path d={`M44 ${40 + i * 36} C120 ${40 + i * 36} 140 100 200 100`} className="stroke-muted-foreground" strokeWidth={2} />
        </g>
      ))}
      <path d={wave(200, 100, 100, 14, 3)} className="stroke-primary" strokeWidth={5} />
      <T x={250} y={140} size={11} weight={600}>uma só voz</T>
      <T x={160} y={186} size={10} className="fill-muted-foreground">mesma nota · mesmo ritmo · mesma vogal · mesmo fôlego</T>
    </Svg>
  );
}

function NaipesSatb({ className }: Props) {
  const seats = [
    { label: "S", name: "Sopranos", x: 64, y: 92, cls: "fill-voice-1" },
    { label: "C", name: "Contraltos", x: 124, y: 62, cls: "fill-voice-2" },
    { label: "T", name: "Tenores", x: 196, y: 62, cls: "fill-voice-3" },
    { label: "B", name: "Baixos", x: 256, y: 92, cls: "fill-voice-4" },
  ];
  return (
    <Svg className={className} label="Disposição de um coral a quatro vozes em semicírculo diante do regente: sopranos, contraltos, tenores e baixos, do agudo feminino ao grave masculino.">
      <path d="M30 120 Q160 0 290 120" className="stroke-muted-foreground" strokeWidth={1.5} strokeDasharray="4 4" />
      {seats.map((s) => (
        <g key={s.label}>
          <circle cx={s.x} cy={s.y} r={22} className={s.cls} opacity={0.85} />
          <T x={s.x} y={s.y + 6} size={18} weight={800} className="fill-white">{s.label}</T>
          <T x={s.x} y={s.y + 38} size={10}>{s.name}</T>
        </g>
      ))}
      <circle cx={160} cy={168} r={10} className="fill-foreground" />
      <T x={160} y={194} size={10} weight={600}>Regente</T>
      <T x={64} y={150} size={9} className="fill-muted-foreground">agudas femininas</T>
      <T x={256} y={150} size={9} className="fill-muted-foreground">graves masculinas</T>
    </Svg>
  );
}

function QuartetoTtbb({ className }: Props) {
  const v = [
    { name: "1º tenor", sub: "a mais aguda", cls: "fill-voice-1" },
    { name: "2º tenor", sub: "a melodia", cls: "fill-voice-2" },
    { name: "Barítono", sub: "completa o acorde", cls: "fill-voice-3" },
    { name: "Baixo", sub: "a base", cls: "fill-voice-4" },
  ];
  return (
    <Svg className={className} label="Quarteto masculino: primeiro tenor na voz mais aguda, segundo tenor com a melodia, barítono completando o acorde e baixo como base.">
      {v.map((p, i) => (
        <g key={p.name}>
          <rect x={30} y={20 + i * 42} width={260 - i * 40} height={32} rx={10} className={p.cls} opacity={0.85} />
          <T x={44} y={41 + i * 42} anchor="start" size={12} weight={700} className="fill-white">{p.name}</T>
          <T x={282 - i * 40} y={41 + i * 42} anchor="end" size={10} className="fill-white">{p.sub}</T>
        </g>
      ))}
      <T x={160} y={196} size={10} className="fill-muted-foreground">do agudo (em cima) ao grave (embaixo)</T>
    </Svg>
  );
}

function Equilibrio({ className }: Props) {
  const groups = [
    { label: "Equilibrado", bars: [60, 58, 62, 60], ok: true },
    { label: "Desequilibrado", bars: [40, 96, 38, 44], ok: false },
  ];
  return (
    <Svg className={className} label="Equilíbrio entre naipes: à esquerda, os quatro naipes com volumes parecidos; à direita, um naipe muito mais forte encobrindo os outros.">
      {groups.map((g, gi) => (
        <g key={g.label}>
          {g.bars.map((h, i) => (
            <rect key={i} x={30 + gi * 160 + i * 30} y={150 - h} width={22} height={h} rx={4} className={["fill-voice-1", "fill-voice-2", "fill-voice-3", "fill-voice-4"][i]} />
          ))}
          <T x={72 + gi * 160} y={172} weight={600}>{g.label}</T>
          {g.ok ? <Check x={140} y={30} /> : <Cross x={300} y={30} />}
        </g>
      ))}
      <T x={160} y={194} size={10} className="fill-muted-foreground">se você não ouve os outros naipes, está forte demais</T>
    </Svg>
  );
}

function Regente({ className }: Props) {
  return (
    <Svg className={className} label="Gesto do regente em compasso de quatro tempos: para baixo no 1, para dentro no 2, para fora no 3 e para cima no 4. O gesto de preparação vem um tempo antes da entrada, e é nele que se respira.">
      <circle cx={160} cy={100} r={6} className="fill-foreground" />
      <Arrow x1={160} y1={40} x2={160} y2={150} className="stroke-primary" />
      <Arrow x1={160} y1={150} x2={90} y2={110} className="stroke-primary" />
      <Arrow x1={90} y1={110} x2={240} y2={110} className="stroke-primary" />
      <Arrow x1={240} y1={110} x2={168} y2={42} className="stroke-gold" />
      <T x={172} y={160} size={14} weight={700} className="fill-primary">1</T>
      <T x={78} y={106} size={14} weight={700} className="fill-primary">2</T>
      <T x={252} y={106} size={14} weight={700} className="fill-primary">3</T>
      <T x={214} y={62} size={14} weight={700} className="fill-gold">4</T>
      <T x={232} y={40} anchor="start" size={10} className="fill-gold">preparação:</T>
      <T x={232} y={52} anchor="start" size={10} className="fill-gold">respire aqui</T>
      <T x={160} y={190} size={10.5}>a entrada acontece no tempo seguinte ao gesto de preparo</T>
    </Svg>
  );
}

function EscutaAtiva({ className }: Props) {
  return (
    <Svg className={className} label="Escuta ativa: enquanto canta, metade da atenção fica na sua voz e metade no grupo, para ajustar volume, afinação e ritmo.">
      <path d="M150 50 Q186 46 190 84 Q192 108 172 122 Q160 132 162 150 Q160 166 144 162" className="stroke-foreground" strokeWidth={4} />
      <path d="M162 84 Q168 74 176 82" className="stroke-foreground" strokeWidth={3} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${110 - i * 18} ${70 - i * 6} Q${96 - i * 18} 100 ${110 - i * 18} ${130 + i * 6}`} className="stroke-primary" strokeWidth={2.5} />
      ))}
      {[0, 1, 2].map((i) => (
        <path key={`r${i}`} d={`M${214 + i * 18} ${70 - i * 6} Q${228 + i * 18} 100 ${214 + i * 18} ${130 + i * 6}`} className="stroke-gold" strokeWidth={2.5} />
      ))}
      <T x={68} y={168} size={11} weight={600} className="fill-primary">50% o grupo</T>
      <T x={254} y={168} size={11} weight={600} className="fill-gold">50% você</T>
      <T x={160} y={194} size={10} className="fill-muted-foreground">cante ouvindo: ajuste volume, afinação e tempo</T>
    </Svg>
  );
}

/* --------------------------------------------------------------------------
 * Teoria
 * ------------------------------------------------------------------------ */

function TomSemitom({ className }: Props) {
  return (
    <Svg className={className} label="No teclado, semitom é a menor distância entre duas teclas vizinhas, como Mi e Fá; tom são dois semitons, como Fá e Sol, que têm uma tecla preta entre elas.">
      <T x={104} y={20} size={10.5} weight={600} className="fill-gold">semitom (Mi → Fá)</T>
      <path d="M90 36 L90 28 L118 28 L118 36" className="stroke-gold" strokeWidth={2} />
      <MiniKeys x={20} y={40} n={10} highlight={{ 2: "fill-gold/40", 3: "fill-gold/40", 4: "fill-primary/25" }} />
      {["Dó", "Ré", "Mi", "Fá", "Sol", "Lá", "Si", "Dó", "Ré", "Mi"].map((n, i) => (
        <T key={i} x={34 + i * 28} y={122} size={8.5} className="fill-muted-foreground">{n}</T>
      ))}
      <path d="M118 136 L118 144 L146 144 L146 136" className="stroke-primary" strokeWidth={2} />
      <T x={132} y={160} size={10.5} weight={600} className="fill-primary">tom (Fá → Sol)</T>
      <T x={160} y={190} size={10} className="fill-muted-foreground">semitom = vizinha mais próxima · tom = 2 semitons</T>
    </Svg>
  );
}

function IntervaloEscada({ className }: Props) {
  const names = ["1ª", "2ª", "3ª", "4ª", "5ª", "6ª", "7ª", "8ª"];
  return (
    <Svg className={className} label="Escada de intervalos a partir de Dó: segunda, terça, quarta, quinta, sexta, sétima e oitava. Cada degrau sobe uma nota da escala.">
      {names.map((n, i) => (
        <g key={n}>
          <rect x={20 + i * 36} y={170 - (i + 1) * 15} width={34} height={(i + 1) * 15} rx={4} className={[2, 4, 7].includes(i) ? "fill-gold/40 stroke-gold" : "fill-primary/15 stroke-primary"} strokeWidth={1.2} />
          <T x={37 + i * 36} y={164 - (i + 1) * 15} size={11} weight={700}>{n}</T>
          <T x={37 + i * 36} y={186} size={9} className="fill-muted-foreground">{["Dó", "Ré", "Mi", "Fá", "Sol", "Lá", "Si", "Dó"][i]}</T>
        </g>
      ))}
      <T x={160} y={16} size={10.5}>em destaque: terça, quinta e oitava (as mais usadas)</T>
    </Svg>
  );
}

function Triade({ className }: Props) {
  return (
    <Svg className={className} label="Tríade: três notas empilhadas em terças. Fundamental embaixo, terça no meio e quinta em cima, como Dó, Mi e Sol no acorde de Dó maior.">
      <StaffLines x={40} y={60} w={120} gap={12} className="stroke-foreground" />
      <Music x={58} y={114} size={54}>𝄞</Music>
      <line x1={88} x2={112} y1={120} y2={120} className="stroke-foreground" strokeWidth={1.4} />
      <NoteHead x={100} y={120} stem={false} className="fill-primary" />
      <NoteHead x={100} y={108} stem={false} className="fill-gold" />
      <NoteHead x={100} y={96} stem={false} className="fill-success" />
      {[
        { y: 96, t: "quinta (Sol)", c: "fill-success" },
        { y: 108, t: "terça (Mi)", c: "fill-gold" },
        { y: 120, t: "fundamental (Dó)", c: "fill-primary" },
      ].map((r) => (
        <g key={r.t}>
          <line x1={112} x2={188} y1={r.y} y2={r.y} className="stroke-muted-foreground" strokeDasharray="2 3" />
          <T x={194} y={r.y + 4} anchor="start" size={11} weight={600} className={r.c}>{r.t}</T>
        </g>
      ))}
      <T x={160} y={30} size={11} weight={600}>Acorde = notas empilhadas de 3 em 3</T>
      <T x={160} y={176} size={10} className="fill-muted-foreground">a terça decide se o acorde é maior ou menor</T>
    </Svg>
  );
}

function Inversoes({ className }: Props) {
  const stacks = [
    { name: "Estado fundamental", notes: ["Dó", "Mi", "Sol"] },
    { name: "1ª inversão", notes: ["Mi", "Sol", "Dó"] },
    { name: "2ª inversão", notes: ["Sol", "Dó", "Mi"] },
  ];
  return (
    <Svg className={className} label="Inversões do acorde de Dó maior: estado fundamental com Dó no baixo, primeira inversão com Mi no baixo e segunda inversão com Sol no baixo.">
      {stacks.map((s, i) => (
        <g key={s.name}>
          {s.notes.map((n, k) => (
            <g key={k}>
              <rect x={30 + i * 96} y={130 - k * 34} width={70} height={28} rx={8} className={n === "Dó" ? "fill-primary/30 stroke-primary" : "fill-card stroke-muted-foreground"} strokeWidth={1.5} />
              <T x={65 + i * 96} y={149 - k * 34} size={12} weight={k === 0 ? 700 : 500}>{n}</T>
            </g>
          ))}
          <T x={65 + i * 96} y={180} size={9.5} weight={600}>{s.name}</T>
          <T x={65 + i * 96} y={194} size={9} className="fill-muted-foreground">baixo: {s.notes[0]}</T>
        </g>
      ))}
      <T x={160} y={24} size={10.5}>mesmas notas, ordem diferente (quem está no baixo muda)</T>
    </Svg>
  );
}

function MovimentosVozes({ className }: Props) {
  const kinds = [
    { name: "Paralelo", a: "M10 60 L80 30", b: "M10 90 L80 60" },
    { name: "Contrário", a: "M10 40 L80 70", b: "M10 100 L80 70" },
    { name: "Oblíquo", a: "M10 40 L80 40", b: "M10 100 L80 60" },
  ];
  return (
    <Svg className={className} label="Movimentos entre duas vozes: paralelo, quando as duas sobem ou descem juntas; contrário, quando uma sobe e a outra desce; oblíquo, quando uma fica parada e a outra se move.">
      {kinds.map((k, i) => (
        <g key={k.name} transform={`translate(${16 + i * 100} 20)`}>
          <rect x={0} y={10} width={90} height={110} rx={10} className="fill-card stroke-muted-foreground" strokeWidth={1.2} />
          <path d={k.a} className="stroke-voice-1" strokeWidth={4} />
          <path d={k.b} className="stroke-voice-3" strokeWidth={4} />
          <T x={45} y={146} size={11} weight={600}>{k.name}</T>
        </g>
      ))}
      <T x={160} y={190} size={10} className="fill-muted-foreground">o contrário e o oblíquo ajudam cada voz a manter a própria linha</T>
    </Svg>
  );
}

function CampoHarmonico({ className }: Props) {
  const deg = [
    { r: "I", c: "C", f: "T" },
    { r: "ii", c: "Dm", f: "S" },
    { r: "iii", c: "Em", f: "T" },
    { r: "IV", c: "F", f: "S" },
    { r: "V", c: "G", f: "D" },
    { r: "vi", c: "Am", f: "T" },
    { r: "vii°", c: "B°", f: "D" },
  ];
  const cls: Record<string, string> = { T: "fill-primary/25 stroke-primary", S: "fill-gold/30 stroke-gold", D: "fill-destructive/20 stroke-destructive" };
  return (
    <Svg className={className} label="Campo harmônico de Dó maior: sete acordes formados sobre cada nota da escala, agrupados em funções: tônica (repouso), subdominante (afastamento) e dominante (tensão que pede resolução).">
      {deg.map((d, i) => (
        <g key={d.r}>
          <rect x={14 + i * 42} y={50} width={38} height={70} rx={8} className={cls[d.f]} strokeWidth={1.5} />
          <T x={33 + i * 42} y={78} size={13} weight={700}>{d.r}</T>
          <T x={33 + i * 42} y={100} size={11}>{d.c}</T>
          <T x={33 + i * 42} y={138} size={10} weight={600}>{d.f}</T>
        </g>
      ))}
      <T x={160} y={30} size={11} weight={600}>Campo harmônico de Dó maior</T>
      <T x={14} y={166} anchor="start" size={9.5} className="fill-primary">T = tônica (repouso, “casa”)</T>
      <T x={14} y={180} anchor="start" size={9.5} className="fill-gold">S = subdominante (afastamento)</T>
      <T x={14} y={194} anchor="start" size={9.5} className="fill-destructive">D = dominante (tensão que pede a tônica)</T>
    </Svg>
  );
}

function Cadencia({ className }: Props) {
  const rows = [
    { from: "V", to: "I", name: "Conclusiva (perfeita)", sub: "ponto final", cls: "stroke-success" },
    { from: "IV", to: "I", name: "Plagal", sub: "o “Amém” dos hinos", cls: "stroke-gold" },
    { from: "I", to: "V", name: "Suspensiva", sub: "vírgula: pede continuação", cls: "stroke-primary" },
  ];
  return (
    <Svg className={className} label="Cadências: a conclusiva vai do quinto ao primeiro grau e soa como ponto final; a plagal vai do quarto ao primeiro, como o Amém dos hinos; a suspensiva para no quinto grau e soa como uma vírgula.">
      {rows.map((r, i) => (
        <g key={r.name}>
          <circle cx={40} cy={40 + i * 54} r={18} className="fill-card stroke-foreground" strokeWidth={1.5} />
          <T x={40} y={45 + i * 54} size={13} weight={700}>{r.from}</T>
          <Arrow x1={62} y1={40 + i * 54} x2={104} y2={40 + i * 54} className={r.cls} />
          <circle cx={126} cy={40 + i * 54} r={18} className="fill-card stroke-foreground" strokeWidth={1.5} />
          <T x={126} y={45 + i * 54} size={13} weight={700}>{r.to}</T>
          <T x={160} y={38 + i * 54} anchor="start" size={11} weight={600}>{r.name}</T>
          <T x={160} y={52 + i * 54} anchor="start" size={10} className="fill-muted-foreground">{r.sub}</T>
        </g>
      ))}
    </Svg>
  );
}

function Cifra({ className }: Props) {
  return (
    <Svg className={className} label="Anatomia da cifra C sustenido menor com sétima: a letra é a nota fundamental, o sustenido é o acidente, o m indica acorde menor e o 7 acrescenta a sétima.">
      <T x={160} y={100} size={56} weight={800} className="fill-foreground">C♯m7</T>
      {[
        { x: 98, label: "nota (C = Dó)", y: 140, c: "fill-primary" },
        { x: 138, label: "acidente (♯)", y: 160, c: "fill-gold" },
        { x: 182, label: "m = menor", y: 140, c: "fill-success" },
        { x: 222, label: "7 = sétima", y: 160, c: "fill-destructive" },
      ].map((l) => (
        <g key={l.label}>
          <line x1={l.x} x2={l.x} y1={110} y2={l.y - 12} className="stroke-muted-foreground" strokeDasharray="2 3" />
          <T x={l.x} y={l.y} size={10.5} weight={600} className={l.c}>{l.label}</T>
        </g>
      ))}
      <T x={160} y={34} size={10.5} className="fill-muted-foreground">A B C D E F G = Lá Si Dó Ré Mi Fá Sol</T>
    </Svg>
  );
}

const MAP: Record<IllustrationName, (p: Props) => React.ReactElement> = {
  "postura-comparada": PosturaComparada,
  "postura-sentada": PosturaSentada,
  respiracao: Respiracao,
  "aparelho-vocal": AparelhoVocal,
  ressonancia: Ressonancia,
  vogais: Vogais,
  mandibula: Mandibula,
  registros: Registros,
  "extensao-tessitura": ExtensaoTessitura,
  aquecimento: Aquecimento,
  hidratacao: Hidratacao,
  pauta: Pauta,
  claves: Claves,
  "linhas-suplementares": LinhasSuplementares,
  "figuras-ritmicas": FigurasRitmicas,
  compasso: Compasso,
  pulso: Pulso,
  "onda-afinada": OndaAfinada,
  "onda-desafinada": OndaDesafinada,
  unissono: Unissono,
  "naipes-satb": NaipesSatb,
  "quarteto-ttbb": QuartetoTtbb,
  equilibrio: Equilibrio,
  regente: Regente,
  "escuta-ativa": EscutaAtiva,
  "tom-semitom": TomSemitom,
  "intervalo-escada": IntervaloEscada,
  triade: Triade,
  inversoes: Inversoes,
  "movimentos-vozes": MovimentosVozes,
  "campo-harmonico": CampoHarmonico,
  cadencia: Cadencia,
  cifra: Cifra,
  "partitura-vocal": PartituraVocal,
  dinamica: Dinamica,
  "frase-respiracao": FraseRespiracao,
};

export function Illustration({ name, caption, className }: { name: IllustrationName; caption?: string; className?: string }) {
  const Comp = MAP[name];
  if (!Comp) return null;
  return (
    <figure className={cn("space-y-2", className)}>
      <div className="mx-auto max-w-md rounded-2xl border bg-card p-3 sm:p-4">
        <Comp />
      </div>
      {caption && <figcaption className="text-center text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

export const ILLUSTRATION_COMPONENTS = MAP;
