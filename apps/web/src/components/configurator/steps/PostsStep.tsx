'use client'

import {
  POST_CAP_LABELS,
  POST_CAP_STYLES,
  POST_MATERIAL_LABELS,
  POST_MATERIALS,
  type PostCapStyle,
  type PostMaterial,
} from '@steelyes/gate-engine'

import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'

export function PostsStep() {
  const config = useConfiguratorConfig()
  const patchConfig = useConfiguratorStore((state) => state.patchConfig)
  const posts = config.posts

  return (
    <div className="space-y-5">
      <p className="text-sm leading-6 text-muted-deep">
        Configure the two mounting posts that frame the gate opening — material, finial cap, and height above
        the frame. This mirrors the post setup in professional gate configurators.
      </p>

      <div className="rounded-2xl border border-steel/10 bg-paper p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-heading text-sm font-bold uppercase tracking-tight text-steel">Include posts</p>
            <p className="mt-1 text-xs leading-5 text-muted-deep">Two posts, left and right of the opening.</p>
          </div>
          <button
            type="button"
            onClick={() =>
              patchConfig({
                posts: {
                  ...posts,
                  enabled: !posts.enabled,
                  material: !posts.enabled && posts.material === 'none' ? 'steel' : posts.material,
                },
              })
            }
            className={`inline-flex min-h-[44px] min-w-[88px] items-center justify-center rounded-full px-4 font-heading text-xs font-bold uppercase tracking-tight transition ${
              posts.enabled ? 'bg-primary text-white' : 'border border-steel/12 bg-white text-steel'
            }`}
          >
            {posts.enabled ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      {posts.enabled ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 sm:col-span-2">
            <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Post material</span>
            <select
              className="h-12 w-full rounded-xl border border-steel/12 bg-white px-4 font-body text-base text-steel shadow-sm outline-none transition focus:border-primary"
              value={posts.material}
              onChange={(event) =>
                patchConfig({
                  posts: { ...posts, material: event.target.value as PostMaterial },
                })
              }
            >
              {POST_MATERIALS.map((material) => (
                <option key={material} value={material}>
                  {POST_MATERIAL_LABELS[material]}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Post cap / finial</span>
            <select
              className="h-12 w-full rounded-xl border border-steel/12 bg-white px-4 font-body text-base text-steel shadow-sm outline-none transition focus:border-primary"
              value={posts.capStyle}
              onChange={(event) =>
                patchConfig({
                  posts: { ...posts, capStyle: event.target.value as PostCapStyle },
                })
              }
            >
              {POST_CAP_STYLES.map((capStyle) => (
                <option key={capStyle} value={capStyle}>
                  {POST_CAP_LABELS[capStyle]}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              Extension above gate ({posts.extendAboveGateMm} mm)
            </span>
            <input
              type="range"
              min={0}
              max={300}
              step={10}
              value={posts.extendAboveGateMm}
              onChange={(event) =>
                patchConfig({
                  posts: { ...posts, extendAboveGateMm: Number(event.target.value) },
                })
              }
              className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-steel/15 accent-primary"
            />
          </label>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-steel/12 bg-white px-4 py-3 text-sm text-muted-deep">
          Posts hidden — only the gate leaf/panel is shown in the installation preview.
        </p>
      )}
    </div>
  )
}
