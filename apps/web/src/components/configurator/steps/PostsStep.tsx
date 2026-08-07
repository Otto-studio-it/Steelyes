'use client'

import {
  POST_CAP_LABELS,
  POST_CAP_STYLES,
  POST_MATERIAL_LABELS,
  POST_MATERIALS,
  type PostCapStyle,
  type PostMaterial,
} from '@steelyes/gate-engine'

import { ConfiguratorSwitch } from '@/components/configurator/ConfiguratorSwitch'
import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'

export function PostsStep() {
  const config = useConfiguratorConfig()
  const patchConfig = useConfiguratorStore((state) => state.patchConfig)
  const posts = config.posts

  return (
    <div className="space-y-4">
      <div className="border border-steel/10 bg-paper p-4">
        <ConfiguratorSwitch
          checked={posts.enabled}
          onCheckedChange={(enabled) =>
            patchConfig({
              posts: {
                ...posts,
                enabled,
                material: enabled && posts.material === 'none' ? 'steel' : posts.material,
              },
            })
          }
          label="Include posts"
          description="Two posts, left and right of the opening."
          id="posts-enabled"
        />
      </div>

      {posts.enabled ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 sm:col-span-2">
            <span className="block font-mono text-xs uppercase tracking-widest text-muted">Post material</span>
            <select
              className="h-12 w-full border border-steel/12 bg-white px-4 font-body text-base text-steel outline-none transition focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
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
            <span className="block font-mono text-xs uppercase tracking-widest text-muted">Post cap / finial</span>
            <select
              className="h-12 w-full border border-steel/12 bg-white px-4 font-body text-base text-steel outline-none transition focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
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
            <span className="block font-mono text-xs uppercase tracking-widest text-muted">
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
              className="mt-3 h-2 w-full cursor-pointer appearance-none bg-steel/15 accent-primary"
              aria-label="Extension above gate"
            />
          </label>
        </div>
      ) : (
        <p className="border border-dashed border-steel/12 bg-white px-4 py-3 text-sm text-muted-deep">
          Posts hidden — only the gate leaf/panel is shown in the Design drawing.
        </p>
      )}
    </div>
  )
}
