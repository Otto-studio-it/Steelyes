'use client'

import { useEffect, useRef } from 'react'
import { buildGateMeshPlan, mmToSceneUnits, type GateConfig } from '@steelyes/gate-engine'
import * as THREE from 'three'

type ConfiguratorPreview3DProps = {
  config: GateConfig
  compact?: boolean
}

function roleOpacity(role: string): number {
  if (role === 'panel') {
    return 0.92
  }
  if (role === 'rail') {
    return 0.75
  }
  if (role === 'counterweight') {
    return 0.88
  }
  return 1
}

export function ConfiguratorPreview3D({ config, compact = false }: ConfiguratorPreview3DProps) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) {
      return
    }

    const plan = buildGateMeshPlan(config)
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#f7f5f2')

    const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100)
    camera.position.set(0, mmToSceneUnits(config.heightMm) * 0.55, mmToSceneUnits(config.widthMm) * 1.35)
    camera.lookAt(0, mmToSceneUnits(config.heightMm) * 0.45, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    host.replaceChildren(renderer.domElement)

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(plan.material.colorHex),
      metalness: plan.material.metalness,
      roughness: plan.material.roughness,
    })

    const group = new THREE.Group()
    for (const box of plan.boxes) {
      const geometry = new THREE.BoxGeometry(
        mmToSceneUnits(box.widthMm),
        mmToSceneUnits(box.heightMm),
        mmToSceneUnits(box.depthMm),
      )
      const meshMaterial = material.clone()
      if (meshMaterial instanceof THREE.MeshStandardMaterial) {
        meshMaterial.opacity = roleOpacity(box.role)
        meshMaterial.transparent = box.role === 'panel'
      }
      const mesh = new THREE.Mesh(geometry, meshMaterial)
      mesh.position.set(
        mmToSceneUnits(box.positionMm[0]),
        mmToSceneUnits(box.positionMm[1]),
        mmToSceneUnits(box.positionMm[2]),
      )
      mesh.name = box.id
      group.add(mesh)
    }
    scene.add(group)

    const ambient = new THREE.AmbientLight(0xffffff, 0.65)
    const key = new THREE.DirectionalLight(0xffffff, 1.1)
    key.position.set(2, 3, 4)
    scene.add(ambient, key)

    const ground = new THREE.GridHelper(
      mmToSceneUnits(Math.max(config.widthMm, 1800)),
      12,
      '#d8d2cb',
      '#ece7e0',
    )
    ground.position.y = 0
    scene.add(ground)

    const container = host

    function resize() {
      const width = container.clientWidth
      const height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(container)

    let frameId = 0
    const renderLoop = () => {
      group.rotation.y = Math.sin(Date.now() * 0.00035) * 0.08
      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(renderLoop)
    }
    renderLoop()

    return () => {
      window.cancelAnimationFrame(frameId)
      observer.disconnect()
      renderer.dispose()
      group.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          object.material.dispose()
        }
      })
      host.replaceChildren()
    }
  }, [config])

  return (
    <div
      ref={hostRef}
      className={`overflow-hidden rounded-2xl border border-steel/10 bg-[#F7F5F2] ${
        compact ? 'min-h-[220px]' : 'min-h-[320px] lg:min-h-[420px]'
      }`}
      aria-label="3D schematic gate preview"
    />
  )
}
