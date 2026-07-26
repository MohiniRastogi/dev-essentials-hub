import type { ComponentType } from "react";
import {
  Braces,
  FileJson,
  FileMinus,
  Table,
  Eye,
  GitCompare,
  ArrowLeftRight,
  Code2,
  FileCode,
  Paintbrush,
  Palette,
  Sparkles,
  Layers,
  Grid3x3,
  Move,
  Scissors,
  Regex,
  Terminal,
  Clock,
  KeyRound,
  Fingerprint,
  Hash,
  Lock,
  ShieldCheck,
  Type,
  Text as TextIcon,
  FileText,
  ListOrdered,
  Shuffle,
  QrCode,
  ScanLine,
  Pipette,
  Blend,
  Image as ImageIcon,
  Binary,
  Link as LinkIcon,
  Wand2,
  Square,
  Box,
} from "lucide-react";

import { JsonFormatter } from "@/tools/json/JsonFormatter";
import { JsonValidator } from "@/tools/json/JsonValidator";
import { JsonMinifier } from "@/tools/json/JsonMinifier";
import { JsonToCsv } from "@/tools/json/JsonToCsv";
import { Base64Tool } from "@/tools/encoding/Base64Tool";
import { UrlEncoderTool } from "@/tools/encoding/UrlEncoderTool";
import { JwtDecoder } from "@/tools/security/JwtDecoder";
import { UuidGenerator } from "@/tools/security/UuidGenerator";
import { HashTool } from "@/tools/security/HashTool";
import { PasswordGenerator } from "@/tools/security/PasswordGenerator";
import { WordCounter } from "@/tools/text/WordCounter";
import { CaseConverter } from "@/tools/text/CaseConverter";
import { GradientGenerator } from "@/tools/design/GradientGenerator";
import { QrGenerator } from "@/tools/design/QrGenerator";
import { RegexTester } from "@/tools/js/RegexTester";
import { ColorPickerTool } from "@/tools/design/ColorPickerTool";
import { QrScanner } from "@/tools/design/QrScanner";
import { HtmlBeautifier } from "@/tools/html/HtmlBeautifier";
import { HtmlMinifier } from "@/tools/html/HtmlMinifier";
import { CssBeautifier } from "@/tools/css/CssBeautifier";
import { CssMinifier } from "@/tools/css/CssMinifier";
import { SlugGenerator } from "@/tools/text/SlugGenerator";
import { HtmlEntityTool } from "@/tools/encoding/HtmlEntityTool";
import { LoremIpsum } from "@/tools/text/LoremIpsum";
import { JsonViewer } from "@/tools/json/JsonViewer";
import { JsonCompare } from "@/tools/json/JsonCompare";
import { JsonEscapeTool } from "@/tools/json/JsonEscapeTool";
import { CharacterCounter } from "@/tools/text/CharacterCounter";
import { ParagraphCounter } from "@/tools/text/ParagraphCounter";
import { RemoveDuplicateLines } from "@/tools/text/RemoveDuplicateLines";
import { SortLines } from "@/tools/text/SortLines";
import { ReverseText } from "@/tools/text/ReverseText";
import { RandomText } from "@/tools/text/RandomText";

export type CategorySlug =
  | "json"
  | "html"
  | "css"
  | "javascript"
  | "security"
  | "text"
  | "encoding"
  | "design";

export interface CategoryMeta {
  slug: CategorySlug;
  name: string;
  description: string;
  accent: string; // css color
  icon: ComponentType<{ className?: string }>;
}

export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: CategorySlug;
  icon: ComponentType<{ className?: string }>;
  component?: ComponentType;
  popular?: boolean;
}

export const CATEGORIES: CategoryMeta[] = [
  { slug: "json", name: "JSON Tools", description: "Format, validate, minify and convert JSON.", accent: "#3B82F6", icon: Braces },
  { slug: "html", name: "HTML Tools", description: "Beautify, minify and encode HTML.", accent: "#F97316", icon: FileCode },
  { slug: "css", name: "CSS Tools", description: "Generators for gradients, shadows, layouts.", accent: "#EC4899", icon: Paintbrush },
  { slug: "javascript", name: "JavaScript Tools", description: "Beautify, minify, test regex and more.", accent: "#EAB308", icon: Code2 },
  { slug: "security", name: "Security Tools", description: "Hashes, JWT, UUIDs and passwords.", accent: "#22C55E", icon: ShieldCheck },
  { slug: "text", name: "Text Tools", description: "Count, convert and transform text.", accent: "#A855F7", icon: TextIcon },
  { slug: "encoding", name: "Encoding Tools", description: "Base64, URL, HTML and Unicode.", accent: "#06B6D4", icon: Binary },
  { slug: "design", name: "Design Tools", description: "QR codes, colors, gradients and SVG.", accent: "#F43F5E", icon: Palette },
];

export const TOOLS: Tool[] = [
  // JSON
  { slug: "json-formatter", name: "JSON Formatter", description: "Beautify and format JSON with syntax indentation.", category: "json", icon: Braces, component: JsonFormatter, popular: true },
  { slug: "json-validator", name: "JSON Validator", description: "Validate JSON and pinpoint syntax errors.", category: "json", icon: FileJson, component: JsonValidator, popular: true },
  { slug: "json-minifier", name: "JSON Minifier", description: "Minify JSON by stripping whitespace.", category: "json", icon: FileMinus, component: JsonMinifier },
  { slug: "json-to-csv", name: "JSON to CSV", description: "Convert a JSON array into a CSV file.", category: "json", icon: Table, component: JsonToCsv, popular: true },
  { slug: "json-viewer", name: "JSON Viewer", description: "Explore JSON as a collapsible tree.", category: "json", icon: Eye, component: JsonViewer, popular: true },
  { slug: "json-compare", name: "JSON Compare", description: "Diff two JSON documents side by side.", category: "json", icon: GitCompare },
  { slug: "json-escape", name: "JSON Escape", description: "Escape a string for safe JSON embedding.", category: "json", icon: ArrowLeftRight },
  { slug: "json-unescape", name: "JSON Unescape", description: "Unescape a JSON string back to raw text.", category: "json", icon: ArrowLeftRight },

  // HTML
  { slug: "html-beautifier", name: "HTML Beautifier", description: "Format HTML with proper indentation.", category: "html", icon: FileCode, component: HtmlBeautifier, popular: true },
  { slug: "html-minifier", name: "HTML Minifier", description: "Minify HTML for production.", category: "html", icon: FileMinus, component: HtmlMinifier },
  { slug: "html-encoder", name: "HTML Encoder", description: "Encode HTML entities for safe output.", category: "html", icon: ArrowLeftRight, component: () => <HtmlEntityTool mode="encode" /> },
  { slug: "html-decoder", name: "HTML Decoder", description: "Decode HTML entities to plain text.", category: "html", icon: ArrowLeftRight, component: () => <HtmlEntityTool mode="decode" /> },
  { slug: "html-viewer", name: "HTML Viewer", description: "Preview raw HTML in a sandbox.", category: "html", icon: Eye },
  { slug: "html-escape", name: "HTML Escape", description: "Escape HTML strings for embedding.", category: "html", icon: Scissors },

  // CSS
  { slug: "css-beautifier", name: "CSS Beautifier", description: "Format CSS with proper indentation.", category: "css", icon: Paintbrush, component: CssBeautifier, popular: true },
  { slug: "css-minifier", name: "CSS Minifier", description: "Minify CSS for production.", category: "css", icon: FileMinus, component: CssMinifier },
  { slug: "gradient-generator", name: "Gradient Generator", description: "Design linear gradients with a live preview.", category: "css", icon: Blend, component: GradientGenerator, popular: true },
  { slug: "box-shadow-generator", name: "Box Shadow Generator", description: "Craft box-shadow with visual controls.", category: "css", icon: Square },
  { slug: "border-radius-generator", name: "Border Radius Generator", description: "Design border-radius per corner.", category: "css", icon: Box },
  { slug: "glassmorphism-generator", name: "Glassmorphism Generator", description: "Generate frosted glass CSS.", category: "css", icon: Layers },
  { slug: "neumorphism-generator", name: "Neumorphism Generator", description: "Generate soft neumorphic UI CSS.", category: "css", icon: Layers },
  { slug: "animation-generator", name: "Animation Generator", description: "Compose CSS keyframe animations.", category: "css", icon: Sparkles },
  { slug: "flexbox-generator", name: "Flexbox Generator", description: "Visual flexbox playground.", category: "css", icon: Move },
  { slug: "grid-generator", name: "Grid Generator", description: "Design CSS Grid layouts.", category: "css", icon: Grid3x3 },
  { slug: "clamp-generator", name: "Clamp Generator", description: "Fluid clamp() typography values.", category: "css", icon: Type },

  // JavaScript
  { slug: "js-beautifier", name: "JS Beautifier", description: "Format and indent JavaScript.", category: "javascript", icon: Code2 },
  { slug: "js-minifier", name: "JS Minifier", description: "Minify JavaScript for production.", category: "javascript", icon: FileMinus },
  { slug: "regex-tester", name: "Regex Tester", description: "Test regular expressions with live matches.", category: "javascript", icon: Regex, component: RegexTester, popular: true },
  { slug: "console-formatter", name: "Console Formatter", description: "Pretty print console log output.", category: "javascript", icon: Terminal },
  { slug: "timestamp-converter", name: "Timestamp Converter", description: "Convert between date and Unix timestamps.", category: "javascript", icon: Clock },
  { slug: "unix-time-converter", name: "Unix Time Converter", description: "Convert Unix time to human dates.", category: "javascript", icon: Clock },

  // Security
  { slug: "jwt-decoder", name: "JWT Decoder", description: "Decode JWT header and payload.", category: "security", icon: KeyRound, component: JwtDecoder, popular: true },
  { slug: "uuid-generator", name: "UUID Generator", description: "Generate v4 UUIDs in bulk.", category: "security", icon: Fingerprint, component: UuidGenerator, popular: true },
  { slug: "sha256", name: "SHA-256 Hash", description: "Compute SHA-256 of any text.", category: "security", icon: Hash, component: () => <HashTool algorithm="SHA-256" /> },
  { slug: "sha1", name: "SHA-1 Hash", description: "Compute SHA-1 of any text.", category: "security", icon: Hash, component: () => <HashTool algorithm="SHA-1" /> },
  { slug: "sha512", name: "SHA-512 Hash", description: "Compute SHA-512 of any text.", category: "security", icon: Hash, component: () => <HashTool algorithm="SHA-512" /> },
  { slug: "md5", name: "MD5 Hash", description: "Compute MD5 checksum of any text.", category: "security", icon: Hash, component: () => <HashTool algorithm="MD5" /> },
  { slug: "password-generator", name: "Password Generator", description: "Generate strong random passwords.", category: "security", icon: Lock, component: PasswordGenerator, popular: true },
  { slug: "password-strength", name: "Password Strength Checker", description: "Estimate password entropy and strength.", category: "security", icon: ShieldCheck },
  { slug: "bcrypt-generator", name: "Bcrypt Generator", description: "Generate bcrypt hashes.", category: "security", icon: Hash },
  { slug: "hmac-generator", name: "HMAC Generator", description: "Generate HMAC signatures.", category: "security", icon: Hash },

  // Text
  { slug: "case-converter", name: "Case Converter", description: "Convert text between casing styles.", category: "text", icon: Type, component: CaseConverter, popular: true },
  { slug: "word-counter", name: "Word Counter", description: "Live word, character and reading stats.", category: "text", icon: FileText, component: WordCounter, popular: true },
  { slug: "character-counter", name: "Character Counter", description: "Count characters, letters and spaces.", category: "text", icon: FileText },
  { slug: "paragraph-counter", name: "Paragraph Counter", description: "Count paragraphs and sentences.", category: "text", icon: FileText },
  { slug: "lorem-ipsum", name: "Lorem Ipsum Generator", description: "Generate placeholder text.", category: "text", icon: Wand2, component: LoremIpsum, popular: true },
  { slug: "slug-generator", name: "Slug Generator", description: "Convert text to URL-friendly slugs.", category: "text", icon: LinkIcon, component: SlugGenerator },
  { slug: "remove-duplicate-lines", name: "Remove Duplicate Lines", description: "Deduplicate lines of text.", category: "text", icon: ListOrdered },
  { slug: "sort-lines", name: "Sort Lines", description: "Sort lines alphabetically.", category: "text", icon: ListOrdered },
  { slug: "reverse-text", name: "Reverse Text", description: "Reverse text character by character.", category: "text", icon: Shuffle },
  { slug: "random-text", name: "Random Text Generator", description: "Generate random strings and words.", category: "text", icon: Wand2 },

  // Encoding
  { slug: "base64-encode", name: "Base64 Encode", description: "Encode text to Base64.", category: "encoding", icon: Binary, component: () => <Base64Tool mode="encode" />, popular: true },
  { slug: "base64-decode", name: "Base64 Decode", description: "Decode Base64 to text.", category: "encoding", icon: Binary, component: () => <Base64Tool mode="decode" /> },
  { slug: "url-encode", name: "URL Encode", description: "Percent-encode URLs and components.", category: "encoding", icon: LinkIcon, component: () => <UrlEncoderTool mode="encode" />, popular: true },
  { slug: "url-decode", name: "URL Decode", description: "Decode percent-encoded URLs.", category: "encoding", icon: LinkIcon, component: () => <UrlEncoderTool mode="decode" /> },
  { slug: "html-encode-2", name: "HTML Encode", description: "Encode text as HTML entities.", category: "encoding", icon: ArrowLeftRight, component: () => <HtmlEntityTool mode="encode" /> },
  { slug: "html-decode-2", name: "HTML Decode", description: "Decode HTML entities to text.", category: "encoding", icon: ArrowLeftRight, component: () => <HtmlEntityTool mode="decode" /> },
  { slug: "unicode-encode", name: "Unicode Encode", description: "Encode text to Unicode escapes.", category: "encoding", icon: Binary },
  { slug: "unicode-decode", name: "Unicode Decode", description: "Decode Unicode escapes to text.", category: "encoding", icon: Binary },

  // Design
  { slug: "qr-generator", name: "QR Code Generator", description: "Generate QR codes with custom size and color.", category: "design", icon: QrCode, component: QrGenerator, popular: true },
  { slug: "qr-scanner", name: "QR Scanner", description: "Scan QR codes from your camera or an image.", category: "design", icon: ScanLine, component: QrScanner, popular: true },
  { slug: "color-picker", name: "Color Picker", description: "Pick colors and convert HEX / RGB / HSL.", category: "design", icon: Pipette, component: ColorPickerTool, popular: true },
  { slug: "hex-rgb-converter", name: "HEX ↔ RGB Converter", description: "Convert between HEX and RGB colors.", category: "design", icon: Palette },
  { slug: "svg-blob-generator", name: "SVG Blob Generator", description: "Generate random SVG blobs.", category: "design", icon: Shuffle },
  { slug: "favicon-generator", name: "Favicon Generator", description: "Generate favicons in multiple sizes.", category: "design", icon: ImageIcon },
  { slug: "css-generator", name: "CSS Generator", description: "Generate CSS from visual controls.", category: "design", icon: Sparkles },
  { slug: "svg-optimizer", name: "SVG Optimizer", description: "Shrink and clean up SVG files.", category: "design", icon: FileMinus },
];

export function getTool(slug: string) {
  return TOOLS.find((t) => t.slug === slug);
}

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function toolsByCategory(slug: CategorySlug) {
  return TOOLS.filter((t) => t.category === slug);
}

export function toolCount(slug: CategorySlug) {
  return TOOLS.filter((t) => t.category === slug).length;
}

export function isImplemented(tool: Tool) {
  return typeof tool.component === "function";
}