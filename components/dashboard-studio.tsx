"use client";

import { useState } from "react";

const languages = [
  "Hindi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Bengali",
  "Marathi",
  "Gujarati",
  "Punjabi",
  "Odia",
];

export function DashboardStudio() {
  const [sourceLanguage, setSourceLanguage] = useState("English");
  const [targetLanguage, setTargetLanguage] = useState("Hindi");
  const [fileName, setFileName] = useState("");

  return (
    <div className="min-h-screen w-full bg-[#070b16] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">

        {/* Header */}
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2">
            <span className="mr-2 h-2 w-2 rounded-full bg-lime-300" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-lime-300">
              Resonance Studio
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Create your video dub
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
            Upload your video, select your source and target languages, and
            prepare your localized video.
          </p>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d1322] shadow-2xl shadow-black/40">

          {/* Card Header */}
          <div className="border-b border-white/10 px-6 py-5 sm:px-8">
            <h2 className="text-lg font-bold text-white">
              Dubbing project
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Configure your video localization settings.
            </p>
          </div>

          <div className="p-6 sm:p-8">

            {/* Upload */}
            <div className="rounded-2xl border border-dashed border-white/15 bg-[#080d19] p-6">

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Video file
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Supported formats: MP4, MOV, WebM
                  </p>
                </div>

                <span className="rounded-full bg-lime-300/10 px-3 py-1 text-xs font-bold text-lime-300">
                  Required
                </span>
              </div>

              <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-10 text-center transition duration-200 hover:border-lime-300/40 hover:bg-lime-300/[0.03]">

                <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-lime-300 text-2xl font-bold text-black shadow-lg shadow-lime-300/10">
                  ↑
                </div>

                <p className="font-bold text-white">
                  Choose a video file
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Click to browse your computer
                </p>

                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];

                    if (file) {
                      setFileName(file.name);
                    }
                  }}
                />
              </label>

              {fileName && (
                <div className="mt-4 flex items-center justify-between rounded-xl border border-lime-300/20 bg-lime-300/5 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-lime-300">
                      Selected video
                    </p>

                    <p className="mt-1 truncate text-sm text-white">
                      {fileName}
                    </p>
                  </div>

                  <span className="ml-4 text-xl text-lime-300">
                    ✓
                  </span>
                </div>
              )}
            </div>

            {/* Languages */}
            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              <div className="rounded-2xl border border-white/10 bg-[#080d19] p-5">
                <label
                  htmlFor="source-language"
                  className="text-sm font-bold text-white"
                >
                  Source language
                </label>

                <p className="mt-1 text-xs text-slate-500">
                  Original language of your video
                </p>

                <select
                  id="source-language"
                  value={sourceLanguage}
                  onChange={(event) =>
                    setSourceLanguage(event.target.value)
                  }
                  className="mt-4 w-full rounded-xl border border-white/10 bg-[#050812] px-4 py-3 text-white outline-none transition focus:border-lime-300/60 focus:ring-2 focus:ring-lime-300/10"
                >
                  <option value="English">English</option>

                  {languages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#080d19] p-5">
                <label
                  htmlFor="target-language"
                  className="text-sm font-bold text-white"
                >
                  Target language
                </label>

                <p className="mt-1 text-xs text-slate-500">
                  Language you want to dub into
                </p>

                <select
                  id="target-language"
                  value={targetLanguage}
                  onChange={(event) =>
                    setTargetLanguage(event.target.value)
                  }
                  className="mt-4 w-full rounded-xl border border-white/10 bg-[#050812] px-4 py-3 text-white outline-none transition focus:border-lime-300/60 focus:ring-2 focus:ring-lime-300/10"
                >
                  {languages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-[#080d19] p-5 sm:p-6">

              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                  Project summary
                </p>

                <span className="text-xs text-slate-600">
                  Ready
                </span>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-3">

                <div>
                  <p className="text-xs text-slate-500">
                    Source
                  </p>

                  <p className="mt-2 font-bold text-white">
                    {sourceLanguage}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Target
                  </p>

                  <p className="mt-2 font-bold text-lime-300">
                    {targetLanguage}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-slate-500">
                    Video
                  </p>

                  <p className="mt-2 truncate font-bold text-white">
                    {fileName || "No file selected"}
                  </p>
                </div>

              </div>
            </div>

            {/* Button */}
            <button
              type="button"
              className="mt-6 w-full rounded-xl bg-lime-300 px-6 py-4 text-sm font-extrabold text-black shadow-lg shadow-lime-300/10 transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-xl"
              onClick={() => {
                if (!fileName) {
                  alert("Please select a video file first.");
                  return;
                }

                alert(
                  `Ready to dub ${fileName} from ${sourceLanguage} to ${targetLanguage}.`
                );
              }}
            >
              Start dubbing →
            </button>

            <p className="mt-4 text-center text-xs text-slate-600">
              Your video will be processed securely through the
              localization workflow.
            </p>

          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-600">
          Resonance Dubbing Lab · AI-powered Indian language localization
        </p>

      </div>
    </div>
  );
}