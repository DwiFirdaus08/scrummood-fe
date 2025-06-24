"use client"

import { useEffect, useRef, useState } from "react"

interface VoiceEmotionData {
  emotion: string
  confidence: number
  audioFeatures: {
    pitch: number
    energy: number
    speakingRate: number
    volume: number
    spectralCentroid: number
    zeroCrossingRate: number
  }
}

interface VoiceEmotionDetectorProps {
  audioStream: MediaStream
  isActive: boolean
  onEmotionDetected: (emotion: VoiceEmotionData) => void
  onSpeakingStateChanged: (speaking: boolean) => void
}

export function VoiceEmotionDetector({
  audioStream,
  isActive,
  onEmotionDetected,
  onSpeakingStateChanged,
}: VoiceEmotionDetectorProps) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const pitchDetectorRef = useRef<any>(null)

  // Audio analysis state
  const [audioFeatures, setAudioFeatures] = useState({
    pitch: 0,
    energy: 0,
    speakingRate: 0,
    volume: 0,
    spectralCentroid: 0,
    zeroCrossingRate: 0,
  })

  // Speaking detection state
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechHistory, setSpeechHistory] = useState<number[]>([])
  const [lastSpeechTime, setLastSpeechTime] = useState(0)

  // Emotion detection parameters
  const VOLUME_THRESHOLD = 0.01
  const SPEECH_TIMEOUT = 1000 // 1 second
  const ANALYSIS_INTERVAL = 500 // 0.5 seconds
  const HISTORY_LENGTH = 10 // Keep last 10 measurements

  useEffect(() => {
    if (!audioStream || !isActive) {
      cleanup()
      return
    }

    initializeAudioAnalysis()

    return cleanup
  }, [audioStream, isActive])

  const initializeAudioAnalysis = async () => {
    try {
      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Create analyser node
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 2048
      analyserRef.current.smoothingTimeConstant = 0.8

      // Create source from audio stream
      sourceRef.current = audioContextRef.current.createMediaStreamSource(audioStream)
      sourceRef.current.connect(analyserRef.current)

      // Start analysis loop
      startAnalysis()
    } catch (error) {
      console.error("Error initializing voice emotion detection:", error)
    }
  }

  const startAnalysis = () => {
    if (!analyserRef.current || !audioContextRef.current) return

    const analyze = () => {
      if (!isActive || !analyserRef.current) return

      const features = extractAudioFeatures()
      setAudioFeatures(features)

      // Update speaking state
      const speaking = features.volume > VOLUME_THRESHOLD
      updateSpeakingState(speaking)

      // Detect emotion every ANALYSIS_INTERVAL
      if (Date.now() - lastSpeechTime > ANALYSIS_INTERVAL) {
        detectEmotion(features)
        setLastSpeechTime(Date.now())
      }

      animationFrameRef.current = requestAnimationFrame(analyze)
    }

    analyze()
  }

  const extractAudioFeatures = () => {
    if (!analyserRef.current || !audioContextRef.current) {
      return audioFeatures
    }

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    const frequencyData = new Float32Array(bufferLength)
    const timeData = new Float32Array(analyserRef.current.fftSize)

    // Get frequency and time domain data
    analyserRef.current.getByteFrequencyData(dataArray)
    analyserRef.current.getFloatFrequencyData(frequencyData)
    analyserRef.current.getFloatTimeDomainData(timeData)

    // Calculate volume (RMS)
    let sum = 0
    for (let i = 0; i < timeData.length; i++) {
      sum += timeData[i] * timeData[i]
    }
    const volume = Math.sqrt(sum / timeData.length)

    // Calculate energy
    const energy = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length / 255

    // Calculate pitch using autocorrelation
    const pitch = detectPitch(timeData, audioContextRef.current.sampleRate)

    // Calculate spectral centroid
    const spectralCentroid = calculateSpectralCentroid(frequencyData, audioContextRef.current.sampleRate)

    // Calculate zero crossing rate
    const zeroCrossingRate = calculateZeroCrossingRate(timeData)

    // Calculate speaking rate (simplified)
    const speakingRate = calculateSpeakingRate(volume)

    return {
      pitch,
      energy,
      speakingRate,
      volume,
      spectralCentroid,
      zeroCrossingRate,
    }
  }

  const detectPitch = (timeData: Float32Array, sampleRate: number): number => {
    // Simple autocorrelation-based pitch detection
    const minPeriod = Math.floor(sampleRate / 800) // 800 Hz max
    const maxPeriod = Math.floor(sampleRate / 80) // 80 Hz min

    let bestCorrelation = 0
    let bestPeriod = 0

    for (let period = minPeriod; period < maxPeriod; period++) {
      let correlation = 0
      for (let i = 0; i < timeData.length - period; i++) {
        correlation += timeData[i] * timeData[i + period]
      }

      if (correlation > bestCorrelation) {
        bestCorrelation = correlation
        bestPeriod = period
      }
    }

    return bestPeriod > 0 ? sampleRate / bestPeriod : 0
  }

  const calculateSpectralCentroid = (frequencyData: Float32Array, sampleRate: number): number => {
    let numerator = 0
    let denominator = 0

    for (let i = 0; i < frequencyData.length; i++) {
      const frequency = (i * sampleRate) / (2 * frequencyData.length)
      const magnitude = Math.pow(10, frequencyData[i] / 20) // Convert from dB

      numerator += frequency * magnitude
      denominator += magnitude
    }

    return denominator > 0 ? numerator / denominator : 0
  }

  const calculateZeroCrossingRate = (timeData: Float32Array): number => {
    let crossings = 0
    for (let i = 1; i < timeData.length; i++) {
      if (timeData[i] >= 0 !== timeData[i - 1] >= 0) {
        crossings++
      }
    }
    return crossings / timeData.length
  }

  const calculateSpeakingRate = (volume: number): number => {
    // Add current volume to history
    setSpeechHistory((prev) => {
      const newHistory = [...prev, volume].slice(-HISTORY_LENGTH)

      // Calculate speaking rate based on volume variations
      let variations = 0
      for (let i = 1; i < newHistory.length; i++) {
        if (Math.abs(newHistory[i] - newHistory[i - 1]) > 0.005) {
          variations++
        }
      }

      return newHistory
    })

    // Return normalized speaking rate
    return Math.min(
      speechHistory.length > 0 ? speechHistory.filter((v) => v > VOLUME_THRESHOLD).length / speechHistory.length : 0,
      1,
    )
  }

  const updateSpeakingState = (speaking: boolean) => {
    if (speaking !== isSpeaking) {
      setIsSpeaking(speaking)
      onSpeakingStateChanged(speaking)
    }
  }

  const detectEmotion = (features: typeof audioFeatures) => {
    // Emotion detection algorithm based on audio features
    const emotions = analyzeEmotionFromFeatures(features)

    if (emotions.confidence > 0.3) {
      // Only report if confidence is reasonable
      onEmotionDetected(emotions)
    }
  }

  const analyzeEmotionFromFeatures = (features: typeof audioFeatures): VoiceEmotionData => {
    const { pitch, energy, volume, spectralCentroid, zeroCrossingRate, speakingRate } = features

    // Normalize features (simplified normalization)
    const normalizedPitch = Math.min(pitch / 300, 2) // Normalize to 0-2 range
    const normalizedEnergy = Math.min(energy, 1)
    const normalizedVolume = Math.min(volume * 10, 1)
    const normalizedSpectral = Math.min(spectralCentroid / 2000, 1)
    const normalizedZCR = Math.min(zeroCrossingRate * 100, 1)

    // Emotion scoring based on feature combinations
    const emotionScores = {
      happy: calculateHappyScore(normalizedPitch, normalizedEnergy, normalizedVolume, speakingRate),
      excited: calculateExcitedScore(normalizedPitch, normalizedEnergy, speakingRate, normalizedZCR),
      calm: calculateCalmScore(normalizedPitch, normalizedEnergy, normalizedVolume, speakingRate),
      neutral: calculateNeutralScore(normalizedPitch, normalizedEnergy, normalizedVolume),
      stressed: calculateStressedScore(normalizedPitch, normalizedEnergy, speakingRate, normalizedZCR),
      angry: calculateAngryScore(normalizedPitch, normalizedEnergy, normalizedSpectral, normalizedZCR),
      sad: calculateSadScore(normalizedPitch, normalizedEnergy, normalizedVolume, speakingRate),
      frustrated: calculateFrustratedScore(normalizedPitch, normalizedEnergy, speakingRate, normalizedZCR),
    }

    // Find dominant emotion
    const dominantEmotion = Object.entries(emotionScores).reduce((a, b) =>
      emotionScores[a[0] as keyof typeof emotionScores] > emotionScores[b[0] as keyof typeof emotionScores] ? a : b,
    )

    return {
      emotion: dominantEmotion[0],
      confidence: dominantEmotion[1],
      audioFeatures: features,
    }
  }

  // Emotion scoring functions
  const calculateHappyScore = (pitch: number, energy: number, volume: number, speakingRate: number): number => {
    // Happy: Higher pitch, moderate-high energy, good volume, moderate speaking rate
    const pitchScore = pitch > 1.2 ? 0.8 : pitch > 0.8 ? 0.6 : 0.3
    const energyScore = energy > 0.6 ? 0.8 : energy > 0.4 ? 0.6 : 0.3
    const volumeScore = volume > 0.3 ? 0.7 : 0.4
    const rateScore = speakingRate > 0.4 && speakingRate < 0.8 ? 0.7 : 0.4

    return (pitchScore + energyScore + volumeScore + rateScore) / 4
  }

  const calculateExcitedScore = (pitch: number, energy: number, speakingRate: number, zcr: number): number => {
    // Excited: High pitch, high energy, fast speaking rate, high ZCR
    const pitchScore = pitch > 1.4 ? 0.9 : pitch > 1.0 ? 0.7 : 0.3
    const energyScore = energy > 0.7 ? 0.9 : energy > 0.5 ? 0.6 : 0.3
    const rateScore = speakingRate > 0.7 ? 0.8 : 0.4
    const zcrScore = zcr > 0.6 ? 0.7 : 0.4

    return (pitchScore + energyScore + rateScore + zcrScore) / 4
  }

  const calculateCalmScore = (pitch: number, energy: number, volume: number, speakingRate: number): number => {
    // Calm: Stable pitch, low-moderate energy, consistent volume, steady rate
    const pitchScore = pitch > 0.7 && pitch < 1.3 ? 0.8 : 0.4
    const energyScore = energy > 0.2 && energy < 0.6 ? 0.8 : 0.3
    const volumeScore = volume > 0.2 && volume < 0.6 ? 0.7 : 0.4
    const rateScore = speakingRate > 0.3 && speakingRate < 0.7 ? 0.8 : 0.4

    return (pitchScore + energyScore + volumeScore + rateScore) / 4
  }

  const calculateNeutralScore = (pitch: number, energy: number, volume: number): number => {
    // Neutral: Average values across all features
    const pitchScore = pitch > 0.8 && pitch < 1.2 ? 0.7 : 0.4
    const energyScore = energy > 0.3 && energy < 0.7 ? 0.7 : 0.4
    const volumeScore = volume > 0.2 && volume < 0.5 ? 0.7 : 0.4

    return (pitchScore + energyScore + volumeScore) / 3
  }

  const calculateStressedScore = (pitch: number, energy: number, speakingRate: number, zcr: number): number => {
    // Stressed: Variable pitch, high energy, fast/irregular rate, high ZCR
    const pitchScore = pitch > 1.3 ? 0.8 : 0.4
    const energyScore = energy > 0.6 ? 0.8 : 0.4
    const rateScore = speakingRate > 0.8 ? 0.9 : speakingRate < 0.3 ? 0.7 : 0.4
    const zcrScore = zcr > 0.7 ? 0.8 : 0.4

    return (pitchScore + energyScore + rateScore + zcrScore) / 4
  }

  const calculateAngryScore = (pitch: number, energy: number, spectral: number, zcr: number): number => {
    // Angry: Lower pitch, high energy, harsh spectral content, high ZCR
    const pitchScore = pitch < 0.8 ? 0.8 : 0.4
    const energyScore = energy > 0.7 ? 0.9 : 0.4
    const spectralScore = spectral > 0.6 ? 0.8 : 0.4
    const zcrScore = zcr > 0.6 ? 0.7 : 0.4

    return (pitchScore + energyScore + spectralScore + zcrScore) / 4
  }

  const calculateSadScore = (pitch: number, energy: number, volume: number, speakingRate: number): number => {
    // Sad: Lower pitch, low energy, low volume, slow speaking rate
    const pitchScore = pitch < 0.9 ? 0.8 : 0.4
    const energyScore = energy < 0.4 ? 0.8 : 0.4
    const volumeScore = volume < 0.3 ? 0.8 : 0.4
    const rateScore = speakingRate < 0.4 ? 0.8 : 0.4

    return (pitchScore + energyScore + volumeScore + rateScore) / 4
  }

  const calculateFrustratedScore = (pitch: number, energy: number, speakingRate: number, zcr: number): number => {
    // Frustrated: Variable pitch, moderate-high energy, irregular rate, moderate ZCR
    const pitchScore = pitch > 1.1 || pitch < 0.9 ? 0.7 : 0.4
    const energyScore = energy > 0.5 ? 0.7 : 0.4
    const rateScore = speakingRate > 0.7 || speakingRate < 0.3 ? 0.8 : 0.4
    const zcrScore = zcr > 0.5 ? 0.6 : 0.4

    return (pitchScore + energyScore + rateScore + zcrScore) / 4
  }

  const cleanup = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect()
      sourceRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    analyserRef.current = null
    setIsSpeaking(false)
    setSpeechHistory([])
  }

  // This component doesn't render anything visible
  return null
}
