import React, { useContext, useState, useRef } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const stylePresets = [
  { label: '🎨 Photorealistic', tag: 'photorealistic, 8k, ultra detailed, sharp focus' },
  { label: '🌸 Anime', tag: 'anime style, vibrant colors, Studio Ghibli' },
  { label: '🖼️ Oil Painting', tag: 'oil painting, classical art style, textured canvas' },
  { label: '🌆 Cyberpunk', tag: 'cyberpunk, neon lights, futuristic city, rain' },
  { label: '💧 Watercolor', tag: 'watercolor painting, soft pastel colors, artistic' },
  { label: '✏️ Sketch', tag: 'pencil sketch, black and white, detailed linework' },
  { label: '🚀 Sci-Fi', tag: 'science fiction, space, cinematic lighting, epic' },
  { label: '🏰 Fantasy', tag: 'fantasy art, magical, ethereal glow, detailed' },
]

const examplePrompts = [
  'A lone astronaut standing on Mars at golden hour, cinematic',
  'Enchanted forest with glowing mushrooms and fairies at night',
  'Futuristic Tokyo skyline with flying cars and neon signs',
  'Majestic dragon perched on a mountain peak at sunset',
]

const Result = () => {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [image, setImage] = useState(null)
  const [usedPrompt, setUsedPrompt] = useState('')
  const [copied, setCopied] = useState(false)

  const { generateImage, credit } = useContext(AppContext)
  const navigate = useNavigate()
  const textareaRef = useRef(null)

  const onSubmitHandler = async (e) => {
    e?.preventDefault()
    if (!input.trim() || loading) return
    setLoading(true)
    const result = await generateImage(input)
    if (result) {
      setIsImageLoaded(true)
      setImage(result)
      setUsedPrompt(input)
    }
    setLoading(false)
  }

  const handleStyleTag = (tag) => {
    const newInput = input.trim() ? `${input.trim()}, ${tag}` : tag
    setInput(newInput)
    textareaRef.current?.focus()
  }

  const handleExamplePrompt = (prompt) => {
    setInput(prompt)
    textareaRef.current?.focus()
  }

  const handleReset = () => {
    setIsImageLoaded(false)
    setImage(null)
    setInput('')
    setUsedPrompt('')
  }

  const copyPrompt = () => {
    navigator.clipboard.writeText(usedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-10">

      {/* Header */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          AI-Powered Generation
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 leading-tight">
          Create Stunning Images
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto">
          Describe anything and watch our AI bring it to life in seconds
        </p>
      </motion.div>

      {/* Main Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT — Image Panel */}
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Image Box */}
          <div
            className="relative bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
            style={{ aspectRatio: '1 / 1' }}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="relative mb-5">
                    <div className="w-16 h-16 border-4 border-blue-200 rounded-full" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p className="text-gray-700 font-semibold text-sm">Generating your image...</p>
                  <p className="text-gray-400 text-xs mt-1">This may take a few seconds</p>
                  <div className="w-48 h-1.5 bg-gray-200 rounded-full mt-6 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '85%' }}
                      transition={{ duration: 9, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              ) : isImageLoaded && image ? (
                <motion.div
                  key="image"
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={image}
                    alt="AI Generated"
                    className="w-full h-full object-cover"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-300" />
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 border border-gray-100">
                    <img src={assets.logo_icon} alt="" className="w-10 opacity-30" />
                  </div>
                  <p className="text-gray-400 text-sm font-medium">Your image will appear here</p>
                  <p className="text-gray-300 text-xs mt-1">Write a prompt to get started</p>

                  {/* Example prompts */}
                  <div className="mt-6 px-6 w-full">
                    <p className="text-xs text-gray-300 text-center mb-2 uppercase tracking-wider">Try an example</p>
                    <div className="flex flex-col gap-1.5">
                      {examplePrompts.map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleExamplePrompt(p)}
                          className="text-xs text-gray-400 hover:text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-left transition-all truncate"
                        >
                          ↗ {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons — shown after image is generated */}
          <AnimatePresence>
            {isImageLoaded && (
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <a
                  href={image}
                  download="imagify-generated.png"
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-700 active:scale-95 transition-all"
                >
                  <img src={assets.download_icon} alt="" className="w-4 invert" />
                  Download
                </a>
                <button
                  type="button"
                  onClick={copyPrompt}
                  className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 active:scale-95 transition-all"
                >
                  {copied ? '✓ Copied!' : '⎘ Copy Prompt'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 flex items-center justify-center gap-2 border border-blue-200 text-blue-600 py-3 rounded-xl text-sm font-medium hover:bg-blue-50 active:scale-95 transition-all"
                >
                  ↺ New Image
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Used Prompt display */}
          <AnimatePresence>
            {isImageLoaded && usedPrompt && (
              <motion.div
                className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Prompt Used</p>
                <p className="text-sm text-gray-600 leading-relaxed">{usedPrompt}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* RIGHT — Controls Panel */}
        <motion.form
          onSubmit={onSubmitHandler}
          className="flex flex-col gap-4"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Prompt Input Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Describe your image
            </label>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="A futuristic city at sunset with flying cars, neon reflections on wet streets, cinematic..."
              rows={6}
              disabled={loading}
              className="w-full resize-none outline-none text-sm text-gray-700 placeholder-gray-300 leading-relaxed disabled:opacity-50"
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) onSubmitHandler(e)
              }}
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
              <span className="text-xs text-gray-300">{input.length} chars · Ctrl+Enter to generate</span>
              <button
                type="button"
                onClick={() => setInput('')}
                className="text-xs text-gray-300 hover:text-red-400 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Style Presets Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">Style Presets</p>
            <p className="text-xs text-gray-400 mb-3">Click to append a style to your prompt</p>
            <div className="flex flex-wrap gap-2">
              {stylePresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleStyleTag(preset.tag)}
                  disabled={loading}
                  className="px-3 py-1.5 text-xs rounded-full border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Credits Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <img src={assets.credit_star} alt="" className="w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Credits remaining</p>
                <p className="text-base font-bold text-gray-800">{credit !== false ? credit : '—'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/buy')}
              className="text-xs bg-white text-blue-600 font-semibold px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-all active:scale-95"
            >
              Buy Credits →
            </button>
          </div>

          {/* Generate Button */}
          <motion.button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl text-sm font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                ✦ Generate Image
              </span>
            )}
          </motion.button>

          {/* Tips */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-amber-700 mb-2">💡 Tips for better results</p>
            <ul className="text-xs text-amber-600 space-y-1 list-disc list-inside">
              <li>Be descriptive — mention lighting, mood, style</li>
              <li>Use style presets to refine the look</li>
              <li>Add "cinematic", "4k", "detailed" for quality</li>
            </ul>
          </div>
        </motion.form>
      </div>
    </div>
  )
}

export default Result
