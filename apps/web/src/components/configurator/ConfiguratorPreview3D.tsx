'use client'

import { useEffect, useRef } from 'react'
import { buildGateMeshPlan, mmToSceneUnits, type GateConfig } from '@steelyes/gate-engine'
import * as THREE from 'three'

type ConfiguratorPreview3DProps = {
  config: GateConfig
  compact?: boolean
  studio?: boolean
}

function roleOpacity(role: string): number {
  if (role === 'panel') return 0.92
  if (role === 'rail') return 0.75
  if (role === 'bar') return 0.88
  if (role === 'counterweight') return 0.88
  if (role === 'post') return 1
  return 1
}

function isDarkFinish(baseHex: string): boolean {
  const color = new THREE.Color(baseHex)
  const hsl = { h: 0, s: 0, l: 0 }
  color.getHSL(hsl)
  return hsl.l < 0.42
}

function roleColor(role: string, baseHex: string, studio: boolean): THREE.Color {
  const color = new THREE.Color(baseHex)
  if (role === 'post') {
    color.offsetHSL(0, -0.08, -0.12)
  }
  if (role === 'rail') {
    color.offsetHSL(0, -0.2, 0.08)
  }
  if (role === 'counterweight') {
    color.offsetHSL(0, -0.05, -0.05)
  }
  if (studio && isDarkFinish(baseHex)) {
    color.offsetHSL(0, -0.04, 0.34)
  }
  return color
}

export function ConfiguratorPreview3D({ config, compact = false, studio = false }: ConfiguratorPreview3DProps) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const plan = buildGateMeshPlan(config)
    const scene = new THREE.Scene()
    const studioBackground = '#5c5852'
    scene.background = new THREE.Color(studio ? studioBackground : '#eef2ea')
    scene.fog = new THREE.Fog(studio ? studioBackground : '#eef2ea', 8, 24)

    const camera = new THREE.PerspectiveCamera(36, 1, 0.01, 100)
    camera.position.set(0, mmToSceneUnits(config.heightMm) * 0.62, mmToSceneUnits(config.widthMm) * 1.45)
    camera.lookAt(0, mmToSceneUnits(config.heightMm) * 0.42, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    host.replaceChildren(renderer.domElement)

    const group = new THREE.Group()
    for (const box of plan.boxes) {
      const geometry = new THREE.BoxGeometry(
        mmToSceneUnits(box.widthMm),
        mmToSceneUnits(box.heightMm),
        mmToSceneUnits(box.depthMm),
      )
      const meshMaterial = new THREE.MeshStandardMaterial({
        color: roleColor(box.role, plan.material.colorHex, studio),
        metalness: box.role === 'post' ? plan.material.metalness * 0.7 : plan.material.metalness,
        roughness: box.role === 'panel' ? plan.material.roughness + 0.08 : plan.material.roughness,
        transparent: box.role === 'panel' || box.role === 'counterweight',
        opacity: roleOpacity(box.role),
        emissive: studio && isDarkFinish(plan.material.colorHex) ? new THREE.Color('#c8c2b8') : undefined,
        emissiveIntensity: studio && isDarkFinish(plan.material.colorHex) ? 0.14 : 0,
      })
      const mesh = new THREE.Mesh(geometry, meshMaterial)
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.position.set(
        mmToSceneUnits(box.positionMm[0]),
        mmToSceneUnits(box.positionMm[1]),
        mmToSceneUnits(box.positionMm[2]),
      )
      mesh.name = box.id
      group.add(mesh)
    }

    for (const cylinder of plan.cylinders) {
      const geometry = new THREE.CylinderGeometry(
        mmToSceneUnits(cylinder.radiusMm),
        mmToSceneUnits(cylinder.radiusMm),
        mmToSceneUnits(cylinder.heightMm),
        12,
      )
      const meshMaterial = new THREE.MeshStandardMaterial({
        color: roleColor(cylinder.role, plan.material.colorHex, studio),
        metalness: plan.material.metalness,
        roughness: plan.material.roughness,
        transparent: cylinder.role === 'bar',
        opacity: cylinder.role === 'bar' ? 0.88 : 1,
        emissive: studio && isDarkFinish(plan.material.colorHex) ? new THREE.Color('#c8c2b8') : undefined,
        emissiveIntensity: studio && isDarkFinish(plan.material.colorHex) ? 0.14 : 0,
      })
      const mesh = new THREE.Mesh(geometry, meshMaterial)
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.position.set(
        mmToSceneUnits(cylinder.positionMm[0]),
        mmToSceneUnits(cylinder.positionMm[1]),
        mmToSceneUnits(cylinder.positionMm[2]),
      )
      mesh.name = cylinder.id
      group.add(mesh)
    }
    scene.add(group)

    const ambient = new THREE.AmbientLight(0xffffff, studio ? 0.95 : 0.65)
    const key = new THREE.DirectionalLight(0xffffff, studio ? 2.4 : 1.1)
    key.position.set(2.5, 4, 3)
    key.castShadow = true
    const fill = new THREE.DirectionalLight(0xdce8ff, studio ? 0.65 : 0.35)
    fill.position.set(-2, 2, -1)
    const rim = new THREE.DirectionalLight(0xfff2df, studio ? 0.55 : 0.2)
    rim.position.set(0, 2.5, -3)
    scene.add(ambient, key, fill, rim)

    const groundGeo = new THREE.PlaneGeometry(12, 8)
    const groundMat = new THREE.MeshStandardMaterial({
      color: studio ? '#2a2926' : '#d8e2cf',
      roughness: 0.95,
      metalness: 0,
    })
    const ground = new THREE.Mesh(groundGeo, groundMat)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = 0
    ground.receiveShadow = true
    scene.add(ground)

    const drivewayGeo = new THREE.PlaneGeometry(6, 2.2)
    const driveway = new THREE.Mesh(
      drivewayGeo,
      new THREE.MeshStandardMaterial({ color: studio ? '#3a3834' : '#c9c3ba', roughness: 0.9 }),
    )
    driveway.rotation.x = -Math.PI / 2
    driveway.position.set(0, 0.002, 0.6)
    scene.add(driveway)

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
    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderLoop = () => {
      if (!prefersReducedMotion) {
        group.rotation.y = Math.sin(Date.now() * 0.00028) * 0.06
      }
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
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
      host.replaceChildren()
    }
  }, [config, studio])

  return (
    <div
      ref={hostRef}
      className={`overflow-hidden rounded-2xl border ${
        studio ? 'min-h-[clamp(260px,44vh,480px)] border-white/10 bg-steel' : 'min-h-[320px] border-steel/10 bg-paper lg:min-h-[420px]'
      } ${compact ? 'min-h-[220px]' : ''}`}
      aria-label="3D schematic gate preview"
    />
  )
}
