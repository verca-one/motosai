export type ErrorType = "맞춤법" | "띄어쓰기" | "문장부호";

export type SpellRule = {
  pattern: RegExp;
  replacement: string;
  type: ErrorType;
  help: string;
};

export const SPELL_RULES: SpellRule[] = [
  // ── 됐/됬 ──
  { pattern: /됬/g, replacement: "됐", type: "맞춤법", help: "'-됬-'은 '-됐-'으로 써야 합니다." },
  { pattern: /됬습니다/g, replacement: "됐습니다", type: "맞춤법", help: "'-됬습니다'는 '-됐습니다'로 써야 합니다." },

  // ── 안/않 혼동 ──
  { pattern: /않돼요/g, replacement: "안 돼요", type: "맞춤법", help: "'않돼요'는 '안 돼요'로 써야 합니다." },
  { pattern: /않돼/g, replacement: "안 돼", type: "맞춤법", help: "'않돼'는 '안 돼'로 써야 합니다." },
  { pattern: /않되/g, replacement: "안 돼", type: "맞춤법", help: "'않되'는 '안 돼'로 써야 합니다." },
  { pattern: /않됩니다/g, replacement: "안 됩니다", type: "맞춤법", help: "'않됩니다'는 '안 됩니다'로 써야 합니다." },
  { pattern: /않됩/g, replacement: "안 됩", type: "맞춤법", help: "'않됩'은 '안 됩'으로 써야 합니다." },

  // ── 되/돼 혼동 ──
  { pattern: /되요/g, replacement: "돼요", type: "맞춤법", help: "'되요'는 '돼요'로 써야 합니다." },
  { pattern: /되서/g, replacement: "돼서", type: "맞춤법", help: "'되서'는 '돼서'로 써야 합니다." },
  { pattern: /(\S)되야/g, replacement: "$1돼야", type: "맞춤법", help: "'-되야'는 '-돼야'로 써야 합니다." },

  // ── 자주 틀리는 단어 ──
  { pattern: /몇일/g, replacement: "며칠", type: "맞춤법", help: "'몇일'은 '며칠'로 써야 합니다." },
  { pattern: /웬지/g, replacement: "왠지", type: "맞춤법", help: "'웬지'는 '왠지'로 써야 합니다. '왠지'는 '왜인지'의 준말입니다." },
  { pattern: /금새/g, replacement: "금세", type: "맞춤법", help: "'금새'는 '금세'로 써야 합니다." },
  { pattern: /오랫만에/g, replacement: "오랜만에", type: "맞춤법", help: "'오랫만에'는 '오랜만에'로 써야 합니다." },
  { pattern: /어떻해/g, replacement: "어떡해", type: "맞춤법", help: "'어떻해'는 '어떡해'로 써야 합니다." },
  { pattern: /설레임/g, replacement: "설렘", type: "맞춤법", help: "'설레임'은 '설렘'으로 써야 합니다." },
  { pattern: /너무나도/g, replacement: "너무나", type: "맞춤법", help: "'너무나도'는 '너무나'로 쓰는 것이 자연스럽습니다." },
  { pattern: /낳은/g, replacement: "나은", type: "맞춤법", help: "'낳은'과 '나은'을 혼동하지 마세요. 비교의 의미면 '나은'입니다." },
  { pattern: /않좋/g, replacement: "안 좋", type: "맞춤법", help: "'않좋-'은 '안 좋-'으로 써야 합니다." },
  { pattern: /안되/g, replacement: "안 돼", type: "맞춤법", help: "'안되'는 '안 돼'로 띄어 써야 합니다." },
  { pattern: /어의없/g, replacement: "어이없", type: "맞춤법", help: "'어의없'은 '어이없'으로 써야 합니다." },
  { pattern: /어이없는/g, replacement: "어이없는", type: "맞춤법", help: "" }, // correct, skip

  // ── 띄어쓰기 ──
  { pattern: /할수있/g, replacement: "할 수 있", type: "띄어쓰기", help: "의존 명사 '수'는 앞말과 띄어 씁니다." },
  { pattern: /할수없/g, replacement: "할 수 없", type: "띄어쓰기", help: "의존 명사 '수'는 앞말과 띄어 씁니다." },
  { pattern: /것같/g, replacement: "것 같", type: "띄어쓰기", help: "'것 같-'은 앞말과 띄어 써야 합니다." },
  { pattern: /있는게/g, replacement: "있는 게", type: "띄어쓰기", help: "'것이'의 준말 '게'는 앞말과 띄어 씁니다." },
  { pattern: /없는게/g, replacement: "없는 게", type: "띄어쓰기", help: "'것이'의 준말 '게'는 앞말과 띄어 씁니다." },
  { pattern: /하는게/g, replacement: "하는 게", type: "띄어쓰기", help: "'것이'의 준말 '게'는 앞말과 띄어 씁니다." },
  { pattern: /인것/g, replacement: "인 것", type: "띄어쓰기", help: "의존 명사 '것'은 앞말과 띄어 씁니다." },
  { pattern: /이것을/g, replacement: "이것을", type: "띄어쓰기", help: "" }, // correct
  { pattern: /([가-힣])뿐만아니라/g, replacement: "$1 뿐만 아니라", type: "띄어쓰기", help: "'뿐'과 '아니라'는 앞뒤로 띄어 씁니다." },
  { pattern: /([가-힣])만큼/g, replacement: "$1 만큼", type: "띄어쓰기", help: "의존 명사 '만큼'은 앞말과 띄어 씁니다." },
  { pattern: /([가-힣])때문에/g, replacement: "$1 때문에", type: "띄어쓰기", help: "의존 명사 '때문에'는 앞말과 띄어 씁니다." },
  { pattern: /([가-힣])대로/g, replacement: "$1 대로", type: "띄어쓰기", help: "의존 명사 '대로'는 앞말과 띄어 씁니다." },

  // ── 문장부호 ──
  { pattern: /  +/g, replacement: " ", type: "문장부호", help: "띄어쓰기가 연속으로 사용되었습니다." },
];

export type SpellError = {
  id: string;
  original: string;
  suggestion: string;
  type: ErrorType;
  help: string;
  start: number;
  end: number;
  ignored: boolean;
};

export function runSpellCheck(text: string): SpellError[] {
  const errors: SpellError[] = [];
  let idCounter = 0;

  for (const rule of SPELL_RULES) {
    if (!rule.replacement || !rule.help) continue; // skip non-errors
    rule.pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = rule.pattern.exec(text)) !== null) {
      const original = match[0];
      const suggestion = original.replace(rule.pattern, rule.replacement);
      if (original === suggestion) continue;
      // Avoid overlapping errors
      const start = match.index;
      const end = start + original.length;
      const overlaps = errors.some(e => e.start < end && e.end > start);
      if (!overlaps) {
        errors.push({ id: `err-${idCounter++}`, original, suggestion, type: rule.type, help: rule.help, start, end, ignored: false });
      }
      rule.pattern.lastIndex = match.index + 1;
    }
  }

  return errors.sort((a, b) => a.start - b.start);
}
