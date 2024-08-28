'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Sun, Moon, Contrast, Download, Crop, RotateCcw } from 'lucide-react'
import { Palette, Image, ArrowUpDown, Sunset, Zap, Cloud, Droplet, Layers } from 'lucide-react'

export default function Component() {
  const [image, setImage] = useState<string | null>(null)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [filter, setFilter] = useState('normal')
  const [blur, setBlur] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const resetFilters = () => {
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    setFilter('normal')
    setBlur(0)
  }

  const applyFilter = useCallback((filterName: string) => {
    setFilter(filterName)
  }, [])

  const getFilterStyle = useCallback(() => {
    let style = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`
    switch (filter) {
      case 'grayscale':
        style += ' grayscale(100%)'
        break
      case 'sepia':
        style += ' sepia(100%)'
        break
      case 'invert':
        style += ' invert(100%)'
        break
      case 'warm':
        style += ' sepia(50%) saturate(150%) hue-rotate(-30deg)'
        break
      case 'cool':
        style += ' sepia(50%) saturate(150%) hue-rotate(30deg)'
        break
      case 'vintage':
        style += ' sepia(80%) brightness(120%) contrast(90%)'
        break
    }
    return style
  }, [brightness, contrast, saturation, filter, blur])

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'edited-image.png'
      link.href = dataUrl
      link.click()
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Image Editor</h1>
      <div className="mb-4">
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          Upload Image
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
      </div>
      {image && (
        <div className="space-y-6">
          <div className="flex justify-center mb-4 relative">
            <canvas
              ref={canvasRef}
              style={{
                filter: getFilterStyle(),
                maxWidth: '100%',
                maxHeight: '400px',
              }}
            />
            <img
              src={image}
              alt="Uploaded"
              style={{
                filter: getFilterStyle(),
                maxWidth: '100%',
                maxHeight: '400px',
                display: 'none',
              }}
              onLoad={(e) => {
                const canvas = canvasRef.current
                const ctx = canvas?.getContext('2d')
                if (canvas && ctx) {
                  canvas.width = e.currentTarget.width
                  canvas.height = e.currentTarget.height
                  ctx.drawImage(e.currentTarget, 0, 0)
                }
              }}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="brightness" className="flex items-center">
                <Sun className="w-4 h-4 mr-2" />
                Brightness
              </Label>
              <Slider
                id="brightness"
                min={0}
                max={200}
                step={1}
                value={[brightness]}
                onValueChange={(value) => setBrightness(value[0])}
              />
            </div>
            <div>
              <Label htmlFor="contrast" className="flex items-center">
                <Contrast className="w-4 h-4 mr-2" />
                Contrast
              </Label>
              <Slider
                id="contrast"
                min={0}
                max={200}
                step={1}
                value={[contrast]}
                onValueChange={(value) => setContrast(value[0])}
              />
            </div>
            <div>
              <Label htmlFor="saturation" className="flex items-center">
                <Moon className="w-4 h-4 mr-2" />
                Saturation
              </Label>
              <Slider
                id="saturation"
                min={0}
                max={200}
                step={1}
                value={[saturation]}
                onValueChange={(value) => setSaturation(value[0])}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Button onClick={() => applyFilter('normal')} variant={filter === 'normal' ? 'default' : 'outline'}>Normal</Button>
            <Button onClick={() => applyFilter('grayscale')} variant={filter === 'grayscale' ? 'default' : 'outline'}>Grayscale</Button>
            <Button onClick={() => applyFilter('sepia')} variant={filter === 'sepia' ? 'default' : 'outline'}>Sepia</Button>
            <Button onClick={() => applyFilter('invert')} variant={filter === 'invert' ? 'default' : 'outline'}>Invert</Button>
            <Button onClick={() => setBlur(prev => prev === 0 ? 5 : 0)} variant={blur > 0 ? 'default' : 'outline'}>Blur</Button>
            <Button onClick={() => applyFilter('warm')} variant={filter === 'warm' ? 'default' : 'outline'}>Warm</Button>
            <Button onClick={() => applyFilter('cool')} variant={filter === 'cool' ? 'default' : 'outline'}>Cool</Button>
            <Button onClick={() => applyFilter('vintage')} variant={filter === 'vintage' ? 'default' : 'outline'}>Vintage</Button>
          </div>
          <div className="flex justify-between">
            <Button onClick={resetFilters} variant="outline" className="flex items-center">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset All
            </Button>
            <Button variant="outline" className="flex items-center">
              <Crop className="w-4 h-4 mr-2" />
              Crop
            </Button>
            <Button onClick={downloadImage} variant="outline" className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
