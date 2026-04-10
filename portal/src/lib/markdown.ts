import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const translationsDir = path.join(process.cwd(), '..', 'translations', 'content', 'ta');

function stripHugoShortcodes(content: string): string {
  // Remove glossary_tooltip shortcodes, keeping the text attribute
  content = content.replace(
    /\{\{<\s*glossary_tooltip\s+text="([^"]+)"\s+term_id="[^"]+"\s*>\}\}/g,
    '$1'
  );
  content = content.replace(
    /\{\{<\s*glossary_tooltip\s+term_id="[^"]+"\s+text="([^"]+)"\s*>\}\}/g,
    '$1'
  );
  // Remove glossary_tooltip with just term_id (no text)
  content = content.replace(
    /\{\{<\s*glossary_tooltip\s+term_id="[^"]+"\s*>\}\}/g,
    ''
  );
  // Remove glossary_definition shortcodes
  content = content.replace(
    /\{\{<\s*glossary_definition[^>]*>\}\}/g,
    ''
  );
  // Remove feature-state shortcodes
  content = content.replace(
    /\{\{<\s*feature-state[^>]*>\}\}/g,
    ''
  );
  // Remove code_sample shortcodes
  content = content.replace(
    /\{\{%\s*code_sample[^%]*%\}\}/g,
    ''
  );
  // Remove figure shortcodes, keep alt text
  content = content.replace(
    /\{\{<\s*figure\s+src="[^"]*"\s+alt="([^"]*)"\s*[^>]*>\}\}/g,
    '_[$1]_'
  );
  // Remove heading shortcodes
  content = content.replace(
    /\{\{%\s*heading\s+"([^"]+)"\s*%\}\}/g,
    '$1'
  );
  // Remove note/warning/caution blocks but keep content
  content = content.replace(/\{\{<\s*note\s*>\}\}/g, '> **குறிப்பு:** ');
  content = content.replace(/\{\{<\s*\/note\s*>\}\}/g, '');
  content = content.replace(/\{\{<\s*warning\s*>\}\}/g, '> **எச்சரிக்கை:** ');
  content = content.replace(/\{\{<\s*\/warning\s*>\}\}/g, '');
  content = content.replace(/\{\{<\s*caution\s*>\}\}/g, '> **எச்சரிக்கை:** ');
  content = content.replace(/\{\{<\s*\/caution\s*>\}\}/g, '');
  // Remove api-reference shortcodes
  content = content.replace(
    /\{\{<\s*api-reference[^>]*>\}\}/g,
    'API Reference'
  );
  // Remove skew shortcodes
  content = content.replace(
    /\{\{<\s*skew\s+[^>]*>\}\}/g,
    ''
  );
  // Remove param shortcodes
  content = content.replace(
    /\{\{<\s*param\s+"[^"]*"\s*>\}\}/g,
    ''
  );
  // Remove tabs shortcodes
  content = content.replace(/\{\{<\s*tabs[^>]*>\}\}/g, '');
  content = content.replace(/\{\{<\s*\/tabs\s*>\}\}/g, '');
  content = content.replace(/\{\{%\s*tab\s+name="([^"]+)"\s*%\}\}/g, '**$1:**');
  content = content.replace(/\{\{%\s*\/tab\s*%\}\}/g, '');
  // Remove HTML comments
  content = content.replace(/<!--[^]*?-->/g, '');
  // Remove remaining Hugo shortcodes
  content = content.replace(/\{\{[<%][^]*?[%>]\}\}/g, '');
  return content;
}

export async function getDocContent(docPath: string) {
  const fullPath = path.join(translationsDir, docPath);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const cleaned = stripHugoShortcodes(content);
  const result = await remark().use(html, { sanitize: false }).process(cleaned);

  return {
    title: data.title || '',
    description: data.description || '',
    htmlContent: result.toString(),
  };
}
