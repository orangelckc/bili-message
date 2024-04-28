<script lang="ts" setup>
import ColorThief from 'colorthief'

const props = defineProps<{
  albumImageUrl?: string
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const CircleNum = 50
const colorThief = new ColorThief()
const { backgroundImage } = useBackgroundStore()
const albumImageUrl = ref(backgroundImage)

watchEffect(() => {
  if (props.albumImageUrl)
    albumImageUrl.value = props.albumImageUrl.replace('http://', 'https://')

  changeBackground()
})

function random(min: number, max: number) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min
  return num
}

class Circle {
  private ctx: CanvasRenderingContext2D
  private X: number
  private Y: number
  private VelX: number
  private VelY: number
  private Radius: number
  private RGB: { r: number, g: number, b: number }

  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, Velx: number, Vely: number, radius: number, rgb: [number, number, number]) {
    this.ctx = ctx
    this.X = x
    this.Y = y
    this.VelX = Velx
    this.VelY = Vely
    this.Radius = radius
    this.RGB = { r: rgb[0], g: rgb[1], b: rgb[2] }
  }

  draw() {
    this.ctx.beginPath()

    const g = this.ctx.createRadialGradient(
      this.X,
      this.Y,
      this.Radius * 0.01,
      this.X,
      this.Y,
      this.Radius,
    )
    const rgb = this.RGB
    g.addColorStop(0.1, `rgba(${rgb.r},${rgb.g},${rgb.b},1)`)
    g.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`)
    this.ctx.fillStyle = g
    this.ctx.arc(this.X, this.Y, this.Radius, 0, Math.PI * 2, false)
    this.ctx.fill()
  }

  move(width: number, height: number) {
    if (this.X >= width || this.X <= 0)
      this.VelX = -this.VelX

    if (this.Y >= height || this.Y <= 0)
      this.VelY = -this.VelY

    this.X += this.VelX
    this.Y += this.VelY
  }
}

function changeBackground() {
  if (!canvasRef.value)
    return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  if (!ctx)
    return

  const width = canvas.width = innerWidth
  const height = canvas.height = innerHeight
  const maxRadii = 1200

  const circles: Circle[] = []
  const image = new Image()
  image.crossOrigin = 'Anonymous'
  image.src = albumImageUrl.value
  image.onload = () => {
    ctx.drawImage(image, 0, 0, width, height)
    const colors = colorThief.getPalette(image) || []
    Array.from({ length: CircleNum }).forEach((_, i) => {
      circles.push(new Circle(
        ctx,
        random(maxRadii, width - maxRadii),
        random(maxRadii, height - maxRadii),
        Math.floor(Math.random() * 5 + 1) - 3,
        Math.floor(Math.random() * 5 + 1) - 3,
        300,
        colors[i % colors.length],
      ))
    })
  }

  function animation() {
    ctx!.clearRect(0, 0, width, height)
    circles.forEach((circObj) => {
      circObj.move(width, height)
      circObj.draw()
    })
    requestAnimationFrame(animation)
  }
  animation()
}
</script>

<template>
  <canvas ref="canvasRef" />
</template>
