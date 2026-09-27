#!/usr/bin/env node
/** BuildWise bounded low-token context pack. */
import fs from "node:fs";
import path from "node:path";
const root=process.cwd();
const maxChars=Number(process.env.BUILDWISE_CONTEXT_MAX_CHARS||12000);
const task=process.argv[2]||process.env.BUILDWISE_TASK_FILE||null;
const files=[".agent-control/BRIEF.md",".agent-control/memory/PERFORMANCE.md",task].filter(Boolean);
const blocks=[];
for(const rel of files){const abs=path.join(root,rel);if(!fs.existsSync(abs))continue;const raw=fs.readFileSync(abs,'utf8').trim();if(raw)blocks.push('## '+rel+'\n'+raw);}
const pack=blocks.join("\n\n");
if(pack.length>maxChars)throw new Error('CONTEXT_PACK_TOO_LARGE: '+pack.length+' > '+maxChars);
process.stdout.write(pack+(pack?'\n':''));
