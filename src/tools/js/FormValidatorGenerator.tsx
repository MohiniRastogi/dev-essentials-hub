import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { CodeOutput, Field, inputClass } from "./_shared/CodeOutput";

type FieldType = "text" | "email" | "password" | "number" | "tel" | "url" | "checkbox";

interface FieldDef {
  id: number;
  name: string;
  type: FieldType;
  required: boolean;
  min: string;
  max: string;
}

const TYPES: FieldType[] = ["text", "email", "password", "number", "tel", "url", "checkbox"];

let nextId = 100;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_RE = /^https?:\/\/[^\s.]+\.\S{2,}$/;
const TEL_RE = /^[+]?[\d\s()-]{7,}$/;

function safeName(name: string, index: number) {
  const cleaned = name.trim().replace(/[^A-Za-z0-9_]/g, "_");
  return cleaned || `field_${index + 1}`;
}

export function FormValidatorGenerator() {
  const [formId, setFormId] = useState("my-form");
  const [fields, setFields] = useState<FieldDef[]>([
    { id: 1, name: "email", type: "email", required: true, min: "", max: "" },
    { id: 2, name: "password", type: "password", required: true, min: "8", max: "" },
  ]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (id: number, patch: Partial<FieldDef>) =>
    setFields((f) => f.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const rulesFor = (f: FieldDef, index: number) => {
    const name = safeName(f.name, index);
    const lines: string[] = [];
    if (f.type === "checkbox") {
      if (f.required) lines.push(`    if (!data.${name}) errors.${name} = "${name} must be checked.";`);
      return lines;
    }
    if (f.required) lines.push(`    if (!String(data.${name} ?? "").trim()) errors.${name} = "${name} is required.";`);
    if (f.type === "email") lines.push(`    else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(data.${name})) errors.${name} = "Enter a valid email address.";`);
    if (f.type === "url") lines.push(`    else if (!/^https?:\\/\\/[^\\s.]+\\.\\S{2,}$/.test(data.${name})) errors.${name} = "Enter a valid URL.";`);
    if (f.type === "tel") lines.push(`    else if (!/^[+]?[\\d\\s()-]{7,}$/.test(data.${name})) errors.${name} = "Enter a valid phone number.";`);
    if (f.type === "number") {
      lines.push(`    else if (isNaN(Number(data.${name}))) errors.${name} = "${name} must be a number.";`);
      if (f.min !== "") lines.push(`    else if (Number(data.${name}) < ${Number(f.min)}) errors.${name} = "${name} must be at least ${Number(f.min)}.";`);
      if (f.max !== "") lines.push(`    else if (Number(data.${name}) > ${Number(f.max)}) errors.${name} = "${name} must be at most ${Number(f.max)}.";`);
    } else {
      if (f.min !== "") lines.push(`    else if (data.${name}.length < ${Number(f.min)}) errors.${name} = "${name} must be at least ${Number(f.min)} characters.";`);
      if (f.max !== "") lines.push(`    else if (data.${name}.length > ${Number(f.max)}) errors.${name} = "${name} must be at most ${Number(f.max)} characters.";`);
    }
    return lines;
  };

  const code = `// Validation for #${formId || "my-form"}
(function () {
  var form = document.getElementById("${formId || "my-form"}");
  if (!form) return;

  function validate(data) {
    var errors = {};

${fields.map((f, i) => rulesFor(f, i).join("\n")).filter(Boolean).join("\n\n")}

    return errors;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var formData = new FormData(form);
    var data = {
${fields
  .map((f, i) => {
    const n = safeName(f.name, i);
    return f.type === "checkbox"
      ? `      ${n}: formData.get("${n}") !== null`
      : `      ${n}: String(formData.get("${n}") || "")`;
  })
  .join(",\n")}
    };

    var errors = validate(data);

    form.querySelectorAll("[data-error-for]").forEach(function (el) {
      el.textContent = errors[el.getAttribute("data-error-for")] || "";
    });

    if (Object.keys(errors).length > 0) {
      console.warn("Validation failed", errors);
      return;
    }

    // Valid — replace with your own submit logic
    console.log("Valid form data", data);
  });
})();`;

  function runPreview(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    fields.forEach((f, i) => {
      const name = safeName(f.name, i);
      const raw = values[name] ?? "";
      if (f.type === "checkbox") {
        if (f.required && raw !== "on") next[name] = `${name} must be checked.`;
        return;
      }
      if (f.required && !raw.trim()) {
        next[name] = `${name} is required.`;
        return;
      }
      if (!raw.trim()) return;
      if (f.type === "email" && !EMAIL_RE.test(raw)) next[name] = "Enter a valid email address.";
      else if (f.type === "url" && !URL_RE.test(raw)) next[name] = "Enter a valid URL.";
      else if (f.type === "tel" && !TEL_RE.test(raw)) next[name] = "Enter a valid phone number.";
      else if (f.type === "number") {
        const n = Number(raw);
        if (Number.isNaN(n)) next[name] = `${name} must be a number.`;
        else if (f.min !== "" && n < Number(f.min)) next[name] = `${name} must be at least ${Number(f.min)}.`;
        else if (f.max !== "" && n > Number(f.max)) next[name] = `${name} must be at most ${Number(f.max)}.`;
      } else {
        if (f.min !== "" && raw.length < Number(f.min))
          next[name] = `${name} must be at least ${Number(f.min)} characters.`;
        else if (f.max !== "" && raw.length > Number(f.max))
          next[name] = `${name} must be at most ${Number(f.max)} characters.`;
      }
    });
    setErrors(next);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel
        title="Fields"
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setFields((f) => [...f, { id: nextId++, name: "", type: "text", required: true, min: "", max: "" }])
            }
          >
            <Plus className="h-4 w-4" /> Add field
          </Button>
        }
      >
        <div className="grid gap-4">
          <Field label="Form element id">
            <input value={formId} onChange={(e) => setFormId(e.target.value)} className={inputClass} />
          </Field>

          {fields.map((f, i) => (
            <div key={f.id} className="grid gap-3 rounded-lg border border-border bg-card/40 p-3">
              <div className="flex gap-2">
                <input
                  value={f.name}
                  placeholder={`field_${i + 1}`}
                  onChange={(e) => update(f.id, { name: e.target.value })}
                  className={inputClass}
                />
                <select
                  value={f.type}
                  onChange={(e) => update(f.id, { type: e.target.value as FieldType })}
                  className="h-9 shrink-0 rounded-md border border-border bg-card/40 px-2 text-sm text-foreground"
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t} className="bg-background text-foreground">
                      {t}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  aria-label="Remove field"
                  onClick={() => setFields((list) => list.filter((x) => x.id !== f.id))}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-card/40 text-muted-foreground"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={f.required}
                    onChange={(e) => update(f.id, { required: e.target.checked })}
                  />
                  Required
                </label>
                {f.type !== "checkbox" && (
                  <>
                    <input
                      value={f.min}
                      placeholder={f.type === "number" ? "min value" : "min length"}
                      onChange={(e) => update(f.id, { min: e.target.value.replace(/[^\d]/g, "") })}
                      className="h-9 w-28 rounded-md border border-border bg-card/40 px-2 text-sm text-foreground"
                    />
                    <input
                      value={f.max}
                      placeholder={f.type === "number" ? "max value" : "max length"}
                      onChange={(e) => update(f.id, { max: e.target.value.replace(/[^\d]/g, "") })}
                      className="h-9 w-28 rounded-md border border-border bg-card/40 px-2 text-sm text-foreground"
                    />
                  </>
                )}
              </div>
            </div>
          ))}
          {fields.length === 0 && (
            <p className="text-sm text-muted-foreground">Add at least one field to generate validation code.</p>
          )}
        </div>
      </ToolPanel>

      <ToolPanel title="Live preview">
        <form onSubmit={runPreview} className="grid gap-3 rounded-xl border border-border bg-card/40 p-5" noValidate>
          {fields.map((f, i) => {
            const name = safeName(f.name, i);
            return (
              <div key={f.id} className="grid gap-1">
                <Field label={`${name}${f.required ? " *" : ""}`}>
                  {f.type === "checkbox" ? (
                    <input
                      type="checkbox"
                      checked={values[name] === "on"}
                      onChange={(e) => setValues((v) => ({ ...v, [name]: e.target.checked ? "on" : "" }))}
                    />
                  ) : (
                    <input
                      type={f.type === "password" ? "password" : "text"}
                      value={values[name] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [name]: e.target.value }))}
                      className={inputClass}
                    />
                  )}
                </Field>
                {errors[name] && <p className="text-sm text-destructive">{errors[name]}</p>}
              </div>
            );
          })}
          <button
            type="submit"
            className="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
            disabled={fields.length === 0}
          >
            Validate
          </button>
          {fields.length > 0 && Object.keys(errors).length === 0 && (
            <p className="text-sm text-muted-foreground">No errors reported.</p>
          )}
        </form>
      </ToolPanel>

      <CodeOutput
        title="Generated JS"
        code={code}
        filename="form-validation.js"
        mime="text/javascript"
        className="lg:col-span-2"
      />
    </div>
  );
}
