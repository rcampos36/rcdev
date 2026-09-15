"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ProjectItem, ServiceItem, SiteContent } from "@/lib/content-types";

type Tab = "projects" | "services" | "contact" | "site";

const TABS: { id: Tab; label: string }[] = [
  { id: "projects", label: "Projects" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
  { id: "site", label: "Site" },
];

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function emptyProject(): ProjectItem {
  return {
    id: createId("project"),
    title: "New project",
    date: "",
    tags: [],
    description: "",
    imageUrl: "",
    url: "",
  };
}

function emptyService(): ServiceItem {
  return {
    id: createId("service"),
    title: "New service",
    number: "",
    description: "",
  };
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-big-shoulders uppercase tracking-wider text-gray-500 mb-1">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-900 bg-white"
      />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-big-shoulders uppercase tracking-wider text-gray-500 mb-1">
        {label}
      </span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-900 bg-white resize-y"
      />
    </label>
  );
}

async function compressImage(file: File) {
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const maxWidth = 1600;
    const scale = Math.min(1, maxWidth / bitmap.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.82)
    );
    bitmap.close();
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" });
  } catch {
    return file;
  }
}

async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", await compressImage(file));
  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });
  const data = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !data.url) {
    throw new Error(data.error || "Upload failed");
  }
  return data.url;
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div>
      <Field label={label} value={value} onChange={onChange} placeholder="/images/example.jpg" />
      <div className="mt-2 flex items-center gap-3">
        <label className="inline-flex items-center gap-2 text-xs font-big-shoulders uppercase tracking-wider text-gray-700 cursor-pointer">
          <span className="border border-gray-200 rounded-lg px-3 py-1.5 hover:border-gray-900 transition-colors">
            {uploading ? "Uploading..." : "Upload image"}
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            disabled={uploading}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              setError("");
              setUploading(true);
              try {
                onChange(await uploadImage(file));
              } catch (uploadError) {
                setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
              } finally {
                setUploading(false);
              }
            }}
          />
        </label>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-12 w-16 object-cover rounded border border-gray-200" />
        ) : null}
      </div>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export default function ContentEditor({ initialContent }: { initialContent: SiteContent }) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [tab, setTab] = useState<Tab>("projects");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);

  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(initialContent));

  useEffect(() => {
    setDirty(JSON.stringify(content) !== savedSnapshot);
  }, [content, savedSnapshot]);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function update<K extends keyof SiteContent>(section: K, value: SiteContent[K]) {
    setContent((current) => ({ ...current, [section]: value }));
    setMessage("");
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = (await response.json()) as SiteContent & { error?: string };
      if (!response.ok) {
        setError(data.error || "Failed to save");
        return;
      }
      setContent(data);
      setSavedSnapshot(JSON.stringify(data));
      setDirty(false);
      setMessage("Content saved. The live site is updated.");
      router.refresh();
    } catch {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-big-shoulders uppercase tracking-[0.2em] text-gray-400">Backend</p>
            <h1 className="text-3xl font-bold font-big-shoulders uppercase tracking-tight text-gray-900">
              Edit content
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="text-sm font-big-shoulders uppercase tracking-tight text-gray-600 hover:text-gray-900"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-big-shoulders uppercase tracking-tight text-gray-600 hover:text-gray-900"
            >
              Log out
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-gray-900 text-white px-5 py-2.5 rounded-lg font-big-shoulders uppercase tracking-tight text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : dirty ? "Save changes*" : "Save changes"}
            </button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pb-4 flex gap-2 overflow-x-auto">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`px-4 py-2 rounded-full text-sm font-big-shoulders uppercase tracking-tight ${
                tab === item.id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {message ? <p className="mb-6 text-sm text-green-700">{message}</p> : null}
        {error ? <p className="mb-6 text-sm text-red-600">{error}</p> : null}

        {tab === "projects" ? (
          <section className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6 grid gap-4">
              <h2 className="text-xl font-bold font-big-shoulders uppercase">Section copy</h2>
              <Field
                label="Heading"
                value={content.projects.heading}
                onChange={(heading) => update("projects", { ...content.projects, heading })}
              />
              <Field
                label="Role"
                value={content.projects.role}
                onChange={(role) => update("projects", { ...content.projects, role })}
              />
              <Field
                label="Subtitle"
                value={content.projects.subtitle}
                onChange={(subtitle) => update("projects", { ...content.projects, subtitle })}
              />
              <Area
                label="Intro"
                value={content.projects.intro}
                onChange={(intro) => update("projects", { ...content.projects, intro })}
              />
              <Area
                label="Tagline"
                value={content.projects.tagline}
                onChange={(tagline) => update("projects", { ...content.projects, tagline })}
              />
            </div>

            {content.projects.items.map((project, index) => (
              <div key={project.id} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold font-big-shoulders uppercase">
                    Project {index + 1}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => {
                        const items = [...content.projects.items];
                        [items[index - 1], items[index]] = [items[index], items[index - 1]];
                        update("projects", { ...content.projects, items });
                      }}
                      className="text-xs uppercase font-big-shoulders text-gray-600 disabled:opacity-30"
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      disabled={index === content.projects.items.length - 1}
                      onClick={() => {
                        const items = [...content.projects.items];
                        [items[index], items[index + 1]] = [items[index + 1], items[index]];
                        update("projects", { ...content.projects, items });
                      }}
                      className="text-xs uppercase font-big-shoulders text-gray-600 disabled:opacity-30"
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!confirm("Remove this project?")) return;
                        update("projects", {
                          ...content.projects,
                          items: content.projects.items.filter((item) => item.id !== project.id),
                        });
                      }}
                      className="text-xs uppercase font-big-shoulders text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field
                    label="Title"
                    value={project.title}
                    onChange={(title) => {
                      const items = content.projects.items.map((item) =>
                        item.id === project.id ? { ...item, title } : item
                      );
                      update("projects", { ...content.projects, items });
                    }}
                  />
                  <Field
                    label="Date"
                    value={project.date}
                    onChange={(date) => {
                      const items = content.projects.items.map((item) =>
                        item.id === project.id ? { ...item, date } : item
                      );
                      update("projects", { ...content.projects, items });
                    }}
                  />
                  <Field
                    label="URL"
                    value={project.url}
                    onChange={(url) => {
                      const items = content.projects.items.map((item) =>
                        item.id === project.id ? { ...item, url } : item
                      );
                      update("projects", { ...content.projects, items });
                    }}
                  />
                  <Field
                    label="Tags (comma separated)"
                    value={project.tags.join(", ")}
                    onChange={(tags) => {
                      const items = content.projects.items.map((item) =>
                        item.id === project.id
                          ? { ...item, tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean) }
                          : item
                      );
                      update("projects", { ...content.projects, items });
                    }}
                  />
                </div>
                <Area
                  label="Description"
                  value={project.description}
                  onChange={(description) => {
                    const items = content.projects.items.map((item) =>
                      item.id === project.id ? { ...item, description } : item
                    );
                    update("projects", { ...content.projects, items });
                  }}
                />
                <ImageField
                  label="Image URL"
                  value={project.imageUrl}
                  onChange={(imageUrl) => {
                    const items = content.projects.items.map((item) =>
                      item.id === project.id ? { ...item, imageUrl } : item
                    );
                    update("projects", { ...content.projects, items });
                  }}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                update("projects", { ...content.projects, items: [...content.projects.items, emptyProject()] })
              }
              className="border border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm font-big-shoulders uppercase tracking-tight text-gray-700 hover:border-gray-900"
            >
              Add project
            </button>
          </section>
        ) : null}

        {tab === "services" ? (
          <section className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6 grid gap-4">
              <h2 className="text-xl font-bold font-big-shoulders uppercase">Section copy</h2>
              <Field
                label="Heading"
                value={content.services.heading}
                onChange={(heading) => update("services", { ...content.services, heading })}
              />
              <Area
                label="Intro"
                value={content.services.intro}
                onChange={(intro) => update("services", { ...content.services, intro })}
              />
              <Area
                label="Call to action"
                value={content.services.cta}
                onChange={(cta) => update("services", { ...content.services, cta })}
              />
              <Field
                label="Availability button"
                value={content.services.availability}
                onChange={(availability) => update("services", { ...content.services, availability })}
              />
            </div>

            {content.services.items.map((service, index) => (
              <div key={service.id} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold font-big-shoulders uppercase">
                    Service {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirm("Remove this service?")) return;
                      update("services", {
                        ...content.services,
                        items: content.services.items.filter((item) => item.id !== service.id),
                      });
                    }}
                    className="text-xs uppercase font-big-shoulders text-red-600"
                  >
                    Delete
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field
                    label="Title"
                    value={service.title}
                    onChange={(title) => {
                      const items = content.services.items.map((item) =>
                        item.id === service.id ? { ...item, title } : item
                      );
                      update("services", { ...content.services, items });
                    }}
                  />
                  <Field
                    label="Number"
                    value={service.number}
                    onChange={(number) => {
                      const items = content.services.items.map((item) =>
                        item.id === service.id ? { ...item, number } : item
                      );
                      update("services", { ...content.services, items });
                    }}
                  />
                </div>
                <Area
                  label="Description"
                  rows={6}
                  value={service.description}
                  onChange={(description) => {
                    const items = content.services.items.map((item) =>
                      item.id === service.id ? { ...item, description } : item
                    );
                    update("services", { ...content.services, items });
                  }}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                update("services", { ...content.services, items: [...content.services.items, emptyService()] })
              }
              className="border border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm font-big-shoulders uppercase tracking-tight text-gray-700 hover:border-gray-900"
            >
              Add service
            </button>
          </section>
        ) : null}

        {tab === "contact" ? (
          <section className="bg-white border border-gray-200 rounded-xl p-6 grid gap-4">
            <Field
              label="Heading"
              value={content.contact.heading}
              onChange={(heading) => update("contact", { ...content.contact, heading })}
            />
            <Field
              label="Role"
              value={content.contact.role}
              onChange={(role) => update("contact", { ...content.contact, role })}
            />
            <Field
              label="Passion line"
              value={content.contact.passion}
              onChange={(passion) => update("contact", { ...content.contact, passion })}
            />
            <Area
              label="Intro"
              value={content.contact.intro}
              onChange={(intro) => update("contact", { ...content.contact, intro })}
            />
            <Area
              label="Description"
              value={content.contact.description}
              onChange={(description) => update("contact", { ...content.contact, description })}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <Field
                label="Email label"
                value={content.contact.emailLabel}
                onChange={(emailLabel) => update("contact", { ...content.contact, emailLabel })}
              />
              <Field
                label="Email"
                value={content.contact.email}
                onChange={(email) => update("contact", { ...content.contact, email })}
              />
              <Field
                label="Phone label"
                value={content.contact.phoneLabel}
                onChange={(phoneLabel) => update("contact", { ...content.contact, phoneLabel })}
              />
              <Field
                label="Phone"
                value={content.contact.phone}
                onChange={(phone) => update("contact", { ...content.contact, phone })}
              />
              <Field
                label="Instagram label"
                value={content.contact.instagramLabel}
                onChange={(instagramLabel) => update("contact", { ...content.contact, instagramLabel })}
              />
              <Field
                label="Instagram handle"
                value={content.contact.instagramHandle}
                onChange={(instagramHandle) => update("contact", { ...content.contact, instagramHandle })}
              />
            </div>
            <Field
              label="Instagram URL"
              value={content.contact.instagramUrl}
              onChange={(instagramUrl) => update("contact", { ...content.contact, instagramUrl })}
            />
            <ImageField
              label="Profile image"
              value={content.contact.profileImage}
              onChange={(profileImage) => update("contact", { ...content.contact, profileImage })}
            />
          </section>
        ) : null}

        {tab === "site" ? (
          <section className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6 grid gap-4">
              <h2 className="text-xl font-bold font-big-shoulders uppercase">Navigation</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="First name"
                  value={content.navigation.firstName}
                  onChange={(firstName) => update("navigation", { ...content.navigation, firstName })}
                />
                <Field
                  label="Last name"
                  value={content.navigation.lastName}
                  onChange={(lastName) => update("navigation", { ...content.navigation, lastName })}
                />
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 grid gap-4">
              <h2 className="text-xl font-bold font-big-shoulders uppercase">Footer</h2>
              <Field
                label="Name"
                value={content.footer.name}
                onChange={(name) => update("footer", { ...content.footer, name })}
              />
              <Field
                label="Title"
                value={content.footer.title}
                onChange={(title) => update("footer", { ...content.footer, title })}
              />
              <Field
                label="Tagline"
                value={content.footer.tagline}
                onChange={(tagline) => update("footer", { ...content.footer, tagline })}
              />
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
