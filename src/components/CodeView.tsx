import type { BlockInstance } from '../types';
import { BLOCK_DEFS } from './Blocks/blockDefinitions';

interface Props {
  blocks: BlockInstance[];
}

function generateCode(blocks: BlockInstance[], indent: number = 0): string {
  const pad = '    '.repeat(indent);
  let result = '';

  for (const block of blocks) {
    const def = BLOCK_DEFS.find(d => d.id === block.defId);
    if (!def) continue;

    const paramStr = block.params.map(p => p.value).join(', ');
    const hasParams = block.params.length > 0;
    const paramComment = block.params
      .map(p => {
        const paramDef = def.params?.find(pd => pd.name === p.name);
        return paramDef?.unit ? `# ${paramDef.unit}` : '';
      })
      .filter(Boolean)
      .join(' ');

    const fnName = block.defId;

    if (def.isHat) {
      result += `${pad}${fnName}():\n`;
    } else if (def.isContainer) {
      const call = hasParams ? `${fnName}(${paramStr})` : fnName;
      result += `${pad}${call}:\n`;
      if (block.children.length > 0) {
        result += generateCode(block.children, indent + 1);
      } else {
        result += `${'    '.repeat(indent + 1)}pass\n`;
      }
    } else {
      const call = hasParams
        ? `${fnName}(${paramStr})${paramComment ? '  ' + paramComment : ''}`
        : `${fnName}()`;
      result += `${pad}${call}\n`;
    }
  }

  return result;
}

interface TokenProps {
  text: string;
  color: string;
  bold?: boolean;
}

function Token({ text, color, bold }: TokenProps) {
  return (
    <span
      style={{
        color,
        fontWeight: bold ? 700 : 400,
      }}
    >
      {text}
    </span>
  );
}

function ColoredCodeLine({ line }: { line: string }) {
  // Simple tokenizer for pseudocode lines
  const trimmed = line.trimStart();
  const indent = line.length - trimmed.length;
  const indentStr = ' '.repeat(indent);

  if (trimmed.startsWith('#')) {
    return (
      <div>
        <span style={{ color: '#4A90E2', fontStyle: 'italic' }}>{line}</span>
      </div>
    );
  }

  // Tokenize: keyword(params):  or  keyword(params)  # comment
  const commentSplit = trimmed.split(/\s+#\s*/);
  const code = commentSplit[0];
  const comment = commentSplit[1];

  const parenIdx = code.indexOf('(');
  const endsWithColon = code.endsWith(':');

  if (parenIdx === -1) {
    return (
      <div>
        <span style={{ userSelect: 'none', color: 'transparent' }}>{indentStr}</span>
        <Token text={code} color="#00b8d4" bold />
        {comment && <Token text={`  # ${comment}`} color="#6B7A86" />}
      </div>
    );
  }

  const fnName = code.slice(0, parenIdx);
  const rest = code.slice(parenIdx);
  const closeIdx = rest.lastIndexOf(')');
  const params = rest.slice(1, closeIdx);
  const suffix = rest.slice(closeIdx + 1); // e.g. ":"

  const paramParts = params ? params.split(/,\s*/) : [];

  return (
    <div>
      <span style={{ userSelect: 'none', color: 'transparent' }}>{indentStr}</span>
      <Token text={fnName} color="#00b8d4" bold={endsWithColon} />
      <Token text="(" color="#e0eaf2" />
      {paramParts.map((p, i) => (
        <span key={i}>
          <Token text={p.trim()} color="#E8A33D" />
          {i < paramParts.length - 1 && <Token text=", " color="#e0eaf2" />}
        </span>
      ))}
      <Token text=")" color="#e0eaf2" />
      {suffix && <Token text={suffix} color="#e0eaf2" bold />}
      {comment && <Token text={`  # ${comment}`} color="#6B7A86" />}
    </div>
  );
}

export function CodeView({ blocks }: Props) {
  const header = '# FiCo Programı\n';
  const code = blocks.length > 0 ? generateCode(blocks) : '# Henüz blok eklenmedi\n';
  const fullCode = header + '\n' + code;
  const lines = fullCode.split('\n');

  return (
    <div
      style={{
        flex: 1,
        background: '#0A1520',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #1a3d5c',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          padding: '8px 16px',
          background: '#0f2e4a',
          borderBottom: '1px solid #1a3d5c',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '12px', color: '#00b8d4', fontWeight: 700 }}>
          Kod Görünümü
        </span>
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
          — Python benzeri sözde kod
        </span>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: '5px' }}>
          {['#C75D5D', '#E8A33D', '#50C878'].map((c, i) => (
            <div
              key={i}
              style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }}
            />
          ))}
        </div>
      </div>

      {/* Code area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          fontFamily: "'Consolas', 'Courier New', monospace",
          fontSize: '13px',
          lineHeight: '1.7',
        }}
      >
        {lines.map((line, i) => (
          <ColoredCodeLine key={i} line={line} />
        ))}
      </div>
    </div>
  );
}
